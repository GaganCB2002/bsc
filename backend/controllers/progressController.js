import mongoose from 'mongoose';
import Progress from '../models/Progress.js';
import Section from '../models/Section.js';
import Course from '../models/Course.js';
import { logActivity } from '../middleware/safeActivity.js';

// @desc    Get progress for a specific course
// @route   GET /api/progress/:courseId
export const getProgress = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const totalSections = await Section.countDocuments({ courseId: req.params.courseId });
    const progress = await Progress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    });

    if (!progress) {
      return res.json({
        success: true,
        progress: {
          percentage: 0,
          completedSections: [],
          totalSections,
          currentSection: null,
          lastAccessed: null,
          completedAt: null,
        },
      });
    }

    res.json({
      success: true,
      progress: {
        _id: progress._id,
        percentage: progress.percentage,
        completedSections: progress.completedSections,
        completedCount: progress.completedSections.length,
        totalSections,
        currentSection: progress.currentSection,
        lastAccessed: progress.lastAccessed,
        completedAt: progress.completedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all progress for current user
// @route   GET /api/progress
export const getAllProgress = async (req, res, next) => {
  try {
    const progressList = await Progress.find({ userId: req.user._id })
      .populate('courseId', 'title thumbnail category difficulty status')
      .sort({ lastAccessed: -1 });

    // Drop progress for non-published courses from the public view.
    const filtered = progressList.filter(
      (p) => p.courseId && p.courseId.status === 'published'
    );

    const courseIds = filtered.map((p) => p.courseId._id);
    const sectionCounts = await Section.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } },
    ]);
    const sMap = new Map(sectionCounts.map((s) => [String(s._id), s.count]));

    const enriched = filtered.map((p) => ({
      ...p.toObject(),
      totalSections: sMap.get(String(p.courseId._id)) || 0,
      completedCount: p.completedSections.length,
    }));
    res.json({ success: true, progress: enriched });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark section as complete
// @route   POST /api/progress/section/:sectionId/complete
// Uses atomic findOneAndUpdate to avoid the read-modify-write race condition.
export const completeSection = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.sectionId)) {
      return res.status(400).json({ success: false, message: 'Invalid section ID' });
    }

    const section = await Section.findById(req.params.sectionId).lean();
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    // Only sections in published courses can be completed (admins always allowed).
    if (req.user.role !== 'admin') {
      const course = await Course.findById(section.courseId).select('status').lean();
      if (!course || course.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Section is not available' });
      }
    }

    const totalSections = await Section.countDocuments({ courseId: section.courseId });

    // First, ensure a Progress document exists (idempotent upsert by userId+courseId).
    // The unique index on { userId, courseId } is required for this to work safely.
    await Progress.updateOne(
      { userId: req.user._id, courseId: section.courseId },
      {
        $setOnInsert: { percentage: 0, lastAccessed: new Date() },
      },
      { upsert: true }
    );

    // Atomically push the section into completedSections, set currentSection, recompute percentage.
    // We use $addToSet to make the operation idempotent.
    const updated = await Progress.findOneAndUpdate(
      { userId: req.user._id, courseId: section.courseId },
      {
        $addToSet: { completedSections: section._id },
        $set: { currentSection: section._id, lastAccessed: new Date() },
      },
      { new: true }
    );

    const completedCount = updated.completedSections.length;
    const percentage =
      totalSections > 0
        ? Math.min(100, Math.max(0, Math.round((completedCount / totalSections) * 100)))
        : 0;
    updated.percentage = percentage;
    if (percentage >= 100 && !updated.completedAt) {
      updated.completedAt = new Date();
    }
    await updated.save();

    logActivity(req.user._id, 'section_completed', {
      courseId: section.courseId,
      sectionId: section._id,
      sectionName: section.title,
    });
    if (percentage >= 100) {
      logActivity(req.user._id, 'course_completed', { courseId: section.courseId });
    }

    res.json({
      success: true,
      message: 'Section marked as complete',
      progress: {
        _id: updated._id,
        percentage: updated.percentage,
        completedSections: updated.completedSections,
        completedCount,
        totalSections,
        currentSection: updated.currentSection,
        lastAccessed: updated.lastAccessed,
        completedAt: updated.completedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress (current section / last accessed)
// @route   PUT /api/progress/:courseId
// Validates that currentSection belongs to the requested course.
export const updateProgress = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const { currentSection } = req.body;

    if (currentSection) {
      if (!mongoose.Types.ObjectId.isValid(currentSection)) {
        return res.status(400).json({ success: false, message: 'Invalid section ID' });
      }
      // Ensure the section actually belongs to the requested course.
      const section = await Section.findById(currentSection).select('courseId').lean();
      if (!section || String(section.courseId) !== String(req.params.courseId)) {
        return res.status(400).json({ success: false, message: 'Section does not belong to this course' });
      }
    }

    // Atomic upsert — single round-trip, no race.
    const set = { lastAccessed: new Date() };
    if (currentSection) set.currentSection = currentSection;
    const setOnInsert = { percentage: 0 };

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, courseId: req.params.courseId },
      { $set: set, $setOnInsert: setOnInsert },
      { new: true, upsert: true }
    );
    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

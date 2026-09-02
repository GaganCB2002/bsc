import Progress from '../models/Progress.js';
import Section from '../models/Section.js';
import Activity from '../models/Activity.js';

// @desc    Get progress for a specific course
// @route   GET /api/progress/:courseId
export const getProgress = async (req, res, next) => {
  try {
    const totalSections = await Section.countDocuments({ courseId: req.params.courseId });

    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    });

    if (!progress) {
      // Return default progress if none exists
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
      .populate('courseId', 'title thumbnail category difficulty')
      .sort({ lastAccessed: -1 });

    // Enrich with total section counts
    const enriched = await Promise.all(
      progressList.map(async (p) => {
        const totalSections = await Section.countDocuments({ courseId: p.courseId._id });
        return {
          ...p.toObject(),
          totalSections,
          completedCount: p.completedSections.length,
        };
      })
    );

    res.json({ success: true, progress: enriched });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark section as complete
// @route   POST /api/progress/section/:sectionId/complete
export const completeSection = async (req, res, next) => {
  try {
    const section = await Section.findById(req.params.sectionId);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    // Verify section belongs to a valid course
    const totalSections = await Section.countDocuments({ courseId: section.courseId });

    // Find or create progress
    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId: section.courseId,
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        courseId: section.courseId,
        completedSections: [],
        currentSection: section._id,
        percentage: 0,
        lastAccessed: new Date(),
      });
    }

    // Prevent duplicate completion
    const alreadyCompleted = progress.completedSections.some(
      (id) => id.toString() === section._id.toString()
    );

    if (!alreadyCompleted) {
      progress.completedSections.push(section._id);
    }

    // Calculate percentage safely
    const completedCount = progress.completedSections.length;
    progress.percentage =
      totalSections > 0
        ? Math.min(100, Math.max(0, Math.round((completedCount / totalSections) * 100)))
        : 0;

    progress.currentSection = section._id;
    progress.lastAccessed = new Date();

    // Mark as completed if 100%
    if (progress.percentage >= 100 && !progress.completedAt) {
      progress.completedAt = new Date();
    }

    await progress.save();

    // Log activity
    await Activity.create({
      userId: req.user._id,
      type: 'section_completed',
      metadata: {
        courseId: section.courseId,
        sectionId: section._id,
        sectionName: section.title,
      },
    });

    // Log course completion activity
    if (progress.percentage >= 100) {
      await Activity.create({
        userId: req.user._id,
        type: 'course_completed',
        metadata: {
          courseId: section.courseId,
        },
      });
    }

    res.json({
      success: true,
      message: alreadyCompleted
        ? 'Section was already completed'
        : 'Section marked as complete',
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

// @desc    Update progress (current section / last accessed)
// @route   PUT /api/progress/:courseId
export const updateProgress = async (req, res, next) => {
  try {
    const { currentSection } = req.body;

    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        courseId: req.params.courseId,
        completedSections: [],
        currentSection: currentSection || null,
        percentage: 0,
        lastAccessed: new Date(),
      });
    } else {
      if (currentSection) progress.currentSection = currentSection;
      progress.lastAccessed = new Date();
    }

    await progress.save();

    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

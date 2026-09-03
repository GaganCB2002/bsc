import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Section from '../models/Section.js';
import { logActivity } from '../middleware/safeActivity.js';

// @desc    Get full course content for learning
// @route   GET /api/learning/:courseId
export const getLearningContent = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const course = await Course.findById(req.params.courseId).lean();
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Only published courses are accessible to non-admins. Admins can view any status.
    if (course.status !== 'published' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Course is not available' });
    }

    const modules = await Module.find({ courseId: course._id })
      .sort({ order: 1 })
      .lean();
    const moduleIds = modules.map((m) => m._id);
    const sections = await Section.find({ moduleId: { $in: moduleIds } })
      .sort({ order: 1 })
      .lean();
    const sectionsByModule = new Map();
    for (const s of sections) {
      const k = String(s.moduleId);
      if (!sectionsByModule.has(k)) sectionsByModule.set(k, []);
      sectionsByModule.get(k).push(s);
    }
    const modulesWithSections = modules.map((m) => ({
      ...m,
      sections: sectionsByModule.get(String(m._id)) || [],
    }));

    logActivity(req.user._id, 'course_opened', {
      courseId: course._id,
      courseName: course.title,
    });

    res.json({
      success: true,
      course: {
        ...course,
        modules: modulesWithSections,
        totalSections: sections.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single section
// @route   GET /api/learning/section/:sectionId
export const getSection = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.sectionId)) {
      return res.status(400).json({ success: false, message: 'Invalid section ID' });
    }

    const section = await Section.findById(req.params.sectionId).lean();
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    // Only published courses are accessible to non-admins.
    if (req.user.role !== 'admin') {
      const course = await Course.findById(section.courseId).select('status').lean();
      if (!course || course.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Section is not available' });
      }
    }

    logActivity(req.user._id, 'section_opened', {
      courseId: section.courseId,
      sectionId: section._id,
      sectionName: section.title,
    });

    res.json({ success: true, section });
  } catch (error) {
    next(error);
  }
};

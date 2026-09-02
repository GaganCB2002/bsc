import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Section from '../models/Section.js';
import Activity from '../models/Activity.js';

// @desc    Get full course content for learning
// @route   GET /api/learning/:courseId
export const getLearningContent = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const modules = await Module.find({ courseId: course._id })
      .sort({ order: 1 })
      .lean();

    const modulesWithSections = await Promise.all(
      modules.map(async (mod) => {
        const sections = await Section.find({ moduleId: mod._id })
          .sort({ order: 1 })
          .lean();
        return { ...mod, sections };
      })
    );

    const totalSections = await Section.countDocuments({ courseId: course._id });

    // Log activity
    await Activity.create({
      userId: req.user._id,
      type: 'course_opened',
      metadata: {
        courseId: course._id,
        courseName: course.title,
      },
    });

    res.json({
      success: true,
      course: {
        ...course.toObject(),
        modules: modulesWithSections,
        totalSections,
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
    const section = await Section.findById(req.params.sectionId);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    // Log activity
    await Activity.create({
      userId: req.user._id,
      type: 'section_opened',
      metadata: {
        courseId: section.courseId,
        sectionId: section._id,
        sectionName: section.title,
      },
    });

    res.json({ success: true, section });
  } catch (error) {
    next(error);
  }
};

import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Section from '../models/Section.js';

// @desc    Get all published courses
// @route   GET /api/courses
export const getCourses = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 20 } = req.query;
    const filter = { status: 'published' };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Course.countDocuments(filter),
    ]);

    // Get section counts for each course
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const sectionCount = await Section.countDocuments({ courseId: course._id });
        const moduleCount = await Module.countDocuments({ courseId: course._id });
        return {
          ...course.toObject(),
          totalSections: sectionCount,
          totalModules: moduleCount,
        };
      })
    );

    res.json({
      success: true,
      courses: coursesWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course with modules and sections
// @route   GET /api/courses/:id
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
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

// @desc    Create course (admin)
// @route   POST /api/courses
export const createCourse = async (req, res, next) => {
  try {
    const courseData = {
      ...req.body,
      createdBy: req.user._id,
    };
    const course = await Course.create(courseData);
    res.status(201).json({ success: true, message: 'Course created', course });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course (admin)
// @route   PUT /api/courses/:id
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, message: 'Course updated', course });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course (admin)
// @route   DELETE /api/courses/:id
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    // Archive instead of delete
    course.status = 'archived';
    await course.save();
    res.json({ success: true, message: 'Course archived successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create module (admin)
// @route   POST /api/courses/modules
export const createModule = async (req, res, next) => {
  try {
    const { courseId, title, description, order } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    const moduleOrder = order ?? (await Module.countDocuments({ courseId }));
    const mod = await Module.create({ courseId, title, description, order: moduleOrder });
    res.status(201).json({ success: true, message: 'Module created', module: mod });
  } catch (error) {
    next(error);
  }
};

// @desc    Create section (admin)
// @route   POST /api/courses/sections
export const createSection = async (req, res, next) => {
  try {
    const { moduleId, courseId, title, content, contentType, order, estimatedTime, resources } = req.body;
    const mod = await Module.findById(moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    const sectionOrder = order ?? (await Section.countDocuments({ moduleId }));
    const section = await Section.create({
      moduleId,
      courseId: courseId || mod.courseId,
      title,
      content,
      contentType,
      order: sectionOrder,
      estimatedTime,
      resources,
    });
    res.status(201).json({ success: true, message: 'Section created', section });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses (admin — includes drafts/archived)
// @route   GET /api/courses/admin/all
export const getAllCoursesAdmin = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const sectionCount = await Section.countDocuments({ courseId: course._id });
        const moduleCount = await Module.countDocuments({ courseId: course._id });
        return { ...course.toObject(), totalSections: sectionCount, totalModules: moduleCount };
      })
    );
    res.json({ success: true, courses: coursesWithCounts });
  } catch (error) {
    next(error);
  }
};

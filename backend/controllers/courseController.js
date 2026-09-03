import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Section from '../models/Section.js';
import { logActivity } from '../middleware/safeActivity.js';

// Escape user input before using as a regex. Prevents ReDoS and operator injection.
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toInt = (val, def, max) => {
  const n = parseInt(val, 10);
  if (Number.isNaN(n) || n < 1) return def;
  if (max && n > max) return max;
  return n;
};

// @desc    Get all published courses
// @route   GET /api/courses
export const getCourses = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    const page = toInt(req.query.page, 1);
    const limit = toInt(req.query.limit, 20, 100);

    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      const safe = escapeRegex(search);
      filter.$or = [
        { title: { $regex: safe, $options: 'i' } },
        { description: { $regex: safe, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(filter),
    ]);

    // Compute section/module counts in a single aggregation to avoid N+1.
    const courseIds = courses.map((c) => c._id);
    const [sectionCounts, moduleCounts] = await Promise.all([
      Section.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } },
      ]),
      Module.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } },
      ]),
    ]);
    const sMap = new Map(sectionCounts.map((s) => [String(s._id), s.count]));
    const mMap = new Map(moduleCounts.map((m) => [String(m._id), m.count]));

    const coursesWithCounts = courses.map((c) => ({
      ...c,
      totalSections: sMap.get(String(c._id)) || 0,
      totalModules: mMap.get(String(c._id)) || 0,
    }));

    res.json({
      success: true,
      courses: coursesWithCounts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course with modules and sections
// @route   GET /api/courses/:id
export const getCourse = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const course = await Course.findById(req.params.id).lean();
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Single aggregation: modules + their sections, ordered correctly.
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

    res.json({
      success: true,
      course: { ...course, modules: modulesWithSections, totalSections: sections.length },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course (admin)
// @route   POST /api/courses
// Strict allowlist — never spread req.body, prevents mass-assignment.
export const createCourse = async (req, res, next) => {
  try {
    const {
      title, description, category, difficulty, thumbnail, estimatedDuration, instructor, tags, status,
    } = req.body;

    const course = await Course.create({
      title, description, category, difficulty, thumbnail, estimatedDuration, instructor, tags, status,
      createdBy: req.user._id,
    });
    logActivity(req.user._id, 'course_created', { courseId: course._id });
    res.status(201).json({ success: true, message: 'Course created', course });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course (admin)
// @route   PUT /api/courses/:id
// Strict allowlist — never spread req.body, prevents mass-assignment + NoSQL operator injection.
const COURSE_UPDATABLE = [
  'title', 'description', 'category', 'difficulty', 'thumbnail',
  'estimatedDuration', 'instructor', 'tags', 'status',
];
export const updateCourse = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const updates = {};
    for (const k of COURSE_UPDATABLE) {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    logActivity(req.user._id, 'course_updated', { courseId: course._id });
    res.json({ success: true, message: 'Course updated', course });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course (admin) — soft archive
// @route   DELETE /api/courses/:id
export const deleteCourse = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    course.status = 'archived';
    await course.save();
    logActivity(req.user._id, 'course_archived', { courseId: course._id });
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
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }
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
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({ success: false, message: 'Invalid module ID' });
    }
    if (courseId && !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }
    const mod = await Module.findById(moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    const sectionOrder = order ?? (await Section.countDocuments({ moduleId }));

    // Sanitize resources: only allow http(s) URLs and known types.
    const safeResources = Array.isArray(resources)
      ? resources
          .map((r) => {
            if (!r || typeof r !== 'object') return null;
            const type = ['link', 'pdf', 'video'].includes(r.type) ? r.type : 'link';
            const url = typeof r.url === 'string' && /^https?:\/\//i.test(r.url) ? r.url : null;
            if (!url) return null;
            return { title: String(r.title || '').slice(0, 200), url, type };
          })
          .filter(Boolean)
      : [];

    const section = await Section.create({
      moduleId,
      courseId: courseId || mod.courseId,
      title,
      content,
      contentType,
      order: sectionOrder,
      estimatedTime,
      resources: safeResources,
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
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    const courseIds = courses.map((c) => c._id);
    const [sectionCounts, moduleCounts] = await Promise.all([
      Section.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } },
      ]),
      Module.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', count: { $sum: 1 } } },
      ]),
    ]);
    const sMap = new Map(sectionCounts.map((s) => [String(s._id), s.count]));
    const mMap = new Map(moduleCounts.map((m) => [String(m._id), m.count]));

    const coursesWithCounts = courses.map((c) => ({
      ...c,
      totalSections: sMap.get(String(c._id)) || 0,
      totalModules: mMap.get(String(c._id)) || 0,
    }));
    res.json({ success: true, courses: coursesWithCounts });
  } catch (error) {
    next(error);
  }
};

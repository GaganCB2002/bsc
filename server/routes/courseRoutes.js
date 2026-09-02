import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  createModule,
  createSection,
  getAllCoursesAdmin,
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCourseRules, createModuleRules, createSectionRules } from '../validators/courseValidator.js';

const router = express.Router();

// Public (authenticated) routes
router.get('/', protect, getCourses);
router.get('/:id', protect, getCourse);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllCoursesAdmin);
router.post('/', protect, authorize('admin'), createCourseRules, validate, createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.post('/modules', protect, authorize('admin'), createModuleRules, validate, createModule);
router.post('/sections', protect, authorize('admin'), createSectionRules, validate, createSection);

export default router;

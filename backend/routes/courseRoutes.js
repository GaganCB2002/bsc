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
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

// Public (authenticated) routes
router.get('/', protect, getCourses);
router.get('/:id', protect, validateObjectId(['id']), getCourse);

// Admin routes — /admin/all is a two-segment path so Express won't
// match it against the single-segment /:id param above.
router.get('/admin/all', protect, authorize('admin'), getAllCoursesAdmin);
router.post('/', protect, authorize('admin'), createCourseRules, validate, createCourse);
router.put('/:id', protect, authorize('admin'), validateObjectId(['id']), updateCourse);
router.delete('/:id', protect, authorize('admin'), validateObjectId(['id']), deleteCourse);
router.post('/modules', protect, authorize('admin'), createModuleRules, validate, createModule);
router.post('/sections', protect, authorize('admin'), createSectionRules, validate, createSection);

export default router;

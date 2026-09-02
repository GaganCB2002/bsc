import { body } from 'express-validator';

export const createCourseRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),
];

export const createModuleRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Module title is required')
    .isLength({ max: 200 }),
  body('courseId').notEmpty().withMessage('Course ID is required').isMongoId().withMessage('Invalid Course ID'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
];

export const createSectionRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Section title is required')
    .isLength({ max: 200 }),
  body('moduleId').notEmpty().withMessage('Module ID is required').isMongoId().withMessage('Invalid Module ID'),
  body('courseId').notEmpty().withMessage('Course ID is required').isMongoId().withMessage('Invalid Course ID'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('contentType')
    .optional()
    .isIn(['text', 'video', 'quiz', 'exercise'])
    .withMessage('Invalid content type'),
];

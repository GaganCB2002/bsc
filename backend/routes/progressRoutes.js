import express from 'express';
import {
  getProgress,
  getAllProgress,
  completeSection,
  updateProgress,
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/', protect, getAllProgress);
router.get('/:courseId', protect, validateObjectId(['courseId']), getProgress);
router.post(
  '/section/:sectionId/complete',
  protect,
  validateObjectId(['sectionId']),
  completeSection
);
router.put('/:courseId', protect, validateObjectId(['courseId']), updateProgress);

export default router;

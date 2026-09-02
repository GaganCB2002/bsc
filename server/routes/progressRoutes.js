import express from 'express';
import {
  getProgress,
  getAllProgress,
  completeSection,
  updateProgress,
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllProgress);
router.get('/:courseId', protect, getProgress);
router.post('/section/:sectionId/complete', protect, completeSection);
router.put('/:courseId', protect, updateProgress);

export default router;

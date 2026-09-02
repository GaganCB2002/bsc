import express from 'express';
import { getLearningContent, getSection } from '../controllers/learningController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:courseId', protect, getLearningContent);
router.get('/section/:sectionId', protect, getSection);

export default router;

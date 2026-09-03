import express from 'express';
import { getLearningContent, getSection } from '../controllers/learningController.js';
import { protect } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/:courseId', protect, validateObjectId(['courseId']), getLearningContent);
router.get('/section/:sectionId', protect, validateObjectId(['sectionId']), getSection);

export default router;

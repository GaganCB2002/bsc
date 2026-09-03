import express from 'express';
import { getQuiz, submitQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/:quizId', protect, validateObjectId(['quizId']), getQuiz);
router.post('/:quizId/submit', protect, validateObjectId(['quizId']), submitQuiz);

export default router;

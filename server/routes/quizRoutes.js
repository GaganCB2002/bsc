import express from 'express';
import { getQuiz, submitQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:quizId', protect, getQuiz);
router.post('/:quizId/submit', protect, submitQuiz);

export default router;

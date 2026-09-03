import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Course from '../models/Course.js';
import { logActivity } from '../middleware/safeActivity.js';

// @desc    Get quiz (without correct answers)
// @route   GET /api/quiz/:quizId
export const getQuiz = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.quizId)) {
      return res.status(400).json({ success: false, message: 'Invalid quiz ID' });
    }

    const quiz = await Quiz.findById(req.params.quizId).lean();
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Only quizzes on published courses are accessible to non-admins.
    if (req.user.role !== 'admin') {
      const course = await Course.findById(quiz.courseId).select('status').lean();
      if (!course || course.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Quiz is not available' });
      }
    }

    const safeQuestions = (quiz.questions || []).map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    const attempts = await QuizAttempt.find({ userId: req.user._id, quizId: quiz._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        courseId: quiz.courseId,
        sectionId: quiz.sectionId,
        questions: safeQuestions,
        passingScore: quiz.passingScore,
        timeLimit: quiz.timeLimit,
        totalQuestions: safeQuestions.length,
      },
      previousAttempts: attempts.map((a) => ({
        score: a.score,
        passed: a.passed,
        date: a.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quiz/:quizId/submit
export const submitQuiz = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.quizId)) {
      return res.status(400).json({ success: false, message: 'Invalid quiz ID' });
    }

    const { answers, timeTaken } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers are required (array)' });
    }

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (req.user.role !== 'admin') {
      const course = await Course.findById(quiz.courseId).select('status').lean();
      if (!course || course.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Quiz is not available' });
      }
    }

    const totalQ = quiz.questions.length;

    // Validate answers shape: each must be a number (or null) within option bounds.
    const sanitizedAnswers = [];
    for (let i = 0; i < totalQ; i++) {
      const v = answers[i];
      if (v === null || v === undefined) {
        sanitizedAnswers.push(null);
        continue;
      }
      const n = typeof v === 'number' ? v : parseInt(v, 10);
      if (Number.isNaN(n) || n < 0 || n >= (quiz.questions[i]?.options?.length || 0)) {
        return res.status(400).json({
          success: false,
          message: `Invalid answer for question ${i + 1}`,
        });
      }
      sanitizedAnswers.push(n);
    }

    let correctCount = 0;
    const gradedAnswers = quiz.questions.map((q, index) => {
      const userAnswer = sanitizedAnswers[index];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      return { questionIndex: index, selectedAnswer: userAnswer, isCorrect };
    });

    const score = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const passed = score >= quiz.passingScore;

    // Cap timeTaken to a reasonable range to prevent abuse.
    const safeTime =
      typeof timeTaken === 'number' && timeTaken >= 0 && timeTaken < 24 * 3600
        ? Math.floor(timeTaken)
        : 0;

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      quizId: quiz._id,
      courseId: quiz.courseId,
      answers: gradedAnswers,
      score,
      passed,
      timeTaken: safeTime,
    });

    logActivity(req.user._id, passed ? 'quiz_passed' : 'quiz_attempted', {
      courseId: quiz.courseId,
      quizId: quiz._id,
      quizName: quiz.title,
      score,
    });

    const results = quiz.questions.map((q, index) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      selectedAnswer: sanitizedAnswers[index],
      isCorrect: gradedAnswers[index].isCorrect,
      explanation: q.explanation,
    }));

    res.json({
      success: true,
      message: passed ? 'Congratulations! You passed!' : 'Quiz completed. Keep learning!',
      result: {
        score,
        passed,
        correctCount,
        totalQuestions: totalQ,
        passingScore: quiz.passingScore,
        timeTaken: attempt.timeTaken,
      },
      results,
    });
  } catch (error) {
    next(error);
  }
};

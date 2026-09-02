import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Activity from '../models/Activity.js';

// @desc    Get quiz (without correct answers)
// @route   GET /api/quiz/:quizId
export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Strip correct answers from questions
    const safeQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    // Get previous attempts
    const attempts = await QuizAttempt.find({
      userId: req.user._id,
      quizId: quiz._id,
    }).sort({ createdAt: -1 });

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
        totalQuestions: quiz.questions.length,
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
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers are required' });
    }

    // Grade the quiz
    let correctCount = 0;
    const gradedAnswers = quiz.questions.map((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionIndex: index,
        selectedAnswer: userAnswer,
        isCorrect,
      };
    });

    const score =
      quiz.questions.length > 0
        ? Math.round((correctCount / quiz.questions.length) * 100)
        : 0;
    const passed = score >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      quizId: quiz._id,
      courseId: quiz.courseId,
      answers: gradedAnswers,
      score,
      passed,
      timeTaken: timeTaken || 0,
    });

    // Log activity
    await Activity.create({
      userId: req.user._id,
      type: passed ? 'quiz_passed' : 'quiz_attempted',
      metadata: {
        courseId: quiz.courseId,
        quizId: quiz._id,
        quizName: quiz.title,
        score,
      },
    });

    // Return results with explanations
    const results = quiz.questions.map((q, index) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      selectedAnswer: answers[index],
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
        totalQuestions: quiz.questions.length,
        passingScore: quiz.passingScore,
        timeTaken: attempt.timeTaken,
      },
      results,
    });
  } catch (error) {
    next(error);
  }
};

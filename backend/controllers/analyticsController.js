import User from '../models/User.js';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import Activity from '../models/Activity.js';
import QuizAttempt from '../models/QuizAttempt.js';

// @desc    Get user learning analytics
// @route   GET /api/analytics/user
export const getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [progressList, recentActivity, quizAttempts] = await Promise.all([
      Progress.find({ userId }).populate('courseId', 'title thumbnail category'),
      Activity.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      QuizAttempt.find({ userId }),
    ]);

    const coursesEnrolled = progressList.length;
    const coursesCompleted = progressList.filter((p) => p.percentage >= 100).length;
    const totalSectionsCompleted = progressList.reduce(
      (sum, p) => sum + p.completedSections.length,
      0
    );
    const avgProgress =
      coursesEnrolled > 0
        ? Math.round(
            progressList.reduce((sum, p) => sum + p.percentage, 0) / coursesEnrolled
          )
        : 0;
    const quizzesAttempted = quizAttempts.length;
    const quizzesPassed = quizAttempts.filter((q) => q.passed).length;
    const avgQuizScore =
      quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length
          )
        : 0;

    res.json({
      success: true,
      analytics: {
        coursesEnrolled,
        coursesCompleted,
        totalSectionsCompleted,
        averageProgress: avgProgress,
        quizzesAttempted,
        quizzesPassed,
        averageQuizScore: avgQuizScore,
        recentActivity,
        progressByCourse: progressList.map((p) => ({
          course: p.courseId,
          percentage: p.percentage,
          completedSections: p.completedSections.length,
          lastAccessed: p.lastAccessed,
          completedAt: p.completedAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin analytics
// @route   GET /api/analytics/admin
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCourses,
      publishedCourses,
      allProgress,
      recentUsers,
      completionActivities,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Course.countDocuments({ status: 'published' }),
      Progress.find(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt role'),
      Activity.find({ type: 'course_completed' }),
    ]);

    const activeLearners = new Set(allProgress.map((p) => p.userId.toString())).size;
    const completedCourses = allProgress.filter((p) => p.percentage >= 100).length;
    const avgProgress =
      allProgress.length > 0
        ? Math.round(
            allProgress.reduce((sum, p) => sum + p.percentage, 0) / allProgress.length
          )
        : 0;

    res.json({
      success: true,
      analytics: {
        totalUsers,
        activeLearners,
        totalCourses,
        publishedCourses,
        completedCourses,
        averageProgress: avgProgress,
        totalEnrollments: allProgress.length,
        recentUsers,
        courseCompletions: completionActivities.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
});
app.use('/api/auth', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'BS Channabasappa LMS API is running', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;

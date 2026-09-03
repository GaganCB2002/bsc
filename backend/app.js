import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import errorHandler from './middleware/errorHandler.js';
import { requestId } from './middleware/requestId.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import tryOnRoutes from './routes/tryOnRoutes.js';

const app = express();

// Trust the first proxy when deployed behind nginx/heroku/etc.
// Required for accurate req.ip and for express-rate-limit to count per-client.
app.set('trust proxy', 1);

// Request id must be set before anything else so the error handler can use it.
app.use(requestId);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // API-only server
  })
);

// CORS — refuse to start in production with a missing or wildcard origin.
const clientUrl = process.env.CLIENT_URL;
if (process.env.NODE_ENV === 'production' && !clientUrl) {
  // Fail loudly at boot, not at the first request.
  throw new Error('CLIENT_URL must be set in production');
}
const allowedOrigins = (clientUrl || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    maxAge: 86400,
  })
);

// Body parsing — small limit (this API does not accept file uploads).
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Strip MongoDB operators from req.body / req.query / req.params to prevent
// NoSQL injection (e.g. {"$ne": null}, {"$gt": ""}).
app.use(mongoSanitize({ replaceWith: '_' }));

// Rate limiting (per IP) — MUST be after body parsing so limiters don't consume the stream
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
});
app.use('/api/auth', authLimiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check (does NOT leak server info)
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection?.readyState;
  res.json({
    success: true,
    status: 'ok',
    db: dbState === 1 ? 'connected' : 'disconnected',
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/try-on', tryOnRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Centralized error handler (must be last)
app.use(errorHandler);

export default app;

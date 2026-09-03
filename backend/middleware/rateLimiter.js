import rateLimit from 'express-rate-limit';

// Rate limiter for login route: 5 requests per 15 minutes per IP.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // Use the real reset time from express-rate-limit so the client gets an accurate
    // "locked until" timestamp. Previously this was hardcoded to +15m regardless of
    // how much time remained in the window.
    const resetTime = req.rateLimit?.resetTime
      ? new Date(req.rateLimit.resetTime).toISOString()
      : new Date(Date.now() + 15 * 60 * 1000).toISOString();
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again later.',
      lockedUntil: resetTime,
    });
  },
});

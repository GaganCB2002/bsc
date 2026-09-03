import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB, { gracefulShutdown } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Boot-time validation for the JWT secret. Refuse to start with a weak/placeholder value.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET is missing or too short. Refusing to start.');
  console.error('   Generate one with:  node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  process.exit(1);
}
if (process.env.NODE_ENV === 'production' && /ROTATE_ME|change_this|change_in_production/i.test(process.env.JWT_SECRET)) {
  console.error('❌ JWT_SECRET looks like a placeholder. Refusing to start in production.');
  process.exit(1);
}

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 BS Channabasappa LMS Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
  });

  // Allow long-lived keep-alive connections
  server.keepAliveTimeout = 30_000;
  server.headersTimeout = 31_000;

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    // Hard exit if graceful shutdown takes too long.
    const forceExit = setTimeout(() => {
      console.error('Forced shutdown after 10s timeout');
      process.exit(1);
    }, 10_000);
    forceExit.unref();
    server.close(() => gracefulShutdown());
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    // Continue running — log it, but don't crash on every async error.
    // The process is still healthy; only fatal errors should exit.
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // This is a programmer error / fatal state. Exit and let a process manager restart.
    server.close(() => process.exit(1));
    setTimeout(() => process.exit(1), 5000).unref();
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

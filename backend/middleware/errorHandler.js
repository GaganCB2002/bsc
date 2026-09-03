import crypto from 'crypto';

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID format';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for '${field}'. This ${field} already exists.`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join('. ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // Body parser errors
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON payload';
  }
  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body too large';
  }

  // MongoDB network / connection errors -> 503
  if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
    statusCode = 503;
    message = 'Database temporarily unavailable. Please try again.';
  }

  // Generate a request id for correlation
  const requestId = req.id || crypto.randomUUID();

  // Log full error server-side (always — including in production for ops triage)
  // but do NOT return stack to the client regardless of environment.
  console.error(`[${requestId}] ${err.name || 'Error'}: ${err.message}`);
  if (err.stack) console.error(err.stack);

  const body = { success: false, message, requestId };

  // Only include the stack in dev AND only if explicitly enabled via env var.
  if (process.env.NODE_ENV === 'development' && process.env.EXPOSE_STACK === '1') {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};

export default errorHandler;

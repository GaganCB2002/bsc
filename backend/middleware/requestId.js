import crypto from 'crypto';

// Adds a request id to every incoming request so logs/errors can be correlated.
export const requestId = (req, res, next) => {
  const id = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
};

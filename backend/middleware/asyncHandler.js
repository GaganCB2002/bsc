// Wraps an async route handler so that thrown errors propagate to the
// centralized error handler via next(err) instead of crashing the process.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

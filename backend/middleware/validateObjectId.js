import mongoose from 'mongoose';

// Express middleware factory: validates that every :id in `req.params` is a Mongo ObjectId.
// Usage: router.get('/:id', validateObjectId(['id']), handler)
// If validation fails, sends 400 and does NOT call next().
export const validateObjectId = (paramNames = []) => (req, res, next) => {
  for (const name of paramNames) {
    const value = req.params[name];
    if (value && !mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for parameter '${name}'`,
      });
    }
  }
  next();
};

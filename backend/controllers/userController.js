import mongoose from 'mongoose';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Activity from '../models/Activity.js';
import { logActivity } from '../middleware/safeActivity.js';

const toInt = (val, def, max) => {
  const n = parseInt(val, 10);
  if (Number.isNaN(n) || n < 1) return def;
  if (max && n > max) return max;
  return n;
};

// @desc    Get current user's profile
// @route   GET /api/users/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/profile
// Strict allowlist — only these fields may be changed.
const PROFILE_UPDATABLE = ['name', 'phone', 'bio', 'avatar'];
export const updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    for (const k of PROFILE_UPDATABLE) {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    // Belt-and-braces: never let role / password / _id be set via this route.
    delete updates.role;
    delete updates.password;
    delete updates._id;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    logActivity(req.user._id, 'profile_updated', { details: 'Profile updated' });
    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
export const getUsers = async (req, res, next) => {
  try {
    const page = toInt(req.query.page, 1);
    const limit = toInt(req.query.limit, 20, 100);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(),
    ]);

    res.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin) — soft delete + cascade
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin user' });
    }
    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    // Cascade delete (no transaction support in standalone Mongo < 4.0; we accept eventual consistency).
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      Progress.deleteMany({ userId: req.params.id }),
      QuizAttempt.deleteMany({ userId: req.params.id }),
      Activity.deleteMany({ userId: req.params.id }),
    ]);
    logActivity(req.user._id, 'user_deleted', { deletedUserId: req.params.id });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

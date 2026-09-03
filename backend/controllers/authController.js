import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logActivity } from '../middleware/safeActivity.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  bio: user.bio,
});

// @desc    Register new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    // Strict allowlist — never spread req.body, prevents mass-assignment of role/etc.
    const { name, email, password, phone = '' } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({ name, email, password, phone });

    const token = generateToken(user._id);

    // Log activity (fire-and-forget; never throws back to the request)
    logActivity(user._id, 'login', { details: 'Account created' });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Generic message — don't leak whether the email exists.
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login (don't let a validation error here block the response)
    try {
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    } catch (e) {
      console.warn(`[login] could not update lastLogin: ${e.message}`);
    }

    const token = generateToken(user._id);
    logActivity(user._id, 'login', { details: 'User logged in' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: safeUser(user) });
  } catch (error) {
    next(error);
  }
};

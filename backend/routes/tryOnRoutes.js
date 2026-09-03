import express from 'express';
import jwt from 'jsonwebtoken';
import {
  getTryOnConfig,
  getActiveModels,
  generateTryOn,
  getUserGenerations,
  getGenerationById,
  adminGetStats,
  adminGetConfig,
  adminUpdateConfig,
  adminGetModels,
  adminCreateModel,
  adminUpdateModel,
  adminDeleteModel,
  adminGetGenerations,
  adminDeleteGeneration
} from '../controllers/tryOnController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import User from '../models/User.js';

const router = express.Router();

// --- PUBLIC / CUSTOMER ROUTES ---
router.get('/config', getTryOnConfig);
router.get('/models', getActiveModels);

// TryOn generation (could be guest or user, logic handled in controller).
// optionalAuth populates req.user if a valid token is present but does NOT
// fail the request when the token is missing or invalid — the controller
// uses config.allowGuestUsers to decide whether anonymous requests are
// permitted.
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (e) {
      // ignore invalid token for optional auth
    }
  }
  next();
};

router.post('/generate', optionalAuth, generateTryOn);
router.get('/history', protect, getUserGenerations);
router.get('/generation/:id', optionalAuth, validateObjectId(['id']), getGenerationById);

// --- ADMIN ROUTES ---
router.use('/admin', protect, authorize('admin'));

router.get('/admin/stats', adminGetStats);
router.get('/admin/config', adminGetConfig);
router.put('/admin/config', adminUpdateConfig);

router.route('/admin/models')
  .get(adminGetModels)
  .post(adminCreateModel);

router.route('/admin/models/:id')
  .put(validateObjectId(['id']), adminUpdateModel)
  .delete(validateObjectId(['id']), adminDeleteModel);

router.get('/admin/generations', adminGetGenerations);
router.delete('/admin/generations/:id', validateObjectId(['id']), adminDeleteGeneration);

export default router;

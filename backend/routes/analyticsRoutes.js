import express from 'express';
import { getUserAnalytics, getAdminAnalytics } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/user', protect, getUserAnalytics);
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);

export default router;

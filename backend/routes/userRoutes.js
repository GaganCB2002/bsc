import express from 'express';
import { getProfile, updateProfile, getUsers, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/', protect, authorize('admin'), getUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;

import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getUserProfile,
  updateUserProfile,
  getTeamMembers,
} from '../controllers/user.controller';

const router = Router();

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.get('/team', authenticate, getTeamMembers);

export default router;

import express from 'express';
import { authenticate } from '../utils/checkAuth';
import { deleteProfile, getProfile, updateProfile } from '../models/profile';
const router = express.Router();

router.get('/', authenticate, getProfile);
router.patch('/', authenticate, updateProfile);
router.delete('/', authenticate, deleteProfile);

export default router;

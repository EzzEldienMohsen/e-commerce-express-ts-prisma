import express from 'express';
import { authenticate } from '../utils/checkAuth';
import { logOutUser } from '../models/auth';

const router = express.Router();

router.post('/', authenticate, logOutUser);

export default router;

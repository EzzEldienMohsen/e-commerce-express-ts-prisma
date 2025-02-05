import express from 'express';
import { authenticate } from '../utils/checkAuth';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '../models/wishlist';
const router = express.Router();

router.get('/', authenticate, getWishlist);
router.post('/', authenticate, addToWishlist);
router.delete('/', authenticate, removeFromWishlist);

export default router;

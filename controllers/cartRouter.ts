import express from 'express';
import { authenticate } from '../utils/checkAuth';
import {
  addToCart,
  getAllCart,
  removeCartItem,
  updateCartItem,
} from '../models/cart';

const router = express.Router();

router.get('/', authenticate, getAllCart);
router.post('/', authenticate, addToCart);
router.patch('/', authenticate, updateCartItem);
router.delete('/', authenticate, removeCartItem);

export default router;

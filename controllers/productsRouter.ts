import express from 'express';
import { getAllProducts, getProductById } from '../models/products';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;

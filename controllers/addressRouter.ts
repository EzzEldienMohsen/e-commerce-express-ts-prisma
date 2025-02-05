import express from 'express';
import { authenticate } from '../utils/checkAuth';
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getAllAddresses,
  updateAddress,
} from '../models/address';
import { validate } from '../utils/validationMiddleWare';
import { ClientAddressSchema } from '../utils/validateSchema';
const router = express.Router();

router.get('/', authenticate, getAllAddresses);
router.get('/:id', authenticate, getAddressById);
router.post('/', validate(ClientAddressSchema), authenticate, createAddress);
router.patch(
  '/:id',
  validate(ClientAddressSchema),
  authenticate,
  updateAddress
);
router.delete('/:id', authenticate, deleteAddress);

export default router;

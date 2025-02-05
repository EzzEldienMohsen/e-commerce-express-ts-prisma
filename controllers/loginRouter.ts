import express from 'express';
import { login } from '../models/auth';
import { validate } from '../utils/validationMiddleWare';
import { ClientLoginSchema } from '../utils/validateSchema';

const router = express.Router();
router.post('/', validate(ClientLoginSchema), login);

export default router;

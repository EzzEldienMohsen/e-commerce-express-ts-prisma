import express from 'express';
import { signUp } from '../models/auth';
import { validate } from '../utils/validationMiddleWare';
import { ClientSignupSchema } from '../utils/validateSchema';

const router = express.Router();

router.post('/', validate(ClientSignupSchema), signUp);

export default router;

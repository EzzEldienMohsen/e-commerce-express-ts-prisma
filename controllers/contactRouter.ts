import express from 'express';
import { validate } from '../utils/validationMiddleWare';
import { messageSchema } from '../utils/validateSchema';
import { sendMessage } from '../models/contact';
const router = express.Router();

router.post('/', validate(messageSchema), sendMessage);
export default router;

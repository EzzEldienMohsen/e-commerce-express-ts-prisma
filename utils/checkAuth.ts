import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './jwtUtils';
import { CustomRequest } from '../assets/types';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export const authenticate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, error: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = verifyToken(token);

    // Ensure the decoded token is valid and contains a userId
    if (!decoded || typeof decoded === 'string' || !('userId' in decoded)) {
      res
        .status(403)
        .json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    const user = await prisma.clientUser.findUnique({
      where: { id: Number(decoded.userId) },
    });

    if (!user || user.token !== token) {
      res
        .status(403)
        .json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(403).json({ success: false, error: 'Invalid or expired token' });
    return;
  }
};

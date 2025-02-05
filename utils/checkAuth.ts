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

  // Check for token in the Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // If no token in header, check cookies
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  // If no token is found, return a 401 error
  if (!token) {
    res
      .status(401)
      .json({ success: false, error: 'Unauthorized: No token provided' });
    return;
  }

  try {
    // Verify the token using jwt.verify
    const decoded = verifyToken(token);

    // Ensure the decoded token is valid and contains a userId
    if (!decoded || typeof decoded === 'string' || !('userId' in decoded)) {
      res
        .status(403)
        .json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    // Perform an additional check: fetch the user from the database
    // and verify that the token matches the one stored for that user.
    const user = await prisma.clientUser.findUnique({
      where: { id: Number(decoded.userId) },
    });

    // If no user is found or the token does not match, reject the request.
    if (!user || user.token !== token) {
      res
        .status(403)
        .json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    // Token is valid and matches the DB record—attach userId to the request
    req.userId = decoded.userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(403).json({ success: false, error: 'Invalid or expired token' });
    return;
  }
};

import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { hashUserPassword, verifyPassword } from '../utils/hash';
import { generateToken, verifyToken } from '../utils/jwtUtils';
import { serializeBigInt } from '../utils';
import { CustomRequest } from '../assets/types';
const prisma = new PrismaClient().$extends(withAccelerate());

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { f_name, l_name, email, phone, password } = req.body;

  try {
    const hashedPassword = hashUserPassword(password);

    const newUser = await prisma.clientUser.create({
      data: {
        f_name,
        l_name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    const token = generateToken(serializeBigInt(newUser).id);

    const updatedUser = await prisma.clientUser.update({
      where: { id: newUser.id },
      data: { token },
    });

    res.cookie('auth_token', token, {
      httpOnly: true, // Prevents JavaScript from accessing the cookie.
      secure: process.env.NODE_ENV === 'production', // Uses HTTPS in production.
      maxAge: 60 * 60 * 24, // Cookie expiry in seconds (here, 1 day).
      sameSite: 'lax', // Helps prevent CSRF attacks.
    });

    res.status(201).json({
      success: true,
      user: {
        firstName: updatedUser.f_name,
        lastName: updatedUser.l_name,
        registeredEmail: updatedUser.email,
        updatedToken: updatedUser.token,
      },
      message: 'Signed up successfully',
    });
  } catch (error) {
    console.error('Error during sign up:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.clientUser.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'The email is not registered to an account',
      });
      return;
    }

    if (!verifyPassword(user.password, password)) {
      res.status(400).json({
        success: false,
        message: 'Please check password and try again',
      });
      return;
    }

    const token = generateToken(serializeBigInt(user).id);

    const updatedUser = await prisma.clientUser.update({
      where: { id: user.id },
      data: { token },
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });

    res.status(201).json({
      success: true,
      user: {
        firstName: updatedUser.f_name,
        lastName: updatedUser.l_name,
        registeredEmail: updatedUser.email,
        updatedToken: updatedUser.token,
      },
      message: 'Logged in successfully',
    });
  } catch (error) {
    console.error('Error during logging in:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

export const logOutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customRequest = req as CustomRequest;
    const userId = customRequest.userId;

    await prisma.clientUser.update({
      where: { id: serializeBigInt(userId) },
      data: { token: '' },
    });

    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });

    res.status(202).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logging out:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

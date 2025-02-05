import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { serializeBigInt } from '../utils';
import { CustomRequest } from '../assets/types';
const prisma = new PrismaClient().$extends(withAccelerate());

export const getProfile = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  try {
    const profile = await prisma.clientUser.findUnique({
      where: { id: Number(userId) },
    });
    res.status(200).json({ success: true, data: serializeBigInt(profile) });
  } catch (error) {
    console.error('fetching profile', error);
    res.status(500).json({
      success: false,
      data: {},
      message: 'Failed fetching profile please try again later',
    });
  }
};

export const updateProfile = async (req: CustomRequest, res: Response) => {
  const {
    f_name,
    l_name,
    email,
    phone,
    main_address,
    gender,
    date_of_birth,
    nationality,
    avatar_url,
    bio,
  } = req.body;
  const userId = req.userId;
  try {
    const result = await prisma.clientUser.update({
      where: { id: Number(userId) },
      data: {
        f_name,
        l_name,
        email,
        phone,
        main_address,
        gender,
        date_of_birth,
        nationality,
        avatar_url,
        bio,
      },
    });
    res.status(202).json({
      success: true,
      data: serializeBigInt(result),
      message: 'Profile updated successfully!',
    });
  } catch (error) {
    console.error('error updating address', error);
    res.status(500).json({
      success: false,
      data: {},
      message: 'Failed to update profile, please try again later',
    });
  }
};

export const deleteProfile = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  try {
    await prisma.clientUser.delete({
      where: { id: Number(userId) },
    });
    res
      .status(202)
      .json({ success: true, message: 'profile deleted successfully' });
  } catch (error) {
    console.error('error deleting profile', error);
    res.status(500).json({
      success: false,
      message: 'failed deleting profile, please try again later',
    });
  }
};

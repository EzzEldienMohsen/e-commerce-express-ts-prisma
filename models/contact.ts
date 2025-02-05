import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Request, Response } from 'express';
const prisma = new PrismaClient().$extends(withAccelerate());

export const sendMessage = async (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;
  try {
    await prisma.contact.create({ data: { name, email, phone, message } });
    res
      .status(201)
      .json({ success: true, message: 'message sent successfully' });
  } catch (error) {
    console.error('error sending the message', error);
    res.status(500).json({
      success: false,
      message: 'could not send the message please try again later',
    });
  }
};

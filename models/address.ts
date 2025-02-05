import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Response } from 'express';
import { serializeBigInt } from '../utils';
import { CustomRequest } from '../assets/types';
const prisma = new PrismaClient().$extends(withAccelerate());

export const getAllAddresses = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  try {
    const result = await prisma.client_address.findMany({
      where: { client_id: Number(userId) },
    });
    res.status(200).json({ success: true, data: serializeBigInt(result) });
  } catch (error) {
    console.error('getting addressError', error);
    res.status(500).json({
      success: false,
      message: 'could not get addresses try again later',
    });
  }
};

export const createAddress = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  const { address_name, address_details } = req.body;
  try {
    await prisma.client_address.create({
      data: { address_name, address_details, client_id: Number(userId) },
    });
    res
      .status(201)
      .json({ success: true, message: 'Address created successfully' });
  } catch (error) {
    console.error('failed adding address', error);
    res.status(500).json({
      success: false,
      message: 'Failed adding address, try again later',
    });
  }
};

export const getAddressById = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;
  try {
    const result = await prisma.client_address.findUnique({
      where: { id: BigInt(id), client_id: Number(userId) },
    });
    res.status(200).json({ success: true, data: serializeBigInt(result) });
  } catch (error) {
    console.error('fetching address error ', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed Fetching address' });
  }
};

export const updateAddress = async (req: CustomRequest, res: Response) => {
  const { address_name, address_details } = req.body;
  const { id } = req.params;
  const userId = req.userId;
  try {
    const result = await prisma.client_address.update({
      where: { id: Number(id), client_id: Number(userId) },
      data: { address_name, address_details },
    });
    res.status(202).json({
      success: true,
      data: serializeBigInt(result),
      message: 'Address updated successfully',
    });
  } catch (error) {
    console.error('update address error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address, try again later',
    });
  }
};

export const deleteAddress = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    await prisma.client_address.delete({
      where: { id: BigInt(id), client_id: Number(userId) },
    });
    res
      .status(202)
      .json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('error deleting address', error);
    res.status(500).json({
      success: false,
      message: 'Failed deleting address,try again later',
    });
  }
};

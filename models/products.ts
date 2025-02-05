import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Request, Response } from 'express';
import { serializeBigInt } from '../utils';

const prisma = new PrismaClient().$extends(withAccelerate());

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit = '8', offset = '0', category, latest = 'false' } = req.query;

    let products;
    let totalCount = 0;

    if (latest === 'true') {
      products = await prisma.products.findMany({
        orderBy: { id: 'desc' },
        take: 4,
      });
    } else {
      products = await prisma.products.findMany({
        where: category ? { cat: String(category) } : undefined,
        skip: Number(offset),
        take: Number(limit),
      });

      totalCount = await prisma.products.count({
        where: category ? { cat: String(category) } : undefined,
      });
    }

    res.json({
      success: true,
      products: serializeBigInt(products),
      totalPages:
        latest === 'true' ? undefined : Math.ceil(totalCount / Number(limit)),
      currentPage:
        latest === 'true'
          ? undefined
          : Math.floor(Number(offset) / Number(limit)) + 1,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch products.' });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const product = await prisma.products.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, product: serializeBigInt(product) });
  } catch (error) {
    console.error('Error fetching product:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch product.' });
  }
};

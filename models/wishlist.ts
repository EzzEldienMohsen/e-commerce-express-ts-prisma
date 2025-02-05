import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Response } from 'express';
import { serializeBigInt } from '../utils';
import { CustomRequest } from '../assets/types';
import { fetchWishlistById } from '../utils/wishlistUtils';
const prisma = new PrismaClient().$extends(withAccelerate());

export const getWishlist = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  try {
    const wishlist = await fetchWishlistById(userId);
    if (!wishlist) {
      res.status(200).json({ success: true, data: [], totalItems: 0 });
      return;
    }
    const wishItems = await prisma.wishlist_items.findMany({
      where: { wishlidt_id: wishlist.id },
    });
    const products = await Promise.all(
      wishItems.map(async (item) => {
        // Return the product details (or modify as needed)
        const product = await prisma.products.findUnique({
          where: { id: item.product_id },
        });
        return product;
      })
    );

    res
      .status(200)
      .json({
        success: true,
        data: serializeBigInt(products),
        totalItems: wishItems.length,
      });
  } catch (error) {
    console.error('error fetching wishlist', error);
    res.status(500).json({
      success: false,
      data: [],
      message: 'error fetching your wishlist,try again later',
    });
  }
};

export const addToWishlist = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  const { product_id } = req.body;
  try {
    let wishlist = await fetchWishlistById(userId);
    if (!wishlist && userId) {
      wishlist = await prisma.wishlist.create({
        data: { client_id: BigInt(userId) },
      });
    }
    if (!wishlist) {
      // This should never happen, but handles an unexpected state
      res.status(500).json({
        success: false,
        message: 'Wishlist not found or could not be created',
      });
      return;
    }
    await prisma.wishlist_items.create({
      data: { wishlidt_id: wishlist.id, product_id: BigInt(product_id) },
    });
    res
      .status(201)
      .json({ success: true, message: 'Item added to wishlist successfully' });
  } catch (error) {
    console.error('error adding to wishlist', error);
    res.status(500).json({
      success: false,
      message: 'failed to add to your wishlist, please try again later',
    });
  }
};

export const removeFromWishlist = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.body;
  try {
    const wishlist = await fetchWishlistById(userId);
    if (!wishlist) {
      res
        .status(404)
        .json({ success: false, message: 'Could not find wishlist' });
      return;
    }
    await prisma.wishlist_items.delete({
      where: { wishlidt_id: wishlist.id, id: BigInt(id) },
    });
    res
      .status(202)
      .json({ success: true, message: 'Item removed successfully' });
  } catch (error) {
    console.error('error removing wishlist item', error);
    res.status(500).json({
      success: false,
      message: 'Failed removing the item, try again later',
    });
  }
};

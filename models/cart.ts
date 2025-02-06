import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { CustomRequest } from '../assets/types';
import { Response } from 'express';
import {
  calculateCartTotals,
  fetchCartByClientId,
  fetchCartItems,
} from '../utils/cartUtils';
import { bigint } from 'zod';
import { serializeBigInt } from '../utils/index';

const prisma = new PrismaClient().$extends(withAccelerate());

export const getAllCart = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  try {
    const cart = await fetchCartByClientId(userId);
    if (!cart) {
      res.status(200).json({
        success: true,
        data: [
          {
            items: [],
            totalPrice: 0,
            totalItems: 0,
            taxes: 0,
            subTotal: 0,
          },
        ],
      });
      return;
    }
    const cartItems = await fetchCartItems(cart.id);
    const { subTotal, taxes, totalPrice } = calculateCartTotals(
      cartItems,
      cart.taxes
    );
    const totalItems = cartItems.length;
    res.status(200).json({
      success: true,
      data: [
        {
          items: serializeBigInt(cartItems),
          totalPrice,
          totalItems,
          taxes,
          subTotal,
        },
      ],
    });
  } catch (error) {
    console.error('error fetching cart', error);
    res.status(500).json({ success: false, message: 'Failed Fetching cart' });
  }
};

export const addToCart = async (req: CustomRequest, res: Response) => {
  const userId = req.userId;
  const { img, name, type, price, cat, id: productId, amount } = req.body;

  try {
    let cart = await fetchCartByClientId(userId);
    if (!cart && userId) {
      cart = await prisma.cart.create({
        data: {
          client_id: BigInt(userId),
        },
      });
    }
    if (!cart || !userId) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to add to cart' });
      return;
    }
    await prisma.cart_products.create({
      data: {
        img,
        name,
        type,
        price,
        cat,
        cart_id: cart.id,
        product_id: BigInt(productId),
        amount,
      },
    });

    const cartItems = await fetchCartItems(cart.id);
    const { subTotal, taxes, totalPrice } = calculateCartTotals(
      cartItems,
      cart.taxes
    );

    await prisma.cart.update({
      where: { id: cart.id, client_id: BigInt(userId) },
      data: {
        sub_total: subTotal,
        total_price: totalPrice,
      },
    });

    res
      .status(201)
      .json({ success: true, message: 'Added to cart successfully' });
  } catch (error) {
    console.error('error adding to cart', error);
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
};

export const updateCartItem = async (req: CustomRequest, res: Response) => {
  const { id, newAmount } = req.body;
  const userId = req.userId;

  try {
    const cart = await fetchCartByClientId(userId);
    if (!cart || !userId) {
      res.status(404).json({ success: false, message: 'cart not found' });
      return;
    }

    if (newAmount <= 0) {
      removeCartItem(req, res);
      return;
    }

    await prisma.cart_products.update({
      where: {
        id: BigInt(id),
        cart_id: cart.id,
      },
      data: {
        amount: newAmount,
      },
    });

    const cartItems = await fetchCartItems(cart.id);
    const { subTotal, taxes, totalPrice } = calculateCartTotals(
      cartItems,
      cart.taxes
    );

    await prisma.cart.update({
      where: { id: cart.id, client_id: BigInt(userId) },
      data: {
        sub_total: subTotal,
        total_price: totalPrice,
      },
    });

    res
      .status(202)
      .json({ success: true, message: 'Item updated successfully' });
  } catch (error) {
    console.error('error updating cart item', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to update cart item' });
  }
};

export const removeCartItem = async (req: CustomRequest, res: Response) => {
  const { id } = req.body;
  const userId = req.userId;

  try {
    const cart = await fetchCartByClientId(userId);
    if (!cart || !userId) {
      res.status(404).json({ success: false, message: 'cart not found' });
      return;
    }

    await prisma.cart_products.delete({
      where: {
        id: BigInt(id),
        cart_id: cart.id,
      },
    });

    const cartItems = await fetchCartItems(cart.id);
    const { subTotal, taxes, totalPrice } = calculateCartTotals(
      cartItems,
      cart.taxes
    );

    await prisma.cart.update({
      where: { id: cart.id, client_id: BigInt(userId) },
      data: {
        sub_total: subTotal,
        total_price: totalPrice,
      },
    });

    res.status(202).json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('error removing cart item', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete cart item' });
  }
};

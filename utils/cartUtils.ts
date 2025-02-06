import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { CartProduct } from '../assets/types';

const prisma = new PrismaClient().$extends(withAccelerate());

export const fetchCartByClientId = async (
  userId: number | null | undefined
) => {
  if (!userId) {
    return null;
  }
  const cart = await prisma.cart.findUnique({
    where: { client_id: BigInt(userId) },
  });
  return cart;
};

export const fetchCartItems = async (cartId: bigint) => {
  const items = await prisma.cart_products.findMany({
    where: { cart_id: BigInt(cartId) },
  });
  return items;
};

export const calculateCartTotals = (
  cartItems: CartProduct[],
  taxRate: number
) => {
  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.amount,
    0
  );
  const taxes = subTotal * taxRate;
  const totalPrice = subTotal + taxes;
  return { subTotal, taxes, totalPrice };
};

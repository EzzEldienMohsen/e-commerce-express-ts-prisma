import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export const fetchWishlistById = async (userId: number | null | undefined) => {
  if (!userId) {
    return null;
  }
  const result = await prisma.wishlist.findUnique({
    where: { client_id: BigInt(userId) },
  });
  return result;
};

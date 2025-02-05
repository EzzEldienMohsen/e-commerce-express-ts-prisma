import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { products } from '../assets/products';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  await Promise.all(
    products.map((prod) => prisma.products.create({ data: prod }))
  );

  console.log('Seeding complete! 🎉');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

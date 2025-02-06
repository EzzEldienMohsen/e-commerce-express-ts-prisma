/*
  Warnings:

  - You are about to drop the column `amout` on the `Cart_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart_products" DROP COLUMN "amout",
ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 1;

/*
  Warnings:

  - A unique constraint covering the columns `[client_id]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[client_id]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cart_client_id_key" ON "Cart"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_client_id_key" ON "Wishlist"("client_id");

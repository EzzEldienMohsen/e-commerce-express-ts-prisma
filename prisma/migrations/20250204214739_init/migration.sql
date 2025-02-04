-- CreateTable
CREATE TABLE "Products" (
    "id" BIGSERIAL NOT NULL,
    "img" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "cat" TEXT NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientUser" (
    "id" BIGSERIAL NOT NULL,
    "f_name" TEXT NOT NULL,
    "l_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "main_address" TEXT,
    "password" TEXT NOT NULL,
    "token" TEXT,
    "gender" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "nationality" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,

    CONSTRAINT "ClientUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client_address" (
    "id" BIGSERIAL NOT NULL,
    "address_name" TEXT NOT NULL,
    "address_details" TEXT NOT NULL,
    "client_id" BIGINT NOT NULL,

    CONSTRAINT "Client_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" BIGSERIAL NOT NULL,
    "client_id" BIGINT NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxes" DOUBLE PRECISION NOT NULL DEFAULT 0.05,
    "sub_total" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart_products" (
    "id" BIGSERIAL NOT NULL,
    "img" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "cat" TEXT NOT NULL,
    "amout" INTEGER NOT NULL DEFAULT 1,
    "product_id" BIGINT NOT NULL,
    "cart_id" BIGINT NOT NULL,

    CONSTRAINT "Cart_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" BIGSERIAL NOT NULL,
    "client_id" BIGINT NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist_items" (
    "id" BIGSERIAL NOT NULL,
    "wishlidt_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,

    CONSTRAINT "Wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_id_key" ON "Products"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ClientUser_email_key" ON "ClientUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientUser_phone_key" ON "ClientUser"("phone");

-- AddForeignKey
ALTER TABLE "Client_address" ADD CONSTRAINT "Client_address_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "ClientUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "ClientUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_products" ADD CONSTRAINT "Cart_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_products" ADD CONSTRAINT "Cart_products_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "ClientUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist_items" ADD CONSTRAINT "Wishlist_items_wishlidt_id_fkey" FOREIGN KEY ("wishlidt_id") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist_items" ADD CONSTRAINT "Wishlist_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

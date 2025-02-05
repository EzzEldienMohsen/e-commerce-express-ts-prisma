// Types for the Database Tables

// Type for the `products` table
export type Products = {
  id: number;
  img: string;
  name: string;
  type: string;
  price: number;
  cat: string;
}[];
export type Product = {
  id: number;
  img: string;
  name: string;
  type: string;
  price: number;
  cat: string;
};
export type ProductToAddToCart = {
  id: number;
  img: string;
  name: string;
  type: string;
  price: number;
  cat: string;
  amount: number;
};

// Type for the `clientUser` table
export type ClientUser = {
  id: number;
  token?: string;
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  main_address?: string;
  password: string;
  gender?: string;
  date_of_birth?: string; // Use ISO 8601 date string
  nationality?: string;
  avatar_url?: string;
  bio?: string;
};
// Type for the `cart` table
export type Cart = {
  id: number;
  client_id: number;
  total_price: number;
  taxes: number;
  sub_total: number;
};

// Type for the `cart_products` table
export type CartProduct = {
  id: number;
  img: string;
  name: string;
  type: string;
  price: number;
  cat: string;
  cart_id: number;
  product_id: number;
  amount: number;
};

// Type for the `wish_list` table
export type WishList = {
  id: number;
  client_id: number;
  product_id: number;
};

// Type for the `client_address` table
export type ClientAddress = {
  id: number;
  address_name: string;
  address_details: string;
  client_id: number;
};

// Type for the `adminUser` table
export type AdminUser = {
  id: number;
  name: string;
  email: string;
  password: string;
};

// Type for the `orders` table
export type Order = {
  id: number;
  client_id: number;
  cart_products_id: number;
  status: string;
  address: string;
  total_price: number;
};

// Type for the `branchAddress` table
export type BranchAddress = {
  id: number;
  address_name: string;
  address_details: string;
  working_hours: string;
  holidays: string;
  admin_id: number;
};

// HeaderLinks
export type HeaderLinks = string[];
// Footer column

export type FooterColumn = {
  title: string;
  list: string[];
};
// GET ALL CART RETURN TYPE
export type GetCartData = {
  items: CartProduct[];
  totalPrice: number;
  totalItems: number;
  taxes: number;
  cartId: number;
  subTotal: number;
  error?: { field: string; message: string }[];
};

//  Get The WishList Data
export type GetWishlistData = {
  items: WishlistItem[];
  totalItems: number;
  error?: { field: string; message: string }[];
};
// WishList Item
export type WishlistItem = {
  id: number;
  img: string;
  name: string;
  type: string;
  price: number;
  cat: string;
  wishlist_id: number;
  product_id: number;
};

// wishList Type
export type Wishlist = { id: number; client_id: number };

// App Configuration
export const APP_NAME = "Mini Ecommerce";
export const APP_DESCRIPTION =
  "Platform e-commerce modern dengan produk berkualitas dan harga terbaik";

// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://dummyjson.com";

// Pagination
export const PRODUCTS_PER_PAGE = 12;

// Locations
export const LOCATIONS = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Medan",
] as const;

export type Location = (typeof LOCATIONS)[number];

// Toast Messages
export const TOAST_MESSAGES = {
  addToCart: "Produk ditambahkan ke keranjang",
  removeFromCart: "Produk dihapus dari keranjang",
  loginSuccess: "Login berhasil",
  logoutSuccess: "Logout berhasil",
  loginError: "Gagal login",
  cartError: "Gagal menambahkan ke keranjang",
  addProduct: "Produk baru berhasil ditambahkan",
} as const;

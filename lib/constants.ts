// App Configuration
export const APP_NAME = "Mini Ecommerce";
export const APP_DESCRIPTION =
  "Platform e-commerce modern dengan produk berkualitas dan harga terbaik";

// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://dummyjson.com";

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const INFINITE_SCROLL_THRESHOLD = 100; // pixels from bottom

// Locations
export const LOCATIONS = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Medan",
] as const;

export type Location = (typeof LOCATIONS)[number];

// Price Ranges
export const PRICE_RANGES = {
  all: { label: "Semua Harga", min: 0, max: Infinity },
  lt100: { label: "< $100", min: 0, max: 100 },
  "100to500": { label: "$100 - $500", min: 100, max: 500 },
  gt500: { label: "> $500", min: 500, max: Infinity },
} as const;

// Rating
export const MIN_RATING = 1;
export const MAX_RATING = 5;

// Toast Messages
export const TOAST_MESSAGES = {
  addToCart: "Produk ditambahkan ke keranjang",
  removeFromCart: "Produk dihapus dari keranjang",
  loginSuccess: "Login berhasil",
  logoutSuccess: "Logout berhasil",
  loginError: "Gagal login",
  cartError: "Gagal menambahkan ke keranjang",
} as const;

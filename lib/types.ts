export interface User {
  id: number;
  username: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  stock: number;
  category: string;
  rating: number;
  brand: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

/** The app's own cart item shape (Zustand cart store, persisted to localStorage). */
export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

/** DummyJSON's `/carts/*` response shape — only used by the (currently unused) cart proxy routes. */
export interface DummyJsonCartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
}

export interface DummyJsonCart {
  id: number;
  userId: number;
  products: DummyJsonCartProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

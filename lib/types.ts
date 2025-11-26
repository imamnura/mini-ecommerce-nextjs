export interface User {
  id: number;
  username: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
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

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Cart {
  id: number;
  userId: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

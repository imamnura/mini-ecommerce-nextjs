import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

interface LocalProductsState {
  products: Product[];
  addProduct: (product: Product) => void;
}

export const useLocalProductsStore = create<LocalProductsState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),
    }),
    {
      name: "local-products-storage",
    },
  ),
);

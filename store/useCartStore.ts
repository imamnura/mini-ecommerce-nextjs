import { create } from "zustand";

interface CartState {
  totalQuantity: number;
  setTotalQuantity: (qty: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  totalQuantity: 0,
  setTotalQuantity: (qty) => set({ totalQuantity: qty }),
}));

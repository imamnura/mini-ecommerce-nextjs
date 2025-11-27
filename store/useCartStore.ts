import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface CartState {
  products: CartProduct[];
  totalQuantity: number;
  totalPrice: number;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addToCart: (product: Omit<CartProduct, "quantity">) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      products: [],
      totalQuantity: 0,
      totalPrice: 0,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      addToCart: (product) => {
        const existingProduct = get().products.find((p) => p.id === product.id);

        if (existingProduct) {
          // Update quantity if already in cart
          set((state) => {
            const updatedProducts = state.products.map((p) =>
              p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            );
            return {
              products: updatedProducts,
              totalQuantity: updatedProducts.reduce(
                (sum, p) => sum + p.quantity,
                0
              ),
              totalPrice: updatedProducts.reduce(
                (sum, p) => sum + p.price * p.quantity,
                0
              ),
            };
          });
        } else {
          // Add new product
          set((state) => {
            const newProduct = { ...product, quantity: 1 };
            const updatedProducts = [...state.products, newProduct];
            return {
              products: updatedProducts,
              totalQuantity: updatedProducts.reduce(
                (sum, p) => sum + p.quantity,
                0
              ),
              totalPrice: updatedProducts.reduce(
                (sum, p) => sum + p.price * p.quantity,
                0
              ),
            };
          });
        }
      },

      removeFromCart: (productId) => {
        set((state) => {
          const updatedProducts = state.products.filter(
            (p) => p.id !== productId
          );
          return {
            products: updatedProducts,
            totalQuantity: updatedProducts.reduce(
              (sum, p) => sum + p.quantity,
              0
            ),
            totalPrice: updatedProducts.reduce(
              (sum, p) => sum + p.price * p.quantity,
              0
            ),
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => {
          const updatedProducts = state.products.map((p) =>
            p.id === productId ? { ...p, quantity } : p
          );
          return {
            products: updatedProducts,
            totalQuantity: updatedProducts.reduce(
              (sum, p) => sum + p.quantity,
              0
            ),
            totalPrice: updatedProducts.reduce(
              (sum, p) => sum + p.price * p.quantity,
              0
            ),
          };
        });
      },

      clearCart: () => set({ products: [], totalQuantity: 0, totalPrice: 0 }),

      isInCart: (productId) => {
        return get().products.some((p) => p.id === productId);
      },
    }),
    {
      name: "cart-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

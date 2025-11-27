import { create } from "zustand";

interface User {
  id: number;
  username?: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (state: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (state) => set({ isLoading: state }),
  logout: () =>
    set({
      user: null,
      isLoading: false,
    }),
}));

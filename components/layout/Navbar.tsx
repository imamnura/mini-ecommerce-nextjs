"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, LogOut } from "lucide-react";
import { APP_NAME, TOAST_MESSAGES } from "@/lib/constants";

export default function Navbar() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const isLoading = useUserStore((s) => s.isLoading);
  const logoutStore = useUserStore((s) => s.logout);
  const totalQuantity = useCartStore((s) => s.totalQuantity);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    logoutStore();
    toast.success(TOAST_MESSAGES.logoutSuccess);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-lg sm:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href="/products"
          className="flex items-center gap-2 text-lg font-bold text-green-600 sm:text-xl"
        >
          <ShoppingCart className="h-6 w-6" />
          <span>{APP_NAME}</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3 text-sm sm:gap-5">
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-600"
            >
              <ShoppingCart className="h-5 w-5 sm:hidden" />
              <span className="hidden sm:inline">Keranjang</span>
              {totalQuantity > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
                  {totalQuantity}
                </span>
              )}
            </Link>

            <span className="hidden text-gray-600 sm:inline">
              Halo,{" "}
              <span className="font-semibold text-green-600">
                {user.username || `User #${user.id}`}
              </span>
            </span>

            <button
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-green-600 hover:text-green-600"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        ) : isLoading ? (
          <div className="h-9 w-16 animate-pulse rounded-lg bg-gray-200"></div>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

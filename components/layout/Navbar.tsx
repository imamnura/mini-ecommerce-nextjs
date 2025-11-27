"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const logoutStore = useUserStore((s) => s.logout);
  const totalQuantity = useCartStore((s) => s.totalQuantity);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    logoutStore();
    toast.success("Logout berhasil");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/products"
          className="text-lg font-semibold text-indigo-300"
        >
          Mini Ecommerce
        </Link>

        {user ? (
          <div className="flex items-center gap-5 text-sm">
            <Link
              href="/cart"
              className="relative text-slate-300 hover:text-indigo-200"
            >
              Keranjang
              {totalQuantity > 0 && (
                <span className="absolute -right-3 -top-2 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  {totalQuantity}
                </span>
              )}
            </Link>

            <span className="text-slate-400">
              Hallo: <span className="text-indigo-300">User #{user.id}</span>
            </span>

            <button
              className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-indigo-400 hover:text-indigo-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-indigo-400 hover:text-indigo-200"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

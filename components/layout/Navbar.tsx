"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  token: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  async function fetchUser() {
    const res = await fetch("/api/me");
    const data = await res.json();
    setUser(data.user ?? null);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  async function handleLogout() {
    // hapus cookie via route logout
    await fetch("/api/logout", { method: "POST" });

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
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">
              Login sebagai:{" "}
              <span className="text-indigo-300">User #{user.id}</span>
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

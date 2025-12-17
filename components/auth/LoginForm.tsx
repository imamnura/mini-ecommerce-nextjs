"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { ShoppingCart } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") ?? "/products";
  const setUser = useUserStore((s) => s.setUser);

  const [username, setUsername] = useState("emilys"); // contoh user dummyjson
  const [password, setPassword] = useState("emilyspass");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Gagal login");
      }

      const data = await res.json();
      setUser(data.user); // Update user store immediately
      router.push(redirectTo);
      router.refresh(); // Force refresh to update navbar
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message ?? "Terjadi kesalahan");
      } else {
        setError("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="mx-auto mt-16 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <ShoppingCart className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {APP_NAME}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Login dengan akun DummyJSON
        </p>
        <p className="text-xs text-gray-500">(emilys / emilyspass)</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-600/30 transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-70"
          whileTap={{ scale: 0.97 }}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>
      </form>
    </motion.div>
  );
}

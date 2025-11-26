"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { motion } from "framer-motion";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/products";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }

      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message ?? "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      className="mx-auto mt-24 w-full max-w-md rounded-2xl bg-slate-900/80 p-8 shadow-2xl shadow-slate-900/80 ring-1 ring-slate-800"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h1 className="text-center text-2xl font-semibold tracking-tight">
        Mini Ecommerce
      </h1>
      <p className="mt-2 text-center text-sm text-slate-400">
        Login denagn akun DummyJSON
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-slate-200"
          >
            Username
          </label>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Password</label>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
          whileTap={{ scale: 0.97 }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </motion.button>
      </form>
    </motion.div>
  );
}

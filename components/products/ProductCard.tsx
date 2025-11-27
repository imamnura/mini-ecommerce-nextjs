"use client";

import type { Product } from "@/lib/types";
import { getMockLocation } from "@/lib/helpers";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [adding, setAdding] = useState(false);

  const location = getMockLocation(product);

  const setTotalQty = useCartStore((s) => s.setTotalQuantity);

  async function handleAddToCart() {
    setAdding(true);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      // Update jumlah produk total
      setTotalQty(data.totalQuantity);

      toast.success("Ditambahkan ke keranjang");
    } catch (err) {
      toast.error("Gagal menambahkan ke keranjang");
    } finally {
      setAdding(false);
    }
  }

  return (
    <motion.article
      className="group flex flex-col overflow-hidden rounded-2xl bg-slate-900/90 ring-1 ring-slate-800 transition hover:-translate-y-1 hover:ring-indigo-500/60"
      whileHover={{ scale: 1.01 }}
      layout
    >
      <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/0 to-slate-950/20" />
        <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-100">
          {product.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-50">
          {product.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-sm text-indigo-300">
            ${product.price.toFixed(2)}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>{product.brand}</span>
          <span>{location}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/40 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {adding ? "Menambahkan..." : "Tambah ke Keranjang"}
        </button>
      </div>
    </motion.article>
  );
}

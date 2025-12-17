"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const products = useCartStore((s) => s.products);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const totalQuantity = useCartStore((s) => s.totalQuantity);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const hasHydrated = useCartStore((s) => s._hasHydrated);

  if (!hasHydrated) {
    return (
      <main className="space-y-6">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"></div>
            <p className="mt-4 text-sm text-gray-500">Memuat keranjang...</p>
          </div>
        </div>
      </main>
    );
  }

  const isEmpty = products.length === 0;

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
            <ShoppingCart className="h-6 w-6 text-green-600" />
            <span>Keranjang Belanja</span>
          </h1>
          <p className="text-sm text-gray-500">
            Kelola produk dalam keranjang Anda
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm font-medium text-green-600 transition hover:text-green-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Lanjut Belanja</span>
        </Link>
      </div>

      {isEmpty ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-300" />
          <p className="mt-4 text-xl font-semibold text-gray-700">
            Keranjang Kosong
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Yuk mulai belanja produk favoritmu!
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <div className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700">
              Produk ({products.length})
            </h2>
            <div className="space-y-3">
              {products.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 transition hover:border-green-300 hover:shadow-md"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={p.thumbnail}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{p.title}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      ${p.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(p.id, p.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {p.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(p.id, p.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="font-mono text-lg font-semibold text-green-600">
                    ${(p.price * p.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(p.id)}
                    className="rounded-md p-2 text-red-500 transition hover:bg-red-50"
                    title="Hapus dari keranjang"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-900">
              <ShoppingCart className="h-4 w-4 text-green-600" />
              <span>Ringkasan Belanja</span>
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2 text-gray-600">
                <span>Total Produk</span>
                <span className="font-medium">{products.length}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2 text-gray-600">
                <span>Total Item</span>
                <span className="font-medium">{totalQuantity}</span>
              </div>
              <div className="flex justify-between pt-1 text-base">
                <span className="font-semibold text-gray-700">Total Harga</span>
                <span className="font-mono text-2xl font-bold text-green-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/30 transition hover:bg-green-500 hover:shadow-xl">
              <Rocket className="h-4 w-4" />
              <span>Checkout Sekarang</span>
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

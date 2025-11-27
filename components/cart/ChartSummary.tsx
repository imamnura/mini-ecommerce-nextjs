"use client";

import type { Cart } from "@/lib/types";

interface Props {
  cart: Cart;
}

export function CartSummary({ cart }: Props) {
  return (
    <section className="space-y-4 rounded-2xl bg-slate-900/90 p-4 ring-1 ring-slate-800">
      <h2 className="text-sm font-semibold tracking-wide text-slate-200">
        Ringkasan
      </h2>
      <div className="space-y-1 text-sm text-slate-300">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Total Produk</span>
          <span>{cart.totalProducts}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Total Qty</span>
          <span>{cart.totalQuantity}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="font-medium">Subtotal</span>
          <span className="font-mono text-indigo-300">
            ${cart.total.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-emerald-300">
          <span>Setelah diskon</span>
          <span className="font-mono">${cart.discountedTotal.toFixed(2)}</span>
        </div>
      </div>

      <button className="mt-2 w-full rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-400">
        Checkout (dummy)
      </button>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { Cart } from "@/lib/types";
import { CartSummary } from "@/components/cart/ChartSummary";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/cart/user");
      const data = await res.json();

      // API carts/user mengembalikan { carts: Cart[], ... }
      const c = data.carts?.[0] as Cart | undefined;
      setCart(c ?? null);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Keranjang</h1>
          <p className="text-sm text-slate-400">
            Data keranjang dari DummyJSON carts/user/1
          </p>
        </div>
        <a
          href="/products"
          className="text-xs font-medium text-indigo-300 hover:text-indigo-200"
        >
          ← Kembali ke produk
        </a>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Memuat keranjang...</p>
      ) : !cart ? (
        <p className="text-sm text-slate-400">
          Keranjang kosong (tidak ada cart untuk user ini).
        </p>
      ) : (
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <div className="space-y-3 rounded-2xl bg-slate-900/90 p-4 ring-1 ring-slate-800">
            {cart.products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/50 px-3 py-2 text-sm"
              >
                <div>
                  <div className="font-medium text-slate-100">{p.title}</div>
                  <div className="text-xs text-slate-400">
                    Qty: {p.quantity} × ${p.price.toFixed(2)}
                  </div>
                </div>
                <div className="font-mono text-sm text-indigo-300">
                  ${p.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <CartSummary cart={cart} />
        </section>
      )}
    </main>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product, ProductsResponse } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import {
  ProductFilters,
  type FiltersState,
} from "@/components/products/ProductFilters";
import { ProductSearchBar } from "@/components/products/ProductSearchBar";
import { motion } from "framer-motion";
import { getMockLocation } from "@/lib/helpers";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    price: "all",
    rating: "all",
    category: "all",
    location: "all",
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch pertama
  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      const res = await fetch(
        `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=0`
      );
      const data: ProductsResponse = await res.json();
      setProducts(data.products);
      setTotal(data.total);
      setSkip(PAGE_SIZE);
      setInitialLoading(false);
    })();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          !loadingMore &&
          !isSearching &&
          products.length < total
        ) {
          setLoadingMore(true);
          const res = await fetch(
            `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`
          );
          const data: ProductsResponse = await res.json();
          setProducts((prev) => [...prev, ...data.products]);
          setSkip((prev) => prev + PAGE_SIZE);
          setLoadingMore(false);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [skip, loadingMore, products.length, total, isSearching]);

  // Pencarian
  async function handleSearch() {
    if (!search.trim()) {
      // Reset ke mode normal
      setIsSearching(false);
      setProducts([]);
      setSkip(0);
      setTotal(0);

      const res = await fetch(
        `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=0`
      );
      const data: ProductsResponse = await res.json();
      setProducts(data.products);
      setTotal(data.total);
      setSkip(PAGE_SIZE);
      return;
    }

    setIsSearching(true);
    setInitialLoading(true);

    const res = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`
    );
    const data: ProductsResponse = await res.json();
    setProducts(data.products);
    setTotal(data.total);
    setInitialLoading(false);
  }

  // Aplikasikan filter di client
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // harga
      if (filters.price === "lt100" && p.price >= 100) return false;
      if (filters.price === "100to500" && (p.price < 100 || p.price > 500))
        return false;
      if (filters.price === "gt500" && p.price <= 500) return false;

      // rating
      if (filters.rating !== "all" && p.rating < filters.rating) return false;

      // kategori
      if (filters.category !== "all" && p.category !== filters.category)
        return false;

      // lokasi (mock)
      if (filters.location !== "all") {
        const loc = getMockLocation(p);
        if (loc !== filters.location) return false;
      }

      return true;
    });
  }, [products, filters]);

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Daftar Produk
          </h1>
          <p className="text-sm text-slate-400">
            Grid produk dengan filter, search dan infinite scroll.
          </p>
        </div>
        <a
          href="/cart"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
        >
          Keranjang
        </a>
      </div>

      {/* Search bar */}
      <ProductSearchBar
        value={search}
        onChange={setSearch}
        onSubmit={handleSearch}
      />

      <section className="mt-4 grid gap-4 md:grid-cols-[260px,minmax(0,1fr)]">
        {/* Sidebar filter */}
        <div className="md:sticky md:top-4 md:self-start">
          <ProductFilters
            products={products}
            value={filters}
            onChange={setFilters}
          />
        </div>

        {/* Grid produk */}
        <div className="space-y-4">
          {initialLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-48 animate-pulse rounded-2xl bg-slate-900/80"
                />
              ))}
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              >
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>

              {/* Sentinel untuk infinite scroll */}
              {!isSearching && filteredProducts.length < total && (
                <div ref={sentinelRef} className="h-10 w-full">
                  {loadingMore && (
                    <p className="text-center text-xs text-slate-500">
                      Memuat produk lagi...
                    </p>
                  )}
                </div>
              )}

              {filteredProducts.length === 0 && (
                <p className="text-sm text-slate-400">
                  Tidak ada produk yang cocok dengan filter / pencarian.
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

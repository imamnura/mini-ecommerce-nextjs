"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product, ProductsResponse } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import {
  ProductFilters,
  type FiltersState,
} from "@/components/products/ProductFilters";
import { ProductSearchBar } from "@/components/products/ProductSearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { getMockLocation } from "@/lib/helpers";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

const PAGE_SIZE = PRODUCTS_PER_PAGE;

// Loader component
function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="aspect-square animate-pulse bg-linear-to-br from-gray-200 to-gray-300" />
      <div className="space-y-3 p-4">
        <div className="h-4 animate-pulse rounded-md bg-gray-200" />
        <div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-200" />
        <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  // const [skip, setSkip] = useState(0); // Removed unused state

  const skipRef = useRef(0); // Track skip with ref to avoid observer recreation
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isSearching, setIsSearching] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    price: "all",
    rating: "all",
    category: "all",
    location: "all",
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch produk (initial & search)
  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      setError(null);
      setIsSearching(!!debouncedSearch);

      try {
        const params = new URLSearchParams({
          limit: String(PAGE_SIZE),
          skip: "0",
        });

        if (debouncedSearch) {
          params.set("q", debouncedSearch);
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data: ProductsResponse = await res.json();
        setProducts(data.products);
        setTotal(data.total);
        // setSkip(PAGE_SIZE); // Removed unused state update
        skipRef.current = PAGE_SIZE; // Sync ref with state
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Terjadi kesalahan");
        } else {
          setError("Terjadi kesalahan");
        }
        setProducts([]);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [debouncedSearch]);

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
          !initialLoading &&
          !isSearching &&
          products.length < total
        ) {
          setLoadingMore(true);
          try {
            const res = await fetch(
              `/api/products?limit=${PAGE_SIZE}&skip=${skipRef.current}`
            );
            if (!res.ok) throw new Error("Failed to load products");
            const data: ProductsResponse = await res.json();
            setProducts((prev) => [...prev, ...data.products]);
            skipRef.current += PAGE_SIZE; // Update ref immediately
            // setSkip(skipRef.current); // Removed unused state
          } catch {
            // Silent fail for infinite scroll - user can retry by scrolling
          } finally {
            setLoadingMore(false);
          }
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadingMore, initialLoading, products.length, total, isSearching]); // Removed skip from deps

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
    <main className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Daftar Produk
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Temukan produk terbaik dengan filter dan pencarian
          </p>
        </div>
      </div>

      {/* Search bar */}
      <ProductSearchBar value={search} onChange={setSearch} />

      {/* Filters */}
      <ProductFilters
        products={products}
        value={filters}
        onChange={setFilters}
      />

      {/* Grid produk */}
      <div className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}

        {initialLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={filteredProducts.length}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
              >
                {filteredProducts.map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Sentinel untuk infinite scroll */}
            {!isSearching && products.length > 0 && products.length < total && (
              <div ref={sentinelRef} className="flex justify-center py-8">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                    <span>Memuat produk lagi...</span>
                  </div>
                )}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <Search className="mb-4 h-16 w-16 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Tidak ada produk ditemukan
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

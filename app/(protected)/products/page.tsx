"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/products/ProductCard";
import {
  type FiltersState,
  ProductFilters,
} from "@/components/products/ProductFilters";
import { ProductSearchBar } from "@/components/products/ProductSearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { getMockLocation } from "@/lib/helpers";
import type { Product, ProductsResponse } from "@/lib/types";
import { useLocalProductsStore } from "@/store/useLocalProductsStore";

const PAGE_SIZE = PRODUCTS_PER_PAGE;
const SKELETON_SLOTS = Array.from(
  { length: 12 },
  (_, i) => `skeleton-${i}`,
);

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
  const skipRef = useRef(0);
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

  const localProducts = useLocalProductsStore((s) => s.products);

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
        skipRef.current = PAGE_SIZE;
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

  async function handleLoadMore() {
    if (loadingMore || isSearching || products.length >= total) return;

    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/products?limit=${PAGE_SIZE}&skip=${skipRef.current}`,
      );
      if (!res.ok) throw new Error("Failed to load products");
      const data: ProductsResponse = await res.json();
      setProducts((prev) => [...prev, ...data.products]);
      skipRef.current += PAGE_SIZE;
    } catch {
      toast.error("Gagal memuat produk, coba lagi");
    } finally {
      setLoadingMore(false);
    }
  }

  // Aplikasikan filter di client. Produk lokal (hasil "Tambah Produk") tidak
  // dikenal oleh endpoint search DummyJSON, jadi hanya ditampilkan saat tidak searching.
  const filteredProducts = useMemo(() => {
    const combined = isSearching ? products : [...localProducts, ...products];

    return combined.filter((p) => {
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
  }, [products, filters, isSearching, localProducts]);

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
            {SKELETON_SLOTS.map((slot) => (
              <ProductSkeleton key={slot} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence>
                {filteredProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load more */}
            {!isSearching && products.length > 0 && products.length < total && (
              <div className="flex justify-center py-8">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-600 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingMore && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                  )}
                  <span>
                    {loadingMore
                      ? "Memuat produk lagi..."
                      : "Muat Lebih Banyak"}
                  </span>
                </button>
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

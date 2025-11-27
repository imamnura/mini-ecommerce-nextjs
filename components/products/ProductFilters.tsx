"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

export type PriceFilter = "all" | "lt100" | "100to500" | "gt500";
export type RatingFilter = "all" | 1 | 2 | 3 | 4 | 5;
export type LocationFilter =
  | "all"
  | "Jakarta"
  | "Bandung"
  | "Surabaya"
  | "Yogyakarta"
  | "Medan";

export interface FiltersState {
  price: PriceFilter;
  rating: RatingFilter;
  category: string | "all";
  location: LocationFilter;
}

interface Props {
  products: Product[];
  value: FiltersState;
  onChange: (filters: FiltersState) => void;
}

export function ProductFilters({ products, value, onChange }: Props) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch categories from API
    fetch("/api/products/categories")
      .then((res) => res.json())
      .then((data: string[] | { slug: string; name: string }[]) => {
        if (Array.isArray(data)) {
          const cats = data.map((cat) =>
            typeof cat === "string" ? cat : cat.slug || cat.name
          );
          setCategories(cats);
        }
      })
      .catch(() => {
        // Fallback to categories from products
        const cats = Array.from(new Set(products.map((p) => p.category)));
        setCategories(cats);
      });
  }, [products]);

  function handleChange<K extends keyof FiltersState>(
    key: K,
    val: FiltersState[K]
  ) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="sticky top-[61px] z-40 bg-white px-4 py-4 shadow-sm sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Filter Produk</h2>
          <button
            type="button"
            onClick={() =>
              onChange({
                price: "all",
                rating: "all",
                category: "all",
                location: "all",
              })
            }
            className="text-xs font-medium text-green-600 transition hover:text-green-700"
          >
            Reset
          </button>
        </div>

        {/* Filters - Horizontal on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Rating */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Rating</label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              value={value.rating}
              onChange={(e) =>
                handleChange(
                  "rating",
                  e.target.value === "all"
                    ? "all"
                    : (Number(e.target.value) as RatingFilter)
                )
              }
            >
              <option value="all">Semua Rating</option>
              <option value={4}>⭐ 4+</option>
              <option value={3}>⭐ 3+</option>
              <option value={2}>⭐ 2+</option>
              <option value={1}>⭐ 1+</option>
            </select>
          </div>

          {/* Kategori */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">
              Kategori
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              value={value.category}
              onChange={(e) =>
                handleChange(
                  "category",
                  e.target.value as FiltersState["category"]
                )
              }
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Lokasi */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Lokasi</label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              value={value.location}
              onChange={(e) =>
                handleChange(
                  "location",
                  e.target.value as FiltersState["location"]
                )
              }
            >
              <option value="all">Semua Lokasi</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Bandung">Bandung</option>
              <option value="Surabaya">Surabaya</option>
              <option value="Yogyakarta">Yogyakarta</option>
              <option value="Medan">Medan</option>
            </select>
          </div>

          {/* Harga */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Harga</label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              value={value.price}
              onChange={(e) =>
                handleChange("price", e.target.value as FiltersState["price"])
              }
            >
              <option value="all">Semua Harga</option>
              <option value="lt100">{"< $100"}</option>
              <option value="100to500">$100 - $500</option>
              <option value="gt500">{"> $500"}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

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
  const categories = Array.from(new Set(products.map((p) => p.category)));

  function handleChange<K extends keyof FiltersState>(
    key: K,
    val: FiltersState[K]
  ) {
    onChange({ ...value, [key]: val });
  }

  return (
    <aside className="space-y-6 rounded-2xl bg-slate-900/90 p-4 shadow-md shadow-slate-900/80 ring-1 ring-slate-800">
      <h2 className="text-sm font-semibold tracking-wide text-slate-200">
        Filter
      </h2>

      {/* Harga */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Harga
        </h3>
        <div className="space-y-1 text-xs">
          {[
            ["all", "Semua"],
            ["lt100", "< 100"],
            ["100to500", "100 - 500"],
            ["gt500", "> 500"],
          ].map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                className="h-3 w-3"
                checked={value.price === key}
                onChange={() =>
                  handleChange("price", key as FiltersState["price"])
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Rating
        </h3>
        <select
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
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
          <option value="all">Semua</option>
          <option value={4}>≥ 4</option>
          <option value={3}>≥ 3</option>
          <option value={2}>≥ 2</option>
          <option value={1}>≥ 1</option>
        </select>
      </div>

      {/* Kategori */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Kategori
        </h3>
        <select
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
          value={value.category}
          onChange={(e) =>
            handleChange("category", e.target.value as FiltersState["category"])
          }
        >
          <option value="all">Semua</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Lokasi (mock dari helper) */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Lokasi
        </h3>
        <select
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
          value={value.location}
          onChange={(e) =>
            handleChange("location", e.target.value as FiltersState["location"])
          }
        >
          <option value="all">Semua</option>
          <option value="Jakarta">Jakarta</option>
          <option value="Bandung">Bandung</option>
          <option value="Surabaya">Surabaya</option>
          <option value="Yogyakarta">Yogyakarta</option>
          <option value="Medan">Medan</option>
        </select>
      </div>

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
        className="w-full rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
      >
        Reset filter
      </button>
    </aside>
  );
}

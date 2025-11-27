"use client";

import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative flex gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-200 transition focus-within:ring-2 focus-within:ring-green-500">
      <Search className="h-5 w-5 text-gray-400" />
      <input
        placeholder="Cari produk (misal: phone)..."
        className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
        >
          <X className="h-3.5 w-3.5" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}

"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function ProductSearchBar({ value, onChange, onSubmit }: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form
      className="flex gap-3 rounded-2xl bg-slate-900 px-4 py-3 shadow-md shadow-slate-900/60"
      onSubmit={handleSubmit}
    >
      <input
        placeholder="Cari produk (misal: phone)..."
        className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="submit"
        className="rounded-xl bg-indigo-500 px-4 py-1.5 text-xs font-semibold tracking-wide text-white transition hover:bg-indigo-400"
      >
        Search
      </button>
    </form>
  );
}

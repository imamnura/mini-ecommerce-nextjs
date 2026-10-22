# Komponen UI & Hooks

Kembali ke [indeks dokumentasi](DOCUMENTATION.md).

Styling memakai Tailwind CSS 4 (utility class langsung di JSX), ikon dari `lucide-react`, animasi dari `framer-motion`, dan toast dari `sonner`. Tidak ada design system/komponen library lain.

## Komponen

| Komponen | Lokasi | Dipakai di | Ringkasan |
|---|---|---|---|
| `LoginForm` | `components/auth/LoginForm.tsx` | `/login` | Form login (pre-filled demo `emilys`/`emilyspass`). Membaca query `from` untuk tujuan redirect. Sukses → `setUser`, `router.push`, `router.refresh` |
| `AuthProvider` | `components/layout/AuthProvider.tsx` | `app/layout.tsx` | Wrapper tipis yang memanggil `useAuthLoader()` lalu render children |
| `Navbar` | `components/layout/Navbar.tsx` | `app/layout.tsx` | Navbar sticky: logo, link "Tambah Produk", link cart + badge jumlah, username, tombol logout |
| `ProductCard` | `components/products/ProductCard.tsx` | `/products` | Gambar (`next/image`), badge kategori, judul (link ke detail), harga, rating, brand, lokasi mock, tombol tambah/di-keranjang (toggle via `isInCart`) |
| `ProductFilters` | `components/products/ProductFilters.tsx` | `/products` | 4 dropdown: rating, kategori, lokasi, harga |
| `ProductSearchBar` | `components/products/ProductSearchBar.tsx` | `/products` | Input search terkontrol dengan tombol clear |
| `FileUpload` | `components/FileUpload.tsx` | `/products/new` | Upload gambar dengan preview dan progress bar |

### `ProductFilters`

```ts
type PriceFilter = "all" | "lt100" | "100to500" | "gt500";
type RatingFilter = "all" | 1 | 2 | 3 | 4 | 5;
type LocationFilter = "all" | Location; // Location dari lib/constants
interface FiltersState { price; rating; category: string | "all"; location }

props: { products: Product[]; value: FiltersState; onChange: (f: FiltersState) => void }
```

- Kategori diambil dari `/api/products/categories`, dengan fallback diturunkan dari prop `products`.
- Pilihan lokasi dibuat dari `LOCATIONS`, jadi menambah kota cukup di `lib/constants.ts`.

### `FileUpload`

```ts
props: {
  type?: "avatar" | "product";        // default "product"
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  currentImage?: string;
  label?: string;                     // default "Upload Image"
  acceptedTypes?: string;             // default jpeg/jpg/png/webp/gif
}
```

## Custom Hooks

| Hook | Signature | Fungsi |
|---|---|---|
| `useAuthLoader` | `(): void` | Saat mount: `setLoading(true)` → `GET /api/me` (`no-store`) → `setUser(...)` → `setLoading(false)`. Dipakai `AuthProvider` |
| `useDebounce` | `<T>(value: T, delay = 500): T` | Debounce generik via `setTimeout`, dipakai search box |
| `useFileUpload` | `(options?) => {...}` | State upload: preview (`FileReader`), simulasi progress, `POST /api/upload`. Dipakai `FileUpload` |

### `useFileUpload`

```ts
options: { type?: "avatar" | "product"; onSuccess?; onError? }
returns: {
  uploading, progress, preview, fileInputRef,
  uploadFile, handleFileInputChange, handleFileSelect, triggerFileInput, reset
}
```

`UploadResult` diimpor sebagai `import type` dari `lib/upload.ts`, jadi kode `node:fs` tidak ikut ke bundle client.

## Konvensi

- Komponen interaktif diberi `"use client"`; halaman di `(protected)` semuanya client component.
- Semua gambar produk memakai `next/image` (host diizinkan di `next.config.ts`).
- Komponen yang membaca cart menunggu `_hasHydrated` sebelum render state cart (lihat [TECH_IMPLEMENTATION.MD](TECH_IMPLEMENTATION.MD)).
- Teks UI dalam Bahasa Indonesia; pesan toast terpusat di `TOAST_MESSAGES`.

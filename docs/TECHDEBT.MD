# Tech Debt & Known Issues

Kembali ke [indeks dokumentasi](DOCUMENTATION.md).

## Masih Berlaku

| # | Isu | Detail | Prioritas |
|---|---|---|---|
| 1 | **Checkout belum diimplementasi** | Tombol "Checkout Sekarang" di `/cart` tidak punya `onClick`/alur lanjutan | Tinggi (fitur) |
| 2 | **Tidak ada test & CI** | Tidak ada test runner, file test, atau workflow CI. Verifikasi hanya lewat lint dan build (lihat [TESTING.MD](TESTING.MD)) | Tinggi |
| 3 | **"Tambah Produk" tidak persist ke backend** | Produk baru hanya di localStorage (per browser/device), karena `POST /products/add` DummyJSON adalah mock | Sedang |
| 4 | **Endpoint cart proxy tidak dipakai** | `/api/cart/add` dan `/api/cart/user` ada, tapi cart sepenuhnya client-side | Rendah |
| 5 | **Filter hanya untuk data yang sudah dimuat** | Filter diterapkan client-side; produk di halaman berikutnya belum ikut terfilter sampai dimuat | Rendah |
| 6 | **Progress upload simulasi** | Progress bar di `useFileUpload` bukan progress nyata | Rendah |
| 7 | **Temuan keamanan** | Token di `/api/me`, cookie tanpa `secure`, parameter `from` tidak divalidasi, validasi upload hanya MIME dari client. Detail di [RISK_ANALYSIS.MD](RISK_ANALYSIS.MD) | Tinggi |

## Sudah Diperbaiki

**Upgrade dependency & refactor-clean (Oktober 2026)**

- Upgrade ke Next 16.4, React 19, TypeScript 7, framer-motion 14, lucide-react 1.x, Biome 2.6; schema `biome.json` dimigrasi.
- Hapus kode mati: `uploadMultipleFiles` dan `validateImageDimensions` (`lib/upload.ts`, juga salah tempat karena memakai browser API di file server), `console.log` debug di upload, key `TOAST_MESSAGES` yang tidak dipakai, type `DummyJsonCart`/`DummyJsonCartProduct`.
- Daftar kota di `ProductFilters` sekarang memakai `LOCATIONS`/`Location`, bukan hardcode.
- `useFileUpload` memakai `import type { UploadResult }` dari `lib/upload`, tidak lagi menduplikasi interface.
- Error accessibility baseline Biome (button tanpa `type`, array index sebagai `key`) sudah tidak muncul; `pnpm lint` bersih.

**Enhancement "fixing tech debt" sebelumnya**

- Route upload dipindah ke `app/api/upload/route.ts` (sebelumnya di luar `app/` sehingga tidak reachable).
- Type produk/cart dikonsolidasikan ke `lib/types.ts`.
- Konstanta tak terpakai (`PRICE_RANGES`, `INFINITE_SCROLL_THRESHOLD`, `MIN_RATING`, `MAX_RATING`) dihapus; `API_BASE_URL` dipakai di semua proxy route.
- Halaman detail produk lewat `/api/products/[slug]`, bukan langsung ke DummyJSON.
- README disinkronkan dengan struktur aktual.
- `proxy.ts` terverifikasi berjalan sebagai middleware Next 16.

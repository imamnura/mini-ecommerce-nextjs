# Impact Analysis — Upgrade Dependency & Refactor-Clean

Dampak perubahan terbaru (Oktober 2026) terhadap kode, perilaku, dan pengguna. Kembali ke [indeks dokumentasi](DOCUMENTATION.md).

## 1. Upgrade Dependency

| Package | Dari | Ke | Jenis | Area terdampak |
|---|---|---|---|---|
| react / react-dom | 18.3.1 | 19.3.1 | **Major** | Semua komponen client |
| @types/react / @types/react-dom | 18.x | 19.3.0 | **Major** | Type-check |
| typescript | 5.9.3 | 7.0.2 | **Major** | Type-check saat `next build` |
| framer-motion | 12.42.2 | 14.5.0 | **Major** | Animasi (`LoginForm`, `ProductCard`, halaman produk, detail, tambah produk, cart) |
| lucide-react | 0.555.0 | 1.61.0 | **Major** | Semua ikon |
| @types/node | 20.19.43 | 24.19.2 | **Major** | Type-check server code (disesuaikan ke Node 24) |
| next | 16.2.10 | 16.4.2 | Minor | Routing, build, middleware |
| @biomejs/biome | 2.5.3 | 2.6.2 | Minor | Lint/format; schema `biome.json` dimigrasi |
| postcss, sonner, zustand, tailwindcss, @tailwindcss/postcss | – | patch | Patch | – |

**Hasil verifikasi:** `pnpm build` (compile + TypeScript + prerender 16 halaman) dan `pnpm lint` lolos tanpa perubahan kode aplikasi. Belum ada verifikasi visual/runtime di browser.

## 2. Refactor-Clean

| File | Perubahan | Dampak perilaku |
|---|---|---|
| `lib/upload.ts` | Hapus `console.log` sukses upload, `uploadMultipleFiles`, `validateImageDimensions` | Tidak ada (tidak ada pemanggil). Log sukses upload tidak lagi muncul di server; log error tetap |
| `lib/constants.ts` | Hapus `TOAST_MESSAGES.removeFromCart/loginSuccess/loginError/cartError` | Tidak ada (tidak direferensikan) |
| `lib/types.ts` | Hapus `DummyJsonCart`, `DummyJsonCartProduct` | Tidak ada (tidak diimpor) |
| `components/products/ProductFilters.tsx` | `LocationFilter` dari `Location`, opsi dropdown di-generate dari `LOCATIONS` | Tampilan sama (5 kota, urutan sama). Menambah kota sekarang cukup di satu tempat |
| `hooks/useFileUpload.ts` | `import type { UploadResult }` dari `lib/upload` | Tidak ada; type sedikit lebih lebar (field `path` opsional) |

## 3. Dampak ke Pengguna

- **Fungsional:** tidak ada perubahan fitur yang disengaja.
- **Data:** key localStorage (`cart-storage`, `local-products-storage`) dan shape-nya tidak berubah, jadi cart dan produk lokal pengguna yang ada tetap terbaca.
- **Sesi:** mekanisme cookie tidak berubah; pengguna yang sedang login tidak ter-logout.

## 4. Area yang Perlu Diuji Ulang

1. Animasi framer-motion (perubahan major dua versi).
2. Semua ikon lucide-react tampil (versi 1.x mengganti nama/menghapus sebagian ikon; build lolos berarti semua import yang dipakai masih ada).
3. Hydration cart di React 19 (tidak ada error hydration di console).
4. Dropdown filter lokasi dan hasil filternya.

Skenario lengkap: [TESTING.MD](TESTING.MD). Risiko terkait: [RISK_ANALYSIS.MD](RISK_ANALYSIS.MD).

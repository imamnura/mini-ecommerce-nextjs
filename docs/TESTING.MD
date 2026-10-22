# Testing

Kembali ke [indeks dokumentasi](DOCUMENTATION.md).

## Kondisi Saat Ini

- **Tidak ada test otomatis.** Tidak ada test runner (Vitest/Jest/Playwright), file `*.test.*`, maupun CI.
- Quality gate yang tersedia hanya statis:

| Perintah | Yang dicek |
|---|---|
| `pnpm lint` | Biome lint (preset `recommended`, termasuk aturan a11y) |
| `pnpm format` | Biome formatter |
| `pnpm build` | Kompilasi Turbopack + type-check TypeScript (strict) + prerender halaman statis |
| `pnpm audit` | Kerentanan dependency |

## Skenario Uji Manual

Jalankan `pnpm dev`, login dengan `emilys` / `emilyspass`.

### Autentikasi & Permission

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| A1 | Buka `/products` tanpa login | Redirect ke `/login?from=/products` |
| A2 | Login dengan kredensial demo | Redirect ke `from` (atau `/products`), username tampil di Navbar |
| A3 | Login dengan password salah | Pesan error, tetap di `/login` |
| A4 | Saat login, buka `/login` | Redirect ke `/products` |
| A5 | Klik Logout | Toast "Logout berhasil", redirect `/login`, akses `/cart` kembali diblokir |
| A6 | `POST /api/upload` tanpa cookie | 401 `Unauthorized` |

### Produk

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| P1 | Buka `/products` | 12 produk pertama tampil dengan gambar |
| P2 | Ketik di search | Hasil berubah setelah ±500ms |
| P3 | Klik "Muat Lebih Banyak" | Produk berikutnya ditambahkan di bawah |
| P4 | Ubah filter lokasi/harga/rating/kategori | Daftar terfilter; dropdown lokasi berisi 5 kota dari `LOCATIONS` |
| P5 | Buka detail produk | Data produk tampil; slug tidak valid → teks "Produk tidak ditemukan" |

### Tambah Produk & Upload

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| U1 | Upload gambar PNG/JPG < 10MB | Preview + progress, URL `/uploads/products/...` |
| U2 | Upload file non-gambar atau > 10MB | Pesan error |
| U3 | Submit form | Toast sukses, redirect ke detail produk baru, produk muncul di atas listing |
| U4 | Reload halaman | Produk baru masih ada (localStorage) |

### Keranjang

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| C1 | Tambah produk ke keranjang | Toast, badge Navbar bertambah, tombol berubah ke status "di keranjang" |
| C2 | Ubah jumlah di `/cart` | Total harga/jumlah terupdate; jumlah 0 menghapus item |
| C3 | Reload `/cart` | Isi keranjang tetap, tanpa flicker/hydration error di console |

### Regresi Upgrade Dependency

Setelah upgrade React 19 / framer-motion 14 / lucide-react 1.x, cek juga: animasi framer-motion (login, listing, detail, tambah produk, cart) berjalan, semua ikon tampil, dan tidak ada warning baru di console browser.

## Rekomendasi

1. Tambah **Vitest + React Testing Library** untuk unit test store (`useCartStore`: add/update/remove/total), `lib/upload.ts` (validasi), dan `getMockLocation`.
2. Tambah **Playwright** untuk alur end-to-end A1–A5, U1–U3, C1–C3.
3. Jalankan `pnpm lint`, `pnpm build`, dan test di CI untuk setiap MR.

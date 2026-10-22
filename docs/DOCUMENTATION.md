# Dokumentasi Proyek — Mini Ecommerce (Next.js)

Dokumentasi ini menjelaskan struktur, arsitektur, dan perilaku aktual aplikasi berdasarkan kode yang ada (bukan deskripsi aspirasional). Untuk quick-start instalasi, lihat [README.md](../README.md).

## Ringkasan

Mini e-commerce dengan Next.js App Router. Data produk berasal dari [DummyJSON](https://dummyjson.com/) (backend eksternal, bukan database sendiri). Fitur utama: login, listing produk dengan search/filter/pagination "Muat Lebih Banyak", detail produk, tambah produk baru dengan upload gambar, dan keranjang belanja yang disimpan di localStorage lewat Zustand. **Belum ada proses checkout** (tombol "Checkout Sekarang" belum punya handler).

DummyJSON tidak benar-benar menyimpan mutasi, sehingga cart dan produk baru disimpan client-side (Zustand + localStorage). Yang benar-benar tersimpan di server hanya gambar hasil upload (`public/uploads/`).

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16.4 (App Router, Turbopack) |
| Bahasa | TypeScript 7 (strict mode) |
| UI | React 19.3 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/postcss`, tanpa `tailwind.config.js`) |
| Ikon | lucide-react 1.x |
| Animasi | Framer Motion 14 |
| Notifikasi | Sonner (toast) |
| State global | Zustand 5 (`persist` untuk cart dan produk lokal) |
| Backend data | DummyJSON, semua akses lewat proxy API route internal (`app/api/**`) |
| Lint/format | Biome 2.6 |
| Package manager | pnpm |

Belum ada test runner, CI, maupun `.env.example`.

## Daftar Dokumen

| Dokumen | Isi |
|---|---|
| [ARCHITECTURE.MD](ARCHITECTURE.MD) | Gambaran arsitektur, struktur folder, routing, state management (Zustand), `lib/`, konfigurasi project |
| [API.MD](API.MD) | Semua API route: method, auth, request/response |
| [FLOW.MD](FLOW.MD) | Alur autentikasi, logout, listing, detail, tambah produk, keranjang |
| [PERMISSION.MD](PERMISSION.MD) | Matriks akses halaman & API, middleware `proxy.ts`, guard client, cookie sesi |
| [UI_COMPONENT.MD](UI_COMPONENT.MD) | Komponen, props, custom hooks, konvensi UI |
| [TECH_IMPLEMENTATION.MD](TECH_IMPLEMENTATION.MD) | Detail teknis: proxy, sesi cookie, persistensi client, hydration, upload, versi dependency |
| [TESTING.MD](TESTING.MD) | Quality gate saat ini, skenario uji manual, rekomendasi test otomatis |
| [DEPLOYMENT_PLAN.MD](DEPLOYMENT_PLAN.MD) | Prasyarat, env var, build, pertimbangan platform, checklist rilis, rollback |
| [IMPACT_ANALYSIS.MD](IMPACT_ANALYSIS.MD) | Dampak upgrade dependency & refactor-clean terbaru |
| [RISK_ANALYSIS.MD](RISK_ANALYSIS.MD) | Risiko keamanan, teknis, operasional, dan prioritas mitigasi |
| [TECHDEBT.MD](TECHDEBT.MD) | Known issues yang masih berlaku dan riwayat yang sudah diperbaiki |
| [SECURITY.md](SECURITY.md) | Catatan audit keamanan & refactoring sebelumnya (Next 16.0.x) |

## Menjalankan Proyek

```bash
pnpm install
# opsional, default sudah fallback ke dummyjson.com:
# echo "NEXT_PUBLIC_API_URL=https://dummyjson.com" > .env.local
pnpm dev                  # http://localhost:3000
pnpm build && pnpm start  # production
```

Login demo (kredensial DummyJSON): `emilys` / `emilyspass`, atau lihat [dummyjson.com/users](https://dummyjson.com/users).

Script lain: `pnpm lint`, `pnpm lint:fix`, `pnpm format`.

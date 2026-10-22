# Deployment Plan

Kembali ke [indeks dokumentasi](DOCUMENTATION.md).

## Prasyarat

| Item | Nilai |
|---|---|
| Node.js | 24.x (sesuai `@types/node` ^24; Next 16 butuh Node ≥ 20.9) |
| Package manager | pnpm (lockfile `pnpm-lock.yaml`) |
| Native build | `sharp`, `unrs-resolver` (diizinkan di `pnpm-workspace.yaml`) |
| Akses keluar | `https://dummyjson.com` (API) dan `https://cdn.dummyjson.com` (gambar) |

## Environment Variable

| Variabel | Wajib | Default | Keterangan |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Tidak | `https://dummyjson.com` | Base URL backend untuk semua proxy route |

Belum ada `.env.example`; file `.env` dan `.env*.local` di-.gitignore.

## Build & Run

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm start        # default port 3000
```

## Pertimbangan Platform

**Upload gambar butuh filesystem persisten.** `/api/upload` menulis file ke `public/uploads/` saat runtime. Ini punya dua konsekuensi:

- Di platform serverless/read-only (mis. Vercel), penulisan gagal atau file hilang setelah instance berganti.
- Next.js production tidak selalu menyajikan file yang ditambahkan ke `public/` setelah build.

Pilihan deployment:

| Opsi | Cocok untuk | Catatan |
|---|---|---|
| **Node server / VM / container dengan volume** (direkomendasikan saat ini) | Demo/staging | Mount volume persisten ke `public/uploads`; pastikan file baru tersaji (atau sajikan lewat reverse proxy) |
| **Vercel / serverless** | Jika upload dipindah | Ganti `lib/upload.ts` ke object storage (S3, R2, Vercel Blob) sebelum deploy |

## Checklist Rilis

- [ ] `pnpm install --frozen-lockfile` berhasil
- [ ] `pnpm lint` bersih
- [ ] `pnpm build` berhasil (termasuk type-check)
- [ ] `pnpm audit` tanpa kerentanan high/critical
- [ ] Uji manual skenario di [TESTING.MD](TESTING.MD), terutama regresi upgrade dependency
- [ ] Direktori upload writable dan persisten di environment target
- [ ] Deploy di belakang HTTPS (cookie sesi belum memakai flag `secure`)
- [ ] `NEXT_PUBLIC_API_URL` diset jika tidak memakai DummyJSON default

## Rollback

Aplikasi tidak punya database atau migrasi, jadi rollback cukup dengan men-deploy ulang build/commit sebelumnya. Data cart dan produk lokal ada di localStorage pengguna dan tidak terpengaruh. File di `public/uploads` tetap ada selama volume tidak dihapus.

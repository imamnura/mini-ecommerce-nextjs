# Risk Analysis

Kembali ke [indeks dokumentasi](DOCUMENTATION.md).

Skala: **Kemungkinan** dan **Dampak** = Rendah / Sedang / Tinggi.

## Risiko Keamanan

| # | Risiko | Lokasi | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|---|---|
| S1 | **Token sesi terekspos ke JavaScript.** `/api/me` mengembalikan `token` di body JSON, sehingga perlindungan httpOnly tidak efektif jika ada XSS | `app/api/me/route.ts` | Sedang | Tinggi | Hapus `token` dari response; client cukup butuh `id` dan `username` |
| S2 | **Open redirect setelah login.** Query `from` dipakai langsung di `router.push`, sehingga `/login?from=https://situs-lain` bisa mengarahkan user keluar | `components/auth/LoginForm.tsx` | Sedang | Sedang | Hanya terima path relatif yang diawali `/` dan bukan `//` |
| S3 | **Validasi upload lemah.** MIME type berasal dari client dan ekstensi diambil dari nama file asli, sehingga file non-gambar (mis. `.html`/`.svg` berisi script) bisa tersimpan di `public/` dan disajikan dari origin yang sama | `lib/upload.ts` | Sedang | Tinggi | Cek magic bytes, tentukan ekstensi dari tipe yang tervalidasi, tolak SVG, simpan di luar `public/` atau di object storage |
| S4 | **Cookie tanpa flag `secure`** | `app/api/login/route.ts` | Rendah (jika di balik HTTPS) | Sedang | Set `secure: process.env.NODE_ENV === "production"` |
| S5 | **Middleware hanya cek keberadaan cookie**, bukan validitas token | `proxy.ts` | Rendah | Rendah | Data sensitif tidak ada di halaman; validasi tetap dilakukan saat memanggil API yang butuh auth |
| S6 | **Upload tanpa rate limit/kuota** dapat memenuhi disk | `app/api/upload/route.ts` | Rendah | Sedang | Rate limit per user, batasi total ukuran folder |

## Risiko Teknis & Upgrade

| # | Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|---|
| T1 | Regresi runtime dari major upgrade (React 19, framer-motion 14, lucide-react 1.x) yang tidak tertangkap build | Sedang | Sedang | Uji manual skenario regresi di [TESTING.MD](TESTING.MD) sebelum rilis |
| T2 | TypeScript 7 masih generasi baru; kompatibilitas tooling pihak ketiga (editor plugin, dsb.) bisa berbeda | Rendah | Rendah | Jika bermasalah, pin kembali ke `typescript@^5.9` |
| T3 | Tidak ada test otomatis, sehingga regresi baru ketahuan di produksi | Tinggi | Sedang | Tambah Vitest + Playwright dan CI (lihat [TESTING.MD](TESTING.MD)) |
| T4 | Ketergantungan penuh pada DummyJSON (API publik pihak ketiga, tanpa SLA) | Sedang | Tinggi | Tampilkan state error yang jelas; siapkan backend sendiri untuk produksi |

## Risiko Operasional & Produk

| # | Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|---|
| O1 | Upload gagal atau hilang di platform serverless/read-only | Tinggi (jika deploy ke Vercel) | Tinggi | Deploy ke server dengan volume persisten atau pindah ke object storage (lihat [DEPLOYMENT_PLAN.MD](DEPLOYMENT_PLAN.MD)) |
| O2 | Produk baru dan cart hanya di localStorage, sehingga hilang saat ganti device/clear browser | Tinggi | Sedang | Dokumentasikan sebagai batasan demo; butuh backend untuk produksi |
| O3 | Checkout belum ada, sehingga alur belanja tidak bisa diselesaikan | Pasti | Tinggi (untuk produksi) | Masuk backlog fitur (lihat [TECHDEBT.MD](TECHDEBT.MD)) |

## Prioritas Penanganan

1. **S1, S2, S3**: perbaikan kecil dengan dampak keamanan besar; kerjakan sebelum deploy publik.
2. **O1**: tentukan target deployment sebelum rilis.
3. **T1, T3**: uji regresi manual sekarang, test otomatis menyusul.

# Permission & Proteksi Akses

Siapa boleh mengakses apa, dan di lapisan mana aturan itu ditegakkan. Kembali ke [indeks dokumentasi](DOCUMENTATION.md).

Aplikasi hanya mengenal dua kondisi: **tamu** (tanpa cookie sesi) dan **user login** (punya cookie `token`). Tidak ada role (admin/seller/buyer); semua user login punya hak yang sama.

## Matriks Akses Halaman

| Route | Tamu | User login |
|---|---|---|
| `/` | Redirect ke `/products` → lalu ke `/login` | Redirect ke `/products` |
| `/login` | ✅ | Redirect ke `/products` |
| `/products`, `/products/[slug]`, `/products/new` | Redirect ke `/login?from=<path>` | ✅ |
| `/cart` | Redirect ke `/login?from=<path>` | ✅ |

## Matriks Akses API

| Route | Tamu | User login | Dicek oleh |
|---|---|---|---|
| `POST /api/login` | ✅ | ✅ | – |
| `POST /api/logout` | ✅ | ✅ | – |
| `GET /api/me` | ✅ (`authenticated: false`) | ✅ | Route handler |
| `GET /api/products*` | ✅ | ✅ | – (publik) |
| `POST /api/upload` | ❌ 401 | ✅ | Cookie `userId` di route handler |
| `POST /api/cart/add`, `GET /api/cart/user` | ❌ 401 | ✅ | Cookie `userId` di route handler |

## Lapisan Proteksi

### 1. Middleware (`proxy.ts`)

- Path yang diawali `/products` atau `/cart` tanpa cookie `token` → redirect ke `/login?from=<path>`.
- `/login` dengan cookie `token` → redirect ke `/products`.
- `matcher` mengecualikan `/api`, `/_next/static`, `/_next/image`, `/favicon.ico`.
- Hanya mengecek **keberadaan** cookie, bukan validitas/expiry token.
- Next 16 mendeteksi file ini sebagai middleware (output build: `ƒ Proxy (Middleware)`).

### 2. Guard client (`app/(protected)/layout.tsx`)

Membaca `user`/`isLoading` dari `useUserStore`. Selama loading menampilkan spinner; jika selesai loading tanpa user → `router.replace("/login")`. Ini lapisan kedua di atas middleware.

### 3. Route handler API

Karena middleware tidak berjalan untuk `/api/*`, route yang butuh login mengecek cookie `userId` sendiri. Route produk sengaja publik.

## Cookie Sesi

| Cookie | httpOnly | sameSite | secure | maxAge |
|---|---|---|---|---|
| `token` | ✅ | lax | ❌ (tidak di-set) | 3600 detik |
| `userId` | ✅ | lax | ❌ | 3600 detik |
| `username` | ✅ | lax | ❌ | 3600 detik |

Catatan keamanan terkait (token bocor via `/api/me`, flag `secure`, validasi parameter `from`) ada di [RISK_ANALYSIS.MD](RISK_ANALYSIS.MD).

# API Routes

Semua route di `app/api/**`. Kembali ke [indeks dokumentasi](DOCUMENTATION.md).

Hampir semua route adalah proxy tipis ke DummyJSON. Base URL diambil dari `API_BASE_URL` (`lib/constants.ts`), yaitu `process.env.NEXT_PUBLIC_API_URL` atau fallback `https://dummyjson.com`. Middleware `proxy.ts` **tidak** berjalan untuk `/api/*`, jadi pengecekan auth dilakukan di masing-masing route (lihat [PERMISSION.MD](PERMISSION.MD)).

## Ringkasan

| Route | Method | Auth | Dipakai UI? |
|---|---|---|---|
| `/api/login` | POST | – | Ya (`LoginForm`) |
| `/api/logout` | POST | – | Ya (`Navbar`) |
| `/api/me` | GET | cookie (opsional) | Ya (`useAuthLoader`) |
| `/api/products` | GET | – | Ya (`/products`) |
| `/api/products/[slug]` | GET | – | Ya (`/products/[slug]`) |
| `/api/products/categories` | GET | – | Ya (`ProductFilters`) |
| `/api/upload` | POST | cookie `userId` | Ya (`FileUpload` di `/products/new`) |
| `/api/cart/add` | POST | cookie `userId` | **Tidak** |
| `/api/cart/user` | GET | cookie `userId` | **Tidak** |

## Detail

### `POST /api/login`

- Body: `{ "username": string, "password": string }`
- 400 `{ message: "username and password are required" }` jika salah satu kosong.
- Proxy ke `POST {API_BASE_URL}/auth/login` dengan `expiresInMins: 60`.
- Sukses (200): set cookie `token`, `userId`, `username` (httpOnly, `sameSite=lax`, `path=/`, `maxAge` 3600 detik). Response `{ user: { id, username } }`.
- Gagal: 401 `{ message: "Invalid username or password" }`.

### `POST /api/logout`

Menghapus ketiga cookie (`maxAge: 0`). Response `{ success: true }`.

### `GET /api/me`

- Tanpa cookie `token`/`userId`: `{ authenticated: false, user: null }`.
- Dengan cookie: `{ authenticated: true, user: { id, username, token } }`.
- ⚠️ Raw token ikut dikembalikan di body JSON, sehingga terbaca JavaScript client meski cookie-nya httpOnly. Lihat [RISK_ANALYSIS.MD](RISK_ANALYSIS.MD).

### `GET /api/products`

- Query: `limit` (default `12`), `skip` (default `0`), `q` (opsional).
- Ada `q`: proxy ke `/products/search?q=...`; tanpa `q`: proxy ke `/products`.
- Response: `ProductsResponse` (`{ products, total, skip, limit }`).

### `GET /api/products/[slug]`

Proxy ke `GET /products/{slug}`. Status 404 diteruskan jika produk tidak ditemukan.

### `GET /api/products/categories`

Proxy ke `GET /products/categories`.

### `POST /api/upload`

- Auth: cookie `userId` wajib, kalau tidak 401 `{ error: "Unauthorized" }`.
- Body `multipart/form-data`: `file` (File), `type` (`"product"` atau `"avatar"`).
- Validasi (di `lib/upload.ts`): MIME type `image/jpeg|jpg|png|webp|gif`; ukuran maks 10MB (`product`) atau 2MB (`avatar`).
- File ditulis ke `public/uploads/products/` atau `public/uploads/avatars/` dengan nama `<nama_disanitasi>_<timestamp>_<random><ext>`.
- Sukses: `{ success: true, url: "/uploads/products/..." }`. Gagal validasi: 400 `{ error }`. Error lain: 500.

### `POST /api/cart/add` *(tidak dipakai UI)*

Body `{ productId, quantity }` → proxy ke `POST /carts/add` dengan `userId` dari cookie. Cart di UI sepenuhnya dikelola Zustand.

### `GET /api/cart/user` *(tidak dipakai UI)*

Proxy ke `GET /carts/user/{userId}`.

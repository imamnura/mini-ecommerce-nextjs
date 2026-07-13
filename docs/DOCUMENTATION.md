# Dokumentasi Proyek — Mini Ecommerce (Next.js)

Dokumentasi ini menjelaskan struktur, arsitektur, dan perilaku aktual aplikasi berdasarkan kode yang ada (bukan deskripsi aspirasional). Untuk quick-start instalasi, lihat [README.md](README.md).

## Daftar Isi

1. [Ringkasan](#1-ringkasan)
2. [Tech Stack](#2-tech-stack)
3. [Struktur Folder (Aktual)](#3-struktur-folder-aktual)
4. [Routing & Middleware](#4-routing--middleware)
5. [API Routes](#5-api-routes)
6. [State Management (Zustand)](#6-state-management-zustand)
7. [Komponen](#7-komponen)
8. [Custom Hooks](#8-custom-hooks)
9. [lib/ — Types, Constants, Helpers](#9-lib--types-constants-helpers)
10. [Alur Autentikasi](#10-alur-autentikasi)
11. [Alur Keranjang Belanja](#11-alur-keranjang-belanja)
12. [Konfigurasi Project](#12-konfigurasi-project)
13. [Menjalankan Proyek](#13-menjalankan-proyek)
14. [Known Issues & Tech Debt](#14-known-issues--tech-debt)

---

## 1. Ringkasan

Mini e-commerce SPA-like app dengan Next.js App Router. Data produk berasal dari [DummyJSON](https://dummyjson.com/) (backend eksternal, bukan database sendiri). Fitur utama: login, listing produk dengan search/filter/infinite-scroll, detail produk, tambah produk baru dengan upload gambar, dan keranjang belanja yang disimpan di localStorage lewat Zustand — **tidak ada proses checkout sungguhan** (tombol "Checkout Sekarang" belum punya handler).

Karena DummyJSON tidak benar-benar mem-persist data (mis. `POST /products/add` selalu berhasil tapi tidak menyimpan apa pun di server mereka), fitur "Tambah Produk" mengikuti pola yang sama dengan cart: mutasi disimpan client-side via Zustand + localStorage (`store/useLocalProductsStore.ts`), bukan lewat DummyJSON. Yang benar-benar nyata dari fitur ini adalah upload gambarnya — file diunggah dan ditulis ke disk lokal (`public/uploads/products/`) lewat `app/api/upload/route.ts`.

## 2. Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16.2.10 (App Router) |
| Bahasa | TypeScript 5.9 (strict mode) |
| UI | React 18.3.1 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/postcss`, tanpa `tailwind.config.js`) |
| Ikon | lucide-react |
| Animasi | Framer Motion |
| Notifikasi | Sonner (toast) |
| State global | Zustand 5 (dengan `persist` middleware untuk cart) |
| Backend data | DummyJSON API (`https://dummyjson.com`) — semua akses lewat proxy API routes internal (`app/api/**`), tidak ada lagi fetch langsung dari client |
| Package manager | pnpm |

Tidak ada test runner, tidak ada CI (`.github/workflows` tidak ada), dan tidak ada `.env.example`.

## 3. Struktur Folder (Aktual)

```
mini-ecommerce-nextjs/
├── app/
│   ├── layout.tsx                       # Root layout (AuthProvider, Navbar, Toaster)
│   ├── page.tsx                         # "/" → redirect ke /products
│   ├── globals.css
│   ├── login/page.tsx                   # "/login"
│   ├── (protected)/                     # route group, tanpa segmen URL
│   │   ├── layout.tsx                   # Client-side auth guard
│   │   ├── cart/page.tsx                # "/cart"
│   │   └── products/
│   │       ├── page.tsx                 # "/products"
│   │       ├── new/page.tsx             # "/products/new" — form tambah produk + upload
│   │       └── [slug]/page.tsx          # "/products/[slug]"
│   └── api/                             # API routes, semua di app/ (routable)
│       ├── login/route.ts               # POST /api/login
│       ├── logout/route.ts              # POST /api/logout
│       ├── me/route.ts                  # GET  /api/me
│       ├── upload/route.ts              # POST /api/upload
│       ├── cart/add/route.ts            # POST /api/cart/add
│       ├── cart/user/route.ts           # GET  /api/cart/user
│       └── products/
│           ├── route.ts                 # GET  /api/products
│           ├── [slug]/route.ts          # GET  /api/products/[slug]
│           └── categories/route.ts      # GET  /api/products/categories
├── components/
│   ├── FileUpload.tsx                   # dipakai di app/(protected)/products/new/page.tsx
│   ├── auth/LoginForm.tsx
│   ├── layout/AuthProvider.tsx
│   ├── layout/Navbar.tsx
│   └── products/
│       ├── ProductCard.tsx
│       ├── ProductFilters.tsx
│       └── ProductSearchBar.tsx
├── hooks/
│   ├── useAuthLoader.ts
│   ├── useDebounce.ts
│   └── useFileUpload.ts                 # dipakai FileUpload.tsx, POST ke /api/upload
├── lib/
│   ├── constants.ts
│   ├── helpers.ts
│   ├── types.ts
│   └── upload.ts                        # implementasi upload ke disk lokal
├── store/
│   ├── useCartStore.ts
│   ├── useUserStore.ts
│   └── useLocalProductsStore.ts         # produk hasil "Tambah Produk" (persist localStorage)
├── proxy.ts                             # middleware auth (lihat catatan di §4)
├── public/
│   └── uploads/                         # hasil upload gambar (products/, avatars/), dibuat runtime
├── logs/                                # artefak tooling lokal, bukan log aplikasi
└── next.config.ts / tsconfig.json / dst
```

> Catatan: README.md sudah disinkronkan dengan struktur di atas. Sebelumnya README menyebut `components/cart/` dan `api/` sebagai folder top-level yang tidak sesuai kode — itu sudah diperbaiki.

## 4. Routing & Middleware

### Peta halaman

| Route | File | Deskripsi |
|---|---|---|
| `/` | `app/page.tsx` | Server component, langsung `redirect("/products")` |
| `/login` | `app/login/page.tsx` | Membungkus `<LoginForm />` dalam `<Suspense>` (karena pakai `useSearchParams`) |
| `/products` | `app/(protected)/products/page.tsx` | Listing produk: search (debounce 500ms), filter (harga/rating/kategori/lokasi mock), infinite scroll via `IntersectionObserver` |
| `/products/new` | `app/(protected)/products/new/page.tsx` | Form tambah produk (judul, deskripsi, harga, brand, stok, kategori) + upload gambar via `<FileUpload>`. Simpan ke `useLocalProductsStore`, lalu redirect ke `/products/{id}` |
| `/products/[slug]` | `app/(protected)/products/[slug]/page.tsx` | Detail produk. Cek dulu ke `useLocalProductsStore` (produk hasil tambah lokal); jika tidak ketemu, fetch ke `/api/products/{slug}` (proxy internal, bukan lagi langsung ke DummyJSON) |
| `/cart` | `app/(protected)/cart/page.tsx` | Daftar item keranjang + ringkasan order, sumber data 100% dari Zustand store (bukan dari `/api/cart/*`) |

> Catatan routing: `/products/new` adalah static segment dan diprioritaskan Next.js di atas sibling dynamic segment `/products/[slug]`, jadi tidak akan tertangkap sebagai `slug="new"`.

### Middleware (`proxy.ts`)

- Melindungi path yang diawali `/products` atau `/cart`: jika cookie `token` tidak ada → redirect ke `/login?from=<path>`.
- Jika user sudah punya cookie `token` dan mengakses `/login` → redirect ke `/products`.
- `matcher` mengecualikan `/api`, `/_next/static`, `/_next/image`, `/favicon.ico`.
- Hanya mengecek **keberadaan** cookie token, bukan validitas/expiry-nya.
- ⚠️ File ini bernama `proxy.ts`, bukan konvensi standar Next.js `middleware.ts`. Perlu diverifikasi di console dev server bahwa file ini benar-benar terdeteksi sebagai middleware oleh Next 16 (lihat §14).

### Guard tambahan di client

`app/(protected)/layout.tsx` (client component) melakukan pengecekan kedua: membaca `user`/`isLoading` dari `useUserStore`, dan jika tidak loading & tidak ada user → `router.replace("/login")`. Ini lapisan proteksi kedua di atas middleware (belt-and-suspenders).

## 5. API Routes

Semua route di `app/api/**` adalah proxy tipis ke DummyJSON.

| Route | Method | Auth | Deskripsi |
|---|---|---|---|
| `/api/login` | POST | - | Body `{username, password}` → proxy ke `POST /auth/login` DummyJSON dengan `expiresInMins: 60`. Sukses: set cookie httpOnly `token`, `userId`, `username` (maxAge 3600s, `sameSite=lax`, `path=/`), return `{user: {id, username}}`. Gagal: 401 `{message: "Invalid username or password"}` |
| `/api/logout` | POST | - | Hapus ketiga cookie (maxAge 0). Return `{success: true}` |
| `/api/me` | GET | cookie | Baca cookie `token`/`userId`/`username`. Return `{authenticated, user}`. **Catatan:** raw token ikut dikembalikan di body JSON, tidak hanya di cookie httpOnly |
| `/api/products` | GET | - | Query `limit` (default 12), `skip` (default 0), `q` opsional. Jika `q` ada → proxy ke `/products/search`, jika tidak → `/products`. Return `ProductsResponse` |
| `/api/products/[slug]` | GET | - | Proxy ke `GET /products/{slug}` DummyJSON. 404 passthrough jika produk tidak ditemukan. Dipakai halaman detail produk untuk produk non-lokal |
| `/api/products/categories` | GET | - | Proxy ke `GET /products/categories` |
| `/api/upload` | POST | cookie `userId` | `multipart/form-data` `{file, type: "avatar" \| "product"}` → tulis ke disk lokal via `lib/upload.ts`, return `{success, url}`. Dipakai halaman `/products/new` (lewat komponen `FileUpload`) |
| `/api/cart/add` | POST | cookie `userId` | Body `{productId, quantity}` → proxy ke `POST /carts/add`. **Tidak dipanggil oleh UI manapun saat ini** — cart sepenuhnya dikelola client-side via Zustand |
| `/api/cart/user` | GET | cookie `userId` | Proxy ke `GET /carts/user/{userId}`. **Juga tidak dipakai** oleh halaman cart |

Semua proxy di atas mengambil base URL dari `API_BASE_URL` (`lib/constants.ts`), bukan lagi hardcode string `"https://dummyjson.com"` di tiap file.

## 6. State Management (Zustand)

### `store/useCartStore.ts`

```ts
import type { CartItem } from "@/lib/types";

interface CartState {
  products: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
}
```

- Persist ke `localStorage` dengan key `cart-storage` (tanpa `partialize`, seluruh state ikut tersimpan).
- `totalQuantity`/`totalPrice` dihitung ulang (`.reduce`) setiap kali produk berubah, bukan selector turunan.
- `_hasHydrated` di-set `true` lewat `onRehydrateStorage` — dipakai halaman/komponen (`cart/page.tsx`, `ProductCard`, `[slug]/page.tsx`) untuk mencegah flicker/mismatch saat SSR hydration.
- `updateQuantity(id, q)` dengan `q <= 0` otomatis memanggil `removeFromCart`.

### `store/useUserStore.ts`

```ts
interface User { id: number; username?: string; }
interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (state: boolean) => void;
  logout: () => void;
}
```

- **Tidak** memakai `persist` — sesi sesungguhnya disimpan di cookie httpOnly (`token`/`userId`/`username`) yang diset backend. Store ini hanya cache in-memory yang direhidrasi tiap load lewat `useAuthLoader` → `GET /api/me`.
- `isLoading` diinisialisasi `true` (menunggu hasil pengecekan sesi).
- `logout()` di store hanya reset state lokal — pemanggilan `POST /api/logout` untuk menghapus cookie dilakukan terpisah di `Navbar`.

### `store/useLocalProductsStore.ts`

```ts
import type { Product } from "@/lib/types";

interface LocalProductsState {
  products: Product[];
  addProduct: (product: Product) => void;
}
```

- Persist ke `localStorage` dengan key `local-products-storage`.
- Menampung produk hasil form "Tambah Produk" (`/products/new`) — DummyJSON tidak benar-benar menyimpan produk baru, jadi produk ini murni client-side, mirip pola `useCartStore`.
- `id` produk baru digenerate dengan `Date.now()` agar tidak bentrok dengan id asli DummyJSON (integer kecil ~1-194).
- Dibaca oleh halaman listing (`/products`, di-prepend ke hasil fetch saat tidak sedang searching) dan halaman detail (`/products/[slug]`, dicek duluan sebelum fetch ke API).

## 7. Komponen

| File | Ringkasan |
|---|---|
| `components/auth/LoginForm.tsx` | Form login dengan state lokal (username/password pre-filled demo `emilys`/`emilyspass`). Baca query `from` untuk redirect tujuan. Sukses → `setUser`, `router.push`, `router.refresh` |
| `components/layout/AuthProvider.tsx` | Wrapper tipis yang memanggil `useAuthLoader()` lalu render children |
| `components/layout/Navbar.tsx` | Navbar sticky: logo, link "Tambah Produk", link cart dengan badge jumlah, username, tombol logout (`POST /api/logout` → reset store → toast → redirect `/login`) |
| `components/products/ProductCard.tsx` | Card produk: gambar, badge kategori, judul (link ke detail), harga, rating, brand, lokasi mock, tombol tambah/di-keranjang (toggle via `isInCart`) |
| `components/products/ProductFilters.tsx` | 4 filter dropdown: rating, kategori (fetch dari `/api/products/categories`, fallback derive dari `products` prop), lokasi, harga. Expose type `FiltersState`, `PriceFilter`, `RatingFilter`, `LocationFilter` |
| `components/products/ProductSearchBar.tsx` | Input search terkontrol dengan tombol clear |
| `components/FileUpload.tsx` | Komponen upload gambar (preview + progress). Dipakai di `app/(protected)/products/new/page.tsx` untuk upload gambar produk baru |

## 8. Custom Hooks

| Hook | Signature | Fungsi |
|---|---|---|
| `useAuthLoader` | `(): void` | Saat mount: `setLoading(true)` → `GET /api/me` (`no-store`) → `setUser(...)` → `setLoading(false)`. Dipakai `AuthProvider` untuk bootstrap sesi di seluruh app |
| `useDebounce` | `<T>(value: T, delay = 500): T` | Debounce generik via `setTimeout`, dipakai search box di halaman produk |
| `useFileUpload` | `(options?): {...}` | Kelola state upload file (preview via `FileReader`, simulasi progress, `POST /api/upload`). Dipakai `FileUpload.tsx` |

## 9. lib/ — Types, Constants, Helpers

### `lib/types.ts`

```ts
interface User { id: number; username: string; }
interface Product { id, title, description, price, discountPercentage, stock, category, rating, brand, thumbnail, images }
interface ProductsResponse { products: Product[]; total; skip; limit }

// Shape cart milik app sendiri (dipakai useCartStore, ProductCard, halaman detail, dll)
interface CartItem { id, title, price, quantity, thumbnail }

// Shape respons DummyJSON /carts/* — hanya dipakai proxy route /api/cart/add & /api/cart/user yang unused
interface DummyJsonCartProduct { id, title, price, quantity, total }
interface DummyJsonCart { id, userId, products: DummyJsonCartProduct[], total, discountedTotal, totalProducts, totalQuantity }
```

`Product` adalah satu-satunya definisi untuk shape produk di seluruh app — halaman detail (`[slug]/page.tsx`) dan halaman tambah produk (`new/page.tsx`) sama-sama mengimpor dari sini, tidak ada lagi definisi lokal duplikat. `CartItem` (shape cart milik app) dan `DummyJsonCartProduct`/`DummyJsonCart` (shape respons API DummyJSON, dipakai proxy route yang tidak aktif) sekarang dipisahkan namanya agar tidak collide.

### `lib/constants.ts`

Konstanta yang dipakai: `APP_NAME`, `APP_DESCRIPTION`, `API_BASE_URL` (dipakai semua proxy route di `app/api/**`), `PRODUCTS_PER_PAGE` (12), `LOCATIONS` (5 kota), `TOAST_MESSAGES`.
`PRICE_RANGES`, `INFINITE_SCROLL_THRESHOLD`, `MIN_RATING`, `MAX_RATING` sudah dihapus karena tidak pernah direferensikan di manapun.

### `lib/helpers.ts`

```ts
function getMockLocation(product: Product): string  // LOCATIONS[product.id % LOCATIONS.length]
```
Generator lokasi mock deterministik (bukan data asli dari DummyJSON), dipakai `ProductCard` dan filter lokasi.

### `lib/upload.ts`

Layanan upload file ke disk lokal (`fs/promises`), menulis ke `public/<folder>/<filename>` dan mengembalikan URL publik.

```ts
uploadFile(file, options?)          // generic
uploadProductImage(file)            // folder "uploads/products", max 10MB
uploadAvatar(file)                  // folder "uploads/avatars", max 2MB
uploadMultipleFiles(files, options?)
validateImageDimensions(file, minW?, minH?, maxW?, maxH?)
```
Backing implementation untuk `app/api/upload/route.ts` — dipakai lewat form "Tambah Produk" (`/products/new`).

## 10. Alur Autentikasi

1. User mengisi form di `/login` (`LoginForm.tsx`) → `POST /api/login`.
2. Route handler validasi ke DummyJSON (`POST /auth/login`), lalu set cookie httpOnly `token`, `userId`, `username` (1 jam) dan balas `{user}`.
3. Client: `setUser(data.user)` di `useUserStore`, redirect ke halaman tujuan (`from` query param atau `/products`).
4. Navigasi berikutnya: `proxy.ts` (middleware) memeriksa cookie `token` untuk memblokir akses `/products`/`/cart` tanpa login.
5. Setiap load app: `AuthProvider` → `useAuthLoader` → `GET /api/me` membaca cookie di server, mengembalikan status login untuk sinkronisasi `useUserStore` di client (karena store tidak persist).
6. Logout: `Navbar` → `POST /api/logout` (hapus cookie) → `logout()` di store → toast → redirect `/login`.

## 11. Alur Keranjang Belanja

1. Dari `ProductCard` atau halaman detail (`[slug]/page.tsx`), tombol "Tambah ke Keranjang" memanggil `addToCart` di `useCartStore` (langsung ke localStorage via Zustand, **tidak** memanggil `/api/cart/add`).
2. `Navbar` menampilkan badge `totalQuantity` dari store yang sama.
3. Halaman `/cart` membaca `products`, `totalPrice`, `totalQuantity` langsung dari store; tombol +/- memanggil `updateQuantity`, tombol hapus memanggil `removeFromCart`.
4. Tombol "Checkout Sekarang" **belum memiliki handler** — tidak ada alur checkout/pembayaran yang sebenarnya.
5. Endpoint `/api/cart/add` dan `/api/cart/user` (proxy ke DummyJSON `/carts/*`) ada di kode tapi **tidak dipanggil** dari UI mana pun saat ini.

## 12. Konfigurasi Project

- **`tsconfig.json`**: `strict: true`, path alias `@/*` → root project (bukan `src/`), target ES2017, `moduleResolution: bundler`.
- **`biome.json`**: konfigurasi Biome (linter + formatter), menggantikan ESLint. `pnpm lint` → `biome lint .`, `pnpm lint:fix` → `biome lint --write .`, `pnpm format` → `biome format --write .`.
- **`postcss.config.mjs`**: hanya plugin `@tailwindcss/postcss` (Tailwind v4, tanpa file `tailwind.config.js`).
- **`pnpm-workspace.yaml`**: bukan workspace multi-package — hanya `allowBuilds` untuk native build script `sharp` dan `unrs-resolver`.
- **`next.config.ts`**: whitelist `images.remotePatterns` untuk host `cdn.dummyjson.com` (dipakai `next/image` di semua tampilan produk).

## 13. Menjalankan Proyek

```bash
pnpm install
# buat .env.local (opsional, default sudah fallback ke dummyjson.com):
# NEXT_PUBLIC_API_URL=https://dummyjson.com
pnpm dev        # http://localhost:3000
pnpm build && pnpm start   # production
```

Login demo (kredensial DummyJSON): `emilys` / `emilyspass`, atau lihat [dummyjson.com/users](https://dummyjson.com/users).

## 14. Known Issues & Tech Debt

Item-item berikut sudah diperbaiki (per enhancement "fixing tech debt"):

- ~~Fitur upload mati (route di luar `app/`)~~ → dipindah ke `app/api/upload/route.ts`, sekarang reachable dan dipakai halaman `/products/new`.
- ~~Duplikasi/inkonsistensi type `CartProduct`/`Product`~~ → dikonsolidasikan ke `lib/types.ts` (`Product`, `CartItem`, `DummyJsonCartProduct`/`DummyJsonCart`), tidak ada lagi definisi lokal duplikat.
- ~~Konstanta tak terpakai~~ → `PRICE_RANGES`, `INFINITE_SCROLL_THRESHOLD`, `MIN_RATING`, `MAX_RATING` dihapus; `API_BASE_URL` sekarang benar-benar dipakai di semua proxy route.
- ~~Halaman detail produk tidak lewat proxy internal~~ → sekarang fetch ke `/api/products/[slug]` (internal), bukan langsung ke `dummyjson.com`.
- ~~README tidak sinkron dengan struktur aktual~~ → README sudah diperbarui.

~~`proxy.ts` vs konvensi `middleware.ts`~~ → diverifikasi lewat `pnpm build`: output build menampilkan `ƒ Proxy (Middleware)`, jadi `proxy.ts` memang terdeteksi dan berjalan sebagai middleware Next 16 meski namanya bukan `middleware.ts`.

Yang masih berlaku:

| Isu | Detail |
|---|---|
| **Endpoint cart proxy tidak dipakai** | `/api/cart/add` dan `/api/cart/user` ada tapi cart sepenuhnya dikelola client-side lewat Zustand — server-side cart DummyJSON tidak pernah tersentuh. |
| **Checkout belum diimplementasi** | Tombol "Checkout Sekarang" di halaman cart tidak punya `onClick`/alur lanjutan. |
| **"Tambah Produk" tidak benar-benar persist ke backend** | Produk baru hanya tersimpan di localStorage lewat `useLocalProductsStore` (per browser/device), karena DummyJSON `POST /products/add` adalah mock yang tidak menyimpan data. Jika butuh persistensi lintas device, perlu backend sungguhan. |
| **Tidak ada test & CI** | Tidak ada test runner, file test, atau workflow CI di repo ini. |
| **Beberapa error accessibility dari baseline Biome** | Sejak migrasi ESLint → Biome, muncul beberapa error accessibility (button tanpa `type`, array index sebagai `key`) yang sudah ada sebelum enhancement ini dan belum diperbaiki — di luar cakupan perubahan ini. |

# Arsitektur

Struktur folder, routing, state management, dan konfigurasi project. Kembali ke [indeks dokumentasi](DOCUMENTATION.md).

## Gambaran Umum

```
Browser (React 19 client components)
   │  fetch("/api/...")
   ▼
Next.js App Router ── proxy.ts (middleware: cek cookie token)
   │
   ├── app/api/**  ── proxy tipis ──►  DummyJSON (https://dummyjson.com)
   │
   └── app/api/upload ──► lib/upload.ts ──► disk lokal (public/uploads/)

State client: Zustand (cart & produk lokal di localStorage, user in-memory)
Sesi: cookie httpOnly (token, userId, username) yang diset /api/login
```

- Tidak ada database sendiri. Data produk berasal dari DummyJSON, dan semua akses dari client lewat API route internal (`app/api/**`), tidak ada fetch langsung ke DummyJSON dari browser.
- Mutasi yang tidak didukung DummyJSON (cart, tambah produk) disimpan client-side lewat Zustand `persist`.

## Struktur Folder

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
│   └── api/                             # API routes (lihat API.MD)
│       ├── login/route.ts
│       ├── logout/route.ts
│       ├── me/route.ts
│       ├── upload/route.ts
│       ├── cart/add/route.ts
│       ├── cart/user/route.ts
│       └── products/
│           ├── route.ts
│           ├── [slug]/route.ts
│           └── categories/route.ts
├── components/                          # lihat UI_COMPONENT.MD
│   ├── FileUpload.tsx
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
│   └── useFileUpload.ts
├── lib/
│   ├── constants.ts
│   ├── helpers.ts
│   ├── types.ts
│   └── upload.ts                        # implementasi upload ke disk lokal (server-only)
├── store/
│   ├── useCartStore.ts
│   ├── useUserStore.ts
│   └── useLocalProductsStore.ts
├── proxy.ts                             # middleware auth (Next 16 mendeteksinya sebagai "Proxy (Middleware)")
├── public/
│   └── uploads/                         # hasil upload gambar (products/, avatars/), dibuat saat runtime
├── logs/                                # artefak tooling lokal, bukan log aplikasi (di-.gitignore)
└── next.config.ts / tsconfig.json / biome.json / dst
```

Path alias `@/*` mengarah ke root project (tidak ada folder `src/`).

## Routing

| Route | File | Deskripsi |
|---|---|---|
| `/` | `app/page.tsx` | Server component, langsung `redirect("/products")` |
| `/login` | `app/login/page.tsx` | Membungkus `<LoginForm />` dalam `<Suspense>` (karena pakai `useSearchParams`) |
| `/products` | `app/(protected)/products/page.tsx` | Listing produk: search (debounce 500ms), filter, pagination "Muat Lebih Banyak" |
| `/products/new` | `app/(protected)/products/new/page.tsx` | Form tambah produk + upload gambar |
| `/products/[slug]` | `app/(protected)/products/[slug]/page.tsx` | Detail produk (cek store lokal dulu, lalu `/api/products/{slug}`) |
| `/cart` | `app/(protected)/cart/page.tsx` | Daftar item keranjang + ringkasan order dari Zustand |

`/products/new` adalah static segment, jadi Next.js memprioritaskannya di atas `/products/[slug]` dan tidak akan tertangkap sebagai `slug="new"`.

Proteksi rute (middleware `proxy.ts` + guard client) dijelaskan di [PERMISSION.MD](PERMISSION.MD).

## State Management (Zustand)

| Store | Persist | Key localStorage | Isi |
|---|---|---|---|
| `useCartStore` | Ya | `cart-storage` | Item keranjang, `totalQuantity`, `totalPrice`, flag `_hasHydrated` |
| `useUserStore` | Tidak | – | `user`, `isLoading` (cache in-memory dari `/api/me`) |
| `useLocalProductsStore` | Ya | `local-products-storage` | Produk hasil form "Tambah Produk" |

### `store/useCartStore.ts`

```ts
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

- Tanpa `partialize`, jadi seluruh state ikut tersimpan.
- `totalQuantity`/`totalPrice` dihitung ulang (`.reduce`) setiap kali produk berubah.
- `_hasHydrated` di-set `true` lewat `onRehydrateStorage`, dipakai untuk mencegah hydration mismatch (lihat [TECH_IMPLEMENTATION.MD](TECH_IMPLEMENTATION.MD)).
- `updateQuantity(id, q)` dengan `q <= 0` otomatis memanggil `removeFromCart`.

### `store/useUserStore.ts`

```ts
interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (state: boolean) => void;
  logout: () => void;
}
```

- Sesi sebenarnya ada di cookie httpOnly. Store ini direhidrasi setiap load lewat `useAuthLoader` → `GET /api/me`.
- `isLoading` diinisialisasi `true`.
- `logout()` hanya me-reset state lokal; penghapusan cookie (`POST /api/logout`) dilakukan di `Navbar`.

### `store/useLocalProductsStore.ts`

```ts
interface LocalProductsState {
  products: Product[];
  addProduct: (product: Product) => void;
}
```

- `id` produk baru = `Date.now()` agar tidak bentrok dengan id DummyJSON (integer kecil ~1–194).
- Dibaca halaman listing (di-prepend ke hasil fetch saat tidak sedang searching) dan halaman detail (dicek sebelum fetch ke API).

## lib/

| File | Isi |
|---|---|
| `lib/types.ts` | `User`, `Product`, `ProductsResponse`, `CartItem`. `Product` adalah satu-satunya definisi shape produk di seluruh app |
| `lib/constants.ts` | `APP_NAME`, `APP_DESCRIPTION`, `API_BASE_URL`, `PRODUCTS_PER_PAGE` (12), `LOCATIONS` + type `Location`, `TOAST_MESSAGES` (`addToCart`, `logoutSuccess`, `addProduct`) |
| `lib/helpers.ts` | `getMockLocation(product)`: `LOCATIONS[product.id % LOCATIONS.length]` |
| `lib/upload.ts` | `uploadFile`, `uploadProductImage`, `uploadAvatar`, type `UploadResult`/`UploadOptions`. Memakai `node:fs`, hanya untuk server |

## Konfigurasi Project

- **`tsconfig.json`**: `strict: true`, path alias `@/*` → root, target ES2017, `moduleResolution: bundler`.
- **`biome.json`**: Biome 2.6 (linter + formatter, preset `recommended`), menggantikan ESLint. Mengabaikan `.next`, `public`, `logs`, dll.
- **`postcss.config.mjs`**: hanya plugin `@tailwindcss/postcss` (Tailwind v4, tanpa `tailwind.config.js`).
- **`pnpm-workspace.yaml`**: bukan workspace multi-package; hanya `allowBuilds` untuk `sharp` dan `unrs-resolver`.
- **`next.config.ts`**: whitelist `images.remotePatterns` untuk `cdn.dummyjson.com` (dipakai `next/image`).

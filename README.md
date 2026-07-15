# Mini Ecommerce - Next.js

Platform e-commerce modern yang dibangun dengan Next.js 16, React 18, dan TypeScript. Aplikasi ini menggunakan DummyJSON API sebagai backend data produk dan menampilkan fitur-fitur e-commerce modern seperti keranjang belanja, filter produk, pagination "Muat Lebih Banyak", autentikasi, dan tambah produk dengan upload gambar.

> Untuk dokumentasi arsitektur yang lebih mendalam (routing, API routes, state management, known issues), lihat [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md).

## 📋 Fitur Utama

- **Autentikasi User** - Login/logout dengan session management (cookie httpOnly)
- **Keranjang Belanja** - State management dengan Zustand & persistent storage (localStorage)
- **Tambah Produk** - Form tambah produk baru dengan upload gambar (disimpan lokal, lihat catatan di DOCUMENTATION.md)
- **Pencarian & Filter** - Filter berdasarkan kategori, harga, rating, dan lokasi
- **Muat Lebih Banyak** - Load produk halaman berikutnya lewat tombol, bukan scroll otomatis
- **Responsive Design** - UI modern dan mobile-friendly
- **Animasi Smooth** - Transisi halus dengan Framer Motion
- **Toast Notifications** - Feedback interaktif dengan Sonner
- **Type-Safe** - Full TypeScript untuk maintainability
- **SEO Optimized** - Meta tags dan semantic HTML
- **Protected Routes** - Middleware untuk route protection

## 🛠️ Tech Stack

### Core

- **Framework**: [Next.js 16.x](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **UI Library**: [React 18.3.1](https://react.dev/)

### Styling & UI

- **CSS Framework**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### State Management

- **Global State**: [Zustand 5.x](https://zustand-demo.pmnd.rs/) dengan persist middleware

### Kualitas Kode

- **Lint & Format**: [Biome](https://biomejs.dev/) (`pnpm lint`, `pnpm lint:fix`, `pnpm format`)

### API

- **Backend**: [DummyJSON API](https://dummyjson.com/)

## 📦 Struktur Project

```
mini-ecommerce-nextjs/
├── app/
│   ├── layout.tsx                       # Root layout (AuthProvider, Navbar, Toaster)
│   ├── page.tsx                         # "/" → redirect ke /products
│   ├── login/page.tsx                   # Halaman login
│   ├── (protected)/                     # Route group dengan auth guard client-side
│   │   ├── layout.tsx
│   │   ├── cart/page.tsx                # Halaman keranjang
│   │   └── products/
│   │       ├── page.tsx                 # Daftar produk (search, filter, infinite scroll)
│   │       ├── new/page.tsx             # Form tambah produk + upload gambar
│   │       └── [slug]/page.tsx          # Detail produk
│   └── api/                             # API Routes (proxy ke DummyJSON)
│       ├── login/route.ts
│       ├── logout/route.ts
│       ├── me/route.ts
│       ├── upload/route.ts              # Upload gambar produk/avatar ke public/uploads
│       ├── cart/add/route.ts
│       ├── cart/user/route.ts
│       └── products/
│           ├── route.ts                 # List & search produk
│           ├── [slug]/route.ts          # Detail produk
│           └── categories/route.ts
├── components/
│   ├── FileUpload.tsx                   # Komponen upload gambar (dipakai di products/new)
│   ├── auth/LoginForm.tsx
│   ├── layout/AuthProvider.tsx
│   ├── layout/Navbar.tsx
│   └── products/                        # ProductCard, ProductFilters, ProductSearchBar
├── hooks/                                # useAuthLoader, useDebounce, useFileUpload
├── lib/
│   ├── constants.ts                     # Konfigurasi & konstanta
│   ├── helpers.ts                       # Helper functions
│   ├── types.ts                         # TypeScript types (Product, CartItem, dll)
│   └── upload.ts                        # Layanan upload file ke disk lokal
├── store/
│   ├── useCartStore.ts                  # Cart state management
│   ├── useUserStore.ts                  # User state management
│   └── useLocalProductsStore.ts         # Produk hasil "Tambah Produk" (localStorage)
└── public/                              # Static assets & hasil upload (public/uploads)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x atau lebih tinggi
- pnpm (atau npm/yarn)

### Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/imamnura/mini-ecommerce-nextjs.git
   cd mini-ecommerce-nextjs
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # atau
   npm install
   # atau
   yarn install
   ```

3. **Setup environment variables**

   Buat file `.env.local` di root project:

   ```env
   NEXT_PUBLIC_API_URL=https://dummyjson.com
   ```

4. **Run development server**

   ```bash
   pnpm dev
   # atau
   npm run dev
   # atau
   yarn dev
   ```

5. **Buka browser**

   Akses aplikasi di [http://localhost:3000](http://localhost:3000)

### Build untuk Production

```bash
# Build aplikasi
pnpm build

# Run production server
pnpm start
```

## 👤 Login Credentials

Gunakan kredensial DummyJSON untuk login:

| Username | Password     | Role |
| -------- | ------------ | ---- |
| emilys   | emilyspass   | User |
| michaelw | michaelwpass | User |

Atau lihat [DummyJSON Users](https://dummyjson.com/users) untuk user lainnya.

# Mini Ecommerce - Next.js

Platform e-commerce modern yang dibangun dengan Next.js 15, React 18, dan TypeScript. Aplikasi ini menggunakan DummyJSON API sebagai backend dan menampilkan fitur-fitur e-commerce modern seperti keranjang belanja, filter produk, infinite scroll, dan autentikasi.

## 📋 Fitur Utama

- ✅ **Autentikasi User** - Login/logout dengan session management
- 🛒 **Keranjang Belanja** - State management dengan Zustand & persistent storage
- 🔍 **Pencarian & Filter** - Filter berdasarkan kategori, harga, rating, dan lokasi
- ♾️ **Infinite Scroll** - Load produk secara dinamis saat scroll
- 📱 **Responsive Design** - UI modern dan mobile-friendly
- 🎨 **Animasi Smooth** - Transisi halus dengan Framer Motion
- 🔔 **Toast Notifications** - Feedback interaktif dengan Sonner
- 🎯 **Type-Safe** - Full TypeScript untuk maintainability
- 🚀 **SEO Optimized** - Meta tags dan semantic HTML
- 🔐 **Protected Routes** - Middleware untuk route protection

## 🛠️ Tech Stack

### Core

- **Framework**: [Next.js 15.5.6](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **UI Library**: [React 18.3.1](https://react.dev/)

### Styling & UI

- **CSS Framework**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### State Management

- **Global State**: [Zustand 5.x](https://zustand-demo.pmnd.rs/) dengan persist middleware

### API

- **Backend**: [DummyJSON API](https://dummyjson.com/)

## 📦 Struktur Project

```
mini-ecommerce-nextjs/
├── app/                          # Next.js App Router
│   ├── (protected)/             # Protected routes (require auth)
│   │   ├── cart/               # Halaman keranjang
│   │   └── products/           # Halaman daftar & detail produk
│   ├── login/                  # Halaman login
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── api/                         # API Routes (proxy ke DummyJSON)
│   ├── cart/                   # Cart endpoints
│   ├── login/                  # Login endpoint
│   ├── logout/                 # Logout endpoint
│   ├── me/                     # User profile endpoint
│   └── products/               # Products endpoints
├── components/                  # React Components
│   ├── auth/                   # Komponen autentikasi
│   ├── cart/                   # Komponen keranjang
│   ├── layout/                 # Komponen layout (Navbar, etc)
│   └── products/               # Komponen produk
├── hooks/                       # Custom React Hooks
├── lib/                         # Utilities & helpers
│   ├── constants.ts            # Konfigurasi & konstanta
│   ├── helpers.ts              # Helper functions
│   └── types.ts                # TypeScript types
├── store/                       # Zustand stores
│   ├── useCartStore.ts         # Cart state management
│   └── useUserStore.ts         # User state management
└── public/                      # Static assets
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

## 📚 Fitur Detail

### 1. Autentikasi

- Login dengan username & password
- Session management dengan cookies
- Automatic redirect ke halaman sebelumnya setelah login
- Protected routes dengan Next.js middleware

### 2. Katalog Produk

- Infinite scroll pagination
- Search by product name
- Filter by:
  - Category (Beauty, Fragrances, Furniture, dll)
  - Price range (< $100, $100-$500, > $500)
  - Rating (1-5 stars)
  - Location (Jakarta, Bandung, Surabaya, dll)
- Product detail page dengan rating & description

### 3. Keranjang Belanja

- Add/remove products
- Update quantity
- Persistent storage (localStorage)
- Real-time cart badge di navbar
- Cart summary dengan total price

### 4. UI/UX

- Light theme dengan green accent (#10b981)
- Smooth animations & transitions
- Loading states & skeleton screens
- Toast notifications untuk user feedback
- Responsive design (mobile, tablet, desktop)

## 🔧 Scripts Available

```bash
pnpm dev          # Run development server
pnpm build        # Build untuk production
pnpm start        # Run production server
pnpm lint         # Run ESLint
```

## 📝 Configuration

Konfigurasi utama aplikasi terletak di `lib/constants.ts`:

```typescript
export const APP_NAME = "Mini Ecommerce";
export const API_BASE_URL = "https://dummyjson.com";
export const PRODUCTS_PER_PAGE = 12;
export const INFINITE_SCROLL_THRESHOLD = 100;
export const LOCATIONS = ["Jakarta", "Bandung", "Surabaya", ...];
```

## 👨‍💻 Author

**Imam Nura**

- GitHub: [@imamnura](https://github.com/imamnura)

## 🙏 Acknowledgments

- [DummyJSON](https://dummyjson.com/) - Free fake REST API
- [Next.js Team](https://nextjs.org/) - Amazing framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

⭐ Jangan lupa star repository ini jika bermanfaat!

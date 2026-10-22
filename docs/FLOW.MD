# Alur Aplikasi

Alur utama pengguna dari UI sampai ke API dan state. Kembali ke [indeks dokumentasi](DOCUMENTATION.md).

## 1. Autentikasi

```
LoginForm ──POST /api/login──► DummyJSON /auth/login
    │                              │
    │◄──── { user } + Set-Cookie (token, userId, username; 1 jam)
    ▼
useUserStore.setUser(user) → router.push(from ?? "/products") → router.refresh()
```

1. User mengisi form di `/login` (`LoginForm.tsx`, pre-filled akun demo `emilys` / `emilyspass`) → `POST /api/login`.
2. Route handler memvalidasi ke DummyJSON, lalu set cookie httpOnly `token`, `userId`, `username` (1 jam) dan membalas `{ user }`.
3. Client: `setUser(data.user)`, redirect ke query `from` atau `/products`.
4. Navigasi berikutnya: `proxy.ts` memeriksa cookie `token` untuk `/products*` dan `/cart*`.
5. Setiap load app: `AuthProvider` → `useAuthLoader` → `GET /api/me` → sinkronisasi `useUserStore` (store tidak di-persist).
6. Sesi berakhir setelah 1 jam (cookie expired). Tidak ada refresh token.

## 2. Logout

`Navbar` → `POST /api/logout` (hapus cookie) → `logout()` di store → toast "Logout berhasil" → redirect `/login`.

## 3. Listing & Pencarian Produk

1. `/products` memuat `GET /api/products?limit=12&skip=0`.
2. Input search di-debounce 500ms (`useDebounce`); jika ada query, request memakai `q` dan daftar di-reset.
3. Tombol "Muat Lebih Banyak" menaikkan `skip` dan meng-append hasil ke daftar.
4. Produk dari `useLocalProductsStore` di-prepend saat tidak sedang searching.
5. Filter (harga, rating, kategori, lokasi) diterapkan client-side pada daftar yang sudah dimuat. Lokasi adalah data mock dari `getMockLocation`.

## 4. Detail Produk

1. `/products/[slug]` mencari dulu di `useLocalProductsStore`.
2. Jika tidak ada, fetch ke `GET /api/products/{slug}`.
3. Tombol "Tambah ke Keranjang" memanggil `useCartStore.addToCart`.

## 5. Tambah Produk

1. User membuka `/products/new` (link "Tambah Produk" di Navbar).
2. Pilih gambar di `<FileUpload>` → preview via `FileReader` → `POST /api/upload` (`type=product`) → file ditulis ke `public/uploads/products/`, URL dikembalikan.
3. Submit form (judul, deskripsi, harga, brand, stok, kategori) → `addProduct` ke `useLocalProductsStore` dengan `id = Date.now()`.
4. Toast "Produk baru berhasil ditambahkan" → redirect ke `/products/{id}`.

Produk baru hanya tersimpan di localStorage browser tersebut; gambar tersimpan di disk server.

## 6. Keranjang Belanja

1. Dari `ProductCard` atau halaman detail, "Tambah ke Keranjang" memanggil `addToCart` (langsung ke localStorage lewat Zustand, **tidak** memanggil `/api/cart/add`).
2. `Navbar` menampilkan badge `totalQuantity` dari store yang sama.
3. `/cart` membaca `products`, `totalPrice`, `totalQuantity` dari store; tombol +/- memanggil `updateQuantity`, tombol hapus memanggil `removeFromCart`.
4. Tombol "Checkout Sekarang" **belum punya handler**; tidak ada alur checkout/pembayaran.

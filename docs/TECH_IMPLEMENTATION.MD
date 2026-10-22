# Detail Implementasi Teknis

Keputusan teknis dan cara kerja bagian-bagian yang tidak langsung terlihat dari struktur folder. Kembali ke [indeks dokumentasi](DOCUMENTATION.md).

## Proxy ke DummyJSON

- Semua request data lewat `app/api/**`, sehingga browser tidak pernah memanggil DummyJSON langsung dan base URL bisa diganti lewat env `NEXT_PUBLIC_API_URL`.
- Route proxy tidak menambahkan caching atau retry; response DummyJSON diteruskan apa adanya (kecuali `/api/login` yang mengubah token menjadi cookie).

## Sesi Berbasis Cookie

- Token DummyJSON disimpan di cookie httpOnly, bukan di localStorage.
- `useUserStore` tidak di-persist; status login selalu diambil ulang dari `GET /api/me` saat app dimuat, sehingga cookie tetap jadi sumber kebenaran.

## Persistensi Client-Side

DummyJSON tidak benar-benar menyimpan mutasi (`POST /products/add` dan `/carts/add` selalu "berhasil" tanpa menyimpan apa pun). Karena itu:

- **Cart** → `useCartStore` + `persist` (`cart-storage`).
- **Produk baru** → `useLocalProductsStore` + `persist` (`local-products-storage`), `id = Date.now()`.

Konsekuensinya data hanya ada di browser tersebut (lihat [TECHDEBT.MD](TECHDEBT.MD)).

## Hydration Cart

State cart berasal dari localStorage yang tidak tersedia saat SSR. Untuk mencegah hydration mismatch, `useCartStore` punya flag `_hasHydrated` yang di-set di `onRehydrateStorage`. `cart/page.tsx`, `ProductCard`, dan `[slug]/page.tsx` menunggu flag ini sebelum merender angka/status cart.

## Pencarian & Pagination

- Search memakai `useDebounce` (500ms) agar tidak memanggil API di setiap ketikan.
- Pagination memakai `limit`/`skip` (`PRODUCTS_PER_PAGE = 12`) dengan tombol "Muat Lebih Banyak" yang meng-append hasil.
- Filter diterapkan client-side pada produk yang sudah dimuat, jadi filter tidak mencakup produk di halaman yang belum dimuat.

## Lokasi Mock

DummyJSON tidak punya data lokasi. `getMockLocation(product)` memberi lokasi deterministik `LOCATIONS[product.id % LOCATIONS.length]`. `LOCATIONS` dan type `Location` di `lib/constants.ts` adalah satu-satunya sumber daftar kota (dipakai helper, `ProductFilters`, dan type `LocationFilter`).

## Upload File

- `lib/upload.ts` (server-only, memakai `node:fs`) memvalidasi ukuran dan MIME type, membuat nama file unik (`<nama_disanitasi>_<timestamp>_<random><ext>`), lalu menulis ke `public/<folder>/`.
- Progress di client adalah simulasi (+10% tiap 200ms sampai 90%), bukan progress upload sesungguhnya.
- File yang ditulis ke `public/` saat runtime butuh filesystem yang persisten dan writable (lihat [DEPLOYMENT_PLAN.MD](DEPLOYMENT_PLAN.MD)).

## Versi Dependency Utama

| Package | Versi |
|---|---|
| next | ^16.4.2 |
| react / react-dom | ^19.3.1 |
| typescript | ^7.0.2 |
| framer-motion | ^14.5.0 |
| lucide-react | ^1.61.0 |
| zustand | ^5.0.15 |
| sonner | ^2.0.8 |
| tailwindcss / @tailwindcss/postcss | ^4.3.3 |
| @biomejs/biome | ^2.6.2 |
| @types/node | ^24 (mengikuti Node 24 runtime) |

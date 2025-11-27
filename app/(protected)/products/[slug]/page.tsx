"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Star, Check, Package } from "lucide-react";
import Link from "next/link";
import { TOAST_MESSAGES } from "@/lib/constants";

type DetailProductPageProps = { params: Promise<{ slug: string }> };

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export default function DetailProductPage({ params }: DetailProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mounted, setMounted] = useState(false);

  const addToCart = useCartStore((s) => s.addToCart);
  const isInCart = useCartStore((s) => s.isInCart);
  const hasHydrated = useCartStore((s) => s._hasHydrated);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    (async () => {
      const { slug } = await params;
      const res = await fetch(`https://dummyjson.com/products/${slug}`);
      const data = await res.json();
      setProduct(data);
      setLoading(false);
    })();
  }, [params]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });

    toast.success(TOAST_MESSAGES.addToCart);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"></div>
          <p className="mt-4 text-sm text-gray-500">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Produk tidak ditemukan</p>
      </div>
    );
  }

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  const productInCart = mounted && hasHydrated ? isInCart(product.id) : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-6xl"
    >
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-green-600 transition hover:text-green-500"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Produk</span>
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square overflow-hidden rounded-xl bg-white shadow-lg"
          >
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square overflow-hidden rounded-lg transition ${
                  selectedImage === idx
                    ? "ring-2 ring-green-600"
                    : "ring-1 ring-gray-200 hover:ring-green-400"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                {product.category}
              </span>
              <span className="text-sm text-gray-500">{product.brand}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.title}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-green-600">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                  -{product.discountPercentage.toFixed(0)}%
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm font-medium text-gray-700">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-400">•</span>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                product.stock > 10 ? "text-green-600" : "text-orange-600"
              }`}
            >
              <Package className="h-4 w-4" />
              <span>
                {product.stock > 10
                  ? `${product.stock} tersedia`
                  : `Hanya ${product.stock} tersisa`}
              </span>
            </span>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-900">
              Deskripsi Produk
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>
          </div>

          <motion.button
            onClick={handleAddToCart}
            disabled={productInCart}
            whileTap={{ scale: 0.97 }}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 text-lg font-semibold text-white shadow-lg transition ${
              productInCart
                ? "cursor-not-allowed bg-gray-400 shadow-gray-400/30"
                : "bg-green-600 shadow-green-600/30 hover:bg-green-500 hover:shadow-xl"
            }`}
          >
            {productInCart ? (
              <>
                <Check className="h-5 w-5" />
                <span>Sudah di Keranjang</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                <span>Tambah ke Keranjang</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

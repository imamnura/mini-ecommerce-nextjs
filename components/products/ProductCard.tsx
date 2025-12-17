"use client";

import type { Product } from "@/lib/types";
import { getMockLocation } from "@/lib/helpers";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { Star, MapPin, ShoppingCart, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TOAST_MESSAGES } from "@/lib/constants";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const addToCart = useCartStore((s) => s.addToCart);
  const isInCart = useCartStore((s) => s.isInCart);
  const hasHydrated = useCartStore((s) => s._hasHydrated);

  const location = getMockLocation(product);

  function handleAddToCart() {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
    toast.success(TOAST_MESSAGES.addToCart);
  }

  const productInCart = hasHydrated ? isInCart(product.id) : false;

  return (
    <motion.article
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:shadow-xl hover:ring-green-500"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square overflow-hidden bg-gray-100"
      >
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
        <div className="absolute left-2 top-2 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-700 backdrop-blur-sm z-10">
          {product.category}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 min-h-10 transition hover:text-green-600">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-xs">
          <span className="text-lg font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-gray-700">{product.rating.toFixed(1)}</span>
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
          <span>{product.brand}</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {location}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={productInCart}
          className={`mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white shadow-sm transition ${productInCart
            ? "cursor-not-allowed bg-gray-400"
            : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {productInCart ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Di Keranjang</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Tambah</span>
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}

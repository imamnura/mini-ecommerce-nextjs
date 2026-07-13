"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileUpload } from "@/components/FileUpload";
import { TOAST_MESSAGES } from "@/lib/constants";
import type { Product } from "@/lib/types";
import { useLocalProductsStore } from "@/store/useLocalProductsStore";

export default function NewProductPage() {
  const router = useRouter();
  const addProduct = useLocalProductsStore((s) => s.addProduct);

  const [categories, setCategories] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch("/api/products/categories")
      .then((res) => res.json())
      .then((data: string[] | { slug: string; name: string }[]) => {
        if (!Array.isArray(data)) return;
        const cats = data.map((cat) =>
          typeof cat === "string" ? cat : cat.slug || cat.name,
        );
        setCategories(cats);
        if (cats.length > 0) setCategory(cats[0]);
      })
      .catch(() => {
        // Biarkan kategori kosong, user tetap bisa mengetik manual lewat fallback di bawah
      });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title || !description || !price || !brand || !category) {
      setError("Semua kolom wajib diisi");
      return;
    }
    if (!imageUrl) {
      setError("Upload gambar produk terlebih dahulu");
      return;
    }

    setSubmitting(true);

    const product: Product = {
      id: Date.now(),
      title,
      description,
      price: Number(price),
      discountPercentage: 0,
      stock: Number(stock) || 0,
      category,
      rating: 0,
      brand,
      thumbnail: imageUrl,
      images: [imageUrl],
    };

    addProduct(product);
    toast.success(TOAST_MESSAGES.addProduct);
    router.push(`/products/${product.id}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl pb-12"
    >
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-green-600 transition hover:text-green-500"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Produk</span>
      </Link>

      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
        Tambah Produk
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FileUpload
          type="product"
          label="Gambar Produk"
          onUploadSuccess={(url) => setImageUrl(url)}
          onUploadError={(err) => setError(err)}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Nama Produk
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Harga ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Stok</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Kategori
            </label>
            {categories.length > 0 ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/30 transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Simpan Produk
        </button>
      </form>
    </motion.div>
  );
}

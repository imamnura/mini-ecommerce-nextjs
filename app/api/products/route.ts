import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";
import type { ProductsResponse } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "12";
  const skip = searchParams.get("skip") || "0";
  const q = searchParams.get("q");

  let url = "";
  if (q) {
    url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(
      q,
    )}&limit=${limit}&skip=${skip}`;
  } else {
    url = `${API_BASE_URL}/products?limit=${limit}&skip=${skip}`;
  }

  const res = await fetch(url);
  const data: ProductsResponse = await res.json();

  return NextResponse.json(data);
}

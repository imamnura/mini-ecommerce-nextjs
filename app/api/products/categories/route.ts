import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

export async function GET() {
  const res = await fetch(`${API_BASE_URL}/products/categories`);
  const categories = await res.json();

  return NextResponse.json(categories);
}

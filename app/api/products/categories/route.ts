import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://dummyjson.com/products/categories");
  const categories = await res.json();

  return NextResponse.json(categories);
}

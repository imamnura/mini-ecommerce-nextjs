import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const res = await fetch(`${API_BASE_URL}/products/${slug}`);

  if (!res.ok) {
    return NextResponse.json(
      { message: "Produk tidak ditemukan" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

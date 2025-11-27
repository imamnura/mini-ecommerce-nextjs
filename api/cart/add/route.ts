import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const me = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/me`, {
    headers: req.headers,
    cache: "no-store",
  });
  const meData = await me.json();

  if (!meData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = meData.user.id;

  const res = await fetch("https://dummyjson.com/carts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      products: [{ id: body.productId, quantity: body.quantity }],
    }),
  });

  const data = await res.json();

  return NextResponse.json(data);
}

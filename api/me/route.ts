import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const token = (req.headers as any).get("cookie")?.match(/token=([^;]+)/)?.[1];
  const userId = (req.headers as any)
    .get("cookie")
    ?.match(/userId=([^;]+)/)?.[1];

  if (!token || !userId) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: Number(userId),
      token,
    },
  });
}

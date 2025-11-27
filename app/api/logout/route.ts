import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set("token", "", { path: "/", maxAge: 0 });
  res.cookies.set("userId", "", { path: "/", maxAge: 0 });
  res.cookies.set("username", "", { path: "/", maxAge: 0 });

  return res;
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: "username and password are required" },
      { status: 400 }
    );
  }

  const res = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  const data = await res.json();

  const response = NextResponse.json({
    user: { id: data.id, username: data.username },
  });

  const token = data.token ?? data.accessToken ?? "";

  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 jam
  });

  response.cookies.set("userId", String(data.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 jam
  });

  return response;
}

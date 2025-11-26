import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/_next", "/favicon.ico"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path)
  );

  const token = req.cookies.get("token")?.value;

  //protect product and chart
  const isProtectedPath =
    pathname.startsWith("/products") || pathname.startsWith("/chart");

  if (isProtectedPath && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  //kalo udah login
  if (pathname === "/login" && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/products";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

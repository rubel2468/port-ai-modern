import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ── Vendor routes ─────────────────────────────────────────────────────────
  if (pathname.startsWith("/vendor")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=/vendor/dashboard", req.url));
    }
    if (token.role !== "hotel_owner" && token.role !== "admin") {
      return NextResponse.redirect(new URL("/?error=unauthorized", req.url));
    }
  }

  // ── Admin routes ──────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=/admin/dashboard", req.url));
    }
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/?error=unauthorized", req.url));
    }
  }

  // ── Customer dashboard routes ─────────────────────────────────────────────
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/booking/checkout")) {
    if (!token) {
      return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${pathname}`, req.url));
    }
  }

  // ── API protection ────────────────────────────────────────────────────────
  if (pathname.startsWith("/api/vendor")) {
    if (!token || (token.role !== "hotel_owner" && token.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (pathname.startsWith("/api/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/vendor/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/booking/checkout/:path*",
    "/api/vendor/:path*",
    "/api/admin/:path*",
  ],
};

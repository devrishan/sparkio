import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyAccessToken } from "@/lib/jwt";

type LegacyUserCookie = {
  role?: string;
};

function parseLegacyUserCookie(cookie?: string): LegacyUserCookie | null {
  if (!cookie) {
    return null;
  }

  try {
    return JSON.parse(cookie);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("earniq_access_token")?.value;
  const legacyToken = request.cookies.get("sparkio_token")?.value;
  const token = accessToken || legacyToken;
  const legacyUser = parseLegacyUserCookie(request.cookies.get("sparkio_user")?.value);

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isMemberRoute = pathname.startsWith("/member");
  const isAdminRoute = pathname.startsWith("/admin");

  // Determine role based on JWT payload or legacy cookie
  let userRole: string | null = null;
  if (accessToken) {
    try {
      const payload = verifyAccessToken(accessToken);
      userRole = payload.role;
    } catch {
      // Invalid/expired token – fall back to legacy cookie if present
      userRole = legacyUser?.role?.toUpperCase() ?? null;
    }
  } else if (legacyUser?.role) {
    userRole = legacyUser.role.toUpperCase();
  }

  if ((isMemberRoute || isAdminRoute) && !token) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (token && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = userRole === "ADMIN" ? "/admin/dashboard" : "/member/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (token && isAdminRoute && userRole !== "ADMIN") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/member/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*", "/admin/:path*", "/login", "/register"],
};


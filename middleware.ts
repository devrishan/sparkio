import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseUserCookie(cookie?: string) {
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
  const token = request.cookies.get("sparkio_token")?.value;
  const user = parseUserCookie(request.cookies.get("sparkio_user")?.value);

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isMemberRoute = pathname.startsWith("/member");
  const isAdminRoute = pathname.startsWith("/admin");

  if ((isMemberRoute || isAdminRoute) && !token) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (token && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = user?.role === "admin" ? "/admin/dashboard" : "/member/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (token && isAdminRoute && user?.role !== "admin") {
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


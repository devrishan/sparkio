import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("earniq_access_token")?.value;
  
  // Fallback to old token for backward compatibility during migration
  const legacyToken = request.cookies.get("sparkio_token")?.value;
  const token = accessToken || legacyToken;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isMemberRoute = pathname.startsWith("/member");
  const isAdminRoute = pathname.startsWith("/admin");

  // Verify token and extract user info
  let userRole: string | null = null;
  if (accessToken) {
    try {
      const payload = verifyAccessToken(accessToken);
      userRole = payload.role;
    } catch {
      // Token invalid, will redirect to login
    }
  }

  // Require authentication for protected routes
  if ((isMemberRoute || isAdminRoute) && !token) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (token && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = userRole === "ADMIN" ? "/admin/dashboard" : "/member/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  // Require admin role for admin routes
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


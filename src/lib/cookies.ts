import { NextResponse } from "next/server";

/**
 * Helper to set secure httpOnly cookies
 */
export function setSecureCookie(
  response: NextResponse,
  name: string,
  value: string,
  options: {
    maxAge?: number; // in seconds
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    path?: string;
  } = {}
): NextResponse {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set(name, value, {
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? isProduction,
    sameSite: options.sameSite ?? "lax",
    maxAge: options.maxAge,
    path: options.path ?? "/",
  });

  return response;
}

/**
 * Clear a cookie by setting it to empty with maxAge 0
 */
export function clearCookie(
  response: NextResponse,
  name: string,
  options: {
    path?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  } = {}
): NextResponse {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set(name, "", {
    maxAge: 0,
    path: options.path ?? "/",
    secure: options.secure ?? isProduction,
    sameSite: options.sameSite ?? "lax",
  });

  return response;
}


import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";

interface ServerFetchOptions extends RequestInit {
  auth?: boolean;
}

export async function serverFetch<T = unknown>(
  path: string,
  { auth = true, headers, ...init }: ServerFetchOptions = {},
): Promise<T> {
  const cookieStore = cookies();
  // Try new token first, fallback to legacy
  const accessToken = cookieStore.get("earniq_access_token")?.value;
  const legacyToken = cookieStore.get("sparkio_token")?.value;
  const token = accessToken || legacyToken;

  // For Next.js API routes, use relative path
  const isNextApiRoute = path.startsWith("/api/");
  const baseUrl = isNextApiRoute ? "" : env.API_BASE_URL;

  const requestHeaders = new Headers({
    "Content-Type": "application/json",
    ...Object.fromEntries(headers ? new Headers(headers) : []),
  });

  if (auth && token && !isNextApiRoute) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: requestHeaders,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API request failed");
  }

  return (await response.json()) as T;
}

export function clearAuthCookies() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "sparkio_token",
    value: "",
    maxAge: 0,
    path: "/",
  });
  response.cookies.set({
    name: "sparkio_user",
    value: "",
    maxAge: 0,
    path: "/",
  });
  return response;
}


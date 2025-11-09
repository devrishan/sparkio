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
  const token = cookieStore.get("sparkio_token")?.value;

  const requestHeaders = new Headers({
    "Content-Type": "application/json",
    ...Object.fromEntries(headers ? new Headers(headers) : []),
  });

  if (auth && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${env.API_BASE_URL}${path}`, {
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


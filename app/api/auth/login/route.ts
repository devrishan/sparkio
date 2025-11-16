import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.email || !body?.password) {
    return NextResponse.json({ success: false, error: "Missing credentials." }, { status: 400 });
  }

  const response = await fetch(`${env.API_BASE_URL}/api/auth/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success || !result?.token) {
    return NextResponse.json(
      { success: false, error: result?.error ?? "Failed to login." },
      { status: response.status || 500 },
    );
  }

  const expiresIn = typeof result.expires_in === "number" ? result.expires_in : 3600;

  const res = NextResponse.json({
    success: true,
    user: result.user,
  });

  res.cookies.set({
    name: "sparkio_token",
    value: result.token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: expiresIn,
    path: "/",
  });

  res.cookies.set({
    name: "sparkio_user",
    value: JSON.stringify(result.user),
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: expiresIn,
    path: "/",
  });

  return res;
}


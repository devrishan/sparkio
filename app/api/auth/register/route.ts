import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.username || !body?.email || !body?.password) {
    return NextResponse.json({ success: false, error: "Missing registration fields." }, { status: 400 });
  }

  const registerResponse = await fetch(`${env.API_BASE_URL}/api/auth/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const registerResult = await registerResponse.json().catch(() => null);

  if (!registerResponse.ok || !registerResult?.success) {
    return NextResponse.json(
      { success: false, error: registerResult?.error ?? "Failed to register." },
      { status: registerResponse.status || 500 },
    );
  }

  const loginResponse = await fetch(`${env.API_BASE_URL}/api/auth/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
  });

  const loginResult = await loginResponse.json().catch(() => null);

  if (!loginResponse.ok || !loginResult?.success || !loginResult?.token) {
    return NextResponse.json(
      { success: false, error: loginResult?.error ?? "Registration succeeded but login failed." },
      { status: loginResponse.status || 500 },
    );
  }

  const expiresIn = typeof loginResult.expires_in === "number" ? loginResult.expires_in : 3600;

  const res = NextResponse.json({
    success: true,
    user: loginResult.user,
  });

  res.cookies.set({
    name: "sparkio_token",
    value: loginResult.token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: expiresIn,
    path: "/",
  });

  res.cookies.set({
    name: "sparkio_user",
    value: JSON.stringify(loginResult.user),
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: expiresIn,
    path: "/",
  });

  return res;
}


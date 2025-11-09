import { NextResponse } from "next/server";

export async function POST() {
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


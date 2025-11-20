import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { serverFetch } from "@/lib/server-api";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("sparkio_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
  }

  try {
    const data = await serverFetch<{ success: boolean; user: unknown }>("/api/auth/me.php");
    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 401 });
  }
}


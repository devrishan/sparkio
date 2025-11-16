import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/src/lib/jwt';
import { prisma } from '@/src/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('earniq_access_token')?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        phone: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error('Session check error', error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

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


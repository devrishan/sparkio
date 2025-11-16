import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken } from '@/src/lib/jwt';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('earniq_refresh_token')?.value;

    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        await prisma.session.updateMany({
          where: { id: payload.sid },
          data: { revokedAt: new Date(), revokedReason: 'user_logout' },
        });
      } catch {
        // ignore invalid token on logout
      }
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set('earniq_access_token', '', { maxAge: 0, path: '/' });
    res.cookies.set('earniq_refresh_token', '', { maxAge: 0, path: '/' });

    return res;
  } catch (error) {
    console.error('Logout error', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

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


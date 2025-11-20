import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signAccessToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('earniq_refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token not found' },
        { status: 401 },
      );
    }

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired refresh token' },
        { status: 401 },
      );
    }

    // Check if session exists and is valid
    const session = await prisma.session.findUnique({
      where: { id: payload.sid },
      include: { user: true },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Session expired or revoked' },
        { status: 401 },
      );
    }

    // Update last activity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivityAt: new Date() },
    });

    // Generate new access token
    const accessToken = signAccessToken({
      sub: session.userId,
      role: session.user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        phone: session.user.phone,
        role: session.user.role,
      },
    });

    // Set new access token cookie
    const accessTtlSeconds = Number(process.env.JWT_ACCESS_TOKEN_TTL_SECONDS ?? 900);
    response.cookies.set('earniq_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessTtlSeconds,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Session refresh error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh session' },
      { status: 500 },
    );
  }
}

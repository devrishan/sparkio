import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/mocks/register
 * Accept registration data and return { user, token, expiresAt }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 },
      );
    }

    // Use existing mock auth service
    const { mockAuthService } = await import('@/lib/mock-data/mock-service');
    
    const registrationData = {
      username: body.username || body.email.split('@')[0],
      email: body.email,
      password: body.password,
      referral_code: body.referral_code || body.referralCode,
    };

    const result = await mockAuthService.register(registrationData);

    if (!result.success || !result.user || !result.token) {
      return NextResponse.json(
        { success: false, error: result.error || 'Registration failed' },
        { status: 400 },
      );
    }

    // Get wallet balance (new users start with 0)
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');
    const wallet = mockDataStore.getWalletByUserId(result.user.id);
    const walletBalance = wallet?.balance ?? 0;

    // Generate expiresAt (30 days from now)
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);

    // Set cookie for session persistence
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        name: result.user.username || result.user.email?.split('@')[0] || 'User',
        email: result.user.email || body.email,
        wallet: walletBalance,
      },
      token: result.token,
      expiresAt: expiresAt,
    });

    // Set cookie with token
    response.cookies.set('mockToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Mock Register] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 },
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/mocks/login
 * Accept { email, password } and return { user, token, expiresAt }
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
    const result = await mockAuthService.login(body.email, body.password);

    if (!result.success || !result.user || !result.token) {
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Get wallet balance
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');
    const wallet = mockDataStore.getWalletByUserId(result.user.id);
    const walletBalance = wallet?.balance ?? 124800;

    // Determine role (ADMIN -> admin, USER -> member)
    const role = result.user.role === 'ADMIN' ? 'admin' : 'member';

    // Generate expiresAt (30 days from now)
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);

    // Set cookie for session persistence
    const cookieStore = cookies();
    
    // Convert user ID to integer format (extract number from 'user_1' -> 1)
    const userId = parseInt(result.user.id.split('_')[1] || '1') || 1;
    
    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: result.user.username || result.user.email?.split('@')[0] || 'User',
        email: result.user.email || body.email,
        role: role,
        wallet: walletBalance,
        referral_code: result.user.referralCode,
      },
      token: result.token,
      expiresAt: expiresAt,
    });

    // Set cookies that middleware expects
    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = 30 * 24 * 60 * 60; // 30 days

    // Set access token cookie (what middleware checks)
    response.cookies.set('earniq_access_token', result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });

    // Set legacy token cookie for backward compatibility
    response.cookies.set('sparkio_token', result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });

    // Set user cookie (what middleware uses to get role)
    const userForCookie = {
      id: userId,
      username: result.user.username || result.user.email?.split('@')[0] || 'user',
      email: result.user.email || body.email,
      role: role, // 'admin' or 'member'
      referral_code: result.user.referralCode,
    };

    response.cookies.set('earniq_user', JSON.stringify(userForCookie), {
      httpOnly: false, // Allow client-side access
      secure: isProduction,
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });

    // Set legacy user cookie
    response.cookies.set('sparkio_user', JSON.stringify(userForCookie), {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });

    // Also set mockToken for backward compatibility with frontend auth library
    response.cookies.set('mockToken', result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Mock Login] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 },
    );
  }
}


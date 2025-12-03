import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/mocks/session
 * Check for mock token and return current session
 * Looks for mockToken in cookies, headers, or query params
 */
export async function GET(request: NextRequest) {
  try {
    // Try to get token from multiple sources
    const cookieStore = cookies();
    const cookieToken = cookieStore.get('mockToken')?.value;
    const headerToken = request.headers.get('x-mock-token');
    const queryToken = request.nextUrl.searchParams.get('token');

    const token = cookieToken || headerToken || queryToken;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No mock token found' },
        { status: 401 },
      );
    }

    // Extract user ID from token (format: mock_jwt_userId_timestamp or mockToken_userId)
    let userId: string | null = null;
    
    if (token.startsWith('mock_jwt_')) {
      // Format: mock_jwt_userId_timestamp
      const withoutPrefix = token.replace('mock_jwt_', '');
      const lastUnderscoreIndex = withoutPrefix.lastIndexOf('_');
      userId = lastUnderscoreIndex > 0 
        ? withoutPrefix.substring(0, lastUnderscoreIndex)
        : withoutPrefix.split('_')[0];
    } else if (token.startsWith('mockToken_')) {
      // Format: mockToken_userId
      userId = token.replace('mockToken_', '');
    }

    if (!userId) {
      // Default to user_2 if can't extract from token
      userId = 'user_2';
    }

    // Import mock data store to get user info
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');
    const user = mockDataStore.getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 },
      );
    }

    // Get wallet balance
    const wallet = mockDataStore.getWalletByUserId(userId);
    const walletBalance = wallet?.balance ?? 124800;

    // Determine role (ADMIN -> admin, USER -> member)
    const role = user.role === 'ADMIN' ? 'admin' : 'member';

    // Return session data matching the specified format
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days from now

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.username || user.email?.split('@')[0] || 'User',
        email: user.email || 'user@example.com',
        role: role,
        wallet: walletBalance,
        referral_code: user.referralCode,
      },
      token: token,
      expiresAt: expiresAt,
    });
  } catch (error) {
    console.error('[Mock Session] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch session' },
      { status: 500 },
    );
  }
}


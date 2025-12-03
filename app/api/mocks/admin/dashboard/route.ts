import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/mocks/admin/dashboard
 * Return admin dashboard mock data: total payouts, fraud blocked, dispute resolution %
 */
export async function GET(request: NextRequest) {
  try {
    // Get userId from token
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

    // Extract user ID from token
    let userId: string | null = null;
    
    if (token.startsWith('mock_jwt_')) {
      const withoutPrefix = token.replace('mock_jwt_', '');
      const lastUnderscoreIndex = withoutPrefix.lastIndexOf('_');
      userId = lastUnderscoreIndex > 0 
        ? withoutPrefix.substring(0, lastUnderscoreIndex)
        : withoutPrefix.split('_')[0];
    } else if (token.startsWith('mockToken_')) {
      userId = token.replace('mockToken_', '');
    }

    if (!userId) {
      userId = 'user_1'; // Default to admin user
    }

    // Import mock data store
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');

    // Get admin-specific mock data
    const totalWithdrawals = mockDataStore.withdrawals.size;
    const totalPayouts = Array.from(mockDataStore.withdrawals.values())
      .filter((w) => w.status === 'APPROVED')
      .reduce((sum, w) => sum + w.amount, 0);

    // Mock fraud blocked count (based on rejected withdrawals)
    const fraudBlocked = Array.from(mockDataStore.withdrawals.values())
      .filter((w) => w.status === 'REJECTED').length;

    // Mock dispute resolution
    const totalDisputes = mockDataStore.withdrawals.size;
    const resolvedDisputes = Array.from(mockDataStore.withdrawals.values())
      .filter((w) => w.status === 'APPROVED' || w.status === 'REJECTED').length;
    const disputeResolutionRate = totalDisputes > 0 
      ? Math.round((resolvedDisputes / totalDisputes) * 100) 
      : 100;

    // Return admin dashboard data
    return NextResponse.json({
      totalPayouts: totalPayouts || 4500000, // Default mock value
      fraudBlocked: fraudBlocked || 23, // Default mock value
      disputeResolutionRate: disputeResolutionRate || 94, // Default mock value (percentage)
      totalUsers: mockDataStore.users.size || 1250,
      totalTasks: mockDataStore.tasks.size || 45,
      activeReferrals: mockDataStore.referrals.size || 320,
    });
  } catch (error) {
    console.error('[Mock Admin Dashboard] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin dashboard data' },
      { status: 500 },
    );
  }
}


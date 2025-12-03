import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/mocks/admin/analytics
 * Return Navi earnings analysis with profit breakdown
 * Navi: 5000 coins = ₹50, user gets ₹40, we keep ₹10
 */
export async function GET(request: NextRequest) {
  try {
    // Get userId from token (admin check)
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

    // Import mock data store
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');
    const { mockMemberService } = await import('@/lib/mock-data/mock-service');

    // Get all referrals (Navi referrals)
    const allReferrals: Array<{
      refId: string;
      userId: string;
      username: string;
      naviCoins: number;
      naviAmount: number;
      userPayout: number;
      ourProfit: number;
      status: 'pending' | 'verified' | 'rejected';
      createdAt: string;
    }> = [];

    // Process each user's referrals
    for (const [userId, user] of mockDataStore.users.entries()) {
      const referralsResult = await mockMemberService.getReferrals(userId);
      
      if (referralsResult.success && referralsResult.data) {
        const referrals = referralsResult.data.referrals || [];
        
        referrals.forEach((ref: any) => {
          // Navi referral: 5000 coins = ₹50
          const naviCoins = 5000;
          const naviAmount = 50; // ₹50 total
          const userPayout = 40; // User gets ₹40
          const ourProfit = 10; // We keep ₹10

          allReferrals.push({
            refId: ref.id,
            userId: ref.referredUserId || userId,
            username: ref.referredUser?.username || user.username || `User ${userId.slice(-4)}`,
            naviCoins,
            naviAmount,
            userPayout,
            ourProfit,
            status: ref.status === 'verified' ? 'verified' : ref.status === 'rejected' ? 'rejected' : 'pending',
            createdAt: ref.createdAt,
          });
        });
      }
    }

    // Calculate summary stats
    const verifiedReferrals = allReferrals.filter((r) => r.status === 'verified');
    const totalNaviReferrals = verifiedReferrals.length;
    const totalOurProfit = verifiedReferrals.reduce((sum, r) => sum + r.ourProfit, 0);
    const totalPaidToUsers = verifiedReferrals.reduce((sum, r) => sum + r.userPayout, 0);
    const avgReferralsPerUser = mockDataStore.users.size > 0 
      ? totalNaviReferrals / mockDataStore.users.size 
      : 0;

    // Constants
    const coinsPerReferral = 5000;
    const userSharePerReferral = 40;
    const ourSharePerReferral = 50;

    return NextResponse.json({
      summary: {
        totalNaviReferrals,
        coinsPerReferral,
        userSharePerReferral,
        ourSharePerReferral,
        totalOurProfit,
        totalPaidToUsers,
        avgReferralsPerUser: Number(avgReferralsPerUser.toFixed(2)),
      },
      breakdown: allReferrals
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 100), // Limit to 100 most recent
    });
  } catch (error) {
    console.error('[Mock Admin Analytics] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 },
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { mockDataStore } from '@/lib/mock-data/fixtures';

/**
 * GET /api/mocks/admin/referrals
 * Return all referrals with Navi profit breakdown
 * Navi referrals: 40₹ to user, 50₹ to us, 10₹ profit
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies();
    const token = cookieStore.get('mockToken')?.value || request.headers.get('x-mock-token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
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
    }

    // Get user to check if admin
    const user = userId ? mockDataStore.getUserById(userId) : null;
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 },
      );
    }

    // Get filter params
    const status = request.nextUrl.searchParams.get('status');
    const dateRange = request.nextUrl.searchParams.get('dateRange');

    // Get all referrals from mock data
    const allReferrals = Array.from(mockDataStore.referrals.values());
    
    // Filter by status if provided
    let filteredReferrals = allReferrals;
    if (status && status !== 'all') {
      filteredReferrals = allReferrals.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    // Get referrer and referred user info
    const referralsWithProfit = filteredReferrals.map((ref) => {
      const referrer = mockDataStore.getUserById(ref.referrerId);
      const referredUser = mockDataStore.getUserById(ref.referredUserId);
      
      // Check if this is a Navi referral (determined by hash of ID for consistency)
      // In real app, this would be based on platform field
      const isNaviReferral = parseInt(ref.id.replace(/\D/g, '')) % 2 === 0; // 50% are Navi

      if (isNaviReferral) {
        // Navi referral: user gets 40₹, we get 50₹, profit is 10₹
        const userReward = 40;
        const ourReward = 50;
        const profit = 10;
        
        return {
          id: ref.id,
          user: {
            id: ref.referrerId,
            username: referrer?.username || `User ${ref.referrerId.slice(-4)}`,
            email: referrer?.email || `user${ref.referrerId.slice(-4)}@example.com`,
          },
          referral: {
            id: ref.referredUserId,
            username: ref.referredUser?.username || referredUser?.username || `User ${ref.referredUserId.slice(-4)}`,
            phone: ref.referredUser?.phone || referredUser?.phone || `xxxxxx${ref.referredUserId.slice(-4)}`,
          },
          status: ref.status.toLowerCase() as 'verified' | 'pending' | 'rejected',
          userReward: userReward,
          ourReward: ourReward,
          profit: profit,
          date: ref.createdAt || new Date().toISOString(),
          platform: 'Navi',
        };
      } else {
        // Regular referral: user gets commission, we get nothing (or different structure)
        const userReward = ref.commissionAmount || 0;
        const ourReward = 0;
        const profit = 0;
        
        return {
          id: ref.id,
          user: {
            id: ref.referrerId,
            username: referrer?.username || `User ${ref.referrerId.slice(-4)}`,
            email: referrer?.email || `user${ref.referrerId.slice(-4)}@example.com`,
          },
          referral: {
            id: ref.referredUserId,
            username: ref.referredUser?.username || referredUser?.username || `User ${ref.referredUserId.slice(-4)}`,
            phone: ref.referredUser?.phone || referredUser?.phone || `xxxxxx${ref.referredUserId.slice(-4)}`,
          },
          status: ref.status.toLowerCase() as 'verified' | 'pending' | 'rejected',
          userReward: userReward,
          ourReward: ourReward,
          profit: profit,
          date: ref.createdAt || new Date().toISOString(),
          platform: 'Other',
        };
      }
    });

    // Calculate summary stats
    const totalUserPayouts = referralsWithProfit
      .filter(r => r.status === 'verified')
      .reduce((sum, r) => sum + r.userReward, 0);
    
    const totalIncoming = referralsWithProfit
      .filter(r => r.status === 'verified')
      .reduce((sum, r) => sum + r.ourReward, 0);
    
    const totalProfit = referralsWithProfit
      .filter(r => r.status === 'verified')
      .reduce((sum, r) => sum + r.profit, 0);

    return NextResponse.json({
      success: true,
      referrals: referralsWithProfit,
      summary: {
        totalUserPayouts,
        totalIncoming,
        totalProfit,
        totalReferrals: referralsWithProfit.length,
        verifiedReferrals: referralsWithProfit.filter(r => r.status === 'verified').length,
        pendingReferrals: referralsWithProfit.filter(r => r.status === 'pending').length,
        rejectedReferrals: referralsWithProfit.filter(r => r.status === 'rejected').length,
      },
    });
  } catch (error) {
    console.error('[Mock Admin Referrals] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch referrals' },
      { status: 500 },
    );
  }
}


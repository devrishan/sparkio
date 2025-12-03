import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/mocks/referrals
 * Return array of referral objects with masked phone numbers
 * Supports filters: status query param (verified, pending, rejected, all)
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
      userId = 'user_2'; // Default user
    }

    // Get status filter
    const statusFilter = request.nextUrl.searchParams.get('status') || 'all';

    // Import mock data store
    const { mockMemberService } = await import('@/lib/mock-data/mock-service');

    // Get referrals
    const referralsResult = await mockMemberService.getReferrals(userId);
    if (!referralsResult.success || !referralsResult.data) {
      return NextResponse.json([]);
    }

    let referrals = referralsResult.data.referrals || [];

    // Filter by status if specified
    if (statusFilter !== 'all') {
      referrals = referrals.filter((r: any) => r.status === statusFilter);
    }

    // Mask phone numbers and format response
    const formattedReferrals = referrals.map((referral: any) => {
      const referredUser = referral.referred_user || referral.referredUser || {};
      const phone = referredUser.phone || '';
      
      // Mask phone: show only last 3 digits (e.g., xxxxxx789)
      let maskedPhone = 'xxxxxx000';
      if (phone && phone.length >= 3) {
        const last3 = phone.slice(-3);
        maskedPhone = `xxxxxx${last3}`;
      }

      // Format name from username or email
      const name = referredUser.username || referredUser.name || 
                   referredUser.email?.split('@')[0] || 
                   `User ${phone.slice(-4)}`;

      return {
        id: referral.id,
        name: name,
        phone: maskedPhone,
        status: referral.status || 'pending',
        reward: referral.commission_amount || referral.commissionAmount || 40,
        createdAt: referral.created_at || referral.createdAt || new Date().toISOString(),
      };
    });

    return NextResponse.json(formattedReferrals);
  } catch (error) {
    console.error('[Mock Referrals] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch referrals' },
      { status: 500 },
    );
  }
}


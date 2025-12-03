import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { getReferralTree, getReferralChain } from '@/lib/referrals';
import { isMockModeEnabled, mockMemberService } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('earniq_access_token')?.value || 
                        cookieStore.get('sparkio_token')?.value;

    // Determine userId and whether to use mock data
    let userId: string = 'user_2'; // Default user
    let useMockData = false;

    // Priority 1: If mock mode is explicitly enabled, always use mock data
    if (isMockModeEnabled()) {
      useMockData = true;
      console.log('[Member Referrals] Mock mode enabled, using mock data');
      // Try to extract userId from mock token if present
      if (accessToken && accessToken.startsWith('mock_jwt_')) {
        const withoutPrefix = accessToken.replace('mock_jwt_', '');
        const lastUnderscoreIndex = withoutPrefix.lastIndexOf('_');
        if (lastUnderscoreIndex > 0) {
          userId = withoutPrefix.substring(0, lastUnderscoreIndex);
        }
      }
    }
    // Priority 2: If no token, use mock data (frontend-only fake auth)
    else if (!accessToken) {
      useMockData = true;
      console.log('[Member Referrals] No auth token, using mock data');
    }
    // Priority 3: If token is a mock token, use mock data
    else if (accessToken.startsWith('mock_jwt_')) {
      useMockData = true;
      console.log('[Member Referrals] Mock token detected, using mock data');
      // Extract userId from mock token
      const withoutPrefix = accessToken.replace('mock_jwt_', '');
      const lastUnderscoreIndex = withoutPrefix.lastIndexOf('_');
      if (lastUnderscoreIndex > 0) {
        userId = withoutPrefix.substring(0, lastUnderscoreIndex);
      }
    }
    // Priority 4: Try to verify real token
    else {
      try {
        const payload = verifyAccessToken(accessToken);
        userId = payload.sub;
        console.log('[Member Referrals] Valid token found, using real data');
        // If verification succeeds, we'll use real data (Prisma)
      } catch (error) {
        // Token verification failed - fall back to mock data
        console.log('[Member Referrals] Token verification failed, falling back to mock data');
        useMockData = true;
      }
    }

    // Use mock data if needed
    if (useMockData) {
      const mockResult = await mockMemberService.getReferrals(userId);
      if (mockResult.success && mockResult.data) {
        // Add chain and tree structure to match expected API response
        return NextResponse.json({
          ...mockResult.data,
          chain: {
            referrer: null,
            direct_referrals: [],
          },
          tree: null,
        });
      }
      // If mock fails, return empty data rather than error
      return NextResponse.json({
        success: true,
        referrals: [],
        stats: {
          total: 0,
          verified: 0,
          pending: 0,
          total_commission: 0,
        },
        chain: {
          referrer: null,
          direct_referrals: [],
        },
        tree: null,
      });
    }

    // Real authentication flow (non-mock mode with valid token)

    // Try Prisma, but fall back to mock if it fails
    try {
      const searchParams = request.nextUrl.searchParams;
      const includeTree = searchParams.get('include_tree') === 'true';

      // Get user's referrals
      const referrals = await prisma.referral.findMany({
      where: {
        referrerId: userId,
      },
      include: {
        referredUser: {
          select: {
            id: true,
            phone: true,
            username: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get referral chain (who referred me, who I referred)
    const chain = await getReferralChain(userId);

    // Get referral tree if requested
    let tree = null;
    if (includeTree) {
      tree = await getReferralTree(userId);
    }

    // Calculate stats
    const totalReferrals = referrals.length;
    const verifiedCount = referrals.filter((r) => r.status === 'verified').length;
    const pendingCount = referrals.filter((r) => r.status === 'pending').length;
    const totalCommission = referrals
      .filter((r) => r.status === 'verified')
      .reduce((sum, r) => sum + Number(r.commissionAmount), 0);

    return NextResponse.json({
      success: true,
      referrals: referrals.map((referral) => ({
        id: referral.id,
        referred_user: {
          id: referral.referredUser.id,
          username: referral.referredUser.username,
          email: referral.referredUser.email,
          phone: referral.referredUser.phone,
          created_at: referral.referredUser.createdAt.toISOString(),
        },
        level: referral.level,
        status: referral.status,
        commission_amount: Number(referral.commissionAmount),
        created_at: referral.createdAt.toISOString(),
        updated_at: referral.updatedAt.toISOString(),
      })),
      stats: {
        total: totalReferrals,
        verified: verifiedCount,
        pending: pendingCount,
        total_commission: totalCommission,
      },
      chain: {
        referrer: chain.referrer,
        direct_referrals: chain.directReferrals,
      },
        tree: tree,
      });
    } catch (prismaError) {
      console.error('[Member Referrals] Prisma error, falling back to mock data:', prismaError);
      // Fall back to mock data
      const mockResult = await mockMemberService.getReferrals(userId);
      if (mockResult.success && mockResult.data) {
        return NextResponse.json(mockResult.data);
      }
      throw prismaError;
    }
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch referrals' },
      { status: 500 },
    );
  }
}


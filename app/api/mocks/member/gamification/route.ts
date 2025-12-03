import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/mocks/member/gamification
 * Return coins, level, XP, nextLevelXP, streakDays, badges
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

    // Import mock data store
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');
    const { mockMemberService } = await import('@/lib/mock-data/mock-service');

    // Get wallet for coins
    const wallet = mockDataStore.getWalletByUserId(userId);
    const coins = wallet?.coins ?? 0;

    // Get referrals and tasks for XP calculation
    const referralsResult = await mockMemberService.getReferrals(userId);
    const submissionsResult = await mockMemberService.getSubmissions(userId);
    
    const verifiedReferrals = referralsResult.success && referralsResult.data
      ? referralsResult.data.referrals?.filter((r: any) => r.status === 'verified').length || 0
      : 0;
    
    const approvedTasks = submissionsResult.success && submissionsResult.data
      ? submissionsResult.data.submissions?.filter((s: any) => s.status === 'APPROVED').length || 0
      : 0;

    // Calculate XP: 100 per verified referral, 50 per approved task
    const currentXP = (verifiedReferrals * 100) + (approvedTasks * 50);
    
    // Determine level based on XP
    // Newbie: 0-999, Pro: 1000-4999, Elite: 5000+
    let level: 'Newbie' | 'Pro' | 'Elite' = 'Newbie';
    let nextLevelXP = 1000;
    
    if (currentXP >= 5000) {
      level = 'Elite';
      nextLevelXP = 10000; // Next milestone
    } else if (currentXP >= 1000) {
      level = 'Pro';
      nextLevelXP = 5000;
    }

    // Calculate streak (mock: random 1-10 days)
    const streakDays = Math.floor(Math.random() * 10) + 1;

    // Generate achievements
    const achievements = [
      {
        id: 'first_referral',
        name: 'First Referral',
        description: 'Get your first verified referral',
        unlocked: verifiedReferrals >= 1,
        icon: '👋',
      },
      {
        id: 'ten_tasks',
        name: 'Task Master',
        description: 'Complete 10 tasks',
        unlocked: approvedTasks >= 10,
        icon: '✅',
      },
      {
        id: 'level_pro',
        name: 'Pro Level',
        description: 'Reach Pro level',
        unlocked: level === 'Pro' || level === 'Elite',
        icon: '⭐',
      },
      {
        id: 'level_elite',
        name: 'Elite Level',
        description: 'Reach Elite level',
        unlocked: level === 'Elite',
        icon: '🏆',
      },
      {
        id: 'five_referrals',
        name: 'Referral Champion',
        description: 'Get 5 verified referrals',
        unlocked: verifiedReferrals >= 5,
        icon: '🎯',
      },
      {
        id: 'streak_week',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        unlocked: streakDays >= 7,
        icon: '🔥',
      },
    ];

    return NextResponse.json({
      coins,
      level,
      currentXP,
      nextLevelXP,
      streakDays,
      achievements,
    });
  } catch (error) {
    console.error('[Mock Gamification] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gamification data' },
      { status: 500 },
    );
  }
}


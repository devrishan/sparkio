import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/mocks/dashboard
 * Return mock dashboard payload: wallet, payoutPulse, referralStats, recentTasks
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

    // Get wallet
    const wallet = mockDataStore.getWalletByUserId(userId);
    const balance = wallet?.balance ?? 124800;
    
    // Calculate today's change (mock: random between -5000 and 15000)
    const todayChange = Math.floor(Math.random() * 20000) - 5000;

    // Get referrals for stats
    const referralsResult = await mockMemberService.getReferrals(userId);
    const referrals = referralsResult.success ? referralsResult.data?.referrals || [] : [];
    const verifiedCount = referrals.filter((r: any) => r.status === 'verified').length;

    // Get tasks
    const tasksResult = await mockMemberService.getTasks();
    const allTasks = tasksResult.success ? tasksResult.data?.tasks || [] : [];
    
    // Get recent submissions for the user to show which tasks are completed
    const submissionsResult = await mockMemberService.getSubmissions(userId);
    const submissions = submissionsResult.success ? submissionsResult.data?.submissions || [] : [];
    
    // Create recent tasks list (3-5 items) with status
    const recentTasks = allTasks.slice(0, 5).map((task: any) => {
      const submission = submissions.find((s: any) => s.taskId === task.id);
      let status = 'pending';
      if (submission) {
        if (submission.status === 'APPROVED') {
          status = 'approved';
        } else if (submission.status === 'REJECTED') {
          status = 'rejected';
        } else {
          status = 'pending';
        }
      }
      
      return {
        id: task.id,
        title: task.title,
        status: status,
        reward: task.reward_amount || task.rewardAmount || 45,
      };
    });

    // Return dashboard data matching the specified format
    return NextResponse.json({
      wallet: {
        balance: balance,
        todayChange: todayChange,
      },
      payoutPulse: {
        avgApprovalTime: '3h 14m',
        fastestWithdrawal: '41s',
        pendingDisputes: 12,
      },
      referralStats: {
        verified: verifiedCount,
        weeklyReleases: 270000, // Mock: total weekly payout amount
      },
      recentTasks: recentTasks,
    });
  } catch (error) {
    console.error('[Mock Dashboard] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 },
    );
  }
}


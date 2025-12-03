import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/mocks/member/tasks/submissions
 * Return user's task submissions with status, reward, proof, timestamps
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
    const statusFilter = request.nextUrl.searchParams.get('status');

    // Import mock data store
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');
    const { mockMemberService } = await import('@/lib/mock-data/mock-service');

    // Get submissions for user
    const submissionsResult = await mockMemberService.getSubmissions(userId);
    if (!submissionsResult.success || !submissionsResult.data) {
      return NextResponse.json({ submissions: [] });
    }

    let submissions = submissionsResult.data.submissions || [];

    // Filter by status if specified
    if (statusFilter) {
      const statusMap: Record<string, string> = {
        'approved': 'APPROVED',
        'pending': 'SUBMITTED',
        'rejected': 'REJECTED',
      };
      const mappedStatus = statusMap[statusFilter.toLowerCase()];
      if (mappedStatus) {
        submissions = submissions.filter((s) => s.status === mappedStatus);
      }
    }

    // Get task details for each submission
    const submissionsWithTasks = submissions.map((submission) => {
      const task = mockDataStore.tasks.get(submission.taskId);
      
      // Map status to frontend format
      let status: 'approved' | 'pending' | 'rejected' = 'pending';
      if (submission.status === 'APPROVED') {
        status = 'approved';
      } else if (submission.status === 'REJECTED') {
        status = 'rejected';
      }

      return {
        id: submission.id,
        taskId: submission.taskId,
        taskTitle: task?.title || 'Unknown Task',
        status,
        reward: task?.reward_amount || 0,
        proofUrl: submission.proofUrl,
        proofType: submission.proofType,
        notes: submission.notes,
        rejectionReason: submission.status === 'REJECTED' ? (submission.notes || 'Proof does not meet requirements') : null,
        submittedAt: submission.submittedAt,
        reviewedAt: submission.reviewedAt,
      };
    });

    // Sort by submittedAt DESC
    submissionsWithTasks.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    // Calculate summary stats
    const stats = {
      total: submissions.length,
      approved: submissions.filter((s) => s.status === 'APPROVED').length,
      pending: submissions.filter((s) => s.status === 'SUBMITTED' || s.status === 'REVIEWING').length,
      rejected: submissions.filter((s) => s.status === 'REJECTED').length,
    };

    return NextResponse.json({
      submissions: submissionsWithTasks,
      stats,
    });
  } catch (error) {
    console.error('[Mock Member Submissions] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 },
    );
  }
}


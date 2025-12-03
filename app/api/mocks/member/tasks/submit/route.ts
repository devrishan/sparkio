import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/mocks/member/tasks/submit
 * Submit a task with proof
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json().catch(() => null);

    if (!body?.taskId || !body?.proofUrl) {
      return NextResponse.json(
        { success: false, error: 'Task ID and proof URL are required' },
        { status: 400 },
      );
    }

    // Import mock data store
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');
    const { mockMemberService } = await import('@/lib/mock-data/mock-service');

    // Verify task exists
    const task = mockDataStore.tasks.get(body.taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 },
      );
    }

    // Submit task
    const result = await mockMemberService.submitTask(
      userId,
      body.taskId,
      body.proofUrl
    );

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to submit task' },
        { status: 400 },
      );
    }

    // Return submission with task details
    return NextResponse.json({
      success: true,
      submission: {
        id: result.data.submission.id,
        taskId: result.data.submission.taskId,
        taskTitle: task.title,
        status: 'pending',
        reward: task.reward_amount,
        proofUrl: result.data.submission.proofUrl,
        proofType: result.data.submission.proofType,
        notes: result.data.submission.notes,
        submittedAt: result.data.submission.submittedAt,
        reviewedAt: null,
      },
    });
  } catch (error) {
    console.error('[Mock Submit Task] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit task' },
      { status: 500 },
    );
  }
}


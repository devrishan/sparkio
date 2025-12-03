import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/mocks/member/tasks
 * Return available tasks by category (UPI & purchase, App referrals, Social tasks)
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

    // Get category filter
    const categoryFilter = request.nextUrl.searchParams.get('category');

    // Import mock data store
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');

    // Get all active tasks
    const allTasks = mockDataStore.getTasks(true);

    // Group tasks by category
    const tasksByCategory: Record<string, typeof allTasks> = {
      'upi-purchase': [],
      'app-referrals': [],
      'social-tasks': [],
    };

    allTasks.forEach((task) => {
      const categoryName = task.category?.slug || task.category?.name?.toLowerCase() || 'social-tasks';
      
      // Map category names to our categories
      if (categoryName.includes('upi') || categoryName.includes('purchase') || categoryName.includes('payment')) {
        tasksByCategory['upi-purchase'].push(task);
      } else if (categoryName.includes('referral') || categoryName.includes('app') || categoryName.includes('install')) {
        tasksByCategory['app-referrals'].push(task);
      } else {
        tasksByCategory['social-tasks'].push(task);
      }
    });

    // If category filter is specified, return only that category
    if (categoryFilter && tasksByCategory[categoryFilter]) {
      return NextResponse.json({
        tasks: tasksByCategory[categoryFilter].map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          category: categoryFilter,
          rewardRange: {
            min: task.reward_amount * 0.8,
            max: task.reward_amount * 1.2,
          },
          rewardAmount: task.reward_amount,
          requirements: `Complete the task and upload proof. ${task.difficulty === 'easy' ? 'Simple and quick!' : task.difficulty === 'medium' ? 'Moderate effort required.' : 'Takes some time but worth it!'}`,
          proofTypes: ['screenshot', 'upi_reference', 'order_id'],
          difficulty: task.difficulty,
          maxSubmissions: task.max_submissions,
          expiresAt: task.expires_at,
        })),
      });
    }

    // Return all tasks grouped by category
    return NextResponse.json({
      categories: {
        'upi-purchase': {
          name: 'UPI & Purchase',
          tasks: tasksByCategory['upi-purchase'].map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            category: 'upi-purchase',
            rewardRange: {
              min: task.reward_amount * 0.8,
              max: task.reward_amount * 1.2,
            },
            rewardAmount: task.reward_amount,
            requirements: `Complete the task and upload proof. ${task.difficulty === 'easy' ? 'Simple and quick!' : task.difficulty === 'medium' ? 'Moderate effort required.' : 'Takes some time but worth it!'}`,
            proofTypes: ['screenshot', 'upi_reference', 'order_id'],
            difficulty: task.difficulty,
            maxSubmissions: task.max_submissions,
            expiresAt: task.expires_at,
          })),
        },
        'app-referrals': {
          name: 'App Referrals',
          tasks: tasksByCategory['app-referrals'].map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            category: 'app-referrals',
            rewardRange: {
              min: task.reward_amount * 0.8,
              max: task.reward_amount * 1.2,
            },
            rewardAmount: task.reward_amount,
            requirements: `Complete the task and upload proof. ${task.difficulty === 'easy' ? 'Simple and quick!' : task.difficulty === 'medium' ? 'Moderate effort required.' : 'Takes some time but worth it!'}`,
            proofTypes: ['screenshot', 'referral_code', 'install_proof'],
            difficulty: task.difficulty,
            maxSubmissions: task.max_submissions,
            expiresAt: task.expires_at,
          })),
        },
        'social-tasks': {
          name: 'Social Tasks',
          tasks: tasksByCategory['social-tasks'].map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            category: 'social-tasks',
            rewardRange: {
              min: task.reward_amount * 0.8,
              max: task.reward_amount * 1.2,
            },
            rewardAmount: task.reward_amount,
            requirements: `Complete the task and upload proof. ${task.difficulty === 'easy' ? 'Simple and quick!' : task.difficulty === 'medium' ? 'Moderate effort required.' : 'Takes some time but worth it!'}`,
            proofTypes: ['screenshot', 'post_url', 'share_proof'],
            difficulty: task.difficulty,
            maxSubmissions: task.max_submissions,
            expiresAt: task.expires_at,
          })),
        },
      },
    });
  } catch (error) {
    console.error('[Mock Member Tasks] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 },
    );
  }
}


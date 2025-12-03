import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/mocks/admin/products/:id/convert
 * Convert a product suggestion to a task
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const productId = params.id;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 },
      );
    }

    // In a real implementation, we would:
    // 1. Get the product suggestion
    // 2. Create a new task from it
    // 3. Update the product status to 'converted'
    // 4. Return the created task

    // For mock, we'll just return a success response with a mock task
    const { generateMockTask } = await import('@/lib/mock-data/generators');

    const mockTask = generateMockTask({
      id: `task_from_product_${productId}`,
      title: `Product Task from ${productId}`,
      reward_amount: 100,
      difficulty: 'medium',
      is_active: true,
    });

    return NextResponse.json({
      success: true,
      task: {
        id: mockTask.id,
        title: mockTask.title,
        description: mockTask.description,
        rewardAmount: mockTask.reward_amount,
        category: mockTask.category,
      },
      message: 'Product suggestion converted to task successfully',
    });
  } catch (error) {
    console.error('[Mock Convert Product] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to convert product to task' },
      { status: 500 },
    );
  }
}


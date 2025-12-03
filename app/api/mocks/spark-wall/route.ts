import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/mocks/spark-wall
 * Return recent events array (earned, withdrew, level_up)
 * Last 50 events sorted by timestamp DESC
 */
export async function GET(request: NextRequest) {
  try {
    // Import mock data store
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');
    const { generateMockSparkEvents } = await import('@/lib/mock-data/generators');

    // Generate mock spark events
    const events = generateMockSparkEvents(50);

    // Format events for frontend
    const formattedEvents = events.map((event) => {
      // Mask user ID (show last 3 digits)
      const userId = event.userId || 'user_123';
      const maskedUserId = userId.length > 3 
        ? `•••${userId.slice(-3)}`
        : `•••${userId}`;

      let message = '';
      let amount: number | null = null;

      switch (event.type) {
        case 'earned':
          amount = event.data?.amount || 40;
          message = `${maskedUserId} earned ₹${amount} from Navi referral`;
          break;
        case 'withdrew':
          amount = event.data?.amount || 120;
          message = `${maskedUserId} withdrew ₹${amount}`;
          break;
        case 'level_up':
          message = `${maskedUserId} reached ${event.data?.level || 'Pro'} level`;
          break;
        case 'task_approved':
          amount = event.data?.reward || 50;
          message = `${maskedUserId} earned ₹${amount} from task completion`;
          break;
        default:
          message = `${maskedUserId} completed an action`;
      }

      return {
        id: event.id,
        type: event.type,
        userId: maskedUserId,
        message,
        amount,
        timestamp: event.createdAt,
      };
    });

    // Sort by timestamp DESC (most recent first)
    formattedEvents.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      events: formattedEvents,
      total: formattedEvents.length,
    });
  } catch (error) {
    console.error('[Mock Spark Wall] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch spark wall events' },
      { status: 500 },
    );
  }
}


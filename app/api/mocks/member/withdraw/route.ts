import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/mocks/member/withdraw - Get withdrawal history
 * POST /api/mocks/member/withdraw - Create withdrawal request
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

    // Get user's withdrawals
    const withdrawals = Array.from(mockDataStore.withdrawals.values())
      .filter((w) => w.userId === userId)
      .map((w) => ({
        id: w.id,
        amount: w.amount,
        upiId: w.upiId,
        status: w.status.toLowerCase() as 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed' | 'cancelled',
        requestedAt: w.requestedAt,
        approvedAt: w.status === 'APPROVED' || w.status === 'COMPLETED' ? w.processedAt : null,
        rejectedAt: w.status === 'REJECTED' ? w.processedAt : null,
        conformanceTime: w.status === 'APPROVED' || w.status === 'COMPLETED' 
          ? (w.processedAt && w.requestedAt 
              ? Math.round((new Date(w.processedAt).getTime() - new Date(w.requestedAt).getTime()) / (1000 * 60)) + ' min'
              : null)
          : null,
        txId: w.txId,
        receiptUrl: w.receiptUrl,
        notes: w.notes,
      }))
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    return NextResponse.json({
      withdrawals,
      total: withdrawals.length,
    });
  } catch (error) {
    console.error('[Mock Withdraw History] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch withdrawal history' },
      { status: 500 },
    );
  }
}

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

    if (!body?.amount || !body?.upiId) {
      return NextResponse.json(
        { success: false, error: 'Amount and UPI ID are required' },
        { status: 400 },
      );
    }

    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount < 100) {
      return NextResponse.json(
        { success: false, error: 'Minimum withdrawal amount is ₹100' },
        { status: 400 },
      );
    }

    // Import mock data store
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');
    const { generateMockWithdrawal } = await import('@/lib/mock-data/generators');

    // Get user and wallet
    const user = mockDataStore.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 },
      );
    }

    const wallet = mockDataStore.getWalletByUserId(userId);
    if (!wallet || wallet.withdrawable < amount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient withdrawable balance' },
        { status: 400 },
      );
    }

    // Create withdrawal request
    const withdrawal = generateMockWithdrawal(userId, user, {
      amount,
      upiId: body.upiId,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      processedAt: null,
      txId: null,
      receiptUrl: null,
      notes: null,
    });

    // Add to store
    mockDataStore.withdrawals.set(withdrawal.id, withdrawal);

    // Update wallet (reduce withdrawable balance)
    wallet.withdrawable -= amount;
    wallet.pendingAmount += amount;

    return NextResponse.json({
      success: true,
      withdrawal: {
        id: withdrawal.id,
        amount: withdrawal.amount,
        upiId: withdrawal.upiId,
        status: 'pending',
        requestedAt: withdrawal.requestedAt,
        approvedAt: null,
        rejectedAt: null,
        conformanceTime: null,
        txId: null,
        receiptUrl: null,
        notes: null,
      },
    });
  } catch (error) {
    console.error('[Mock Withdraw] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create withdrawal request' },
      { status: 500 },
    );
  }
}


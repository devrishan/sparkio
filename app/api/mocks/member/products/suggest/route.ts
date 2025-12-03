import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/mocks/member/products/suggest
 * Accept product suggestion from member
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies();
    const token = cookieStore.get('mockToken')?.value || request.headers.get('x-mock-token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body?.productName || !body?.platform) {
      return NextResponse.json(
        { success: false, error: 'Product name and platform are required' },
        { status: 400 },
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
    }

    if (!userId) {
      userId = 'user_2'; // Default user
    }

    // Create mock product suggestion
    const suggestion = {
      id: `product_${Date.now()}`,
      productName: body.productName,
      platform: body.platform,
      amount: body.amount || null,
      orderId: body.orderId || null,
      proofUrl: body.proofUrl || `https://example.com/proof/${Date.now()}.jpg`,
      status: 'pending' as const,
      suggestedBy: userId,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      suggestion,
      message: 'Product suggestion submitted successfully',
    });
  } catch (error) {
    console.error('[Mock Product Suggest] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit suggestion' },
      { status: 500 },
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/mocks/member/products
 * Return product suggestions for the current user
 */
export async function GET(request: NextRequest) {
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

    // Get status filter
    const statusFilter = request.nextUrl.searchParams.get('status');

    // Generate mock product suggestions for this user
    const platforms = ['Amazon', 'Flipkart', 'Navi', 'Myntra', 'Swiggy', 'Zomato'];
    const statuses: Array<'pending' | 'approved' | 'rejected' | 'converted'> = ['pending', 'approved', 'rejected', 'converted'];
    
    // Create 5-8 mock product suggestions
    const products = Array.from({ length: Math.floor(Math.random() * 4) + 5 }, (_, i) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const amount = Math.floor(Math.random() * 5000) + 100;
      
      return {
        id: `product_${userId}_${i + 1}`,
        productName: `${platform} Product ${i + 1}`,
        platform,
        category: null,
        amount,
        orderId: `ORD${Math.floor(Math.random() * 1000000)}`,
        files: [`https://example.com/proof/${i + 1}.jpg`],
        status,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
      };
    });

    // Filter by status if specified
    let filteredProducts = products;
    if (statusFilter && statusFilter !== 'all') {
      filteredProducts = products.filter((p) => p.status === statusFilter);
    }

    // Sort by createdAt DESC
    filteredProducts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
    });
  } catch (error) {
    console.error('[Mock Member Products] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/mocks/admin/products
 * Return product suggestions with status filters
 */
export async function GET(request: NextRequest) {
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
      userId = 'user_1'; // Default admin
    }

    // Get status filter
    const statusFilter = request.nextUrl.searchParams.get('status');

    // Import mock data store
    const { mockDataStore } = await import('@/lib/mock-data/fixtures');

    // Generate mock product suggestions
    const platforms = ['Amazon', 'Flipkart', 'Navi', 'Myntra', 'Swiggy', 'Zomato'];
    const statuses: Array<'pending' | 'approved' | 'rejected' | 'converted'> = ['pending', 'approved', 'rejected', 'converted'];
    
    // Create mock product suggestions
    const products = Array.from({ length: 15 }, (_, i) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const amount = Math.floor(Math.random() * 5000) + 100;
      
      return {
        id: `product_${i + 1}`,
        productName: `${platform} Product ${i + 1}`,
        platform,
        amount,
        orderId: `ORD${Math.floor(Math.random() * 1000000)}`,
        proofUrl: `https://example.com/proof/${i + 1}.jpg`,
        status,
        suggestedBy: `user_${Math.floor(Math.random() * 5) + 2}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    });

    // Filter by status if specified
    let filteredProducts = products;
    if (statusFilter && statusFilter !== 'all') {
      filteredProducts = products.filter((p) => p.status === statusFilter);
    }

    // Sort by createdAt DESC
    filteredProducts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
      stats: {
        pending: products.filter((p) => p.status === 'pending').length,
        approved: products.filter((p) => p.status === 'approved').length,
        rejected: products.filter((p) => p.status === 'rejected').length,
        converted: products.filter((p) => p.status === 'converted').length,
      },
    });
  } catch (error) {
    console.error('[Mock Admin Products] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('earniq_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthenticated' },
        { status: 401 },
      );
    }

    let userId: string;
    try {
      const payload = verifyAccessToken(accessToken);
      userId = payload.sub;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '20');
    const status = searchParams.get('status');

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        orderBy: {
          requestedAt: 'desc',
        },
        take: perPage,
        skip: (page - 1) * perPage,
      }),
      prisma.withdrawal.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      withdrawals: withdrawals.map((withdrawal) => ({
        id: withdrawal.id,
        amount: Number(withdrawal.amount),
        status: withdrawal.status,
        upi_id: withdrawal.upiId,
        requested_at: withdrawal.requestedAt.toISOString(),
        approved_at: withdrawal.approvedAt?.toISOString() || null,
        paid_at: withdrawal.paidAt?.toISOString() || null,
        rejected_at: withdrawal.rejectedAt?.toISOString() || null,
        receipt_url: withdrawal.receiptUrl || null,
      })),
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching withdrawal history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch withdrawal history' },
      { status: 500 },
    );
  }
}


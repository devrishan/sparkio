import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { Role, WithdrawalStatus, NotificationType } from '@prisma/client';
import { processPayout } from '@/lib/payouts';

export async function PUT(request: NextRequest) {
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
    let userRole: string;
    try {
      const payload = verifyAccessToken(accessToken);
      userId = payload.sub;
      userRole = payload.role;

      // Only admins and payout managers can process
      if (userRole !== Role.ADMIN && userRole !== Role.PAYOUT_MANAGER) {
        return NextResponse.json(
          { success: false, error: 'Forbidden' },
          { status: 403 },
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { withdrawal_id, new_status, tx_id, receipt_url, notes } = body;

    if (!withdrawal_id || !new_status) {
      return NextResponse.json(
        { success: false, error: 'withdrawal_id and new_status are required' },
        { status: 400 },
      );
    }

    const validStatuses: WithdrawalStatus[] = ['APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'FAILED'];
    if (!validStatuses.includes(new_status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 },
      );
    }

    // Get withdrawal with user and wallet
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawal_id },
      include: {
        user: {
          include: {
            wallet: true,
          },
        },
      },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { success: false, error: 'Withdrawal not found' },
        { status: 404 },
      );
    }

    if (withdrawal.status !== 'PENDING' && withdrawal.status !== 'APPROVED') {
      return NextResponse.json(
        { success: false, error: 'Only pending or approved withdrawals can be updated' },
        { status: 400 },
      );
    }

    // Process payout if approved (outside transaction to avoid long-running external calls)
    if (new_status === 'APPROVED') {
      const payoutResult = await processPayout({
        amount: Number(withdrawal.amount),
        upiId: withdrawal.upiId,
        userId: withdrawal.userId,
        withdrawalId: withdrawal.id,
        name: withdrawal.user.username || undefined,
        phone: withdrawal.user.phone,
      });

      if (payoutResult.success && payoutResult.payoutId) {
        // Update status based on payout result
        if (payoutResult.status === 'SUCCESS') {
          new_status = 'COMPLETED';
        } else {
          new_status = 'PROCESSING';
        }
        tx_id = payoutResult.txId || payoutResult.payoutId;
      } else {
        // Payout initiation failed
        new_status = 'FAILED';
        notes = payoutResult.failureReason || 'Payout initiation failed';
      }
    }

    // Process withdrawal
    const updatedWithdrawal = await prisma.$transaction(async (tx) => {
      // Update withdrawal status
      const updated = await tx.withdrawal.update({
        where: { id: withdrawal_id },
        data: {
          status: new_status,
          processedAt: new_status === 'COMPLETED' || new_status === 'FAILED' ? new Date() : withdrawal.processedAt,
          txId: tx_id || withdrawal.txId,
          receiptUrl: receipt_url || withdrawal.receiptUrl,
          notes: notes || withdrawal.notes,
        },
      });

      // Handle wallet updates based on status
      if (withdrawal.user.wallet) {
        if (new_status === 'COMPLETED') {
          // Withdrawal completed - already deducted from withdrawable, just update pending
          await tx.wallet.update({
            where: { id: withdrawal.user.wallet.id },
            data: {
              pendingAmount: { decrement: Number(withdrawal.amount) },
            },
          });
        } else if (new_status === 'FAILED' || new_status === 'REJECTED') {
          // Withdrawal failed - refund to withdrawable
          await tx.wallet.update({
            where: { id: withdrawal.user.wallet.id },
            data: {
              pendingAmount: { decrement: Number(withdrawal.amount) },
              withdrawable: { increment: Number(withdrawal.amount) },
            },
          });

          // Create refund transaction
          await tx.walletTransaction.create({
            data: {
              userId: withdrawal.userId,
              walletId: withdrawal.user.wallet.id,
              amount: Number(withdrawal.amount),
              type: 'WITHDRAWAL_REFUND',
              metadata: {
                withdrawalId: withdrawal.id,
                reason: new_status === 'FAILED' ? 'Payout failed' : 'Withdrawal rejected',
              },
            },
          });
        }
      }

      // Create notification
      let notificationTitle = 'Withdrawal Update';
      let notificationBody = `Your withdrawal request of ₹${withdrawal.amount} has been ${new_status.toLowerCase()}.`;

      if (new_status === 'COMPLETED') {
        notificationBody = `Your withdrawal of ₹${withdrawal.amount} has been processed successfully!`;
      } else if (new_status === 'FAILED' || new_status === 'REJECTED') {
        notificationBody = `Your withdrawal request of ₹${withdrawal.amount} has been ${new_status.toLowerCase()}.${notes ? ` Reason: ${notes}` : ''}`;
      }

      await tx.notification.create({
        data: {
          userId: withdrawal.userId,
          type: NotificationType.WITHDRAWAL_UPDATE,
          title: notificationTitle,
          body: notificationBody,
          data: {
            withdrawalId: withdrawal.id,
            amount: Number(withdrawal.amount),
            status: new_status,
            txId: tx_id,
          },
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: 'Withdrawal updated successfully',
      withdrawal_id: withdrawal_id,
      status: new_status,
      processed_at: updatedWithdrawal.processedAt?.toISOString() || null,
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process withdrawal',
      },
      { status: 500 },
    );
  }
}

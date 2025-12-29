// Shared type definitions to avoid Prisma client generation issues
// These mirror the Prisma schema enums

export type Role = 'USER' | 'ADMIN' | 'VERIFIER' | 'PAYOUT_MANAGER';

export type SubmissionStatus = 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'DELETED';

export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type NotificationType = 
  | 'TASK_APPROVED' 
  | 'TASK_REJECTED' 
  | 'WITHDRAWAL_UPDATE' 
  | 'REFERRAL_VERIFIED' 
  | 'RANK_UPGRADE' 
  | 'STREAK_WARNING' 
  | 'EMAIL_VERIFICATION' 
  | 'PASSWORD_RESET';

export type Rank = 'NEWBIE' | 'PRO' | 'ELITE' | 'MASTER';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, any> | null;
  isRead: boolean;
  createdAt: Date;
  readAt: Date | null;
}

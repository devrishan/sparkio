/**
 * Type definitions for mock data
 */

export type MockUser = {
  id: string;
  phone: string;
  email: string | null;
  username: string | null;
  role: 'USER' | 'ADMIN' | 'VERIFIER' | 'PAYOUT_MANAGER';
  referralCode: string;
  referredById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MockWallet = {
  id: string;
  userId: string;
  balance: number;
  pendingAmount: number;
  withdrawable: number;
  lockedAmount: number;
  coins: number;
  totalEarned: number;
  currency: string;
};

export type MockReferral = {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredUser: {
    id: string;
    username: string | null;
    email: string | null;
    phone: string;
    createdAt: string;
  };
  level: number;
  commissionAmount: number;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
};

export type MockTask = {
  id: string;
  title: string;
  slug: string;
  description: string;
  reward_amount: number;
  reward_coins: number;
  difficulty: string;
  is_active: boolean;
  max_submissions: number | null;
  expires_at: string | null;
  created_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

export type MockTaskSubmission = {
  id: string;
  taskId: string;
  userId: string;
  status: 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'DELETED';
  proofUrl: string;
  proofType: string | null;
  notes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
};

export type MockWithdrawal = {
  id: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  upiId: string;
  upiQrUrl: string | null;
  requestedAt: string;
  processedAt: string | null;
  txId: string | null;
  receiptUrl: string | null;
  notes: string | null;
  user: {
    username: string | null;
    email: string | null;
    phone: string;
  };
};

export type MockDashboard = {
  wallet: {
    balance: number;
    total_earned: number;
  };
  referrals: {
    total: number;
    verified: number;
    pending: number;
    success_rate: number;
  };
  top_referrers: Array<{
    username: string;
    referral_code: string;
    verified_referrals: number;
    total_earned: number;
  }>;
};

export type MockAdminDashboard = {
  users: {
    total: number;
    active: number;
    new_today: number;
    growth_percentage: number;
  };
  payouts: {
    total_paid: number;
    pending_amount: number;
    completed_count: number;
    pending_count: number;
  };
  earnings: {
    total_revenue: number;
    commission_paid: number;
    net_profit: number;
  };
  recent_activity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
};

export type MockSparkEvent = {
  id: string;
  type: string;
  message: string;
  data: Record<string, unknown> | null;
  createdAt: string;
};


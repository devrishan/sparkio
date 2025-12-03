/**
 * Mock Data Generators
 * Generate realistic mock data for development
 */

import type {
  MockUser,
  MockWallet,
  MockReferral,
  MockTask,
  MockTaskSubmission,
  MockWithdrawal,
  MockDashboard,
  MockAdminDashboard,
  MockSparkEvent,
} from './types';

/**
 * Generate a random string ID (CUID-like)
 */
function generateId(): string {
  return `cl${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Generate a random referral code
 */
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/**
 * Generate a random phone number
 */
function generatePhone(): string {
  const prefixes = ['+91', '+91'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  return `${prefix}${number}`;
}

/**
 * Generate a random email
 */
function generateEmail(username?: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const user = username || `user${Math.floor(Math.random() * 10000)}`;
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${user}@${domain}`;
}

/**
 * Generate a random date within the last N days
 */
function randomDate(daysAgo: number = 30): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

/**
 * Generate a random number within range
 */
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random decimal within range
 */
function randomDecimal(min: number, max: number, decimals: number = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

/**
 * Generate a random item from array
 */
function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Generate a mock user
 */
export function generateMockUser(overrides?: Partial<MockUser>): MockUser {
  const username = `user${Math.floor(Math.random() * 1000)}`;
  return {
    id: generateId(),
    phone: generatePhone(),
    email: generateEmail(username),
    username,
    role: 'USER',
    referralCode: generateReferralCode(),
    referredById: null,
    createdAt: randomDate(60),
    updatedAt: randomDate(7),
    ...overrides,
  };
}

/**
 * Generate a mock wallet
 */
export function generateMockWallet(userId: string, overrides?: Partial<MockWallet>): MockWallet {
  const balance = randomDecimal(100, 5000);
  const totalEarned = randomDecimal(500, 10000);
  const pendingAmount = randomDecimal(0, balance * 0.3);
  const withdrawable = balance - pendingAmount;
  
  return {
    id: generateId(),
    userId,
    balance,
    pendingAmount,
    withdrawable,
    lockedAmount: randomDecimal(0, 500),
    coins: randomNumber(0, 1000),
    totalEarned,
    currency: 'INR',
    ...overrides,
  };
}

/**
 * Generate a mock referral
 */
export function generateMockReferral(
  referrerId: string,
  referredUser: MockUser,
  overrides?: Partial<MockReferral>
): MockReferral {
  return {
    id: generateId(),
    referrerId,
    referredUserId: referredUser.id,
    referredUser: {
      id: referredUser.id,
      username: referredUser.username,
      email: referredUser.email,
      phone: referredUser.phone,
      createdAt: referredUser.createdAt,
    },
    level: randomNumber(1, 3),
    commissionAmount: randomDecimal(10, 500),
    status: randomItem(['pending', 'verified', 'rejected'] as const),
    createdAt: randomDate(30),
    updatedAt: randomDate(7),
    ...overrides,
  };
}

/**
 * Generate a mock task
 */
export function generateMockTask(overrides?: Partial<MockTask>): MockTask {
  const categories = [
    { id: generateId(), name: 'Social Media', slug: 'social-media' },
    { id: generateId(), name: 'E-commerce', slug: 'ecommerce' },
    { id: generateId(), name: 'Product Review', slug: 'product-review' },
    { id: generateId(), name: 'App Installation', slug: 'app-installation' },
    { id: generateId(), name: 'Survey', slug: 'survey' },
  ];
  
  const category = randomItem(categories);
  const difficulties = ['easy', 'medium', 'hard'];
  const titles = [
    'Follow us on Instagram',
    'Leave a product review on Amazon',
    'Install and rate our mobile app',
    'Complete a short survey',
    'Share our post on Facebook',
    'Write a blog post review',
    'Subscribe to our YouTube channel',
    'Join our Telegram group',
  ];
  
  return {
    id: generateId(),
    title: randomItem(titles),
    slug: `${randomItem(titles).toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`,
    description: 'Complete this task to earn rewards. Follow the instructions carefully and submit proof of completion.',
    reward_amount: randomDecimal(10, 200),
    reward_coins: randomNumber(10, 100),
    difficulty: randomItem(difficulties),
    is_active: Math.random() > 0.2,
    max_submissions: Math.random() > 0.5 ? randomNumber(100, 1000) : null,
    expires_at: Math.random() > 0.3 ? new Date(Date.now() + randomNumber(1, 30) * 24 * 60 * 60 * 1000).toISOString() : null,
    created_at: randomDate(60),
    category,
    ...overrides,
  };
}

/**
 * Generate a mock task submission
 */
export function generateMockTaskSubmission(
  taskId: string,
  userId: string,
  overrides?: Partial<MockTaskSubmission>
): MockTaskSubmission {
  const statuses: MockTaskSubmission['status'][] = ['SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED'];
  const status = randomItem(statuses);
  const submittedAt = randomDate(14);
  
  return {
    id: generateId(),
    taskId,
    userId,
    status,
    proofUrl: `https://example.com/proof/${generateId()}.jpg`,
    proofType: 'image/jpeg',
    notes: status === 'REJECTED' ? 'Proof does not meet requirements' : null,
    submittedAt,
    reviewedAt: status !== 'SUBMITTED' ? randomDate(7) : null,
    ...overrides,
  };
}

/**
 * Generate a mock withdrawal
 */
export function generateMockWithdrawal(
  userId: string,
  user: MockUser,
  overrides?: Partial<MockWithdrawal>
): MockWithdrawal {
  const statuses: MockWithdrawal['status'][] = ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED'];
  const status = randomItem(statuses);
  const requestedAt = randomDate(7);
  
  return {
    id: generateId(),
    userId,
    amount: randomDecimal(100, 2000),
    status,
    upiId: `${user.username || 'user'}@paytm`,
    upiQrUrl: `https://example.com/qr/${generateId()}.png`,
    requestedAt,
    processedAt: status === 'COMPLETED' ? randomDate(3) : null,
    txId: status === 'COMPLETED' ? `TXN${Math.floor(Math.random() * 1000000)}` : null,
    receiptUrl: status === 'COMPLETED' ? `https://example.com/receipt/${generateId()}.pdf` : null,
    notes: status === 'REJECTED' ? 'Invalid UPI ID' : null,
    user: {
      username: user.username,
      email: user.email,
      phone: user.phone,
    },
    ...overrides,
  };
}

/**
 * Generate a mock dashboard data
 */
export function generateMockDashboard(userId: string, wallet: MockWallet, referrals: MockReferral[]): MockDashboard {
  const totalReferrals = referrals.length;
  const verifiedCount = referrals.filter((r) => r.status === 'verified').length;
  const pendingCount = referrals.filter((r) => r.status === 'pending').length;
  const successRate = totalReferrals > 0 ? (verifiedCount / totalReferrals) * 100 : 0;
  
  // Generate top referrers
  const topReferrers = Array.from({ length: 5 }, () => {
    const user = generateMockUser();
    return {
      username: user.username || user.phone,
      referral_code: user.referralCode,
      verified_referrals: randomNumber(5, 50),
      total_earned: randomDecimal(1000, 10000),
    };
  }).sort((a, b) => b.verified_referrals - a.verified_referrals);
  
  return {
    wallet: {
      balance: wallet.balance,
      total_earned: wallet.totalEarned,
    },
    referrals: {
      total: totalReferrals,
      verified: verifiedCount,
      pending: pendingCount,
      success_rate: Number(successRate.toFixed(2)),
    },
    top_referrers: topReferrers,
  };
}

/**
 * Generate a mock admin dashboard
 */
export function generateMockAdminDashboard(): MockAdminDashboard {
  return {
    users: {
      total: randomNumber(1000, 10000),
      active: randomNumber(500, 5000),
      new_today: randomNumber(10, 100),
      growth_percentage: randomDecimal(5, 25),
    },
    payouts: {
      total_paid: randomDecimal(50000, 500000),
      pending_amount: randomDecimal(5000, 50000),
      completed_count: randomNumber(100, 1000),
      pending_count: randomNumber(10, 100),
    },
    earnings: {
      total_revenue: randomDecimal(100000, 1000000),
      commission_paid: randomDecimal(50000, 500000),
      net_profit: randomDecimal(50000, 500000),
    },
    recent_activity: Array.from({ length: 10 }, (_, i) => ({
      id: generateId(),
      type: randomItem(['withdrawal', 'referral', 'submission', 'user_registration']),
      message: randomItem([
        'New withdrawal request received',
        'Referral verified',
        'Task submission approved',
        'New user registered',
      ]),
      timestamp: randomDate(1),
    })),
  };
}

/**
 * Generate mock spark events
 */
export function generateMockSparkEvents(count: number = 20): MockSparkEvent[] {
  const eventTypes = [
    { type: 'task_completed', message: 'completed a task' },
    { type: 'referral_verified', message: 'verified a new referral' },
    { type: 'withdrawal_processed', message: 'processed a withdrawal' },
    { type: 'badge_earned', message: 'earned a new badge' },
    { type: 'rank_upgraded', message: 'upgraded their rank' },
  ];
  
  return Array.from({ length: count }, () => {
    const event = randomItem(eventTypes);
    return {
      id: generateId(),
      type: event.type,
      message: `${generateMockUser().username || 'User'} ${event.message}`,
      data: { userId: generateId() },
      createdAt: randomDate(1),
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}


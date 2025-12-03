/**
 * Mock Data Fixtures
 * Pre-defined mock data sets for consistent testing
 */

import type {
  MockUser,
  MockWallet,
  MockReferral,
  MockTask,
  MockTaskSubmission,
  MockWithdrawal,
} from './types';
import {
  generateMockUser,
  generateMockWallet,
  generateMockReferral,
  generateMockTask,
  generateMockTaskSubmission,
  generateMockWithdrawal,
} from './generators';

/**
 * Default mock users for testing
 */
export const mockUsers: MockUser[] = [
  generateMockUser({
    id: 'user_1',
    username: 'admin_user',
    email: 'admin@earniq.app',
    role: 'ADMIN',
    referralCode: 'ADMIN001',
  }),
  generateMockUser({
    id: 'user_2',
    username: 'john_doe',
    email: 'john@example.com',
    referralCode: 'JOHN001',
  }),
  generateMockUser({
    id: 'user_3',
    username: 'jane_smith',
    email: 'jane@example.com',
    referralCode: 'JANE001',
    referredById: 'user_2',
  }),
  ...Array.from({ length: 10 }, () => generateMockUser()),
];

/**
 * Default mock wallets
 */
export const mockWallets: MockWallet[] = mockUsers.map((user) =>
  generateMockWallet(user.id, {
    userId: user.id,
    balance: user.id === 'user_1' ? 5000 : Math.random() * 3000,
    totalEarned: user.id === 'user_1' ? 15000 : Math.random() * 8000,
  })
);

/**
 * Default mock referrals
 */
export const mockReferrals: MockReferral[] = [
  generateMockReferral(mockUsers[1].id, mockUsers[2], {
    status: 'verified',
    commissionAmount: 250,
  }),
  generateMockReferral(mockUsers[1].id, mockUsers[3], {
    status: 'pending',
    commissionAmount: 150,
  }),
  ...mockUsers.slice(4, 8).map((user) =>
    generateMockReferral(mockUsers[1].id, user, {
      status: Math.random() > 0.5 ? 'verified' : 'pending',
    })
  ),
];

/**
 * Default mock tasks
 */
export const mockTasks: MockTask[] = [
  generateMockTask({
    id: 'task_1',
    title: 'Follow us on Instagram',
    reward_amount: 50,
    difficulty: 'easy',
    is_active: true,
  }),
  generateMockTask({
    id: 'task_2',
    title: 'Leave a product review on Amazon',
    reward_amount: 150,
    difficulty: 'medium',
    is_active: true,
  }),
  generateMockTask({
    id: 'task_3',
    title: 'Install and rate our mobile app',
    reward_amount: 100,
    difficulty: 'easy',
    is_active: true,
  }),
  generateMockTask({
    id: 'task_4',
    title: 'Complete a short survey',
    reward_amount: 75,
    difficulty: 'easy',
    is_active: true,
  }),
  generateMockTask({
    id: 'task_5',
    title: 'Write a detailed blog post',
    reward_amount: 300,
    difficulty: 'hard',
    is_active: true,
  }),
  ...Array.from({ length: 15 }, () => generateMockTask()),
];

/**
 * Default mock task submissions
 */
export const mockTaskSubmissions: MockTaskSubmission[] = [
  generateMockTaskSubmission(mockTasks[0].id, mockUsers[1].id, {
    status: 'APPROVED',
  }),
  generateMockTaskSubmission(mockTasks[1].id, mockUsers[1].id, {
    status: 'REVIEWING',
  }),
  generateMockTaskSubmission(mockTasks[2].id, mockUsers[2].id, {
    status: 'APPROVED',
  }),
  generateMockTaskSubmission(mockTasks[3].id, mockUsers[2].id, {
    status: 'REJECTED',
  }),
  ...mockUsers.slice(1, 5).flatMap((user) =>
    mockTasks.slice(0, 3).map((task) =>
      generateMockTaskSubmission(task.id, user.id, {
        status: Math.random() > 0.3 ? 'APPROVED' : 'REVIEWING',
      })
    )
  ),
];

/**
 * Default mock withdrawals
 */
export const mockWithdrawals: MockWithdrawal[] = [
  generateMockWithdrawal(mockUsers[1].id, mockUsers[1], {
    status: 'PENDING',
    amount: 500,
  }),
  generateMockWithdrawal(mockUsers[2].id, mockUsers[2], {
    status: 'PROCESSING',
    amount: 1000,
  }),
  generateMockWithdrawal(mockUsers[3].id, mockUsers[3], {
    status: 'COMPLETED',
    amount: 750,
  }),
  generateMockWithdrawal(mockUsers[4].id, mockUsers[4], {
    status: 'REJECTED',
    amount: 200,
  }),
  ...mockUsers.slice(5, 10).map((user) =>
    generateMockWithdrawal(user.id, user, {
      status: Math.random() > 0.5 ? 'PENDING' : 'COMPLETED',
    })
  ),
];

/**
 * Get mock data store (simulates database)
 */
export class MockDataStore {
  users: Map<string, MockUser>;
  wallets: Map<string, MockWallet>;
  referrals: Map<string, MockReferral>;
  tasks: Map<string, MockTask>;
  submissions: Map<string, MockTaskSubmission>;
  withdrawals: Map<string, MockWithdrawal>;

  constructor() {
    this.users = new Map(mockUsers.map((u) => [u.id, u]));
    this.wallets = new Map(mockWallets.map((w) => [w.userId, w]));
    this.referrals = new Map(mockReferrals.map((r) => [r.id, r]));
    this.tasks = new Map(mockTasks.map((t) => [t.id, t]));
    this.submissions = new Map(mockTaskSubmissions.map((s) => [s.id, s]));
    this.withdrawals = new Map(mockWithdrawals.map((w) => [w.id, w]));
  }

  getUserById(id: string): MockUser | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): MockUser | undefined {
    const normalizedEmail = email?.toLowerCase().trim();
    return Array.from(this.users.values()).find((u) => 
      u.email?.toLowerCase().trim() === normalizedEmail
    );
  }

  getUserByPhone(phone: string): MockUser | undefined {
    return Array.from(this.users.values()).find((u) => u.phone === phone);
  }

  getWalletByUserId(userId: string): MockWallet | undefined {
    return this.wallets.get(userId);
  }

  getReferralsByReferrerId(referrerId: string): MockReferral[] {
    return Array.from(this.referrals.values()).filter((r) => r.referrerId === referrerId);
  }

  getTasks(active?: boolean): MockTask[] {
    const tasks = Array.from(this.tasks.values());
    if (active !== undefined) {
      return tasks.filter((t) => t.is_active === active);
    }
    return tasks;
  }

  getSubmissionsByUserId(userId: string): MockTaskSubmission[] {
    return Array.from(this.submissions.values()).filter((s) => s.userId === userId);
  }

  getSubmissionsByTaskId(taskId: string): MockTaskSubmission[] {
    return Array.from(this.submissions.values()).filter((s) => s.taskId === taskId);
  }

  getWithdrawalsByUserId(userId: string): MockWithdrawal[] {
    return Array.from(this.withdrawals.values()).filter((w) => w.userId === userId);
  }

  getAllWithdrawals(status?: string): MockWithdrawal[] {
    const withdrawals = Array.from(this.withdrawals.values());
    if (status) {
      return withdrawals.filter((w) => w.status === status);
    }
    return withdrawals;
  }
}

/**
 * Singleton instance of mock data store
 */
export const mockDataStore = new MockDataStore();


/**
 * Mock Service
 * Provides mock API responses that match the real API structure
 */

import { mockDataStore } from './fixtures';
import { generateMockDashboard, generateMockAdminDashboard, generateMockSparkEvents } from './generators';
import type {
  MockDashboard,
  MockAdminDashboard,
  MockUser,
  MockWallet,
  MockReferral,
  MockTask,
  MockTaskSubmission,
  MockWithdrawal,
} from './types';

/**
 * Check if mock mode is enabled
 */
export function isMockModeEnabled(): boolean {
  if (typeof window !== 'undefined') {
    // Client-side: check URL param or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mock') === 'true') return true;
    try {
      return localStorage.getItem('mock_mode') === 'true';
    } catch {
      return false;
    }
  }
  // Server-side: check environment variable
  return process.env.USE_MOCK_DATA === 'true';
}

/**
 * Mock authentication service
 */
export class MockAuthService {
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; user?: MockUser; error?: string }> {
    // For demo purposes, accept any credentials
    // In real implementation, you'd validate credentials
    
    // Normalize email for comparison
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check for admin emails first (case-insensitive)
    const isAdminEmail = normalizedEmail === 'admin@earniq.app' || 
                         normalizedEmail.includes('admin@') ||
                         normalizedEmail.startsWith('admin');
    
    let user: MockUser | undefined;
    
    if (isAdminEmail) {
      // Try to get admin user by email first
      user = mockDataStore.getUserByEmail('admin@earniq.app');
      // If not found by email, get by ID
      if (!user) {
        user = mockDataStore.getUserById('user_1');
      }
      // If still not found, create admin user
      if (!user) {
        user = {
          id: 'user_1',
          phone: '+911234567890',
          email: 'admin@earniq.app',
          username: 'admin_user',
          role: 'ADMIN' as const,
          referralCode: 'ADMIN001',
          referredById: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        // Add to store
        mockDataStore.users.set('user_1', user);
      }
    } else {
      // Try to find user by email
      user = mockDataStore.getUserByEmail(normalizedEmail);
      
      // If not found, use default demo user
      if (!user) {
        user = mockDataStore.getUserById('user_2');
        if (!user) {
          // Create a temporary demo user
          user = {
            id: 'user_2',
            phone: '+911234567890',
            email: normalizedEmail,
            username: normalizedEmail.split('@')[0],
            role: 'USER' as const,
            referralCode: 'DEMO001',
            referredById: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          mockDataStore.users.set('user_2', user);
        }
      }
    }
    
    // Ensure user is defined
    if (!user) {
      return { success: false, error: 'Failed to create or find user' };
    }
    
    // Generate mock JWT token (in real app, this would be signed properly)
    const token = `mock_jwt_${user.id}_${Date.now()}`;
    
    console.log('[MockAuth] Login successful:', {
      email: normalizedEmail,
      userId: user.id,
      role: user.role,
      isAdmin: user.role === 'ADMIN',
    });
    
    return {
      success: true,
      token,
      user,
    };
  }

  async register(data: { username: string; email: string; password: string; referral_code?: string }): Promise<{
    success: boolean;
    token?: string;
    user?: MockUser;
    error?: string;
  }> {
    const existingUser = mockDataStore.getUserByEmail(data.email);
    
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    // Generate new user (in real app, this would be saved to database)
    const newUser: MockUser = {
      id: `user_${Date.now()}`,
      phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      email: data.email,
      username: data.username,
      role: 'USER',
      referralCode: data.username.toUpperCase().substring(0, 8),
      referredById: data.referral_code ? mockDataStore.getUserById(data.referral_code)?.id || null : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const token = `mock_jwt_${newUser.id}_${Date.now()}`;
    
    return {
      success: true,
      token,
      user: newUser,
    };
  }

  async getCurrentUser(token: string): Promise<{ success: boolean; user?: MockUser }> {
    // Extract user ID from mock token
    const userId = token.split('_')[2];
    const user = mockDataStore.getUserById(userId);
    
    if (!user) {
      return { success: false };
    }

    return { success: true, user };
  }
}

/**
 * Mock member service
 */
export class MockMemberService {
  async getDashboard(userId: string): Promise<{ success: boolean; data?: MockDashboard; error?: string }> {
    const wallet = mockDataStore.getWalletByUserId(userId);
    if (!wallet) {
      return { success: false, error: 'Wallet not found' };
    }

    const referrals = mockDataStore.getReferralsByReferrerId(userId);
    const dashboard = generateMockDashboard(userId, wallet, referrals);

    return {
      success: true,
      data: dashboard,
    };
  }

  async getReferrals(userId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const referrals = mockDataStore.getReferralsByReferrerId(userId);
    const totalReferrals = referrals.length;
    const verifiedCount = referrals.filter((r) => r.status === 'verified').length;
    const pendingCount = referrals.filter((r) => r.status === 'pending').length;
    const totalCommission = referrals
      .filter((r) => r.status === 'verified')
      .reduce((sum, r) => sum + r.commissionAmount, 0);

    return {
      success: true,
      data: {
        referrals: referrals.map((r) => ({
          id: r.id,
          referred_user: r.referredUser,
          level: r.level,
          status: r.status,
          commission_amount: r.commissionAmount,
          created_at: r.createdAt,
          updated_at: r.updatedAt,
        })),
        stats: {
          total: totalReferrals,
          verified: verifiedCount,
          pending: pendingCount,
          total_commission: totalCommission,
        },
      },
    };
  }

  async getTasks(): Promise<{ success: boolean; data?: { tasks: MockTask[] }; error?: string }> {
    const tasks = mockDataStore.getTasks(true);

    return {
      success: true,
      data: {
        tasks,
      },
    };
  }

  async getSubmissions(userId: string): Promise<{ success: boolean; data?: { submissions: MockTaskSubmission[] }; error?: string }> {
    const submissions = mockDataStore.getSubmissionsByUserId(userId);

    return {
      success: true,
      data: {
        submissions,
      },
    };
  }

  async submitTask(userId: string, taskId: string, proofUrl: string): Promise<{
    success: boolean;
    data?: { submission: MockTaskSubmission };
    error?: string;
  }> {
    const task = mockDataStore.tasks.get(taskId);
    if (!task) {
      return { success: false, error: 'Task not found' };
    }

    const submission: MockTaskSubmission = {
      id: `sub_${Date.now()}`,
      taskId,
      userId,
      status: 'SUBMITTED',
      proofUrl,
      proofType: 'image/jpeg',
      notes: null,
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
    };

    mockDataStore.submissions.set(submission.id, submission);

    return {
      success: true,
      data: { submission },
    };
  }

  async requestWithdrawal(userId: string, amount: number, upiId: string): Promise<{
    success: boolean;
    data?: { withdrawal: MockWithdrawal };
    error?: string;
  }> {
    const user = mockDataStore.getUserById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const wallet = mockDataStore.getWalletByUserId(userId);
    if (!wallet || wallet.withdrawable < amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    const withdrawal: MockWithdrawal = {
      id: `wd_${Date.now()}`,
      userId,
      amount,
      status: 'PENDING',
      upiId,
      upiQrUrl: null,
      requestedAt: new Date().toISOString(),
      processedAt: null,
      txId: null,
      receiptUrl: null,
      notes: null,
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    };

    mockDataStore.withdrawals.set(withdrawal.id, withdrawal);

    return {
      success: true,
      data: { withdrawal },
    };
  }
}

/**
 * Mock admin service
 */
export class MockAdminService {
  async getDashboard(): Promise<{ success: boolean; data?: MockAdminDashboard; error?: string }> {
    const dashboard = generateMockAdminDashboard();

    return {
      success: true,
      data: dashboard,
    };
  }

  async getWithdrawals(status?: string): Promise<{ success: boolean; data?: { withdrawals: any[] }; error?: string }> {
    const withdrawals = mockDataStore.getAllWithdrawals(status || 'PENDING');

    return {
      success: true,
      data: {
        withdrawals: withdrawals.map((w) => ({
          id: w.id,
          amount: w.amount,
          status: w.status,
          upi_id: w.upiId,
          upi_qr_url: w.upiQrUrl,
          created_at: w.requestedAt,
          processed_at: w.processedAt,
          tx_id: w.txId,
          receipt_url: w.receiptUrl,
          notes: w.notes,
          user: w.user,
        })),
      },
    };
  }

  async getTaskSubmissions(taskId?: string): Promise<{ success: boolean; data?: { submissions: any[] }; error?: string }> {
    const submissions = taskId
      ? mockDataStore.getSubmissionsByTaskId(taskId)
      : Array.from(mockDataStore.submissions.values());

    return {
      success: true,
      data: {
        submissions: submissions.map((s) => ({
          id: s.id,
          task_id: s.taskId,
          user_id: s.userId,
          status: s.status,
          proof_url: s.proofUrl,
          submitted_at: s.submittedAt,
          reviewed_at: s.reviewedAt,
        })),
      },
    };
  }

  async reviewSubmission(submissionId: string, status: 'APPROVED' | 'REJECTED', notes?: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const submission = mockDataStore.submissions.get(submissionId);
    if (!submission) {
      return { success: false, error: 'Submission not found' };
    }

    submission.status = status;
    submission.notes = notes || submission.notes;
    submission.reviewedAt = new Date().toISOString();

    return { success: true };
  }

  async processWithdrawal(withdrawalId: string, status: string, txId?: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const withdrawal = mockDataStore.withdrawals.get(withdrawalId);
    if (!withdrawal) {
      return { success: false, error: 'Withdrawal not found' };
    }

    withdrawal.status = status as MockWithdrawal['status'];
    if (txId) {
      withdrawal.txId = txId;
    }
    if (status === 'COMPLETED') {
      withdrawal.processedAt = new Date().toISOString();
    }

    return { success: true };
  }
}

/**
 * Mock spark events service
 */
export class MockSparkService {
  async getEvents(limit: number = 20): Promise<{ success: boolean; data?: { events: any[] }; error?: string }> {
    const events = generateMockSparkEvents(limit);

    return {
      success: true,
      data: { events },
    };
  }
}

/**
 * Export singleton instances
 */
export const mockAuthService = new MockAuthService();
export const mockMemberService = new MockMemberService();
export const mockAdminService = new MockAdminService();
export const mockSparkService = new MockSparkService();


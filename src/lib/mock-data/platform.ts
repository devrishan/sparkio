/**
 * Comprehensive mock data for all platform dashboards
 * Used across member, admin, and internal company dashboards
 */

export interface MemberDashboardData {
  wallet: {
    balance: number;
    coins: number;
    todayChange: number;
    totalEarned: number;
  };
  tasks: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  referrals: {
    total: number;
    verified: number;
    pending: number;
    earnings: number;
  };
  level: {
    current: number;
    name: string;
    xp: number;
    nextLevelXP: number;
  };
  streak: {
    days: number;
    longest: number;
  };
}

export interface TaskDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  reward: {
    coins: number;
    rupees: number;
  };
  requirements: string[];
  steps: string[];
  proofType: "screenshot" | "video" | "link" | "text";
  maxSubmissions?: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reward: number;
  proofUrl?: string;
  notes?: string;
  rejectionReason?: string;
}

export interface WalletTransaction {
  id: string;
  type: "earned" | "withdrawal" | "referral" | "bonus" | "adjustment";
  amount: number;
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  upiId: string;
  status: "pending" | "approved" | "rejected" | "processing" | "completed";
  requestedAt: string;
  processedAt?: string;
  notes?: string;
  txId?: string;
}

export interface ReferralUser {
  id: string;
  name: string;
  phone: string;
  joinedAt: string;
  status: "active" | "pending" | "inactive";
  earnings: number;
  level: number;
  children?: ReferralUser[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  earnings: number;
  tasksCompleted: number;
  referrals: number;
  change: number; // rank change from previous period
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
  expiresAt?: string;
}

export interface ProductSuggestion {
  id: string;
  productName: string;
  screenshotUrl: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  sender: "user" | "support";
  content: string;
  timestamp: string;
}

// Admin Dashboard Types
export interface AdminDashboardMetrics {
  users: {
    total: number;
    active: number;
    newToday: number;
    growth: number;
  };
  submissions: {
    pending: number;
    approved: number;
    rejected: number;
  };
  withdrawals: {
    pending: number;
    totalAmount: number;
    completed: number;
  };
  payouts: {
    total: number;
    thisMonth: number;
    average: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    profit: number;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  status: "active" | "suspended" | "banned";
  joinedAt: string;
  walletBalance: number;
  totalEarned: number;
  tasksCompleted: number;
  referrals: number;
  lastActive: string;
  deviceInfo?: {
    deviceId: string;
    platform: string;
    lastSeen: string;
  }[];
}

export interface AdminTask {
  id: string;
  title: string;
  category: string;
  reward: number;
  difficulty: string;
  isActive: boolean;
  submissions: number;
  completionRate: number;
  createdAt: string;
}

export interface SparkWallEvent {
  id: string;
  type: "task_completed" | "referral" | "withdrawal" | "level_up" | "achievement";
  message: string;
  userId: string;
  userName: string;
  timestamp: string;
  isApproved: boolean;
}

// Internal Company Types
export interface FinanceData {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  payouts: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  profit: {
    total: number;
    thisMonth: number;
    margin: number;
  };
  byCategory: Array<{
    category: string;
    revenue: number;
    payouts: number;
    profit: number;
  }>;
  monthly: Array<{
    month: string;
    revenue: number;
    payouts: number;
    profit: number;
  }>;
}

export interface AdvertiserCampaign {
  id: string;
  name: string;
  advertiser: string;
  status: "active" | "paused" | "completed";
  budget: number;
  spent: number;
  conversions: number;
  costPerConversion: number;
  startDate: string;
  endDate?: string;
  demographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
  };
}

// Mock Data Generators
export const generateMemberDashboard = (): MemberDashboardData => ({
  wallet: {
    balance: 2450.75,
    coins: 12500,
    todayChange: 125.50,
    totalEarned: 8750.25,
  },
  tasks: {
    pending: 3,
    approved: 28,
    rejected: 2,
    total: 33,
  },
  referrals: {
    total: 12,
    verified: 8,
    pending: 4,
    earnings: 450.00,
  },
  level: {
    current: 5,
    name: "Pro",
    xp: 1250,
    nextLevelXP: 2000,
  },
  streak: {
    days: 7,
    longest: 12,
  },
});

export const generateTasks = (): TaskDetail[] => [
  {
    id: "task-1",
    title: "Install GlowFit App",
    description: "Download and install the GlowFit app from Play Store",
    category: "App Install",
    difficulty: "Easy",
    reward: { coins: 50, rupees: 25 },
    requirements: ["Android 11+", "New install only"],
    steps: ["Open Play Store", "Search GlowFit", "Install app", "Open app for 2 minutes"],
    proofType: "screenshot",
    isActive: true,
  },
  {
    id: "task-2",
    title: "UPI Recharge - Navi",
    description: "Recharge your mobile or pay bills using Navi UPI",
    category: "UPI",
    difficulty: "Medium",
    reward: { coins: 150, rupees: 75 },
    requirements: ["Minimum ₹499", "UPI SMS proof"],
    steps: ["Open Navi app", "Make UPI payment", "Take screenshot"],
    proofType: "screenshot",
    isActive: true,
  },
  {
    id: "task-3",
    title: "WhatsApp Status Share",
    description: "Share approved status on WhatsApp for 6 hours",
    category: "Social",
    difficulty: "Easy",
    reward: { coins: 30, rupees: 15 },
    requirements: ["Status live 6 hours", "Approved copy only"],
    steps: ["Copy approved text", "Post on WhatsApp status", "Keep live for 6 hours"],
    proofType: "screenshot",
    isActive: true,
  },
];

export const generateTaskSubmissions = (): TaskSubmission[] => [
  {
    id: "sub-1",
    taskId: "task-1",
    taskTitle: "Install GlowFit App",
    status: "approved",
    submittedAt: "2024-08-22T10:00:00Z",
    reviewedAt: "2024-08-22T10:15:00Z",
    reward: 25,
    proofUrl: "/proofs/sub-1.jpg",
  },
  {
    id: "sub-2",
    taskId: "task-2",
    taskTitle: "UPI Recharge - Navi",
    status: "pending",
    submittedAt: "2024-08-22T14:30:00Z",
    reward: 75,
    proofUrl: "/proofs/sub-2.jpg",
  },
  {
    id: "sub-3",
    taskId: "task-3",
    taskTitle: "WhatsApp Status Share",
    status: "rejected",
    submittedAt: "2024-08-21T18:00:00Z",
    reviewedAt: "2024-08-21T18:30:00Z",
    reward: 0,
    rejectionReason: "Status not kept live for required duration",
  },
];

export const generateWalletTransactions = (): WalletTransaction[] => [
  {
    id: "tx-1",
    type: "earned",
    amount: 25,
    description: "Task: Install GlowFit App",
    timestamp: "2024-08-22T10:15:00Z",
    status: "completed",
  },
  {
    id: "tx-2",
    type: "referral",
    amount: 50,
    description: "Referral bonus: Priya L.",
    timestamp: "2024-08-21T12:00:00Z",
    status: "completed",
  },
  {
    id: "tx-3",
    type: "withdrawal",
    amount: -500,
    description: "Withdrawal to UPI: aditir@upi",
    timestamp: "2024-08-20T09:00:00Z",
    status: "completed",
  },
];

export const generateWithdrawalRequests = (): WithdrawalRequest[] => [
  {
    id: "wd-1",
    amount: 500,
    upiId: "aditir@upi",
    status: "completed",
    requestedAt: "2024-08-20T09:00:00Z",
    processedAt: "2024-08-20T10:30:00Z",
    txId: "TXN123456789",
  },
  {
    id: "wd-2",
    amount: 1000,
    upiId: "aditir@upi",
    status: "pending",
    requestedAt: "2024-08-22T14:00:00Z",
  },
];

export const generateReferralTree = (): ReferralUser[] => [
  {
    id: "ref-1",
    name: "Priya L.",
    phone: "+91******1234",
    joinedAt: "2024-08-15T10:00:00Z",
    status: "active",
    earnings: 150,
    level: 1,
    children: [
      {
        id: "ref-1-1",
        name: "Kirti R.",
        phone: "+91******5678",
        joinedAt: "2024-08-18T12:00:00Z",
        status: "active",
        earnings: 75,
        level: 2,
      },
    ],
  },
  {
    id: "ref-2",
    name: "Zaid H.",
    phone: "+91******9012",
    joinedAt: "2024-08-10T08:00:00Z",
    status: "pending",
    earnings: 0,
    level: 1,
  },
];

export const generateLeaderboard = (period: "daily" | "weekly" | "monthly" | "all-time"): LeaderboardEntry[] => [
  { rank: 1, userId: "user-1", name: "Aarav J.", earnings: 7200, tasksCompleted: 45, referrals: 15, change: 0 },
  { rank: 2, userId: "user-2", name: "Meera S.", earnings: 6100, tasksCompleted: 38, referrals: 12, change: 1 },
  { rank: 3, userId: "user-3", name: "Rohit K.", earnings: 5800, tasksCompleted: 35, referrals: 11, change: -1 },
  { rank: 4, userId: "user-4", name: "You", earnings: 4500, tasksCompleted: 28, referrals: 9, change: 0 },
  { rank: 5, userId: "user-5", name: "Priya L.", earnings: 3900, tasksCompleted: 25, referrals: 7, change: 2 },
];

export const generateAchievements = (): Achievement[] => [
  {
    id: "ach-1",
    name: "First Steps",
    description: "Complete your first task",
    icon: "star",
    unlocked: true,
    unlockedAt: "2024-08-01T10:00:00Z",
  },
  {
    id: "ach-2",
    name: "Referral Master",
    description: "Refer 10 friends",
    icon: "users",
    unlocked: false,
    progress: 8,
    target: 10,
  },
  {
    id: "ach-3",
    name: "Streak Champion",
    description: "Maintain a 30-day streak",
    icon: "flame",
    unlocked: false,
    progress: 7,
    target: 30,
  },
];

export const generateMissions = (): Mission[] => [
  {
    id: "mission-1",
    title: "Complete 5 Tasks",
    description: "Finish 5 tasks this week",
    reward: 100,
    progress: 3,
    target: 5,
    completed: false,
    expiresAt: "2024-08-29T23:59:59Z",
  },
  {
    id: "mission-2",
    title: "Refer 3 Friends",
    description: "Get 3 friends to join",
    reward: 200,
    progress: 2,
    target: 3,
    completed: false,
  },
];

export const generateProductSuggestions = (): ProductSuggestion[] => [
  {
    id: "prod-1",
    productName: "New Fitness App",
    screenshotUrl: "/products/prod-1.jpg",
    description: "Found this great fitness tracking app",
    status: "pending",
    submittedAt: "2024-08-22T10:00:00Z",
  },
  {
    id: "prod-2",
    productName: "Shopping Platform",
    screenshotUrl: "/products/prod-2.jpg",
    description: "E-commerce app with good rewards",
    status: "approved",
    submittedAt: "2024-08-20T14:00:00Z",
    reviewedAt: "2024-08-21T09:00:00Z",
  },
];

export const generateSupportTickets = (): SupportTicket[] => [
  {
    id: "ticket-1",
    subject: "Withdrawal not processed",
    category: "Payment",
    status: "in_progress",
    priority: "high",
    createdAt: "2024-08-22T10:00:00Z",
    updatedAt: "2024-08-22T11:00:00Z",
    messages: [
      {
        id: "msg-1",
        sender: "user",
        content: "My withdrawal request is still pending after 2 days",
        timestamp: "2024-08-22T10:00:00Z",
      },
      {
        id: "msg-2",
        sender: "support",
        content: "We're looking into this. Please share your transaction ID.",
        timestamp: "2024-08-22T11:00:00Z",
      },
    ],
  },
];

export const generateAdminDashboard = (): AdminDashboardMetrics => ({
  users: {
    total: 15420,
    active: 8920,
    newToday: 45,
    growth: 12.5,
  },
  submissions: {
    pending: 234,
    approved: 8920,
    rejected: 456,
  },
  withdrawals: {
    pending: 89,
    totalAmount: 125000,
    completed: 2340,
  },
  payouts: {
    total: 2450000,
    thisMonth: 450000,
    average: 1050,
  },
  revenue: {
    total: 3500000,
    thisMonth: 650000,
    profit: 1050000,
  },
});

export const generateSparkWallEvents = (): SparkWallEvent[] => [
  {
    id: "spark-1",
    type: "task_completed",
    message: "Priya completed 'Install GlowFit App' and earned ₹25!",
    userId: "user-1",
    userName: "Priya L.",
    timestamp: "2024-08-22T10:15:00Z",
    isApproved: true,
  },
  {
    id: "spark-2",
    type: "referral",
    message: "Aarav referred 3 friends and earned ₹150!",
    userId: "user-2",
    userName: "Aarav J.",
    timestamp: "2024-08-22T09:30:00Z",
    isApproved: true,
  },
];

export const generateFinanceData = (): FinanceData => ({
  revenue: {
    total: 3500000,
    thisMonth: 650000,
    lastMonth: 580000,
    growth: 12.1,
  },
  payouts: {
    total: 2450000,
    thisMonth: 450000,
    lastMonth: 420000,
    growth: 7.1,
  },
  profit: {
    total: 1050000,
    thisMonth: 200000,
    margin: 30.8,
  },
  byCategory: [
    { category: "App Installs", revenue: 1200000, payouts: 840000, profit: 360000 },
    { category: "UPI", revenue: 1500000, payouts: 1050000, profit: 450000 },
    { category: "Social", revenue: 800000, payouts: 560000, profit: 240000 },
  ],
  monthly: [
    { month: "Jan", revenue: 280000, payouts: 196000, profit: 84000 },
    { month: "Feb", revenue: 320000, payouts: 224000, profit: 96000 },
    { month: "Mar", revenue: 380000, payouts: 266000, profit: 114000 },
  ],
});

export const generateAdvertiserCampaigns = (): AdvertiserCampaign[] => [
  {
    id: "camp-1",
    name: "GlowFit Summer Campaign",
    advertiser: "GlowFit Inc.",
    status: "active",
    budget: 500000,
    spent: 125000,
    conversions: 2500,
    costPerConversion: 50,
    startDate: "2024-08-01T00:00:00Z",
    demographics: {
      ageGroups: { "18-25": 40, "26-35": 35, "36-45": 25 },
      locations: { "Mumbai": 30, "Delhi": 25, "Bangalore": 20, "Others": 25 },
      devices: { "Android": 70, "iOS": 30 },
    },
  },
];


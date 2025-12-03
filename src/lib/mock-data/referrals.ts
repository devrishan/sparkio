/**
 * Mock data for Refer and Earn system (points-based)
 * All data is stored in localStorage for client-only persistence
 */

export interface ReferralStats {
  totalPoints: number;
  joined: number;
  pending: number;
}

export interface ReferralStep {
  number: number;
  title: string;
  description: string;
  icon: string; // Icon name from lucide-react
}

export interface ReferralActivity {
  id: string;
  friendName: string;
  joinedDate: string; // ISO date string
  pointsEarned: number;
  status: "active" | "pending" | "dormant";
  lastActivity?: string; // ISO date string
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  referrals: number;
  period: "weekly" | "monthly";
}

export interface Milestone {
  id: string;
  targetReferrals: number;
  bonusPoints: number;
  achieved: boolean;
  achievedDate?: string;
  progress: number; // current referrals / target
}

export const REFERRAL_STORAGE_KEY = "sparkio_referral_data";
export const REFERRAL_ACTIVITY_KEY = "sparkio_referral_activity";
export const REFERRAL_LEADERBOARD_KEY = "sparkio_referral_leaderboard";

const defaultStats: ReferralStats = {
  totalPoints: 0,
  joined: 0,
  pending: 0,
};

const defaultMilestones: Milestone[] = [
  { id: "milestone-5", targetReferrals: 5, bonusPoints: 500, achieved: false, progress: 0 },
  { id: "milestone-10", targetReferrals: 10, bonusPoints: 1500, achieved: false, progress: 0 },
  { id: "milestone-25", targetReferrals: 25, bonusPoints: 5000, achieved: false, progress: 0 },
  { id: "milestone-50", targetReferrals: 50, bonusPoints: 15000, achieved: false, progress: 0 },
  { id: "milestone-100", targetReferrals: 100, bonusPoints: 50000, achieved: false, progress: 0 },
];

const mockLeaderboardWeekly: LeaderboardEntry[] = [
  { rank: 1, name: "Aarav J.", points: 4850, referrals: 18, period: "weekly" },
  { rank: 2, name: "Meera S.", points: 4120, referrals: 16, period: "weekly" },
  { rank: 3, name: "Rohit K.", points: 3940, referrals: 15, period: "weekly" },
  { rank: 4, name: "Priya L.", points: 2890, referrals: 11, period: "weekly" },
  { rank: 5, name: "Kiran M.", points: 2150, referrals: 8, period: "weekly" },
];

const mockLeaderboardMonthly: LeaderboardEntry[] = [
  { rank: 1, name: "Aarav J.", points: 18500, referrals: 68, period: "monthly" },
  { rank: 2, name: "Meera S.", points: 16420, referrals: 62, period: "monthly" },
  { rank: 3, name: "Rohit K.", points: 15280, referrals: 58, period: "monthly" },
  { rank: 4, name: "Priya L.", points: 11240, referrals: 42, period: "monthly" },
  { rank: 5, name: "Kiran M.", points: 8950, referrals: 33, period: "monthly" },
];

const mockActivity: ReferralActivity[] = [
  {
    id: "act-1",
    friendName: "Asha K.",
    joinedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    pointsEarned: 920,
    status: "active",
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-2",
    friendName: "Dev P.",
    joinedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    pointsEarned: 0,
    status: "pending",
  },
  {
    id: "act-3",
    friendName: "Kirti R.",
    joinedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    pointsEarned: 120,
    status: "dormant",
    lastActivity: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-4",
    friendName: "Zaid H.",
    joinedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    pointsEarned: 480,
    status: "active",
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-5",
    friendName: "Priya L.",
    joinedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    pointsEarned: 0,
    status: "pending",
  },
];

/**
 * Get referral stats from localStorage
 */
export function getReferralStats(): ReferralStats {
  if (typeof window === "undefined") {
    return defaultStats;
  }

  try {
    const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!stored) {
      return defaultStats;
    }
    const parsed = JSON.parse(stored);
    return {
      totalPoints: parsed.totalPoints ?? 0,
      joined: parsed.joined ?? 0,
      pending: parsed.pending ?? 0,
    };
  } catch {
    return defaultStats;
  }
}

/**
 * Update referral stats
 */
export function updateReferralStats(updates: Partial<ReferralStats>): ReferralStats {
  const current = getReferralStats();
  const updated = { ...current, ...updates };
  
  if (typeof window !== "undefined") {
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(updated));
  }
  
  return updated;
}

/**
 * Generate a mock referral link
 */
export function getReferralLink(): string {
  if (typeof window === "undefined") {
    return "https://sparkio.in/r/user-12345";
  }

  // Try to get from localStorage, or generate a mock one
  const stored = localStorage.getItem("sparkio_referral_link");
  if (stored) {
    return stored;
  }

  // Generate a mock referral code
  const userId = Math.random().toString(36).substring(2, 9);
  const link = `https://sparkio.in/r/${userId}`;
  localStorage.setItem("sparkio_referral_link", link);
  return link;
}

/**
 * Get referral activity log
 */
export function getReferralActivity(): ReferralActivity[] {
  if (typeof window === "undefined") {
    return mockActivity;
  }

  try {
    const stored = localStorage.getItem(REFERRAL_ACTIVITY_KEY);
    if (!stored) {
      return mockActivity;
    }
    return JSON.parse(stored);
  } catch {
    return mockActivity;
  }
}

/**
 * Add a new referral activity
 */
export function addReferralActivity(activity: Omit<ReferralActivity, "id">): ReferralActivity {
  const current = getReferralActivity();
  const newActivity: ReferralActivity = {
    ...activity,
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  };

  const updated = [newActivity, ...current];
  
  if (typeof window !== "undefined") {
    localStorage.setItem(REFERRAL_ACTIVITY_KEY, JSON.stringify(updated));
  }

  return newActivity;
}

/**
 * Get leaderboard data
 */
export function getLeaderboard(period: "weekly" | "monthly"): LeaderboardEntry[] {
  if (typeof window === "undefined") {
    return period === "weekly" ? mockLeaderboardWeekly : mockLeaderboardMonthly;
  }

  try {
    const stored = localStorage.getItem(`${REFERRAL_LEADERBOARD_KEY}_${period}`);
    if (!stored) {
      return period === "weekly" ? mockLeaderboardWeekly : mockLeaderboardMonthly;
    }
    return JSON.parse(stored);
  } catch {
    return period === "weekly" ? mockLeaderboardWeekly : mockLeaderboardMonthly;
  }
}

/**
 * Get milestones with current progress
 */
export function getMilestones(): Milestone[] {
  const stats = getReferralStats();
  const currentReferrals = stats.joined;

  return defaultMilestones.map((milestone) => {
    const progress = Math.min(1, currentReferrals / milestone.targetReferrals);
    const achieved = currentReferrals >= milestone.targetReferrals;

    return {
      ...milestone,
      progress,
      achieved,
      achievedDate: achieved && !milestone.achievedDate 
        ? new Date().toISOString() 
        : milestone.achievedDate,
    };
  });
}

/**
 * Check and award milestone bonuses
 */
export function checkMilestoneBonuses(): { pointsAwarded: number; milestonesUnlocked: string[] } {
  const milestones = getMilestones();
  const stats = getReferralStats();
  let pointsAwarded = 0;
  const milestonesUnlocked: string[] = [];

  milestones.forEach((milestone) => {
    if (milestone.achieved && !milestone.achievedDate) {
      pointsAwarded += milestone.bonusPoints;
      milestonesUnlocked.push(milestone.id);
    }
  });

  if (pointsAwarded > 0) {
    updateReferralStats({
      totalPoints: stats.totalPoints + pointsAwarded,
    });
  }

  return { pointsAwarded, milestonesUnlocked };
}

/**
 * Referral steps configuration
 */
export const REFERRAL_STEPS: ReferralStep[] = [
  {
    number: 1,
    title: "Invite friends",
    description: "Share your unique referral link with friends via WhatsApp, email, or social media",
    icon: "UserPlus",
  },
  {
    number: 2,
    title: "Friends join & earn",
    description: "Your friends sign up and complete their first task to start earning rewards",
    icon: "Search",
  },
  {
    number: 3,
    title: "Earn verified points",
    description: "You earn points when your friends complete verified tasks. Up to 7,500 points/month!",
    icon: "Award",
  },
];

/**
 * Format points for display
 */
export function formatPoints(points: number): string {
  return new Intl.NumberFormat("en-IN").format(points);
}

/**
 * Format date for display
 */
export function formatReferralDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
}

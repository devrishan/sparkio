/**
 * Mock data for streak system
 * Streaks are tracked in localStorage
 */

export interface StreakData {
  currentStreak: number; // Current consecutive days
  longestStreak: number; // Longest streak achieved
  lastActivityDate: string; // YYYY-MM-DD format
  streakHistory: string[]; // Array of dates (YYYY-MM-DD) with activity
  nextMilestone: number; // Next milestone (e.g., 7, 14, 30)
  nextMilestoneReward: string; // Reward description
}

const STREAK_MILESTONES = [
  { days: 3, reward: "₹50 bonus" },
  { days: 7, reward: "₹150 bonus" },
  { days: 14, reward: "₹350 bonus" },
  { days: 30, reward: "₹1000 bonus" },
  { days: 60, reward: "₹2500 bonus" },
  { days: 100, reward: "₹5000 bonus" },
];

export const STREAK_STORAGE_KEY = "sparkio_streak_data";
export const STREAK_EVENT = "sparkio:streak-updated";

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: "",
  streakHistory: [],
  nextMilestone: 3,
  nextMilestoneReward: "₹50 bonus",
};

function broadcastStreakUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STREAK_EVENT));
}

/**
 * Get current streak data from localStorage
 */
export function getStreakData(): StreakData {
  if (typeof window === "undefined") {
    return { ...defaultStreakData };
  }

  const stored = localStorage.getItem(STREAK_STORAGE_KEY);
  if (!stored) {
    return { ...defaultStreakData };
  }

  try {
    const data: StreakData = JSON.parse(stored);
    const today = new Date().toISOString().split("T")[0];
    
    // Check if streak should be reset (more than 1 day gap)
    if (data.lastActivityDate) {
      const lastDate = new Date(data.lastActivityDate);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 1) {
        // Streak broken
        data.currentStreak = 0;
        data.lastActivityDate = "";
      }
    }
    
    // Find next milestone
    const nextMilestone = STREAK_MILESTONES.find((m) => m.days > data.currentStreak);
    if (nextMilestone) {
      data.nextMilestone = nextMilestone.days;
      data.nextMilestoneReward = nextMilestone.reward;
    }
    
    return data;
  } catch {
    return { ...defaultStreakData };
  }
}

/**
 * Record activity for today (increments streak if consecutive)
 */
export function recordStreakActivity(): void {
  if (typeof window === "undefined") return;
  
  const data = getStreakData();
  const today = new Date().toISOString().split("T")[0];
  
  // If already recorded today, don't increment
  if (data.lastActivityDate === today) return;
  
  const lastDate = data.lastActivityDate ? new Date(data.lastActivityDate) : null;
  const todayDate = new Date(today);
  
  if (lastDate) {
    const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day - increment streak
      data.currentStreak += 1;
    } else if (daysDiff > 1) {
      // Streak broken - reset
      data.currentStreak = 1;
    } else {
      // Same day - don't increment
      return;
    }
  } else {
    // First activity
    data.currentStreak = 1;
  }
  
  data.lastActivityDate = today;
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
  
  if (!data.streakHistory.includes(today)) {
    data.streakHistory.push(today);
  }
  
  // Find next milestone
  const nextMilestone = STREAK_MILESTONES.find((m) => m.days > data.currentStreak);
  if (nextMilestone) {
    data.nextMilestone = nextMilestone.days;
    data.nextMilestoneReward = nextMilestone.reward;
  }
  
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
  broadcastStreakUpdate();
}

/**
 * Get streak calendar data (last 30 days)
 */
export function getStreakCalendar(): Array<{ date: string; hasActivity: boolean }> {
  const data = getStreakData();
  const calendar: Array<{ date: string; hasActivity: boolean }> = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    calendar.push({
      date: dateStr,
      hasActivity: data.streakHistory.includes(dateStr),
    });
  }
  
  return calendar;
}

export function resetStreakData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STREAK_STORAGE_KEY);
  broadcastStreakUpdate();
}


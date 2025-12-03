"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Bell, CreditCard, Gift, IndianRupee, ShieldCheck } from "lucide-react";

import { SectionCard, StatCard, StatusPill } from "@/components/dashboard";
import { BoosterCard } from "@/components/boosters/BoosterCard";
import {
  AVAILABLE_BOOSTERS,
  BOOSTER_STATE_STORAGE_KEY,
  type BoosterCategory,
  calculateBoostedPayout,
  getActiveBoosters,
} from "@/lib/mock-data/boosters";

const user = {
  firstName: "Aditi",
  totalEarned: "₹82,400",
  pendingApprovals: "₹6,120",
  withdrawable: "₹18,950",
  nextWithdrawalDate: "Next withdrawable date: Aug 26 · 09:00 IST",
};

type RecentTask = {
  name: string;
  type: string;
  status: string;
  category: BoosterCategory;
  payout: number;
};

const recentTasks: RecentTask[] = [
  { name: "Navi UPI referral", type: "UPI task", status: "Pending", category: "UPI", payout: 240 },
  { name: "GlowFit install", type: "App referral", status: "Under review", category: "App", payout: 480 },
  { name: "Lumos wallet top-up", type: "UPI task", status: "Approved", category: "UPI", payout: 310 },
  { name: "WhatsApp status blast", type: "Social drop", status: "Rejected", category: "Social", payout: 150 },
  { name: "KineticPay install", type: "App referral", status: "Approved", category: "App", payout: 520 },
];

const earningsTrend = [
  { day: "Mon", value: 8200 },
  { day: "Tue", value: 9100 },
  { day: "Wed", value: 7800 },
  { day: "Thu", value: 10400 },
  { day: "Fri", value: 11650 },
  { day: "Sat", value: 6900 },
  { day: "Sun", value: 7200 },
];

const recentActivity = [
  { type: "Task", status: "Approved", title: "GlowFit install", time: "Aug 22 · 14:22" },
  { type: "Withdrawal", status: "Processing", title: "₹4,400 to aditir@upi", time: "Aug 21 · 18:04" },
  { type: "Referral", status: "Joined", title: "Priya L. joined with your link", time: "Aug 21 · 16:18" },
  { type: "Task", status: "Rejected", title: "WhatsApp status blast", time: "Aug 21 · 10:58" },
  { type: "Referral", status: "Active", title: "Zaid H. earned ₹120", time: "Aug 20 · 20:33" },
];

const taskStatusTone: Record<string, "pending" | "info" | "success" | "danger"> = {
  Pending: "pending",
  "Under review": "info",
  Approved: "success",
  Rejected: "danger",
};

const GOAL_STORAGE_KEY = "sparkio_earning_goals";
const REMINDER_STORAGE_KEY = "sparkio_goal_reminders";

const goalHistory = [
  { period: "Last week", goal: 2500, earned: 2680 },
  { period: "Week before", goal: 2500, earned: 2210 },
  { period: "July month", goal: 12000, earned: 13140 },
];

export default function DashboardHomePage() {
  const [goals, setGoals] = useState({ weekly: 2500, monthly: 14000 });
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [activeBoosters, setActiveBoosters] = useState<ReturnType<typeof getActiveBoosters>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedGoals = localStorage.getItem(GOAL_STORAGE_KEY);
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
    const storedReminders = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (storedReminders) {
      setRemindersEnabled(storedReminders === "true");
    }
  }, []);

  const refreshActiveBoosters = useCallback(() => {
    if (typeof window === "undefined") return;
    setActiveBoosters(getActiveBoosters());
  }, []);

  useEffect(() => {
    refreshActiveBoosters();
    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === BOOSTER_STATE_STORAGE_KEY) {
        refreshActiveBoosters();
      }
    };

    window.addEventListener("storage", handleStorage);
    const interval = window.setInterval(refreshActiveBoosters, 15000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.clearInterval(interval);
    };
  }, [refreshActiveBoosters]);

  const maxValue = Math.max(...earningsTrend.map((item) => item.value));
  const chartPoints = earningsTrend
    .map((item, index) => {
      const x = (index / (earningsTrend.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 80 - 5;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const areaPath = `M0,100 L${chartPoints.replace(/ /g, " L")} L100,100 Z`;
  const showEmptyState = recentActivity.length === 0;
  const weeklyProgress = { current: 1820, target: goals.weekly };
  const monthlyProgress = { current: 9840, target: goals.monthly };
  const streakMilestoneUnlocked = weeklyProgress.current >= goals.weekly;
  const tasksWithBoosts = useMemo(() => {
    return recentTasks.map((task) => {
      const boostedPayout = calculateBoostedPayout(task.payout, task.category, activeBoosters);
      return {
        ...task,
        boostedPayout,
        boostDelta: boostedPayout - task.payout,
      };
    });
  }, [activeBoosters]);

  const handleGoalSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goals));
  };

  const toggleReminders = () => {
    const next = !remindersEnabled;
    setRemindersEnabled(next);
    localStorage.setItem(REMINDER_STORAGE_KEY, String(next));
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
          Welcome back
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Welcome back, {user.firstName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Track tasks, approvals, and UPI-ready earnings.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total earned"
          value={user.totalEarned}
          hint="Last 30 days · +₹4,900 vs prior"
          icon={<IndianRupee className="h-4 w-4" />}
          accent="from-orange-500/10 via-orange-500/0 to-transparent"
        />
        <StatCard
          label="Pending approvals"
          value={user.pendingApprovals}
          hint="Across 7 submissions"
          icon={<ShieldCheck className="h-4 w-4" />}
          accent="from-blue-500/10 via-blue-500/0 to-transparent"
        />
        <StatCard
          label="Withdrawable now"
          value={user.withdrawable}
          hint="Instant UPI-ready"
          icon={<CreditCard className="h-4 w-4" />}
          accent="from-emerald-500/10 via-emerald-500/0 to-transparent"
        />
        <StatCard
          label="Next payout"
          value="3 days"
          hint="Scheduled for Aug 26"
          icon={<CreditCard className="h-4 w-4" />}
          accent="from-purple-500/10 via-purple-500/0 to-transparent"
        />
      </section>

      <SectionCard title="7-day earnings" subtitle="Track how much cleared each day.">
        <div className="space-y-4">
          <div className="relative h-56 w-full rounded-3xl bg-gradient-to-b from-white/5 to-transparent p-4">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <defs>
                <linearGradient id="memberEarningsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(251,146,60,0.9)" />
                  <stop offset="100%" stopColor="rgba(251,146,60,0.05)" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#memberEarningsGradient)" stroke="none" opacity={0.8} />
              <polyline
                points={chartPoints}
                fill="none"
                stroke="rgba(251,146,60,0.9)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
            {earningsTrend.map((day) => (
              <div key={day.day}>
                <p>{day.day}</p>
                <p className="font-semibold text-white">₹{Math.round(day.value / 100) / 10}k</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Goals & milestones"
        subtitle="Stay accountable with weekly and monthly earning targets."
        actions={
          <button
            onClick={toggleReminders}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
          >
            <Bell className="h-3.5 w-3.5 text-orange-300" />
            {remindersEnabled ? "Reminders on" : "Enable reminders"}
          </button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <form className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4" onSubmit={handleGoalSave}>
            <p className="text-sm font-semibold text-white">Update your goals</p>
            <label className="space-y-2 text-xs text-white/70">
              Weekly goal (₹)
              <input
                type="number"
                min={500}
                value={goals.weekly}
                onChange={(event) => setGoals((prev) => ({ ...prev, weekly: Number(event.target.value) }))}
                className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-xs text-white/70">
              Monthly goal (₹)
              <input
                type="number"
                min={2000}
                value={goals.monthly}
                onChange={(event) => setGoals((prev) => ({ ...prev, monthly: Number(event.target.value) }))}
                className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
            >
              Save goals (demo)
            </button>
            <p className="text-xs text-muted-foreground">Goals save locally and can be adjusted anytime.</p>
          </form>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Weekly progress</span>
                <span className="font-semibold text-white">
                  ₹{weeklyProgress.current.toLocaleString()} / ₹{weeklyProgress.target.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  style={{
                    width: `${Math.min(100, (weeklyProgress.current / weeklyProgress.target) * 100)}%`,
                  }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={weeklyProgress.target}
                  aria-valuenow={weeklyProgress.current}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Monthly progress</span>
                <span className="font-semibold text-white">
                  ₹{monthlyProgress.current.toLocaleString()} / ₹{monthlyProgress.target.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                  style={{
                    width: `${Math.min(100, (monthlyProgress.current / monthlyProgress.target) * 100)}%`,
                  }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={monthlyProgress.target}
                  aria-valuenow={monthlyProgress.current}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#04070d] px-4 py-3 text-xs text-white/70">
              <p className="font-semibold text-white">Milestone bonus</p>
              <div className="mt-2 flex items-center gap-2">
                <Gift className="h-4 w-4 text-amber-300" />
                {streakMilestoneUnlocked ? (
                  <span>Unlocked: +₹150 streak bonus added to your next payout.</span>
                ) : (
                  <span>Hit your weekly goal to unlock a streak bonus.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {goalHistory.map((entry) => (
            <div key={entry.period} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <p className="text-xs text-white/60">{entry.period}</p>
              <p className="mt-2 text-lg font-semibold text-white">₹{entry.earned.toLocaleString()}</p>
              <p className="text-xs text-white/60">Goal: ₹{entry.goal.toLocaleString()}</p>
              <StatusPill label={entry.earned >= entry.goal ? "Achieved" : "Missed"} tone={entry.earned >= entry.goal ? "success" : "danger"} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Recent activity"
        subtitle="All task, referral, and payout events arrive here in real time."
        actions={
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs text-muted-foreground transition hover:border-white/40 hover:text-white">
            View full history
            <ArrowUpRight className="h-3 w-3" />
          </button>
        }
      >
        {showEmptyState ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-[#050507] px-6 py-10 text-center">
            <div className="rounded-full border border-white/10 p-3 text-white/70">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">No earnings yet</h3>
            <p className="text-sm text-muted-foreground">
              Start with a WhatsApp status task or an app referral to see your first approvals.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={`${activity.type}-${activity.time}`}
                className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col">
                  <p className="text-white">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill
                    label={activity.type}
                    tone={
                      activity.type === "Withdrawal"
                        ? "info"
                        : activity.type === "Referral"
                        ? "success"
                        : "brand"
                    }
                  />
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Recent tasks"
        subtitle="Keep an eye on the latest approvals and booster effects."
        actions={
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs text-muted-foreground transition hover:border-white/40 hover:text-white">
            View task history
            <ArrowUpRight className="h-3 w-3" />
          </button>
        }
      >
        <div className="divide-y divide-white/5">
          {tasksWithBoosts.map((task) => (
            <div
              key={`${task.name}-${task.status}`}
              className="flex flex-col gap-3 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-white">{task.name}</p>
                <p className="text-xs">{task.type}</p>
              </div>
              <div className="flex flex-col items-start gap-1 text-xs sm:items-end">
                <div className="text-right text-white">
                  <span className="text-base font-semibold">
                    ₹{task.boostedPayout.toLocaleString("en-IN")}
                  </span>
                  <span className="ml-2 text-[11px] uppercase tracking-wide text-white/50">{task.category} task</span>
                </div>
                {task.boostDelta > 0 ? (
                  <span className="text-[11px] font-semibold text-orange-200">
                    +₹{task.boostDelta.toLocaleString("en-IN")} via booster
                  </span>
                ) : (
                  <span className="text-[11px] text-white/50">
                    Base payout ₹{task.payout.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <StatusPill label={task.status} tone={taskStatusTone[task.status]} />
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">{user.nextWithdrawalDate}</p>
      </SectionCard>

      <SectionCard
        title="Earning Boosters"
        subtitle="Activate boosters to multiply your earnings from tasks."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs text-muted-foreground">
            {activeBoosters.length > 0 ? `${activeBoosters.length} active now` : "No boosters active"}
          </span>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {AVAILABLE_BOOSTERS.slice(0, 3).map((booster) => (
            <BoosterCard key={booster.id} booster={booster} onStateChange={refreshActiveBoosters} />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground" aria-live="polite">
          Boosters sync locally. Activate them before starting tasks to maximize earnings.
        </p>
      </SectionCard>
    </div>
  );
}


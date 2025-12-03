"use client";

import { useState } from "react";
import {
  AppWindow,
  CheckCircle2,
  CreditCard,
  Flame,
  Lock,
  Share2,
  ShieldCheck,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";

import { SectionCard, StatCard, StatusPill } from "@/components/dashboard";
import { BoosterCard } from "@/components/boosters/BoosterCard";
import { StreakProgress } from "@/components/badges/StreakProgress";
import { AVAILABLE_BOOSTERS } from "@/lib/mock-data/boosters";
import { cn } from "@/lib/utils";

const dailyEarnings = [
  { day: "Mon", value: 820, label: "₹820" },
  { day: "Tue", value: 910, label: "₹910" },
  { day: "Wed", value: 780, label: "₹780" },
  { day: "Thu", value: 1040, label: "₹1,040" },
  { day: "Fri", value: 1165, label: "₹1,165" },
  { day: "Sat", value: 690, label: "₹690" },
  { day: "Sun", value: 720, label: "₹720" },
];

const taskMix = [
  { type: "App", count: 42, percentage: 48, icon: <AppWindow className="h-4 w-4 text-orange-300" /> },
  { type: "UPI", count: 28, percentage: 32, icon: <CreditCard className="h-4 w-4 text-blue-300" /> },
  { type: "Social", count: 18, percentage: 20, icon: <Share2 className="h-4 w-4 text-purple-300" /> },
];

const leaderboard = [
  { rank: 1, name: "Aarav J.", earnings: "₹4,820", tasks: 18, badge: "🥇" },
  { rank: 2, name: "Meera S.", earnings: "₹4,110", tasks: 16, badge: "🥈" },
  { rank: 3, name: "Rohit K.", earnings: "₹3,940", tasks: 15, badge: "🥉" },
  { rank: 4, name: "You", earnings: "₹3,240", tasks: 12, badge: "⭐" },
  { rank: 5, name: "Priya L.", earnings: "₹2,890", tasks: 11, badge: "" },
];

const maxEarnings = Math.max(...dailyEarnings.map((d) => d.value));

type BadgeStatus = "locked" | "unlocked" | "in_progress";

interface UserBadge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: BadgeStatus;
  unlockedAt?: string;
  progress?: { current: number; target: number };
  isNew?: boolean;
  color: string;
}

const USER_BADGES: UserBadge[] = [
  {
    id: "task-streak",
    title: "Task Streak",
    description: "Completed tasks 5 days in a row",
    icon: <Flame className="h-8 w-8" />,
    status: "unlocked",
    unlockedAt: "Aug 20, 2024",
    isNew: false,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "referral-pro",
    title: "Referral Pro",
    description: "Referred 10+ active users",
    icon: <Users className="h-8 w-8" />,
    status: "in_progress",
    progress: { current: 7, target: 10 },
    isNew: false,
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "first-withdrawal",
    title: "First Withdrawal",
    description: "Successfully withdrew earnings",
    icon: <CreditCard className="h-8 w-8" />,
    status: "unlocked",
    unlockedAt: "Aug 19, 2024",
    isNew: false,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "kyc-verified",
    title: "KYC Verified",
    description: "Completed ID verification",
    icon: <ShieldCheck className="h-8 w-8" />,
    status: "locked",
    isNew: false,
    color: "from-gray-500 to-gray-600",
  },
  {
    id: "power-earner",
    title: "Power Earner",
    description: "Earned ₹1000+ in total",
    icon: <Trophy className="h-8 w-8" />,
    status: "unlocked",
    unlockedAt: "Aug 18, 2024",
    isNew: true,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "app-master",
    title: "App Master",
    description: "Completed 20+ app install tasks",
    icon: <AppWindow className="h-8 w-8" />,
    status: "in_progress",
    progress: { current: 14, target: 20 },
    isNew: false,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "streak-7-days",
    title: "7-Day Streak",
    description: "Maintained a 7-day activity streak",
    icon: <Flame className="h-8 w-8" />,
    status: "unlocked",
    unlockedAt: "Aug 22, 2024",
    isNew: false,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "streak-30-days",
    title: "30-Day Streak",
    description: "Maintained a 30-day activity streak",
    icon: <Flame className="h-8 w-8" />,
    status: "in_progress",
    progress: { current: 12, target: 30 },
    isNew: false,
    color: "from-red-500 to-orange-500",
  },
];

export default function DashboardInsightsPage() {
  const [selectedBadge, setSelectedBadge] = useState<UserBadge | null>(null);
  const chartPoints = dailyEarnings
    .map((item, index) => {
      const x = (index / (dailyEarnings.length - 1)) * 100;
      const y = 100 - (item.value / maxEarnings) * 80 - 5;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const areaPath = `M0,100 L${chartPoints.replace(/ /g, " L")} L100,100 Z`;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Performance insights</p>
        <h1 className="text-3xl font-semibold text-white">Your earning analytics</h1>
        <p className="text-sm text-muted-foreground">Track daily earnings, task mix, and see how you rank.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total this week"
          value="₹6,125"
          hint="+12% vs last week"
          icon={<TrendingUp className="h-4 w-4 text-emerald-300" />}
          accent="from-emerald-500/10 via-emerald-500/0 to-transparent"
        />
        <StatCard
          label="Tasks completed"
          value="12"
          hint="7-day streak"
          icon={<Trophy className="h-4 w-4 text-orange-300" />}
          accent="from-orange-500/10 via-orange-500/0 to-transparent"
        />
        <StatCard
          label="Avg. per task"
          value="₹510"
          hint="Above platform avg."
          icon={<TrendingUp className="h-4 w-4 text-blue-300" />}
          accent="from-blue-500/10 via-blue-500/0 to-transparent"
        />
      </section>

      <SectionCard title="Daily earnings (7 days)" subtitle="Track your earning trends day by day.">
        <div className="space-y-4">
          <div className="relative h-64 w-full rounded-3xl bg-gradient-to-b from-white/5 to-transparent p-4">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <defs>
                <linearGradient id="insightsEarningsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(251,146,60,0.9)" />
                  <stop offset="100%" stopColor="rgba(251,146,60,0.05)" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#insightsEarningsGradient)" stroke="none" opacity={0.8} />
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
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
            {dailyEarnings.map((day) => (
              <div key={day.day} className="space-y-1">
                <p className="font-semibold text-white">{day.day}</p>
                <p className="text-orange-200">{day.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Task mix" subtitle="Breakdown of your completed tasks by type.">
          <div className="space-y-4">
            {taskMix.map((task) => (
              <div key={task.type} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {task.icon}
                    <span className="font-semibold text-white">{task.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-white">{task.count} tasks</span>
                    <span className="ml-2 text-muted-foreground">{task.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                    style={{ width: `${task.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Weekly leaderboard" subtitle="See how you rank among top earners.">
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-4 rounded-2xl border px-4 py-3 text-sm ${
                  entry.name === "You"
                    ? "border-orange-500/40 bg-orange-500/10"
                    : "border-white/5 bg-white/5"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-white">
                  {entry.badge || entry.rank}
                </span>
                <div className="flex-1">
                  <p className={`font-semibold ${entry.name === "You" ? "text-orange-200" : "text-white"}`}>
                    {entry.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.tasks} tasks completed</p>
                </div>
                <p className={`text-sm font-semibold ${entry.name === "You" ? "text-orange-200" : "text-white"}`}>
                  {entry.earnings}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StreakProgress />
        
        <SectionCard title="Earning Boosters" subtitle="Activate boosters to multiply your earnings.">
          <div className="space-y-3">
            {AVAILABLE_BOOSTERS.slice(0, 2).map((booster) => (
              <BoosterCard key={booster.id} booster={booster} />
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Your Achievements" subtitle="Unlock badges by completing milestones and tasks.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {USER_BADGES.map((badge) => {
            const isLocked = badge.status === "locked";
            const isInProgress = badge.status === "in_progress";
            const progressPercent = badge.progress
              ? Math.min(100, (badge.progress.current / badge.progress.target) * 100)
              : 0;

            return (
              <div
                key={badge.id}
                className={cn(
                  "group relative rounded-2xl border p-4 transition-all",
                  isLocked
                    ? "border-white/10 bg-white/5 opacity-60"
                    : badge.isNew
                    ? "border-orange-500/40 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent shadow-lg shadow-orange-500/20 animate-pulse"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                )}
                onClick={() => setSelectedBadge(badge)}
              >
                {badge.isNew && !isLocked && (
                  <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    !
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white",
                      isLocked ? "from-gray-600 to-gray-700" : badge.color
                    )}
                  >
                    {isLocked ? <Lock className="h-6 w-6" /> : badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn("font-semibold", isLocked ? "text-white/50" : "text-white")}>
                      {badge.title}
                    </h3>
                    <p className={cn("mt-1 text-xs", isLocked ? "text-white/40" : "text-muted-foreground")}>
                      {badge.description}
                    </p>
                    {isInProgress && badge.progress && (
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold text-white">
                            {badge.progress.current} / {badge.progress.target}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {badge.status === "unlocked" && badge.unlockedAt && (
                      <p className="mt-2 text-xs text-muted-foreground">Unlocked: {badge.unlockedAt}</p>
                    )}
                  </div>
                </div>
                {!isLocked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Share "${badge.title}" badge! (Demo only)`);
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Share badge
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          {USER_BADGES.filter((b) => b.status === "unlocked").length} of {USER_BADGES.length} badges unlocked
        </p>
      </SectionCard>

      <SectionCard title="Insights summary" subtitle="Key takeaways from your performance.">
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
            <TrendingUp className="h-5 w-5 shrink-0 text-emerald-300" />
            <div>
              <p className="font-semibold text-white">Best earning day: Friday</p>
              <p className="text-xs">You earned ₹1,165 on Friday, 20% above your weekly average.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
            <AppWindow className="h-5 w-5 shrink-0 text-orange-300" />
            <div>
              <p className="font-semibold text-white">Top task type: App referrals</p>
              <p className="text-xs">48% of your earnings come from app install tasks.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
            <Trophy className="h-5 w-5 shrink-0 text-yellow-300" />
            <div>
              <p className="font-semibold text-white">Ranking: #4 this week</p>
              <p className="text-xs">You're in the top 5 earners! Keep up the momentum.</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedBadge(null)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0A0D14] p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div
                    className={cn(
                      "mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white",
                      selectedBadge.status === "locked"
                        ? "from-gray-600 to-gray-700"
                        : selectedBadge.color
                    )}
                  >
                    {selectedBadge.status === "locked" ? (
                      <Lock className="h-8 w-8" />
                    ) : (
                      selectedBadge.icon
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{selectedBadge.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{selectedBadge.description}</p>
                </div>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {selectedBadge.status === "unlocked" && selectedBadge.unlockedAt && (
                <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span className="font-semibold text-emerald-200">Unlocked</span>
                    <span className="text-emerald-200/70">• {selectedBadge.unlockedAt}</span>
                  </div>
                </div>
              )}
              {selectedBadge.status === "in_progress" && selectedBadge.progress && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-white">
                      {selectedBadge.progress.current} / {selectedBadge.progress.target}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                      style={{
                        width: `${Math.min(100, (selectedBadge.progress.current / selectedBadge.progress.target) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedBadge.progress.target - selectedBadge.progress.current} more to unlock
                  </p>
                </div>
              )}
              {selectedBadge.status === "locked" && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Complete the requirements to unlock this badge.
                  </p>
                </div>
              )}
              {selectedBadge.status !== "locked" && (
                <button
                  onClick={() => {
                    alert(`Share "${selectedBadge.title}" badge! (Demo only)`);
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
                >
                  <Share2 className="h-4 w-4" />
                  Share badge
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


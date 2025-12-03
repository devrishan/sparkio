"use client";

import { ArrowUpRight, BarChart3, Medal, Share2, Sparkles, TrendingUp } from "lucide-react";

import { SectionCard, StatCard, StatusPill } from "@/components/dashboard";

const creatorStats = [
  {
    label: "Daily earnings",
    value: "₹1,240",
    hint: "+18% vs yesterday",
    icon: <TrendingUp className="h-4 w-4 text-emerald-300" />,
    accent: "from-emerald-500/10 via-emerald-500/0 to-transparent",
  },
  {
    label: "Top task payout",
    value: "₹380",
    hint: "GlowFit install boost",
    icon: <Sparkles className="h-4 w-4 text-orange-300" />,
    accent: "from-orange-500/10 via-orange-500/0 to-transparent",
  },
  {
    label: "Referral conversion",
    value: "42%",
    hint: "Last 7 days",
    icon: <Share2 className="h-4 w-4 text-purple-300" />,
    accent: "from-purple-500/10 via-purple-500/0 to-transparent",
  },
  {
    label: "Badges unlocked",
    value: "6",
    hint: "2 new this week",
    icon: <Medal className="h-4 w-4 text-yellow-300" />,
    accent: "from-yellow-500/10 via-yellow-500/0 to-transparent",
  },
];

const dailyCreatorEarnings = [
  { day: "Mon", value: 820 },
  { day: "Tue", value: 940 },
  { day: "Wed", value: 760 },
  { day: "Thu", value: 1100 },
  { day: "Fri", value: 1260 },
  { day: "Sat", value: 640 },
  { day: "Sun", value: 720 },
];

const topTasks = [
  { name: "GlowFit install bonus", category: "App", completions: 38, payout: "₹320", approval: "96%" },
  { name: "Navi UPI recharge", category: "UPI", completions: 22, payout: "₹450", approval: "92%" },
  { name: "WhatsApp status drop", category: "Social", completions: 54, payout: "₹80", approval: "98%" },
];

const referralFunnels = [
  { stage: "Link clicks", value: 180, conversion: "100%" },
  { stage: "Sign ups", value: 92, conversion: "51%" },
  { stage: "First earning", value: 58, conversion: "32%" },
];

const badgeTimeline = [
  { title: "Power Earner", date: "Aug 21 · 16:10", description: "Earned ₹1000+ in a single day" },
  { title: "Referral Pro", date: "Aug 19 · 10:02", description: "Referred 10 active creators" },
  { title: "7-Day Streak", date: "Aug 18 · 08:45", description: "Completed tasks 7 days in a row" },
];

export default function CreatorAnalyticsPage() {
  const maxValue = Math.max(...dailyCreatorEarnings.map((item) => item.value));
  const chartPoints = dailyCreatorEarnings
    .map((item, index) => {
      const x = (index / (dailyCreatorEarnings.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 80 - 5;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const areaPath = `M0,100 L${chartPoints.replace(/ /g, " L")} L100,100 Z`;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Creator analytics</p>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Performance control room</h1>
            <p className="text-sm text-muted-foreground">
              Track daily earnings, task performance, referrals, and badge unlocks in one view.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/70 transition hover:border-white/40 hover:text-white">
            Export report
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {creatorStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            icon={stat.icon}
            accent={stat.accent}
          />
        ))}
      </section>

      <SectionCard title="Daily earnings" subtitle="Creator-only payouts across the last 7 days.">
        <div className="space-y-4">
          <div className="relative h-64 w-full rounded-3xl bg-gradient-to-b from-white/5 to-transparent p-4">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <defs>
                <linearGradient id="creatorEarningsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(251,146,60,0.9)" />
                  <stop offset="100%" stopColor="rgba(251,146,60,0.05)" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#creatorEarningsGradient)" stroke="none" opacity={0.8} />
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
            {dailyCreatorEarnings.map((day) => (
              <div key={day.day}>
                <p className="font-semibold text-white">{day.day}</p>
                <p className="text-orange-200">₹{day.value}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Top tasks" subtitle="High-performing tasks from your recent activity.">
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Completions</th>
                  <th className="px-4 py-3">Payout</th>
                  <th className="px-4 py-3">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#090C12]">
                {topTasks.map((task) => (
                  <tr key={task.name} className="text-sm text-muted-foreground">
                    <td className="px-4 py-4 font-semibold text-white">{task.name}</td>
                    <td className="px-4 py-4">
                      <StatusPill label={task.category} tone="brand" />
                    </td>
                    <td className="px-4 py-4">{task.completions}</td>
                    <td className="px-4 py-4">{task.payout}</td>
                    <td className="px-4 py-4">
                      <StatusPill label={task.approval} tone="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Referral conversion funnel" subtitle="Track how your creator referrals move through the funnel.">
          <div className="space-y-4">
            {referralFunnels.map((stage, index) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-xs text-white/70">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{stage.stage}</p>
                      <p className="text-xs text-white/60">Conversion: {stage.conversion}</p>
                    </div>
                  </div>
                  <span className="text-white">{stage.value}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-400 to-orange-500"
                    style={{ width: `${100 - index * 18}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Badge unlocks" subtitle="Recent gamification highlights from your creator profile.">
        <div className="space-y-4">
          {badgeTimeline.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-1">
                <p className="text-white">{badge.title}</p>
                <p className="text-xs text-white/60">{badge.description}</p>
              </div>
              <StatusPill label={badge.date} tone="info" />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}



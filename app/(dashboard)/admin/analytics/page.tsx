"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Activity, ArrowDown, ArrowUp, BarChart2, CalendarDays, TrendingUp, Users } from "lucide-react";

import { SectionCard, StatCard, StatusPill } from "@/components/dashboard";

type TimeRange = "7d" | "30d" | "90d";
type Segment = "all" | "power" | "new";

type Kpi = { id: string; label: string; value: string; hint?: string; icon?: ReactNode };

const KPIS: Kpi[] = [
  { id: "k1", label: "Total earned", value: "₹1.24L", hint: "+8% vs last week", icon: <IconBadge icon={<TrendingUp className="h-4 w-4" />} /> },
  { id: "k2", label: "Active users", value: "3,420", hint: "+72 new", icon: <IconBadge icon={<Users className="h-4 w-4" />} /> },
  { id: "k3", label: "Conversion rate", value: "41%", hint: "Last 7 days", icon: <IconBadge icon={<Activity className="h-4 w-4" />} /> },
  { id: "k4", label: "New signups", value: "1,280", hint: "+62 vs week", icon: <IconBadge icon={<CalendarDays className="h-4 w-4" />} /> },
];

const EARNINGS_TREND_BY_RANGE: Record<TimeRange, { label: string; value: number }[]> = {
  "7d": [
    { label: "Mon", value: 42000 },
    { label: "Tue", value: 51000 },
    { label: "Wed", value: 46800 },
    { label: "Thu", value: 52000 },
    { label: "Fri", value: 61000 },
    { label: "Sat", value: 39000 },
    { label: "Sun", value: 45000 },
  ],
  "30d": [
    { label: "W1", value: 182000 },
    { label: "W2", value: 194000 },
    { label: "W3", value: 205000 },
    { label: "W4", value: 216000 },
  ],
  "90d": [
    { label: "Jan", value: 520000 },
    { label: "Feb", value: 548000 },
    { label: "Mar", value: 603000 },
  ],
};

const ENGAGEMENT_TREND: Record<Segment, { label: string; active: number; returning: number }[]> = {
  all: [
    { label: "Mon", active: 2100, returning: 900 },
    { label: "Tue", active: 2300, returning: 1000 },
    { label: "Wed", active: 2200, returning: 980 },
    { label: "Thu", active: 2400, returning: 1100 },
    { label: "Fri", active: 2600, returning: 1200 },
    { label: "Sat", active: 2000, returning: 800 },
    { label: "Sun", active: 1900, returning: 760 },
  ],
  power: [
    { label: "Mon", active: 680, returning: 420 },
    { label: "Tue", active: 720, returning: 450 },
    { label: "Wed", active: 710, returning: 440 },
    { label: "Thu", active: 760, returning: 480 },
    { label: "Fri", active: 810, returning: 520 },
    { label: "Sat", active: 640, returning: 380 },
    { label: "Sun", active: 600, returning: 360 },
  ],
  new: [
    { label: "Mon", active: 520, returning: 120 },
    { label: "Tue", active: 610, returning: 150 },
    { label: "Wed", active: 580, returning: 140 },
    { label: "Thu", active: 640, returning: 160 },
    { label: "Fri", active: 690, returning: 180 },
    { label: "Sat", active: 510, returning: 130 },
    { label: "Sun", active: 480, returning: 120 },
  ],
};

// Engagement data by segment and time range for comparison mode
const ENGAGEMENT_BY_SEGMENT: Record<TimeRange, { power: { label: string; active: number; returning: number }[]; new: { label: string; active: number; returning: number }[] }> = {
  "7d": {
    power: [
      { label: "Mon", active: 680, returning: 420 },
      { label: "Tue", active: 720, returning: 450 },
      { label: "Wed", active: 710, returning: 440 },
      { label: "Thu", active: 760, returning: 480 },
      { label: "Fri", active: 810, returning: 520 },
      { label: "Sat", active: 640, returning: 380 },
      { label: "Sun", active: 600, returning: 360 },
    ],
    new: [
      { label: "Mon", active: 520, returning: 120 },
      { label: "Tue", active: 610, returning: 150 },
      { label: "Wed", active: 580, returning: 140 },
      { label: "Thu", active: 640, returning: 160 },
      { label: "Fri", active: 690, returning: 180 },
      { label: "Sat", active: 510, returning: 130 },
      { label: "Sun", active: 480, returning: 120 },
    ],
  },
  "30d": {
    power: [
      { label: "W1", active: 4800, returning: 2900 },
      { label: "W2", active: 5100, returning: 3100 },
      { label: "W3", active: 5300, returning: 3200 },
      { label: "W4", active: 5500, returning: 3400 },
    ],
    new: [
      { label: "W1", active: 3600, returning: 800 },
      { label: "W2", active: 4100, returning: 950 },
      { label: "W3", active: 3900, returning: 920 },
      { label: "W4", active: 4300, returning: 1000 },
    ],
  },
  "90d": {
    power: [
      { label: "Jan", active: 19800, returning: 12200 },
      { label: "Feb", active: 21200, returning: 13100 },
      { label: "Mar", active: 22800, returning: 14100 },
    ],
    new: [
      { label: "Jan", active: 15200, returning: 3600 },
      { label: "Feb", active: 16800, returning: 4100 },
      { label: "Mar", active: 17500, returning: 4300 },
    ],
  },
};

// Overlay stats for segments (session length in minutes, visit frequency per week)
const SEGMENT_STATS: Record<TimeRange, { power: { sessionLength: number; visitFrequency: number }; new: { sessionLength: number; visitFrequency: number } }> = {
  "7d": { power: { sessionLength: 12.4, visitFrequency: 5.2 }, new: { sessionLength: 6.8, visitFrequency: 2.1 } },
  "30d": { power: { sessionLength: 13.1, visitFrequency: 5.5 }, new: { sessionLength: 7.2, visitFrequency: 2.3 } },
  "90d": { power: { sessionLength: 13.8, visitFrequency: 5.8 }, new: { sessionLength: 7.6, visitFrequency: 2.5 } },
};

const FUNNEL_STEPS = [
  { label: "Visited listing", value: 100 },
  { label: "Started task", value: 71 },
  { label: "Uploaded proof", value: 54 },
  { label: "Approved", value: 41 },
];

const COHORTS = [
  { label: "Week 1", users: 420, d7: "74%", d14: "63%", d30: "48%" },
  { label: "Week 2", users: 380, d7: "71%", d14: "59%", d30: "45%" },
  { label: "Week 3", users: 395, d7: "76%", d14: "64%", d30: "49%" },
  { label: "Week 4", users: 410, d7: "78%", d14: "66%", d30: "51%" },
];

const WEEKLY_DIGEST = {
  topReferrer: "Aarav J.",
  topReferrerChange: "+18% vs last week",
  biggestDropStep: "Uploaded proof → Approved",
  biggestDropRate: "13% drop-off",
  bestCohort: "Week 4",
  bestCohortMetric: "51% D30 retention",
};

const RECENT_EVENTS = [
  { id: "e1", type: "Referral", title: "Referral approved — Meera S.", time: "2h ago", tone: "success" as const },
  { id: "e2", type: "Withdrawal", title: "Withdrawal requested — Ravi K.", time: "5h ago", tone: "pending" as const },
  { id: "e3", type: "Submission", title: "Task submission flagged — Aditya P.", time: "12h ago", tone: "warning" as const },
  { id: "e4", type: "System", title: 'Campaign "Navi UPI Rush" started', time: "1d ago", tone: "info" as const },
];

function SegmentComparisonInsights({ timeRange }: { timeRange: TimeRange }) {
  const stats = SEGMENT_STATS[timeRange];
  const visitFrequencyRatio = stats.power.visitFrequency / stats.new.visitFrequency;
  const sessionLengthDiff = ((stats.power.sessionLength - stats.new.sessionLength) / stats.new.sessionLength) * 100;
  const returningRateDiff = 24; // Mock: Power users have 24% higher returning rate

  const insights = [
    {
      label: "Visit frequency",
      value: `Power users visited ${visitFrequencyRatio.toFixed(1)}× more often than New users`,
      trend: "up" as const,
      color: "emerald",
    },
    {
      label: "Returning rate",
      value: `Returning rate was +${returningRateDiff}% higher for Power users`,
      trend: "up" as const,
      color: "emerald",
    },
    {
      label: "Session length",
      value: `Power users spend ${sessionLengthDiff.toFixed(0)}% longer per session`,
      trend: "up" as const,
      color: "emerald",
    },
  ];

  return (
    <div className="mt-4 space-y-2" role="list" aria-label="Segment comparison insights">
      {insights.map((insight, index) => (
        <div
          key={insight.label}
          role="listitem"
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#050712] px-3 py-2 text-xs"
        >
          <div
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 ${
              insight.trend === "up"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/40 bg-red-500/10 text-red-300"
            }`}
            aria-label={`${insight.trend === "up" ? "Increase" : "Decrease"} in ${insight.label}`}
          >
            {insight.trend === "up" ? (
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ArrowDown className="h-3 w-3" aria-hidden="true" />
            )}
            <span className="font-semibold">{insight.label}</span>
          </div>
          <span className="flex-1 text-white/80">{insight.value}</span>
        </div>
      ))}
    </div>
  );
}

type ComparisonMode = "single" | "dual" | "split";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [segment, setSegment] = useState<Segment>("all");
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("single");

  const earningsSeries = EARNINGS_TREND_BY_RANGE[timeRange];
  const engagementSeries = ENGAGEMENT_TREND[segment];
  const segmentData = ENGAGEMENT_BY_SEGMENT[timeRange];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Insights</p>
        <h1 className="text-3xl font-semibold text-white">Analytics & trends</h1>
        <p className="text-sm text-muted-foreground">High-level performance of referrals, tasks, and payouts. Data shown is mock-only.</p>
      </header>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-[#060914] px-4 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/60" id="time-range-label">Time range</span>
          <div
            className="flex gap-1.5"
            role="radiogroup"
            aria-labelledby="time-range-label"
            aria-label="Select time range for analytics"
          >
            {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
              <button
                key={range}
                type="button"
                role="radio"
                aria-checked={timeRange === range}
                aria-label={range === "7d" ? "Last 7 days time range" : range === "30d" ? "Last 30 days time range" : "Last 90 days time range"}
                onClick={() => setTimeRange(range)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setTimeRange(range);
                  }
                }}
                className={[
                  "rounded-full border px-3 py-1",
                  "transition text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-[#060914]",
                  timeRange === range
                    ? "border-orange-500/70 bg-orange-500/15 text-white shadow-inner"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30",
                ].join(" ")}
              >
                {range === "7d" ? "Last 7 days" : range === "30d" ? "Last 30 days" : "Last 90 days"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/60" id="segment-label">Segment</span>
          <div
            className="flex gap-1.5"
            role="radiogroup"
            aria-labelledby="segment-label"
            aria-label="Select user segment for analytics"
          >
            {(["all", "power", "new"] as Segment[]).map((seg) => (
              <button
                key={seg}
                type="button"
                role="radio"
                aria-checked={segment === seg}
                aria-label={seg === "all" ? "All users segment" : seg === "power" ? "Power users segment" : "New users this month segment"}
                onClick={() => setSegment(seg)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSegment(seg);
                  }
                }}
                className={[
                  "rounded-full border px-3 py-1",
                  "transition text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-[#060914]",
                  segment === seg
                    ? "border-emerald-500/70 bg-emerald-500/15 text-white shadow-inner"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30",
                ].join(" ")}
              >
                {seg === "all" ? "All users" : seg === "power" ? "Power users" : "New this month"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => (
          <StatCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
            icon={kpi.icon ?? <BarChart2 className="h-4 w-4 text-white/80" />}
            accent="from-white/10 via-transparent to-transparent"
          />
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Earnings overview"
          subtitle={timeRange === "7d" ? "Approved earnings per day." : timeRange === "30d" ? "Approved earnings per week." : "Approved earnings per month."}
          actions={
            <button
              type="button"
              onClick={() => exportEarningsCsv(earningsSeries, timeRange)}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 hover:border-white/40 hover:text-white"
            >
              Download CSV
            </button>
          }
        >
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
            <EarningsAreaChart data={earningsSeries} />
            <div
              className={`mt-6 grid text-center text-xs text-muted-foreground ${
                earningsSeries.length === 7 ? "grid-cols-7" : earningsSeries.length === 4 ? "grid-cols-4" : "grid-cols-3"
              }`}
            >
              {earningsSeries.map((point) => (
                <div key={point.label}>
                  <p className="font-semibold text-white">{formatRupeeShort(point.value)}</p>
                  <p>{point.label}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Recent activity" subtitle="Live events (mock)">
          <ul className="space-y-3">
            {RECENT_EVENTS.map((event) => (
              <li
                key={event.id}
                className="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <StatusPill label={event.type} tone={event.tone} />
                    <span className="font-semibold">{event.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/60">{event.time}</p>
                </div>
                <button className="text-xs text-orange-300">View</button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Task-to-approval conversion" subtitle="41% conversion last 7 days.">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 rounded-full bg-white/10">
                <div className="h-3 rounded-full bg-emerald-500" style={{ width: "41%" }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">1280 tasks submitted</p>
            </div>
            <div className="text-sm font-semibold text-white">41%</div>
          </div>
        </SectionCard>

        <SectionCard title="Top channels" subtitle="Where conversions come from.">
          <ChannelRow name="App referrals" percentage={50} rupee="₹62k" />
          <ChannelRow name="UPI tasks" percentage={30} rupee="₹37k" />
          <ChannelRow name="Social posts" percentage={20} rupee="₹21k" />
        </SectionCard>

        <SectionCard title="Audit trail" subtitle="Recent admin actions.">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>John D. approved WD-302 (2h ago)</li>
            <li>Anna R. updated campaign settings (5h ago)</li>
            <li>Automated fraud rule flagged 3 submissions (yesterday)</li>
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title="Weekly digest"
        subtitle="Quick snapshot of what changed most in the last 7 days (mock)."
        className="border-white/10 bg-gradient-to-r from-white/10/5 to-transparent"
      >
        <div className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground" role="list" aria-label="Weekly digest metrics">
          <div className="rounded-2xl border border-white/10 bg-[#050712] p-4" role="listitem">
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/60" aria-label="Top referrer metric">Top referrer</p>
            <p className="mt-2 text-base font-semibold text-white">{WEEKLY_DIGEST.topReferrer}</p>
            <p className="mt-1 text-xs text-emerald-300">{WEEKLY_DIGEST.topReferrerChange}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#050712] p-4" role="listitem">
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/60" aria-label="Biggest funnel drop-off metric">Biggest funnel drop-off</p>
            <p className="mt-2 text-base font-semibold text-white">{WEEKLY_DIGEST.biggestDropStep}</p>
            <p className="mt-1 text-xs text-orange-300">{WEEKLY_DIGEST.biggestDropRate}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#050712] p-4" role="listitem">
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/60" aria-label="Highest retention cohort metric">Highest retention cohort</p>
            <p className="mt-2 text-base font-semibold text-white">{WEEKLY_DIGEST.bestCohort}</p>
            <p className="mt-1 text-xs text-sky-300">{WEEKLY_DIGEST.bestCohortMetric}</p>
          </div>
        </div>
        <SegmentComparisonInsights timeRange={timeRange} />
      </SectionCard>

      <SectionCard
        title="Engagement & retention"
        subtitle="See how users come back and where they drop off across the task funnel."
        className="border-white/10 bg-white/5"
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => exportFunnelCsv(FUNNEL_STEPS)}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 hover:border-white/40 hover:text-white"
            >
              Export funnel CSV
            </button>
            <button
              type="button"
              onClick={() => exportCohortsCsv(COHORTS)}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 hover:border-white/40 hover:text-white"
            >
              Export cohorts CSV
            </button>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#050712] px-4 py-3">
          <span className="text-xs text-white/60" id="comparison-mode-label">Comparison mode</span>
          <div
            className="flex gap-1.5"
            role="radiogroup"
            aria-labelledby="comparison-mode-label"
            aria-label="Select engagement chart view mode"
          >
            {(["single", "dual", "split"] as ComparisonMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={comparisonMode === mode}
                aria-label={mode === "single" ? "Single view mode" : mode === "dual" ? "Compare segments mode" : "Split view mode"}
                onClick={() => setComparisonMode(mode)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setComparisonMode(mode);
                  }
                }}
                className={[
                  "rounded-full border px-3 py-1",
                  "transition text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-[#050712]",
                  comparisonMode === mode
                    ? "border-orange-500/70 bg-orange-500/15 text-white shadow-inner"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30",
                ].join(" ")}
              >
                {mode === "single" ? "Single view" : mode === "dual" ? "Compare segments" : "Split view"}
              </button>
            ))}
          </div>
        </div>

        {comparisonMode === "single" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <EngagementPanel
              series={engagementSeries}
              timeRange={timeRange}
              overlayStats={segment !== "all" ? SEGMENT_STATS[timeRange][segment as "power" | "new"] : undefined}
            />
            <FunnelChart steps={FUNNEL_STEPS} />
          </div>
        ) : comparisonMode === "dual" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <DualLineComparisonChart powerData={segmentData.power} newData={segmentData.new} timeRange={timeRange} />
            <FunnelChart steps={FUNNEL_STEPS} />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <SplitViewChart segment="power" data={segmentData.power} timeRange={timeRange} />
            <SplitViewChart segment="new" data={segmentData.new} timeRange={timeRange} />
          </div>
        )}

        <RetentionTable cohorts={COHORTS} />
      </SectionCard>
    </div>
  );
}

function EarningsAreaChart({ data }: { data: { label: string; value: number }[] }) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const height = 180;
  const width = 700;
  const padding = 12;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = data.map((point, index) => {
    const x = padding + (innerW * index) / (data.length - 1);
    const ratio = max === min ? 0.5 : (point.value - min) / (max - min);
    const y = padding + innerH - ratio * innerH;
    return [x, y];
  });

  const area = `M ${points.map((p) => `${p[0]},${p[1]}`).join(" L ")} L ${padding + innerW},${padding + innerH} L ${padding},${padding + innerH} Z`;
  const stroke = `M ${points.map((p) => `${p[0]},${p[1]}`).join(" L ")}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id="analyticsGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#fb923c" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#analyticsGradient)" />
      <path d={stroke} fill="none" stroke="#fbad50" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChannelRow({ name, percentage, rupee }: { name: string; percentage: number; rupee: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-xs text-muted-foreground">{rupee}</p>
      </div>
      <div className="w-28">
        <div className="h-2 rounded-full bg-white/10">
          <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
}

function IconBadge({ icon }: { icon: ReactNode }) {
  return <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 text-white/80">{icon}</span>;
}

function formatRupeeShort(value: number) {
  if (value >= 100000) return `₹${Math.round(value / 1000)}k`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
  return `₹${value}`;
}

function EngagementLineChart({ data }: { data: { label: string; active: number; returning: number }[] }) {
  const height = 160;
  const width = 700;
  const padding = 16;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const allValues = data.flatMap((point) => [point.active, point.returning]);
  const max = Math.max(...allValues);

  const mapSeries = (key: "active" | "returning") =>
    data.map((point, index) => {
      const x = padding + (innerW * index) / (data.length - 1);
      const ratio = max === 0 ? 0 : point[key] / max;
      const y = padding + innerH - ratio * innerH;
      return [x, y];
    });

  const activePoints = mapSeries("active");
  const returningPoints = mapSeries("returning");

  const toPath = (points: number[][]) => `M ${points.map((p) => `${p[0]},${p[1]}`).join(" L ")}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <path d={toPath(activePoints)} fill="none" stroke="#22c55e" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={toPath(returningPoints)} fill="none" stroke="#38bdf8" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={padding}
          x2={padding + innerW}
          y1={padding + innerH * t}
          y2={padding + innerH * t}
          stroke="rgba(255,255,255,0.04)"
        />
      ))}
    </svg>
  );
}

function EngagementPanel({
  series,
  timeRange,
  overlayStats,
}: {
  series: { label: string; active: number; returning: number }[];
  timeRange?: TimeRange;
  overlayStats?: { sessionLength: number; visitFrequency: number };
}) {
  return (
    <div className="space-y-4" role="region" aria-label="User engagement chart">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Daily active vs returning</span>
        <div className="inline-flex items-center gap-2" role="list" aria-label="Chart legend">
          <span className="flex items-center gap-1" role="listitem">
            <span className="h-1.5 w-3 rounded-full bg-emerald-400" aria-hidden="true" />{" "}
            <span aria-label="Active users line">Active</span>
          </span>
          <span className="flex items-center gap-1" role="listitem">
            <span className="h-1.5 w-3 rounded-full bg-sky-400" aria-hidden="true" />{" "}
            <span aria-label="Returning users line">Returning</span>
          </span>
        </div>
      </div>
      <EngagementLineChart data={series} />
      {overlayStats && (
        <div className="flex gap-4 rounded-xl border border-white/10 bg-[#050712] px-3 py-2 text-xs" role="group" aria-label="Session statistics">
          <div>
            <span className="text-white/60">Avg session:</span>
            <span className="ml-2 font-semibold text-white" aria-label={`Average session length ${overlayStats.sessionLength.toFixed(1)} minutes`}>
              {overlayStats.sessionLength.toFixed(1)} min
            </span>
          </div>
          <div>
            <span className="text-white/60">Visits/week:</span>
            <span className="ml-2 font-semibold text-white" aria-label={`Visit frequency ${overlayStats.visitFrequency.toFixed(1)} visits per week`}>
              {overlayStats.visitFrequency.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function DualLineComparisonChart({
  powerData,
  newData,
  timeRange,
}: {
  powerData: { label: string; active: number; returning: number }[];
  newData: { label: string; active: number; returning: number }[];
  timeRange: TimeRange;
}) {
  const height = 200;
  const width = 700;
  const padding = 16;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  // Combine both datasets to find max for scaling
  const allValues = [...powerData.flatMap((p) => [p.active, p.returning]), ...newData.flatMap((p) => [p.active, p.returning])];
  const max = Math.max(...allValues);

  const mapSeries = (data: typeof powerData, key: "active" | "returning") =>
    data.map((point, index) => {
      const x = padding + (innerW * index) / (data.length - 1);
      const ratio = max === 0 ? 0 : point[key] / max;
      const y = padding + innerH - ratio * innerH;
      return [x, y];
    });

  const powerActive = mapSeries(powerData, "active");
  const powerReturning = mapSeries(powerData, "returning");
  const newActive = mapSeries(newData, "active");
  const newReturning = mapSeries(newData, "returning");

  const toPath = (points: number[][]) => `M ${points.map((p) => `${p[0]},${p[1]}`).join(" L ")}`;

  const stats = SEGMENT_STATS[timeRange];

  return (
    <div className="space-y-4" role="region" aria-label="Power users versus New users comparison chart">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Power users vs New users</span>
        <div className="inline-flex items-center gap-3" role="list" aria-label="Chart legend">
          <span className="flex items-center gap-1" role="listitem">
            <span className="h-1.5 w-3 rounded-full bg-orange-400" aria-hidden="true" />{" "}
            <span aria-label="Power users active line">Power active</span>
          </span>
          <span className="flex items-center gap-1" role="listitem">
            <span className="h-1.5 w-3 rounded-full bg-purple-400" aria-hidden="true" />{" "}
            <span aria-label="New users active line">New active</span>
          </span>
          <span className="flex items-center gap-1" role="listitem">
            <span className="h-1.5 w-3 rounded-full bg-sky-400" aria-hidden="true" />{" "}
            <span aria-label="Returning users line">Returning</span>
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Power users - active (orange) */}
        <path d={toPath(powerActive)} fill="none" stroke="#fb923c" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {/* New users - active (purple) */}
        <path d={toPath(newActive)} fill="none" stroke="#a855f7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
        {/* Returning (both segments, lighter) */}
        <path d={toPath(powerReturning)} fill="none" stroke="#38bdf8" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
        <path d={toPath(newReturning)} fill="none" stroke="#38bdf8" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} strokeDasharray="3 3" />
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={padding}
            x2={padding + innerW}
            y1={padding + innerH * t}
            y2={padding + innerH * t}
            stroke="rgba(255,255,255,0.04)"
          />
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-[#050712] px-3 py-2 text-xs" role="group" aria-label="Segment statistics comparison">
        <div>
          <span className="text-white/60">Power:</span>
          <span className="ml-2 font-semibold text-orange-300" aria-label={`Power users average session ${stats.power.sessionLength.toFixed(1)} minutes`}>
            {stats.power.sessionLength.toFixed(1)} min avg
          </span>
          <span className="ml-2 text-white/50" aria-label={`Power users visit frequency ${stats.power.visitFrequency.toFixed(1)} visits per week`}>
            · {stats.power.visitFrequency.toFixed(1)} visits/week
          </span>
        </div>
        <div>
          <span className="text-white/60">New:</span>
          <span className="ml-2 font-semibold text-purple-300" aria-label={`New users average session ${stats.new.sessionLength.toFixed(1)} minutes`}>
            {stats.new.sessionLength.toFixed(1)} min avg
          </span>
          <span className="ml-2 text-white/50" aria-label={`New users visit frequency ${stats.new.visitFrequency.toFixed(1)} visits per week`}>
            · {stats.new.visitFrequency.toFixed(1)} visits/week
          </span>
        </div>
      </div>
    </div>
  );
}

function SplitViewChart({
  segment,
  data,
  timeRange,
}: {
  segment: "power" | "new";
  data: { label: string; active: number; returning: number }[];
  timeRange: TimeRange;
}) {
  const height = 180;
  const width = 700;
  const padding = 16;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const allValues = data.flatMap((p) => [p.active, p.returning]);
  const max = Math.max(...allValues);

  const mapSeries = (key: "active" | "returning") =>
    data.map((point, index) => {
      const x = padding + (innerW * index) / (data.length - 1);
      const ratio = max === 0 ? 0 : point[key] / max;
      const y = padding + innerH - ratio * innerH;
      return [x, y];
    });

  const activePoints = mapSeries("active");
  const returningPoints = mapSeries("returning");

  const toPath = (points: number[][]) => `M ${points.map((p) => `${p[0]},${p[1]}`).join(" L ")}`;

  const stats = SEGMENT_STATS[timeRange];
  const segmentStats = segment === "power" ? stats.power : stats.new;
  const segmentLabel = segment === "power" ? "Power users" : "New users";
  const activeColor = segment === "power" ? "#fb923c" : "#a855f7";
  const textColorClass = segment === "power" ? "text-orange-300" : "text-purple-300";
  const bgColorClass = segment === "power" ? "bg-orange-400" : "bg-purple-400";

  return (
    <div className="space-y-4" role="region" aria-label={`${segmentLabel} engagement chart`}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-semibold text-white">{segmentLabel}</span>
        <div className="inline-flex items-center gap-2" role="list" aria-label="Chart legend">
          <span className="flex items-center gap-1" role="listitem">
            <span className={`h-1.5 w-3 rounded-full ${bgColorClass}`} aria-hidden="true" />{" "}
            <span aria-label={`${segmentLabel} active users line`}>Active</span>
          </span>
          <span className="flex items-center gap-1" role="listitem">
            <span className="h-1.5 w-3 rounded-full bg-sky-400" aria-hidden="true" />{" "}
            <span aria-label={`${segmentLabel} returning users line`}>Returning</span>
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <path
          d={toPath(activePoints)}
          fill="none"
          stroke={activeColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d={toPath(returningPoints)} fill="none" stroke="#38bdf8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={padding}
            x2={padding + innerW}
            y1={padding + innerH * t}
            y2={padding + innerH * t}
            stroke="rgba(255,255,255,0.04)"
          />
        ))}
      </svg>
      <div className="rounded-xl border border-white/10 bg-[#050712] px-3 py-2 text-xs" role="group" aria-label={`${segmentLabel} session statistics`}>
        <div className="flex gap-4">
          <div>
            <span className="text-white/60">Avg session:</span>
            <span className={`ml-2 font-semibold ${textColorClass}`} aria-label={`${segmentLabel} average session length ${segmentStats.sessionLength.toFixed(1)} minutes`}>
              {segmentStats.sessionLength.toFixed(1)} min
            </span>
          </div>
          <div>
            <span className="text-white/60">Visits/week:</span>
            <span className={`ml-2 font-semibold ${textColorClass}`} aria-label={`${segmentLabel} visit frequency ${segmentStats.visitFrequency.toFixed(1)} visits per week`}>
              {segmentStats.visitFrequency.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FunnelChart({ steps }: { steps: typeof FUNNEL_STEPS }) {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.25em] text-white/60">Funnel drop-off</p>
      <div className="space-y-3 text-sm text-muted-foreground">
        {steps.map((step, index) => (
          <div key={step.label} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-white">
                {index + 1}. {step.label}
              </span>
              <span className="text-xs text-white/60">{step.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-emerald-400"
                style={{ width: `${step.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetentionTable({ cohorts }: { cohorts: typeof COHORTS }) {
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-[#050712] p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-white/60">Cohort retention (mock)</p>
      <div className="mt-3 overflow-x-auto text-xs">
        <table className="w-full min-w-[420px] border-separate border-spacing-y-1 text-left">
          <thead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <tr>
              <th className="px-2 py-1">Cohort</th>
              <th className="px-2 py-1">Users</th>
              <th className="px-2 py-1">D7</th>
              <th className="px-2 py-1">D14</th>
              <th className="px-2 py-1">D30</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort) => (
              <tr key={cohort.label} className="rounded-xl bg-white/5 text-[13px] text-white/80">
                <td className="rounded-l-xl px-2 py-1.5">{cohort.label}</td>
                <td className="px-2 py-1.5">{cohort.users}</td>
                <td className="px-2 py-1.5">{cohort.d7}</td>
                <td className="px-2 py-1.5">{cohort.d14}</td>
                <td className="rounded-r-xl px-2 py-1.5">{cohort.d30}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function exportEarningsCsv(series: { label: string; value: number }[], range: TimeRange) {
  const header = "label,value\n";
  const rows = series.map((point) => `${point.label},${point.value}`);
  triggerCsvDownload(`analytics-earnings-${range}.csv`, header + rows.join("\n"));
}

function exportFunnelCsv(steps: typeof FUNNEL_STEPS) {
  const header = "step,percent\n";
  const rows = steps.map((step, index) => `${index + 1} - ${step.label},${step.value}`);
  triggerCsvDownload("analytics-funnel.csv", header + rows.join("\n"));
}

function exportCohortsCsv(cohorts: typeof COHORTS) {
  const header = "cohort,users,d7,d14,d30\n";
  const rows = cohorts.map((c) => `${c.label},${c.users},${c.d7},${c.d14},${c.d30}`);
  triggerCsvDownload("analytics-cohorts.csv", header + rows.join("\n"));
}

function triggerCsvDownload(filename: string, csv: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


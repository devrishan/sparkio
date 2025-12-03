"use client";

import {
  Users,
  Share2,
  Wallet,
  ShieldAlert,
  LineChart,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

const statCards = [
  {
    label: "Total users",
    value: "1,324",
    subtext: "Registered members",
    icon: Users,
    accent: "from-orange-500/15 via-orange-500/5 to-transparent",
  },
  {
    label: "Active referrals",
    value: "238",
    subtext: "With approved earnings",
    icon: Share2,
    accent: "from-blue-500/15 via-blue-500/5 to-transparent",
  },
  {
    label: "Pending withdrawals",
    value: "12 requests",
    subtext: "₹14,600 pending",
    icon: Wallet,
    accent: "from-emerald-500/15 via-emerald-500/5 to-transparent",
  },
  {
    label: "Fraud blocked",
    value: "7",
    subtext: "Last 30 days",
    icon: ShieldAlert,
    accent: "from-red-500/15 via-red-500/5 to-transparent",
  },
];

const earningsTrend = [
  { day: "Mon", value: 42000 },
  { day: "Tue", value: 51000 },
  { day: "Wed", value: 46800 },
  { day: "Thu", value: 52000 },
  { day: "Fri", value: 61000 },
  { day: "Sat", value: 39000 },
  { day: "Sun", value: 45000 },
];

const submissionsFunnel = [
  { label: "Submitted", value: 1280, tone: "bg-slate-700" },
  { label: "Under review", value: 420, tone: "bg-blue-600/70" },
  { label: "Approved", value: 860, tone: "bg-emerald-500/80" },
  { label: "Rejected / fraud", value: 96, tone: "bg-red-500/80" },
];

const withdrawals = [
  { user: "Ayushi S.", upi: "9213", amount: "₹2,400", status: "Pending", requested: "Today · 09:12" },
  { user: "Ravi K.", upi: "1180", amount: "₹7,800", status: "Approved", requested: "Yesterday · 19:44" },
  { user: "Fatima H.", upi: "4422", amount: "₹1,250", status: "Approved", requested: "Yesterday · 11:05" },
  { user: "Dev M.", upi: "3301", amount: "₹3,900", status: "Rejected", requested: "Aug 21 · 15:28" },
  { user: "Shreya V.", upi: "0027", amount: "₹5,100", status: "Pending", requested: "Aug 21 · 09:57" },
  { user: "Kunal T.", upi: "7719", amount: "₹980", status: "Approved", requested: "Aug 20 · 20:03" },
];

const flaggedActivity = [
  { user: "Aditya P.", reason: "Multiple UPI IDs", source: "Withdrawal", date: "Aug 21 · 18:42" },
  { user: "Kirti L.", reason: "Screenshot mismatch", source: "Task proof", date: "Aug 21 · 11:09" },
  { user: "Zaid R.", reason: "Repeated device", source: "Referral", date: "Aug 20 · 23:10" },
  { user: "Simran C.", reason: "Velocity spike", source: "App referral", date: "Aug 20 · 09:54" },
  { user: "Pooja N.", reason: "High dispute rate", source: "UPI task", date: "Aug 19 · 15:42" },
];

const statusStyles: Record<
  string,
  { text: string; badge: string }
> = {
  Pending: {
    text: "text-amber-300",
    badge: "bg-amber-500/10 text-amber-200 border border-amber-500/30",
  },
  Approved: {
    text: "text-emerald-300",
    badge: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/30",
  },
  Rejected: {
    text: "text-red-300",
    badge: "bg-red-500/10 text-red-200 border border-red-500/30",
  },
};

export default function AdminDashboardPage() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const maxValue = Math.max(...earningsTrend.map((item) => item.value));
  const chartPoints = earningsTrend
    .map((item, index) => {
      const x = (index / (earningsTrend.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 80 - 5;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const areaPath = `M0,100 L${chartPoints.replace(/ /g, " L")} L100,100 Z`;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent px-6 py-6 shadow-lg shadow-black/40 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.4em] text-orange-200/80">
            Control room
          </p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Good afternoon, Admin_user
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor referrals, withdrawals, and fraud flags across Earniq.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground lg:items-end">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-emerald-200">
            Sandbox demo
          </span>
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80">
            {formattedDate} · {formattedTime}
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <article
            key={card.label}
            className={`rounded-3xl border border-white/5 bg-gradient-to-br ${card.accent} p-5 shadow-inner shadow-black/30 transition hover:-translate-y-1 hover:shadow-black/70`}
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{card.label}</span>
              <card.icon className="h-4 w-4 text-white/70" aria-hidden="true" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.subtext}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article className="rounded-3xl border border-white/5 bg-[#0b0f18] p-6 shadow-xl shadow-black/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Earnings overview
              </p>
              <h2 className="text-2xl font-semibold text-white">Last 7 days</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              +12% vs last week
            </span>
          </div>
          <div className="mt-8 space-y-4">
            <div className="relative h-56 w-full rounded-3xl bg-gradient-to-b from-white/5 to-transparent p-4">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="earningsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(251, 146, 60, 0.8)" />
                    <stop offset="100%" stopColor="rgba(251, 146, 60, 0.05)" />
                  </linearGradient>
                </defs>
                <path
                  d={areaPath}
                  fill="url(#earningsGradient)"
                  stroke="none"
                  opacity={0.8}
                />
                <polyline
                  points={chartPoints}
                  fill="none"
                  stroke="rgba(251, 146, 60, 0.9)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {earningsTrend.map((day) => (
                <div key={day.day} className="text-center">
                  <p>{day.day}</p>
                  <p className="font-semibold text-white">
                    ₹{(day.value / 1000).toFixed(1)}k
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-white/5 bg-[#0b0f18] p-6 shadow-xl shadow-black/50">
          <div className="flex items-center gap-3">
            <LineChart className="h-5 w-5 text-orange-300" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Submissions funnel
              </p>
              <h2 className="text-xl font-semibold text-white">Task lifecycle</h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {submissionsFunnel.map((stage) => (
              <div key={stage.label}>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{stage.label}</span>
                  <span className="font-semibold text-white">{stage.value}</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full ${stage.tone}`}
                    style={{ width: `${(stage.value / submissionsFunnel[0].value) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-white/5 bg-[#0b0f18] p-6 shadow-xl shadow-black/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Recent withdrawals
              </p>
              <h2 className="text-xl font-semibold text-white">Dispatch queue</h2>
            </div>
            <button className="text-xs text-orange-300">View all</button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <tr>
                  <th className="pb-3">User</th>
                  <th className="pb-3">UPI</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Requested</th>
                  <th className="pb-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {withdrawals.map((row) => (
                  <tr key={`${row.user}-${row.upi}`} className="text-sm text-muted-foreground">
                    <td className="py-3 font-medium text-white">{row.user}</td>
                    <td className="py-3">••{row.upi}</td>
                    <td className="py-3 font-semibold text-white">{row.amount}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status].badge}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs">{row.requested}</td>
                    <td className="py-3 text-right">
                      <button className="inline-flex items-center gap-1 text-xs font-semibold text-orange-300">
                        View
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-3xl border border-white/5 bg-[#0b0f18] p-6 shadow-xl shadow-black/50">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-red-300" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Flagged activity
              </p>
              <h2 className="text-xl font-semibold text-white">Requires review</h2>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <tr>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Reason</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {flaggedActivity.map((item) => (
                  <tr key={`${item.user}-${item.date}`} className="text-sm text-muted-foreground">
                    <td className="py-3 font-semibold text-white">{item.user}</td>
                    <td className="py-3">{item.reason}</td>
                    <td className="py-3 text-orange-200">{item.source}</td>
                    <td className="py-3 text-right text-xs">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}


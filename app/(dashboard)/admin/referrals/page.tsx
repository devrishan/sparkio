"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ArrowUpRight,
  Users,
  Zap,
  Wallet,
  Medal,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { StatusPill } from "@/components/dashboard";

const summaryCards = [
  { label: "Total referrals", value: "1,280", hint: "+62 vs last week", icon: Users },
  { label: "Active referrers", value: "342", hint: "submitted in 7 days", icon: Zap },
  { label: "Avg. ₹ / referral", value: "₹138", hint: "+₹9 WoW", icon: Wallet },
];

const tiers: Record<
  string,
  { tone: "warning" | "info" | "success"; label: string }
> = {
  Bronze: { tone: "warning", label: "Bronze" },
  Silver: { tone: "info", label: "Silver" },
  Gold: { tone: "success", label: "Gold" },
};

const referrers = [
  {
    id: "#REF-9031",
    name: "Aarav Jain",
    phone: "••••• 913",
    tier: "Gold",
    referred: 92,
    earnings: 24820,
    conversion: "41%",
    lastActivity: "Aug 22 · 11:08",
    joined: "Feb 2024",
    pending: 1680,
    recentUsers: [
      { user: "Priya M.", status: "Active", joined: "Aug 21" },
      { user: "Rahul S.", status: "Dormant", joined: "Aug 18" },
      { user: "••••• 722", status: "Active", joined: "Aug 17" },
    ],
  },
  {
    id: "#REF-9018",
    name: "Meera Shah",
    phone: "••••• 663",
    tier: "Gold",
    referred: 81,
    earnings: 23110,
    conversion: "38%",
    lastActivity: "Aug 22 · 09:51",
    joined: "Jan 2024",
    pending: 940,
    recentUsers: [
      { user: "Sneha V.", status: "Active", joined: "Aug 19" },
      { user: "••••• 991", status: "Blocked", joined: "Aug 18" },
      { user: "Arjun C.", status: "Active", joined: "Aug 17" },
    ],
  },
  {
    id: "#REF-9006",
    name: "Rohit Kumar",
    phone: "••••• 441",
    tier: "Silver",
    referred: 67,
    earnings: 19480,
    conversion: "34%",
    lastActivity: "Aug 22 · 08:12",
    joined: "Mar 2024",
    pending: 720,
    recentUsers: [
      { user: "••••• 502", status: "Dormant", joined: "Aug 21" },
      { user: "Karan T.", status: "Active", joined: "Aug 20" },
      { user: "••••• 611", status: "Active", joined: "Aug 18" },
    ],
  },
  {
    id: "#REF-8988",
    name: "Sneha Chauhan",
    phone: "••••• 277",
    tier: "Silver",
    referred: 58,
    earnings: 17630,
    conversion: "32%",
    lastActivity: "Aug 21 · 20:33",
    joined: "May 2024",
    pending: 540,
    recentUsers: [
      { user: "••••• 904", status: "Active", joined: "Aug 19" },
      { user: "Tanya W.", status: "Dormant", joined: "Aug 17" },
      { user: "••••• 155", status: "Active", joined: "Aug 16" },
    ],
  },
  {
    id: "#REF-8977",
    name: "Varun Pai",
    phone: "••••• 509",
    tier: "Bronze",
    referred: 41,
    earnings: 12200,
    conversion: "29%",
    lastActivity: "Aug 21 · 18:27",
    joined: "Jun 2024",
    pending: 320,
    recentUsers: [
      { user: "••••• 199", status: "Active", joined: "Aug 20" },
      { user: "••••• 377", status: "Dormant", joined: "Aug 17" },
      { user: "••••• 924", status: "Active", joined: "Aug 15" },
    ],
  },
];

const leaderboard = [
  { name: "Aarav Jain", earnings: "₹24.8K", referred: 92 },
  { name: "Meera Shah", earnings: "₹23.1K", referred: 81 },
  { name: "Rohit Kumar", earnings: "₹19.4K", referred: 67 },
  { name: "Sneha Chauhan", earnings: "₹17.6K", referred: 58 },
  { name: "Varun Pai", earnings: "₹12.2K", referred: 41 },
];

const ranges = ["7 days", "30 days", "90 days", "All time"] as const;
const sortOptions = ["Total earnings", "Referrals count", "Recent activity"] as const;

export default function AdminReferralsPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("7 days");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Total earnings");
  const [selectedReferrer, setSelectedReferrer] = useState<(typeof referrers)[number]>();

  const filteredReferrers = useMemo(() => {
    const base = referrers.filter(
      (row) =>
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.id.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "Referrals count") {
      return [...base].sort((a, b) => b.referred - a.referred);
    }
    if (sort === "Recent activity") {
      return base;
    }
    return [...base].sort((a, b) => b.earnings - a.earnings);
  }, [search, sort]);

  return (
    <section className="space-y-8 text-white">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
            Referral mission control
          </p>
          <h1 className="text-3xl font-semibold">Referral performance</h1>
          <p className="text-sm text-muted-foreground">
            Track who’s driving quality users into Earniq.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-1 text-xs text-muted-foreground">
          Mock data · Sandbox
        </span>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-5 shadow-inner shadow-black/30"
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{card.label}</span>
              <card.icon className="h-4 w-4 text-white/70" aria-hidden="true" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">{card.value}</p>
            <p className="text-xs text-orange-200">{card.hint}</p>
          </article>
        ))}
      </section>

      <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-6 shadow-xl shadow-black/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2 text-xs">
            {ranges.map((option) => (
              <button
                key={option}
                onClick={() => setRange(option)}
                className={cn(
                  "rounded-full border px-4 py-1.5 transition",
                  range === option
                    ? "border-orange-500/70 bg-orange-500/10 text-white"
                    : "border-white/10 text-muted-foreground hover:border-white/30"
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 focus-within:border-white/30">
              <Search className="h-4 w-4" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search referrer or ID"
                className="bg-transparent text-white placeholder:text-muted-foreground focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 focus-within:border-white/30">
              Sort by
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as (typeof sortOptions)[number])
                }
                className="bg-transparent text-white focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#050507]">
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <article className="rounded-3xl border border-white/5 bg-[#0b0f18] p-6 shadow-xl shadow-black/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Referrers
                </p>
                <h2 className="text-xl font-semibold text-white">Performance roster</h2>
              </div>
              <button className="text-xs text-orange-300">Export CSV</button>
            </div>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Referrer</th>
                    <th className="px-4 py-3">Tier</th>
                    <th className="px-4 py-3">Referred</th>
                    <th className="px-4 py-3">Approved ₹</th>
                    <th className="px-4 py-3">Conversion</th>
                    <th className="px-4 py-3">Last activity</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#090C12]">
                  {filteredReferrers.map((row) => (
                    <tr key={row.id} className="text-sm text-muted-foreground transition hover:bg-white/5">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{row.name}</p>
                        <p className="text-xs">{row.id} · {row.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <StatusPill label={row.tier} tone={tiers[row.tier].tone} />
                      </td>
                      <td className="px-4 py-4">{row.referred}</td>
                      <td className="px-4 py-4 font-semibold text-white">
                        ₹{row.earnings.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-4">{row.conversion}</td>
                      <td className="px-4 py-4 text-xs">{row.lastActivity}</td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => setSelectedReferrer(row)}
                          className="inline-flex items-center gap-1 rounded-full border border-orange-500/40 px-4 py-1.5 text-xs font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/10"
                        >
                          View
                          <ArrowUpRight className="h-3 w-3" />
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
              <Medal className="h-5 w-5 text-orange-300" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Top referrers
                </p>
                <h2 className="text-xl font-semibold text-white">Leaderboard</h2>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500/15 text-white">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.referred} users
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-orange-200">{entry.earnings}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-[#090C12] p-6 shadow-2xl transition-transform duration-300",
          selectedReferrer ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedReferrer && (
          <div className="flex h-full flex-col space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
                  Referrer profile
                </p>
                <h2 className="text-2xl font-semibold text-white">{selectedReferrer.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedReferrer.id} · Joined {selectedReferrer.joined}
                </p>
              </div>
              <button
                onClick={() => setSelectedReferrer(undefined)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground transition hover:border-white/40 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  Total referred
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {selectedReferrer.referred}
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  Approved earnings
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  ₹{selectedReferrer.earnings.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  Pending earnings
                </p>
                <p className="mt-2 text-2xl font-semibold text-amber-200">
                  ₹{selectedReferrer.pending.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  Conversion rate
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {selectedReferrer.conversion}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-white">
                <TrendingUp className="h-4 w-4 text-orange-300" />
                Recent referred users
              </div>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                {selectedReferrer.recentUsers.map((entry) => (
                  <div
                    key={`${entry.user}-${entry.joined}`}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-[#050507] px-3 py-2"
                  >
                    <div>
                      <p className="text-white">{entry.user}</p>
                      <p className="text-xs">{entry.joined}</p>
                    </div>
                    <StatusPill
                      label={entry.status}
                      tone={
                        entry.status === "Blocked"
                          ? "danger"
                          : entry.status === "Dormant"
                          ? "warning"
                          : "success"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedReferrer(undefined)}
              className="mt-auto rounded-2xl border border-white/10 px-4 py-2 text-sm text-muted-foreground transition hover:border-orange-500 hover:text-white"
            >
              Close panel
            </button>
          </div>
        )}
      </div>
      {selectedReferrer && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedReferrer(undefined)}
        />
      )}
    </section>
  );
}

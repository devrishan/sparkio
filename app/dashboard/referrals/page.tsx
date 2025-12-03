"use client";

import { Copy, Share2 } from "lucide-react";

import { SectionCard, StatCard, StatusPill } from "@/components/dashboard";

const referralStats = [
  { label: "Total referrals", value: "184", hint: "+12 this week" },
  { label: "Active referrers", value: "68", hint: "Earning in last 7d" },
  { label: "Referral earnings", value: "₹36,420", hint: "Cleared all-time" },
];

const referralList = [
  { name: "Asha K.", phone: "••••• 913", status: "Active earner", earnings: "₹920" },
  { name: "Dev P.", phone: "••••• 663", status: "Joined", earnings: "₹0" },
  { name: "Kirti R.", phone: "••••• 441", status: "Dormant", earnings: "₹120" },
  { name: "Zaid H.", phone: "••••• 277", status: "Active earner", earnings: "₹480" },
  { name: "Priya L.", phone: "••••• 509", status: "Joined", earnings: "₹0" },
];

const statusTone: Record<string, "success" | "info" | "warning"> = {
  "Active earner": "success",
  Joined: "info",
  Dormant: "warning",
};

const leaderboard = [
  { name: "Aarav J.", earnings: "₹4,820", count: 18 },
  { name: "Meera S.", earnings: "₹4,110", count: 16 },
  { name: "Rohit K.", earnings: "₹3,940", count: 15 },
];

const progress = {
  current: 7,
  goal: 10,
  bonus: "₹1,200 bonus",
};

export default function DashboardReferralsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
          Referral vault
        </p>
        <h1 className="text-3xl font-semibold text-white">Grow by sharing apps you trust</h1>
        <p className="text-sm text-muted-foreground">
          Privacy-first tracking. We only show masked digits and statuses.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {referralStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            accent="from-white/5 via-white/0 to-transparent"
          />
        ))}
      </section>

      <SectionCard title="Referral link" subtitle="Share it across WhatsApp, Insta, or SMS.">
        <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#050507] p-4 text-sm text-muted-foreground md:flex-row md:items-center">
          <p className="flex-1 select-all font-mono text-white">https://earniq.in/r/aditi-39</p>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 transition hover:border-white/40 hover:text-white">
              <Copy className="h-4 w-4" />
              Copy link
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-green-500/40 bg-green-500/10 px-4 py-2 text-green-200 transition hover:border-green-500 hover:bg-green-500/20">
              <Share2 className="h-4 w-4" />
              Share on WhatsApp
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Link is unique to you. Do not share screenshots of your dashboard in public groups.
        </p>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Progress to next bonus" subtitle="Unlock a boost when you hit the goal.">
          <p className="text-sm text-muted-foreground">
            {progress.current}/{progress.goal} referrals · {progress.bonus} waiting
          </p>
          <div className="mt-3 h-3 w-full rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
              style={{ width: `${(progress.current / progress.goal) * 100}%` }}
            />
          </div>
        </SectionCard>

        <SectionCard title="How referrals work" subtitle="Your friend earns first, then you earn.">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Share your secure link via WhatsApp, Insta, or SMS.</li>
            <li>Friend signs up and completes their first earning task.</li>
            <li>Friend gets paid → you earn a percentage instantly.</li>
          </ol>
        </SectionCard>
      </div>

      <SectionCard title="Referral roster" subtitle="Latest joins and their contribution.">
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Earnings contributed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#090C12]">
              {referralList.map((referral) => (
                <tr key={referral.phone} className="text-sm text-muted-foreground">
                  <td className="px-4 py-4 font-semibold text-white">{referral.name}</td>
                  <td className="px-4 py-4 text-xs text-white/70">{referral.phone}</td>
                  <td className="px-4 py-4">
                    <StatusPill label={referral.status} tone={statusTone[referral.status]} />
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-white">{referral.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Top referrers this week" subtitle="Keep up with the leaders for inspiration.">
        <div className="space-y-3">
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
                <p className="text-xs text-muted-foreground">{entry.count} referrals</p>
              </div>
              <p className="text-sm font-semibold text-orange-200">{entry.earnings}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}


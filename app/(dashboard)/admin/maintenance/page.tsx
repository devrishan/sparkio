"use client";

import { RefreshCcw, Calculator, FileDown, Activity, Server, AlarmClock } from "lucide-react";

const maintenanceActions = [
  {
    title: "Clear cache",
    description: "Flush API cache & task suggestion memory for fresh data.",
    icon: RefreshCcw,
  },
  {
    title: "Recalculate stats",
    description: "Rebuild leaderboards, streaks, and payout velocity metrics.",
    icon: Calculator,
  },
  {
    title: "Export logs",
    description: "Download the latest payout + referral logs for audits.",
    icon: FileDown,
  },
];

const systemHealth = [
  { label: "Uptime (30d)", value: "99.98%", icon: Activity },
  { label: "Server load", value: "42% avg", icon: Server },
  { label: "Task queue size", value: "184 pending", icon: AlarmClock },
];

export default function AdminMaintenancePage() {
  return (
    <section className="space-y-8 text-white">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
          Maintenance controls
        </p>
        <h1 className="text-3xl font-semibold">Platform upkeep</h1>
        <p className="text-sm text-muted-foreground">
          Kick off safe operations without risking payouts or member sessions.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {maintenanceActions.map((action) => (
          <article
            key={action.title}
            className="rounded-3xl border border-white/5 bg-[#0b0f18] p-6 shadow-xl shadow-black/50"
          >
            <div className="flex items-center gap-3">
              <action.icon className="h-5 w-5 text-orange-300" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-white">{action.title}</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{action.description}</p>
            <button className="mt-6 w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-muted-foreground opacity-70">
              Action disabled (demo)
            </button>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-6 shadow-inner shadow-black/30">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          System health
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {systemHealth.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <item.icon className="h-4 w-4 text-orange-300" aria-hidden="true" />
                {item.label}
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

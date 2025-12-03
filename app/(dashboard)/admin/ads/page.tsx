"use client";

import { useState } from "react";
import { Megaphone, Plus, Target, BarChart3, X } from "lucide-react";

import { cn } from "@/lib/utils";

const campaigns = [
  {
    name: "Navi UPI Rush",
    budget: "₹3,00,000",
    spend: "₹1,86,420",
    status: "Active",
    tasks: { App: 60, UPI: 30, Social: 10 },
  },
  {
    name: "Cashback Carnival",
    budget: "₹1,80,000",
    spend: "₹74,900",
    status: "Paused",
    tasks: { App: 45, UPI: 20, Social: 35 },
  },
  {
    name: "Weekend Surge",
    budget: "₹2,20,000",
    spend: "₹1,10,600",
    status: "Active",
    tasks: { App: 30, UPI: 50, Social: 20 },
  },
  {
    name: "Influencer Sprint",
    budget: "₹90,000",
    spend: "₹38,200",
    status: "Active",
    tasks: { App: 20, UPI: 10, Social: 70 },
  },
];

export default function AdminAdsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    type: "App",
  });

  return (
    <section className="space-y-8 text-white">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
            Campaign studio
          </p>
          <h1 className="text-3xl font-semibold">Ads & task campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Spin up new task drops and monitor budget pacing.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/50 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
        >
          <Plus className="h-4 w-4" />
          Create new campaign
        </button>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        {campaigns.map((campaign) => {
          const total = Object.values(campaign.tasks).reduce((sum, val) => sum + val, 0);
          return (
            <article
              key={campaign.name}
              className="rounded-3xl border border-white/5 bg-[#0b0f18] p-6 shadow-xl shadow-black/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Campaign
                  </p>
                  <h2 className="text-xl font-semibold text-white">{campaign.name}</h2>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    campaign.status === "Active"
                      ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border border-white/20 text-muted-foreground"
                  )}
                >
                  {campaign.status}
                </span>
              </div>
              <div className="mt-6 grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Budget
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {campaign.budget}
                  </p>
                  <p className="text-xs">Spending plan</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Spent
                  </p>
                  <p className="mt-2 text-lg font-semibold text-orange-200">
                    {campaign.spend}
                  </p>
                  <p className="text-xs">Live expenses</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Task mix
                </p>
                {Object.entries(campaign.tasks).map(([type, value]) => (
                  <div key={type}>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-orange-300" />
                        {type}
                      </span>
                      <span className="font-semibold text-white">
                        {Math.round((value / total) * 100)}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                        style={{ width: `${(value / total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-white/5 bg-[#0b0f18] p-6 shadow-xl shadow-black/50">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-orange-300" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Flight pacing
            </p>
            <h2 className="text-xl font-semibold text-white">Budget overview</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {campaigns.map((campaign) => (
            <div key={`${campaign.name}-pacing`} className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">{campaign.name}</p>
              <p className="text-xs text-muted-foreground">Spend vs budget</p>
              <div className="mt-3 h-2 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  style={{
                    width: `${Math.min(
                      (parseInt(campaign.spend.replace(/\D/g, ""), 10) /
                        parseInt(campaign.budget.replace(/\D/g, ""), 10)) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {campaign.spend} of {campaign.budget}
              </p>
            </div>
          ))}
        </div>
      </section>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0f18] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
                    New campaign
                  </p>
                  <h3 className="text-2xl font-semibold text-white">Create task drop</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form className="mt-6 space-y-4 text-sm text-muted-foreground">
                <label className="space-y-2">
                  <span>Campaign name</span>
                  <input
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Weekend surge drop"
                  />
                </label>
                <label className="space-y-2">
                  <span>Budget (₹)</span>
                  <input
                    value={formData.budget}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, budget: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="200000"
                  />
                </label>
                <label className="space-y-2">
                  <span>Primary task type</span>
                  <select
                    value={formData.type}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, type: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="App" className="bg-[#050507]">
                      App referrals
                    </option>
                    <option value="UPI" className="bg-[#050507]">
                      UPI tasks
                    </option>
                    <option value="Social" className="bg-[#050507]">
                      Social drops
                    </option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full rounded-2xl border border-orange-500/50 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
                >
                  Save campaign (demo)
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

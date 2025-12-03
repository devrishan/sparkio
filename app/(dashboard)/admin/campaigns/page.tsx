"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Package, IndianRupee, Users, Target, ArrowUpRight, X, Calendar, MapPin, Tag, Pause, Edit, AppWindow, CreditCard, Share2 } from "lucide-react";

import { SectionCard, StatCard, StatusPill } from "@/components/dashboard";
import { cn } from "@/lib/utils";

type CampaignStatus = "Active" | "Paused" | "Completed" | "Draft";
type TaskCategory = "App" | "UPI" | "Social";

interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  startDate: string;
  endDate?: string;
  taskDistribution: Record<TaskCategory, number>;
  totalTasks: number;
  completedTasks: number;
  conversionRate: number;
  avgPayout: number;
  minReward: number;
  maxReward: number;
  claimLimit?: number;
  region: string;
  channelTags: string[];
  category: "referral-based" | "one-time" | "evergreen";
  conversionDelta?: number;
  tasksDelta?: number;
}

interface DigitalGood {
  id: string;
  name: string;
  category: TaskCategory;
  payoutRange: string;
  inventory: number;
  claimed: number;
  status: "Available" | "Low stock" | "Out of stock";
}

const CAMPAIGNS: Campaign[] = [
  {
    id: "CAMP-001",
    name: "Navi UPI Rush",
    status: "Active",
    budget: 300000,
    spent: 186420,
    startDate: "Aug 15",
    taskDistribution: { App: 60, UPI: 30, Social: 10 },
    totalTasks: 1200,
    completedTasks: 892,
    conversionRate: 74.3,
    avgPayout: 285,
    minReward: 220,
    maxReward: 360,
    claimLimit: 3,
    region: "All India",
    channelTags: ["UPI", "Fintech", "Recharge"],
    category: "referral-based",
    conversionDelta: 5.2,
    tasksDelta: 12,
  },
  {
    id: "CAMP-002",
    name: "Cashback Carnival",
    status: "Paused",
    budget: 180000,
    spent: 74900,
    startDate: "Aug 10",
    endDate: "Aug 25",
    taskDistribution: { App: 45, UPI: 20, Social: 35 },
    totalTasks: 850,
    completedTasks: 523,
    conversionRate: 61.5,
    avgPayout: 195,
    minReward: 120,
    maxReward: 280,
    claimLimit: 5,
    region: "Metro cities",
    channelTags: ["Multi-category", "Cashback"],
    category: "one-time",
    conversionDelta: -2.1,
    tasksDelta: -8,
  },
  {
    id: "CAMP-003",
    name: "Weekend Surge",
    status: "Active",
    budget: 220000,
    spent: 110600,
    startDate: "Aug 20",
    taskDistribution: { App: 30, UPI: 50, Social: 20 },
    totalTasks: 950,
    completedTasks: 612,
    conversionRate: 64.4,
    avgPayout: 245,
    minReward: 200,
    maxReward: 320,
    claimLimit: 2,
    region: "All India",
    channelTags: ["Weekend", "Surge pricing"],
    category: "evergreen",
    conversionDelta: 3.8,
    tasksDelta: 18,
  },
  {
    id: "CAMP-004",
    name: "Influencer Sprint",
    status: "Completed",
    budget: 90000,
    spent: 88200,
    startDate: "Aug 1",
    endDate: "Aug 15",
    taskDistribution: { App: 20, UPI: 10, Social: 70 },
    totalTasks: 420,
    completedTasks: 398,
    conversionRate: 94.8,
    avgPayout: 220,
    minReward: 25,
    maxReward: 80,
    claimLimit: 10,
    region: "Tier 1 cities",
    channelTags: ["Social", "Influencer", "Viral"],
    category: "one-time",
    conversionDelta: 8.5,
    tasksDelta: 0,
  },
];

const DIGITAL_GOODS: DigitalGood[] = [
  {
    id: "GOOD-001",
    name: "GlowFit Premium Install",
    category: "App",
    payoutRange: "₹120 – ₹180",
    inventory: 500,
    claimed: 342,
    status: "Available",
  },
  {
    id: "GOOD-002",
    name: "Navi UPI Recharge",
    category: "UPI",
    payoutRange: "₹220 – ₹360",
    inventory: 300,
    claimed: 287,
    status: "Low stock",
  },
  {
    id: "GOOD-003",
    name: "WhatsApp Status Blast",
    category: "Social",
    payoutRange: "₹25 – ₹80",
    inventory: 1000,
    claimed: 156,
    status: "Available",
  },
  {
    id: "GOOD-004",
    name: "KineticPay Streak",
    category: "App",
    payoutRange: "₹90 – ₹140",
    inventory: 200,
    claimed: 198,
    status: "Out of stock",
  },
  {
    id: "GOOD-005",
    name: "Lumos Wallet Top-up",
    category: "UPI",
    payoutRange: "₹200 – ₹320",
    inventory: 400,
    claimed: 89,
    status: "Available",
  },
];

const getStatusTone = (status: CampaignStatus | DigitalGood["status"]): StatusPill["tone"] => {
  switch (status) {
    case "Active":
    case "Available":
      return "success";
    case "Paused":
    case "Low stock":
      return "warning";
    case "Completed":
      return "info";
    case "Out of stock":
      return "danger";
    case "Draft":
      return "pending";
    default:
      return "brand";
  }
};

const formatRupee = (amount: number) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount}`;
};

export default function AdminCampaignsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const totalBudget = CAMPAIGNS.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = CAMPAIGNS.reduce((sum, c) => sum + c.spent, 0);
  const totalTasks = CAMPAIGNS.reduce((sum, c) => sum + c.totalTasks, 0);
  const avgConversion = CAMPAIGNS.reduce((sum, c) => sum + c.conversionRate, 0) / CAMPAIGNS.length;

  const campaignStats = [
    {
      label: "Total budget",
      value: formatRupee(totalBudget),
      hint: `${formatRupee(totalSpent)} spent`,
      icon: <IndianRupee className="h-4 w-4 text-orange-300" />,
      accent: "from-orange-500/10 via-orange-500/0 to-transparent",
    },
    {
      label: "Total tasks",
      value: totalTasks.toLocaleString(),
      hint: "Across all campaigns",
      icon: <Target className="h-4 w-4 text-blue-300" />,
      accent: "from-blue-500/10 via-blue-500/0 to-transparent",
    },
    {
      label: "Avg. conversion",
      value: `${avgConversion.toFixed(1)}%`,
      hint: "Task completion rate",
      icon: <TrendingUp className="h-4 w-4 text-emerald-300" />,
      accent: "from-emerald-500/10 via-emerald-500/0 to-transparent",
    },
    {
      label: "Active campaigns",
      value: CAMPAIGNS.filter((c) => c.status === "Active").length.toString(),
      hint: "Currently running",
      icon: <BarChart3 className="h-4 w-4 text-purple-300" />,
      accent: "from-purple-500/10 via-purple-500/0 to-transparent",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Campaign performance</p>
        <h1 className="text-3xl font-semibold text-white">Manage digital goods, payout inventory, and campaign analytics</h1>
        <p className="text-sm text-muted-foreground">Track campaign performance, manage task inventory, and monitor payout distribution.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {campaignStats.map((stat) => (
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

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Campaign performance" subtitle="Track budget, conversions, and task distribution.">
          <div className="space-y-4">
            {CAMPAIGNS.map((campaign) => {
              const budgetUsed = (campaign.spent / campaign.budget) * 100;
              const taskProgress = (campaign.completedTasks / campaign.totalTasks) * 100;
              return (
                <div
                  key={campaign.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">{campaign.name}</h3>
                        <StatusPill label={campaign.status} tone={getStatusTone(campaign.status)} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {campaign.startDate} {campaign.endDate && `→ ${campaign.endDate}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCampaign(campaign)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                    >
                      View details
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Budget</span>
                        <span>{budgetUsed.toFixed(1)}% used</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-white/10">
                        <div
                          className={cn(
                            "h-2 rounded-full",
                            budgetUsed > 90 ? "bg-red-500" : budgetUsed > 70 ? "bg-yellow-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min(100, budgetUsed)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-white">
                        {formatRupee(campaign.spent)} / {formatRupee(campaign.budget)}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Tasks</span>
                        <span>{taskProgress.toFixed(1)}% complete</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${Math.min(100, taskProgress)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-white">
                        {campaign.completedTasks} / {campaign.totalTasks} tasks
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      Conversion: <span className="font-semibold text-white">{campaign.conversionRate.toFixed(1)}%</span>
                    </span>
                    <span>
                      Avg payout: <span className="font-semibold text-white">₹{campaign.avgPayout}</span>
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="text-white/60">Distribution:</span>
                    {Object.entries(campaign.taskDistribution).map(([cat, pct]) => (
                      <span key={cat} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/70">
                        {cat} {pct}%
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Digital goods inventory" subtitle="Manage payout inventory and stock levels.">
          <div className="space-y-3">
            {DIGITAL_GOODS.map((good) => {
              const stockPercent = ((good.inventory - good.claimed) / good.inventory) * 100;
              return (
                <div
                  key={good.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white">{good.name}</h4>
                        <StatusPill label={good.status} tone={getStatusTone(good.status)} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {good.category} • {good.payoutRange}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Stock</span>
                      <span>{stockPercent.toFixed(0)}% remaining</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-white/10">
                      <div
                        className={cn(
                          "h-2 rounded-full",
                          stockPercent < 10 ? "bg-red-500" : stockPercent < 30 ? "bg-yellow-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${Math.min(100, stockPercent)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-white">
                      {good.inventory - good.claimed} / {good.inventory} available
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Slide-over panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-2xl transform bg-[#090C12] p-6 shadow-2xl transition-transform duration-300",
          selectedCampaign ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedCampaign && (
          <div className="flex h-full flex-col space-y-6 overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-white">{selectedCampaign.name}</h2>
                  <StatusPill label={selectedCampaign.status} tone={getStatusTone(selectedCampaign.status)} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Campaign ID: {selectedCampaign.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Performance Summary */}
            <SectionCard className="bg-white/5" title="Performance summary" subtitle="Key metrics and progress.">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-[#050712] p-3">
                  <p className="text-xs text-white/60">Total tasks</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{selectedCampaign.totalTasks.toLocaleString()}</p>
                  {selectedCampaign.tasksDelta !== undefined && (
                    <p className={cn("mt-1 text-xs", selectedCampaign.tasksDelta >= 0 ? "text-emerald-300" : "text-red-300")}>
                      {selectedCampaign.tasksDelta >= 0 ? "+" : ""}{selectedCampaign.tasksDelta} vs last week
                    </p>
                  )}
                </div>
                <div className="rounded-xl border border-white/10 bg-[#050712] p-3">
                  <p className="text-xs text-white/60">Completed tasks</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{selectedCampaign.completedTasks.toLocaleString()}</p>
                  <p className="mt-1 text-xs text-white/60">
                    {((selectedCampaign.completedTasks / selectedCampaign.totalTasks) * 100).toFixed(1)}% completion
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#050712] p-3">
                  <p className="text-xs text-white/60">Average reward</p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-300">₹{selectedCampaign.avgPayout}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#050712] p-3">
                  <p className="text-xs text-white/60">Conversion rate</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{selectedCampaign.conversionRate.toFixed(1)}%</p>
                  {selectedCampaign.conversionDelta !== undefined && (
                    <p className={cn("mt-1 text-xs", selectedCampaign.conversionDelta >= 0 ? "text-emerald-300" : "text-red-300")}>
                      {selectedCampaign.conversionDelta >= 0 ? "+" : ""}{selectedCampaign.conversionDelta.toFixed(1)}% vs last week
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Budget usage</span>
                  <span>{((selectedCampaign.spent / selectedCampaign.budget) * 100).toFixed(1)}%</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-white/10">
                  <div
                    className={cn(
                      "h-3 rounded-full",
                      (selectedCampaign.spent / selectedCampaign.budget) * 100 > 90
                        ? "bg-red-500"
                        : (selectedCampaign.spent / selectedCampaign.budget) * 100 > 70
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
                    )}
                    style={{ width: `${Math.min(100, (selectedCampaign.spent / selectedCampaign.budget) * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-white">
                  {formatRupee(selectedCampaign.spent)} / {formatRupee(selectedCampaign.budget)}
                </p>
              </div>
            </SectionCard>

            {/* Task Mix Breakdown */}
            <SectionCard className="bg-white/5" title="Task mix breakdown" subtitle="Distribution across task categories.">
              <div className="space-y-3">
                {Object.entries(selectedCampaign.taskDistribution).map(([category, percentage]) => {
                  const categoryIcon =
                    category === "App" ? (
                      <AppWindow className="h-4 w-4 text-orange-300" />
                    ) : category === "UPI" ? (
                      <CreditCard className="h-4 w-4 text-blue-300" />
                    ) : (
                      <Share2 className="h-4 w-4 text-purple-300" />
                    );
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {categoryIcon}
                          <span className="font-semibold text-white">{category}</span>
                        </div>
                        <span className="text-white/70">{percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className={cn(
                            "h-2 rounded-full",
                            category === "App" ? "bg-orange-500" : category === "UPI" ? "bg-blue-500" : "bg-purple-500"
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* Reward Range Card */}
            <SectionCard className="bg-white/5" title="Reward range" subtitle="Payout limits and claim restrictions.">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-[#050712] p-4">
                  <p className="text-xs text-white/60">Minimum payout</p>
                  <p className="mt-1 text-xl font-semibold text-white">₹{selectedCampaign.minReward}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#050712] p-4">
                  <p className="text-xs text-white/60">Maximum payout</p>
                  <p className="mt-1 text-xl font-semibold text-emerald-300">₹{selectedCampaign.maxReward}</p>
                </div>
              </div>
              {selectedCampaign.claimLimit && (
                <div className="mt-4 rounded-xl border border-white/10 bg-[#050712] p-4">
                  <p className="text-xs text-white/60">Claim limit per user</p>
                  <p className="mt-1 text-lg font-semibold text-white">{selectedCampaign.claimLimit} task{selectedCampaign.claimLimit > 1 ? "s" : ""}</p>
                </div>
              )}
            </SectionCard>

            {/* Targeting & Metadata */}
            <SectionCard className="bg-white/5" title="Targeting & metadata" subtitle="Campaign configuration and settings.">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-orange-300" />
                  <div>
                    <p className="text-white/60">Duration</p>
                    <p className="font-semibold text-white">
                      {selectedCampaign.startDate} {selectedCampaign.endDate ? `→ ${selectedCampaign.endDate}` : "(Ongoing)"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-orange-300" />
                  <div>
                    <p className="text-white/60">Region</p>
                    <p className="font-semibold text-white">{selectedCampaign.region}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Tag className="h-4 w-4 text-orange-300 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white/60 mb-2">Channel tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCampaign.channelTags.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BarChart3 className="h-4 w-4 text-orange-300" />
                  <div>
                    <p className="text-white/60">Category</p>
                    <p className="font-semibold text-white capitalize">{selectedCampaign.category.replace("-", " ")}</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Action Buttons */}
            <div className="mt-auto flex gap-3">
              <button
                type="button"
                onClick={() => {
                  alert(`Would ${selectedCampaign.status === "Active" ? "pause" : "resume"} campaign in production`);
                }}
                className="flex-1 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
              >
                <div className="flex items-center justify-center gap-2">
                  <Pause className="h-4 w-4" />
                  {selectedCampaign.status === "Active" ? "Pause campaign" : "Resume campaign"}
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Would open reward editor in production");
                }}
                className="flex-1 rounded-2xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-200 transition hover:border-blue-500 hover:bg-blue-500/20"
              >
                <div className="flex items-center justify-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit reward
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedCampaign && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedCampaign(null)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}


"use client";

import { useMemo, useState } from "react";
import { Filter, Layers3, Search, X } from "lucide-react";

import { SectionCard, StatusPill } from "@/components/dashboard";
import { cn } from "@/lib/utils";

type TaskCategory = "All" | "App referrals" | "UPI & purchases" | "Social & status";
type SortOption = "Recommended" | "Highest payout" | "Fastest approval";

const segments: TaskCategory[] = ["All", "App referrals", "UPI & purchases", "Social & status"];
const sortOptions: SortOption[] = ["Recommended", "Highest payout", "Fastest approval"];

const tasks = [
  {
    name: "GlowFit install bonus",
    brand: "GlowFit",
    type: "App referrals",
    payout: "₹80 – ₹160 / install",
    approval: "~45 min after proof",
    requirements: ["Android 10+", "Must open app for 2 min"],
    proof: "Screenshot of installed app + referral ID",
    sla: "Approvals within 4 hours",
    steps: ["Share your unique link", "User completes install", "Upload proof inside Earniq"],
    tags: ["Screenshot required", "KYC required"],
    payoutValue: 160,
    approvalMinutes: 45,
  },
  {
    name: "Navi UPI recharge",
    brand: "Navi",
    type: "UPI & purchases",
    payout: "₹220 – ₹520 / task",
    approval: "~60-90 min after proof",
    requirements: ["UPI payment screenshot", "Min recharge ₹499"],
    proof: "UPI confirmation + reference ID",
    sla: "Payouts within 90 minutes",
    steps: ["Complete UPI recharge", "Upload screenshot + reference ID", "Wait for reviewer confirmation"],
    tags: ["UPI SMS proof", "Screenshot required"],
    payoutValue: 520,
    approvalMinutes: 75,
  },
  {
    name: "WhatsApp status drop",
    brand: "Social Pulse",
    type: "Social & status",
    payout: "₹25 – ₹60 / publish",
    approval: "~30 min after proof",
    requirements: ["Status live for 6 hours", "Use approved copy"],
    proof: "Screenshot of live status",
    sla: "Checks within 2 hours",
    steps: ["Copy approved script", "Post on WhatsApp status", "Upload screenshot proof"],
    tags: ["Screenshot required"],
    payoutValue: 60,
    approvalMinutes: 30,
  },
  {
    name: "KineticPay referral streak",
    brand: "KineticPay",
    type: "App referrals",
    payout: "₹100 – ₹210 / streak day",
    approval: "~2-4 hrs after proof",
    requirements: ["3 installs per day", "Unique devices only"],
    proof: "Device IDs + screenshot",
    sla: "24 hour manual check",
    steps: ["Share link daily", "Collect installs", "Submit combined proof"],
    tags: ["KYC required"],
    payoutValue: 210,
    approvalMinutes: 150,
  },
];

export default function DashboardTasksPage() {
  const [segment, setSegment] = useState<TaskCategory>("All");
  const [selectedTask, setSelectedTask] = useState<(typeof tasks)[number]>();
  const [sort, setSort] = useState<SortOption>("Recommended");
  const [query, setQuery] = useState("");

  const visibleTasks = useMemo(() => {
    let filtered = segment === "All" ? tasks : tasks.filter((task) => task.type === segment);
    if (query.trim()) {
      filtered = filtered.filter((task) =>
        `${task.name} ${task.brand}`.toLowerCase().includes(query.trim().toLowerCase())
      );
    }
    const bySort = [...filtered];
    if (sort === "Highest payout") {
      bySort.sort((a, b) => b.payoutValue - a.payoutValue);
    } else if (sort === "Fastest approval") {
      bySort.sort((a, b) => a.approvalMinutes - b.approvalMinutes);
    }
    return bySort;
  }, [segment, sort, query]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Task board</p>
        <h1 className="text-3xl font-semibold text-white">Find your next earning drop</h1>
        <p className="text-sm text-muted-foreground">Segmented tasks with instant proof requirements.</p>
      </header>

      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {segments.map((option) => (
            <button
              key={option}
              onClick={() => setSegment(option)}
              className={cn(
                "rounded-full border px-4 py-1.5 transition",
                segment === option
                  ? "border-orange-500/70 bg-orange-500/15 text-white shadow-inner"
                  : "border-white/10 text-white/70 hover:text-white"
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 focus-within:border-white/30">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="bg-transparent text-white focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option} className="bg-[#050507]">
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 focus-within:border-white/30">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tasks or brands"
              className="bg-transparent text-white placeholder:text-muted-foreground focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {visibleTasks.map((task) => (
          <SectionCard
            key={task.name}
            title={task.name}
            subtitle={`${task.brand} • ${task.type}`}
            actions={<StatusPill label={task.payout} tone="brand" />}
          >
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Approx. approval time</p>
              <p className="text-white">{task.approval}</p>
              <ul className="space-y-2">
                {task.requirements.map((req) => (
                  <li key={req} className="flex items-center gap-2">
                    <Filter className="h-3 w-3 text-orange-300" />
                    {req}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedTask(task)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
              >
                View details
                <Layers3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  // Mock "Start Task" - no real logic
                  alert("Task started! (Demo only - no real action)");
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
              >
                Start Task
              </button>
            </div>
          </SectionCard>
        ))}
      </div>

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-[#090C12] p-6 shadow-2xl transition-transform duration-300",
          selectedTask ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedTask && (
          <div className="flex h-full flex-col space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
                  Task details
                </p>
                <h2 className="text-2xl font-semibold text-white">{selectedTask.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedTask.brand} • {selectedTask.type}</p>
              </div>
              <button
                onClick={() => setSelectedTask(undefined)}
                className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <SectionCard title="What you'll do" className="bg-white/5">
              <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                {selectedTask.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </SectionCard>

            <SectionCard title="What you'll earn" className="bg-white/5">
              <StatusPill label={selectedTask.payout} tone="success" />
              <p className="mt-3 text-sm text-muted-foreground">{selectedTask.sla}</p>
            </SectionCard>

            <SectionCard title="What you must upload" className="bg-white/5">
              <p className="text-sm text-muted-foreground">{selectedTask.proof}</p>
            </SectionCard>

            <SectionCard title="Approval rules" className="bg-white/5">
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {selectedTask.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </SectionCard>

            <div className="rounded-2xl border border-white/10 bg-[#06080f] px-4 py-3 text-xs text-muted-foreground">
              Safety note: Do not uninstall required apps or delete SMS until approval is complete. Reviewers may ask
              for additional proof.
            </div>

            <button
              className="mt-auto rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
              onClick={() => setSelectedTask(undefined)}
            >
              Close drawer
            </button>
          </div>
        )}
      </div>
      {selectedTask && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedTask(undefined)}
        />
      )}
    </div>
  );
}


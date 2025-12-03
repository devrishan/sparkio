"use client";

import { useMemo, useState } from "react";
import { AppWindow, Calendar, CheckCircle2, Clock, CreditCard, Flag, Image as ImageIcon, Mail, Search, Share2, ShieldCheck, Star, ThumbsDown, ThumbsUp, User, X, XCircle } from "lucide-react";

import { SectionCard, StatusPill, RiskScorePill, type StatusTone } from "@/components/dashboard";
import { TaskTypeFilter } from "@/components/admin/TaskTypeFilter";
import { cn } from "@/lib/utils";

type TaskStatus = "All" | "Pending" | "Approved" | "Rejected" | "Flagged";
type TaskType = "all" | "app" | "upi" | "social";

interface TaskSubmission {
  id: string;
  taskName: string;
  taskType: "App" | "UPI" | "Social";
  submittedBy: string;
  userEmail: string;
  userId: string;
  status: Exclude<TaskStatus, "All">;
  submittedDate: string;
  reward: number;
  payoutRange: string;
  requirements: string[];
  proof: string;
  kycStatus: "Verified" | "Pending" | "Not required";
  reviewerNotes?: string;
  timeline: Array<{ label: string; value: string; timestamp?: string }>;
  riskScore?: { level: "low" | "medium" | "high"; score: number };
}

const ADMIN_TASK_SUBMISSIONS: TaskSubmission[] = [
  {
    id: "TASK-92184",
    taskName: "GlowFit install surge",
    taskType: "App",
    submittedBy: "Aditi Rao",
    userEmail: "aditi@earniq.in",
    userId: "USR-4821",
    status: "Pending",
    submittedDate: "Aug 22 · 10:14",
    reward: 160,
    payoutRange: "₹120 – ₹180",
    requirements: ["Android 11+", "User must open app for 2 minutes", "Screenshot required"],
    proof: "Install screenshot + referral ID",
    kycStatus: "Verified",
    riskScore: { level: "low", score: 15 },
    timeline: [
      { label: "Created", value: "Aug 22 · 10:14", timestamp: "2024-08-22T10:14:00Z" },
      { label: "Reviewed", value: "—" },
      { label: "Approved/Rejected", value: "Awaiting reviewer" },
    ],
  },
  {
    id: "TASK-92112",
    taskName: "Navi recharge push",
    taskType: "UPI",
    submittedBy: "Mohit Verma",
    userEmail: "mohit.v@earniq.in",
    userId: "USR-4756",
    status: "Pending",
    submittedDate: "Aug 22 · 08:42",
    reward: 320,
    payoutRange: "₹220 – ₹360",
    requirements: ["Minimum recharge ₹499", "Use linked UPI ID", "UPI SMS proof"],
    proof: "UPI confirmation + reference ID",
    kycStatus: "Verified",
    riskScore: { level: "medium", score: 45 },
    reviewerNotes: "Screenshot quality is good, verifying UPI transaction",
    timeline: [
      { label: "Created", value: "Aug 22 · 08:42", timestamp: "2024-08-22T08:42:00Z" },
      { label: "Reviewed", value: "Aug 22 · 09:05", timestamp: "2024-08-22T09:05:00Z" },
      { label: "Approved/Rejected", value: "Pending decision" },
    ],
  },
  {
    id: "TASK-92075",
    taskName: "Status takeover",
    taskType: "Social",
    submittedBy: "Sara Khan",
    userEmail: "sara.k@earniq.in",
    userId: "USR-4691",
    status: "Approved",
    submittedDate: "Aug 21 · 22:11",
    reward: 75,
    payoutRange: "₹25 – ₹80",
    requirements: ["Status live for 6 hours", "Approved copy only", "Screenshot required"],
    proof: "WhatsApp status screenshot",
    kycStatus: "Verified",
    riskScore: { level: "low", score: 12 },
    reviewerNotes: "Status verified, copy matches approved template",
    timeline: [
      { label: "Created", value: "Aug 21 · 22:11", timestamp: "2024-08-21T22:11:00Z" },
      { label: "Reviewed", value: "Aug 21 · 22:18", timestamp: "2024-08-21T22:18:00Z" },
      { label: "Approved", value: "Aug 21 · 22:33", timestamp: "2024-08-21T22:33:00Z" },
    ],
  },
  {
    id: "TASK-92052",
    taskName: "KineticPay streak",
    taskType: "App",
    submittedBy: "Devang Patel",
    userEmail: "devang98@earniq.in",
    userId: "USR-4623",
    status: "Rejected",
    submittedDate: "Aug 21 · 19:48",
    reward: 110,
    payoutRange: "₹90 – ₹140",
    requirements: ["Unique device IDs", "No emulators", "KYC required"],
    proof: "Install screenshot",
    kycStatus: "Pending",
    riskScore: { level: "high", score: 78 },
    reviewerNotes: "Device ID appears to be duplicate, needs verification",
    timeline: [
      { label: "Created", value: "Aug 21 · 19:48", timestamp: "2024-08-21T19:48:00Z" },
      { label: "Reviewed", value: "Aug 21 · 20:02", timestamp: "2024-08-21T20:02:00Z" },
      { label: "Rejected", value: "Aug 21 · 20:15", timestamp: "2024-08-21T20:15:00Z" },
    ],
  },
  {
    id: "TASK-92031",
    taskName: "WhatsApp status blast",
    taskType: "Social",
    submittedBy: "Priya L.",
    userEmail: "priya.l@earniq.in",
    userId: "USR-4589",
    status: "Flagged",
    submittedDate: "Aug 21 · 16:22",
    reward: 45,
    payoutRange: "₹30 – ₹60",
    requirements: ["Status live for 6 hours", "Approved copy only"],
    proof: "Status screenshot",
    kycStatus: "Verified",
    riskScore: { level: "high", score: 82 },
    reviewerNotes: "Copy does not match approved template, needs manual review",
    timeline: [
      { label: "Created", value: "Aug 21 · 16:22", timestamp: "2024-08-21T16:22:00Z" },
      { label: "Reviewed", value: "Aug 21 · 16:45", timestamp: "2024-08-21T16:45:00Z" },
      { label: "Flagged", value: "Aug 21 · 17:00", timestamp: "2024-08-21T17:00:00Z" },
    ],
  },
  {
    id: "TASK-91988",
    taskName: "Lumos wallet top-up",
    taskType: "UPI",
    submittedBy: "Ravi K.",
    userEmail: "ravi.k@earniq.in",
    userId: "USR-4512",
    status: "Approved",
    submittedDate: "Aug 21 · 14:05",
    reward: 280,
    payoutRange: "₹200 – ₹320",
    requirements: ["Minimum top-up ₹500", "UPI SMS proof"],
    proof: "UPI confirmation + reference ID",
    kycStatus: "Verified",
    riskScore: { level: "low", score: 8 },
    reviewerNotes: "Transaction verified, payout processed",
    timeline: [
      { label: "Created", value: "Aug 21 · 14:05", timestamp: "2024-08-21T14:05:00Z" },
      { label: "Reviewed", value: "Aug 21 · 14:20", timestamp: "2024-08-21T14:20:00Z" },
      { label: "Approved", value: "Aug 21 · 14:35", timestamp: "2024-08-21T14:35:00Z" },
    ],
  },
];

const statusFilters: TaskStatus[] = ["All", "Pending", "Approved", "Rejected", "Flagged"];
const auditCategories: Array<"All" | "App" | "UPI" | "Social"> = ["All", "App", "UPI", "Social"];
const ratingFilters = ["All", "Exemplary", "Solid", "Needs review", "Suspicious"] as const;

interface AuditEntry {
  id: string;
  taskName: string;
  category: "App" | "UPI" | "Social";
  submitter: string;
  quality: "Exemplary" | "Solid" | "Needs review" | "Suspicious";
  feedback: string;
  lastRatedBy: string;
  submittedAt: string;
}

const TASK_AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "AUD-118",
    taskName: "GlowFit install surge",
    category: "App",
    submitter: "Aditi Rao",
    quality: "Exemplary",
    feedback: "Excellent proof quality with clear timestamps.",
    lastRatedBy: "Nina Patel",
    submittedAt: "Aug 22 · 10:14",
  },
  {
    id: "AUD-119",
    taskName: "Navi recharge push",
    category: "UPI",
    submitter: "Mohit Verma",
    quality: "Solid",
    feedback: "UPI SMS matches reference ID. Awaiting bonus eligibility check.",
    lastRatedBy: "Rahul Jain",
    submittedAt: "Aug 22 · 08:42",
  },
  {
    id: "AUD-120",
    taskName: "WhatsApp status blast",
    category: "Social",
    submitter: "Priya L.",
    quality: "Needs review",
    feedback: "Copy deviates from approved template. Manual verification needed.",
    lastRatedBy: "Divya K.",
    submittedAt: "Aug 21 · 16:22",
  },
  {
    id: "AUD-121",
    taskName: "KineticPay streak",
    category: "App",
    submitter: "Devang Patel",
    quality: "Suspicious",
    feedback: "Device IDs appear recycled across multiple accounts.",
    lastRatedBy: "Rahul Jain",
    submittedAt: "Aug 21 · 19:48",
  },
];

const getStatusTone = (status: Exclude<TaskStatus, "All">): StatusTone => {
  switch (status) {
    case "Pending":
      return "pending";
    case "Approved":
      return "success";
    case "Rejected":
      return "danger";
    case "Flagged":
      return "warning";
    default:
      return "brand";
  }
};

const getTaskTypeIcon = (type: "App" | "UPI" | "Social") => {
  switch (type) {
    case "App":
      return <AppWindow className="h-4 w-4 text-orange-300" />;
    case "UPI":
      return <CreditCard className="h-4 w-4 text-blue-300" />;
    case "Social":
      return <Share2 className="h-4 w-4 text-purple-300" />;
  }
};

export default function AdminTasksPage() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus>("All");
  const [taskTypeFilter, setTaskTypeFilter] = useState<TaskType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskSubmission | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"review" | "audit">("review");
  const [auditCategory, setAuditCategory] = useState<(typeof auditCategories)[number]>("All");
  const [auditRatingFilter, setAuditRatingFilter] = useState<(typeof ratingFilters)[number]>("All");

  const filteredTasks = useMemo(() => {
    let filtered = ADMIN_TASK_SUBMISSIONS;

    if (statusFilter !== "All") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (taskTypeFilter !== "all") {
      const typeMap: Record<TaskType, "App" | "UPI" | "Social" | null> = {
        all: null,
        app: "App",
        upi: "UPI",
        social: "Social",
      };
      filtered = filtered.filter((task) => task.taskType === typeMap[taskTypeFilter]);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.taskName.toLowerCase().includes(query) ||
          task.id.toLowerCase().includes(query) ||
          task.submittedBy.toLowerCase().includes(query) ||
          task.userId.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [statusFilter, taskTypeFilter, searchQuery]);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredTasks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTasks.map((task) => task.id)));
    }
  };

  const handleSelectTask = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBatchApprove = () => {
    alert(`Would approve ${selectedIds.size} task(s) in production`);
    setSelectedIds(new Set());
  };

  const filteredAuditEntries = TASK_AUDIT_ENTRIES.filter((entry) => {
    const categoryMatch = auditCategory === "All" || entry.category === auditCategory;
    const ratingMatch = auditRatingFilter === "All" || entry.quality === auditRatingFilter;
    return categoryMatch && ratingMatch;
  });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Task moderation</p>
        <h1 className="text-3xl font-semibold text-white">Review and manage user tasks</h1>
        <p className="text-sm text-muted-foreground">Review, filter, and take action on submitted user tasks.</p>
      </header>

      <div className="flex gap-2 border-b border-white/10">
        {["review", "audit"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "review" | "audit")}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-semibold transition capitalize",
              activeTab === tab ? "border-orange-500 text-orange-200" : "border-transparent text-white/70 hover:text-white"
            )}
          >
            {tab === "review" ? "Moderation" : "Audit"}
          </button>
        ))}
      </div>

      {activeTab === "review" ? (
        <SectionCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-white/60">Status</span>
            <div className="flex flex-wrap gap-1.5">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition",
                    statusFilter === status
                      ? "border-orange-500/70 bg-orange-500/15 text-white shadow-inner"
                      : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <TaskTypeFilter value={taskTypeFilter} onChange={setTaskTypeFilter} />
            <label className="relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 focus-within:border-white/30 focus-within:text-white">
              <Search className="h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, ID, or user"
                className="bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              />
            </label>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3">
            <span className="text-sm text-white">
              {selectedIds.size} task{selectedIds.size > 1 ? "s" : ""} selected
            </span>
            <button
              type="button"
              onClick={handleBatchApprove}
              className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-200 transition hover:border-emerald-500 hover:bg-emerald-500/20"
            >
              Approve selected
            </button>
          </div>
        )}

        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredTasks.length && filteredTasks.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-white/20 bg-transparent"
                    aria-label="Select all tasks"
                  />
                </th>
                <th className="px-4 py-3">Task name</th>
                <th className="px-4 py-3">Submitted by</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted date</th>
                <th className="px-4 py-3">Reward</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#090C12]">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No tasks found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="text-sm text-muted-foreground transition hover:bg-white/5"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(task.id)}
                        onChange={() => handleSelectTask(task.id)}
                        className="rounded border-white/20 bg-transparent"
                        aria-label={`Select task ${task.id}`}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getTaskTypeIcon(task.taskType)}
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-white">{task.taskName}</span>
                          {task.riskScore && (
                            <RiskScorePill level={task.riskScore.level} score={task.riskScore.score} />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-white">{task.submittedBy}</span>
                        <span className="text-xs text-white/60">{task.userId}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="group relative">
                        <StatusPill label={task.status} tone={getStatusTone(task.status)} />
                        {task.reviewerNotes && (
                          <div className="absolute left-0 top-full z-10 mt-2 hidden w-64 rounded-xl border border-white/10 bg-[#050509] p-3 text-xs text-white/80 shadow-xl group-hover:block">
                            <p className="font-semibold text-white">Reviewer notes:</p>
                            <p className="mt-1">{task.reviewerNotes}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs">{task.submittedDate}</td>
                    <td className="px-4 py-4 font-semibold text-white">₹{task.reward}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTask(task)}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </SectionCard>
      ) : (
        <SectionCard title="Task quality audit" subtitle="Rate task quality, leave feedback, and flag suspicious submissions.">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Category</span>
              <div className="flex gap-1.5">
                {auditCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setAuditCategory(cat)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition",
                      auditCategory === cat
                        ? "border-orange-500/70 bg-orange-500/15 text-white shadow-inner"
                        : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Rating</span>
              <div className="flex gap-1.5">
                {ratingFilters.map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setAuditRatingFilter(rating)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition",
                      auditRatingFilter === rating
                        ? "border-orange-500/70 bg-orange-500/15 text-white shadow-inner"
                        : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30"
                    )}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredAuditEntries.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">{entry.taskName}</p>
                    <p className="text-xs text-white/60">
                      {entry.submitter} • {entry.submittedAt}
                    </p>
                  </div>
                  <StatusPill
                    label={entry.quality}
                    tone={
                      entry.quality === "Exemplary"
                        ? "success"
                        : entry.quality === "Solid"
                        ? "brand"
                        : entry.quality === "Needs review"
                        ? "pending"
                        : "danger"
                    }
                  />
                </div>
                <p className="mt-3 text-xs text-white/60">{entry.feedback}</p>
                <p className="mt-1 text-[11px] text-white/40">Last rated by {entry.lastRatedBy}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                    onClick={() => alert(`Would mark ${entry.id} as exemplary`)}
                  >
                    <Star className="h-3.5 w-3.5 text-amber-300" />
                    Exemplary
                  </button>
                  <button
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                    onClick={() => alert(`Would leave feedback for ${entry.id}`)}
                  >
                    <ThumbsUp className="h-3.5 w-3.5 text-emerald-300" />
                    Solid
                  </button>
                  <button
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                    onClick={() => alert(`Would flag ${entry.id} as suspicious`)}
                  >
                    <Flag className="h-3.5 w-3.5 text-red-300" />
                    Flag
                  </button>
                  <button
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                    onClick={() => alert(`Would request re-upload for ${entry.id}`)}
                  >
                    <ThumbsDown className="h-3.5 w-3.5 text-yellow-300" />
                    Needs review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Slide-over panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-2xl transform bg-[#090C12] p-6 shadow-2xl transition-transform duration-300",
          selectedTask ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedTask && (
          <div className="flex h-full flex-col space-y-6 overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {getTaskTypeIcon(selectedTask.taskType)}
                  <h2 className="text-2xl font-semibold text-white">{selectedTask.taskName}</h2>
                  <StatusPill label={selectedTask.taskType} tone="brand" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Task ID: {selectedTask.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#050712] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">Proof screenshot</p>
              <div className="mt-3 flex h-48 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-white/30" />
                  <p className="mt-2 text-xs text-white/50">{selectedTask.proof}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">Task metadata</p>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <div>
                    <span className="text-white/60">Payout range:</span>
                    <span className="ml-2 font-semibold text-white">{selectedTask.payoutRange}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Reward:</span>
                    <span className="ml-2 font-semibold text-emerald-300">₹{selectedTask.reward}</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-white/60">Requirements:</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
                      {selectedTask.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">User info</p>
                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-300" />
                    <div>
                      <p className="font-semibold text-white">{selectedTask.submittedBy}</p>
                      <p className="text-xs text-white/60">{selectedTask.userId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-orange-300" />
                    <span className="text-white">{selectedTask.userEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-orange-300" />
                    <StatusPill
                      label={selectedTask.kycStatus}
                      tone={selectedTask.kycStatus === "Verified" ? "success" : selectedTask.kycStatus === "Pending" ? "pending" : "info"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">Timeline</p>
              <div className="mt-4 space-y-3">
                {selectedTask.timeline.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      {step.value === "—" || step.value.includes("Awaiting") || step.value.includes("Pending") ? (
                        <Clock className="h-3 w-3 text-white/40" />
                      ) : step.label.includes("Approved") ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      ) : step.label.includes("Rejected") || step.label.includes("Flagged") ? (
                        <XCircle className="h-3 w-3 text-red-400" />
                      ) : (
                        <Calendar className="h-3 w-3 text-orange-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{step.label}</p>
                      <p className="text-xs text-white/60">{step.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedTask.reviewerNotes && (
              <div className="rounded-2xl border border-white/10 bg-[#06090f] p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">Reviewer notes</p>
                <p className="mt-2 text-sm text-white/80">{selectedTask.reviewerNotes}</p>
              </div>
            )}

            <div className="mt-auto flex gap-3">
              <button
                type="button"
                onClick={() => {
                  alert("Would approve task in production");
                  setSelectedTask(null);
                }}
                className="flex-1 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:border-emerald-500 hover:bg-emerald-500/20"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Would reject task in production");
                  setSelectedTask(null);
                }}
                className="flex-1 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:border-red-500 hover:bg-red-500/20"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Would escalate task in production");
                  setSelectedTask(null);
                }}
                className="flex-1 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
              >
                Escalate
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedTask && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedTask(null)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

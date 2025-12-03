"use client";

import { useMemo, useState } from "react";
import {
  Search,
  BadgeCheck,
  ClipboardSignature,
  CheckCircle2,
  XCircle,
  Loader,
  Image as ImageIcon,
  X,
  Calendar,
  Clock,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { TaskTypeFilter } from "@/components/admin/TaskTypeFilter";

type SubmissionStatus = "Pending" | "Under Review" | "Approved" | "Rejected";
type SubmissionType = "App" | "UPI" | "Social";

const statusFilters: Array<SubmissionStatus | "All"> = [
  "All",
  "Pending",
  "Under Review",
  "Approved",
  "Rejected",
];

const mockSubmissions = [
  {
    id: "TASK-92184",
    user: "Aditi Rao",
    type: "App",
    status: "Pending",
    reward: 160,
    payoutRange: "₹120 – ₹180",
    submittedAt: "Aug 22 · 10:14",
    proof: "Install screenshot + referral ID",
    upi: "aditir@upi",
    task: "GlowFit install surge",
    requirements: ["Android 11+", "User must open app for 2 minutes"],
    timeline: [
      { label: "Submitted", value: "Aug 22 · 10:14" },
      { label: "Under review", value: "—" },
      { label: "Approved / Rejected", value: "Awaiting reviewer" },
    ],
  },
  {
    id: "TASK-92112",
    user: "Mohit Verma",
    type: "UPI",
    status: "Under Review",
    reward: 320,
    payoutRange: "₹220 – ₹360",
    submittedAt: "Aug 22 · 08:42",
    proof: "UPI confirmation + reference ID",
    upi: "verma.m@upi",
    task: "Navi recharge push",
    requirements: ["Minimum recharge ₹499", "Use linked UPI ID"],
    timeline: [
      { label: "Submitted", value: "Aug 22 · 08:42" },
      { label: "Under review", value: "Aug 22 · 09:05" },
      { label: "Approved / Rejected", value: "Pending decision" },
    ],
  },
  {
    id: "TASK-92075",
    user: "Sara Khan",
    type: "Social",
    status: "Approved",
    reward: 75,
    payoutRange: "₹25 – ₹80",
    submittedAt: "Aug 21 · 22:11",
    proof: "WhatsApp status screenshot",
    upi: "sarak@upi",
    task: "Status takeover",
    requirements: ["Status live for 6 hours", "Approved copy only"],
    timeline: [
      { label: "Submitted", value: "Aug 21 · 22:11" },
      { label: "Under review", value: "Aug 21 · 22:18" },
      { label: "Approved", value: "Aug 21 · 22:33" },
    ],
  },
  {
    id: "TASK-92052",
    user: "Devang Patel",
    type: "App",
    status: "Rejected",
    reward: 110,
    payoutRange: "₹90 – ₹140",
    submittedAt: "Aug 21 · 19:48",
    proof: "Install screenshot",
    upi: "devang98@upi",
    task: "KineticPay streak",
    requirements: ["Unique device IDs", "No emulators"],
    timeline: [
      { label: "Submitted", value: "Aug 21 · 19:48" },
      { label: "Under review", value: "Aug 21 · 20:02" },
      { label: "Rejected", value: "Aug 21 · 20:20" },
    ],
  },
  {
    id: "TASK-92016",
    user: "Kabir Singh",
    type: "UPI",
    status: "Pending",
    reward: 420,
    payoutRange: "₹320 – ₹480",
    submittedAt: "Aug 21 · 17:25",
    proof: "Payment slip",
    upi: "kabirsingh@upi",
    task: "UPI rush hour",
    requirements: ["UPI ID must match Earniq profile"],
    timeline: [
      { label: "Submitted", value: "Aug 21 · 17:25" },
      { label: "Under review", value: "Queued for analyst" },
      { label: "Approved / Rejected", value: "Awaiting" },
    ],
  },
];

const statusStyles: Record<
  SubmissionStatus,
  { badge: string; dot: string; icon: React.ComponentType<{ className?: string }> }
> = {
  Pending: {
    badge: "bg-amber-500/10 text-amber-200 border border-amber-500/30",
    dot: "bg-amber-400",
    icon: Loader,
  },
  "Under Review": {
    badge: "bg-blue-500/10 text-blue-200 border border-blue-500/30",
    dot: "bg-blue-400",
    icon: ClipboardSignature,
  },
  Approved: {
    badge: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/30",
    dot: "bg-emerald-400",
    icon: CheckCircle2,
  },
  Rejected: {
    badge: "bg-red-500/10 text-red-200 border border-red-500/30",
    dot: "bg-red-400",
    icon: XCircle,
  },
};

export default function AdminSubmissionsPage() {
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<SubmissionType | "All">("All");
  const [search, setSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<(typeof mockSubmissions)[number]>();

  const filteredSubmissions = useMemo(() => {
    return mockSubmissions.filter((submission) => {
      const matchesStatus =
        statusFilter === "All" || submission.status === statusFilter;
      const matchesType = typeFilter === "All" || submission.type === typeFilter;
      const matchesSearch =
        submission.id.toLowerCase().includes(search.toLowerCase()) ||
        submission.user.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [statusFilter, typeFilter, search]);

  return (
    <div className="space-y-8 text-white">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
          Review queue
        </p>
        <h1 className="text-3xl font-semibold">Task submissions</h1>
        <p className="text-sm text-muted-foreground">
          Filter, inspect, and action member submissions with confidence.
        </p>
      </header>

      <section className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-6 shadow-xl shadow-black/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition",
                  statusFilter === status
                    ? "border-orange-500/70 bg-orange-500/10 text-white"
                    : "border-white/10 text-muted-foreground hover:border-white/30"
                )}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <TaskTypeFilter
              value={typeFilter.toLowerCase() as "all" | "app" | "upi" | "social"}
              onChange={(next) =>
                setTypeFilter(
                  next === "all"
                    ? "All"
                    : (next.charAt(0).toUpperCase() + next.slice(1)) as SubmissionType
                )
              }
            />
            <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-sm text-muted-foreground focus-within:border-white/30">
              <Search className="h-4 w-4" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ID or member"
                className="bg-transparent text-sm text-white placeholder:text-muted-foreground focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Submission ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Task type</th>
                <th className="px-4 py-3">Proof</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reward</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#090C12]">
              {filteredSubmissions.map((submission) => {
                const statusMeta = statusStyles[submission.status as SubmissionStatus];
                const StatusIcon = statusMeta.icon;
                return (
                  <tr
                    key={submission.id}
                    className="text-sm text-muted-foreground transition hover:bg-white/5"
                  >
                    <td className="px-4 py-4 font-semibold text-white">
                      {submission.id}
                    </td>
                    <td className="px-4 py-4">{submission.user}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white">
                        <BadgeCheck className="h-3 w-3 text-orange-300" />
                        {submission.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 text-xs">
                        <ImageIcon className="h-4 w-4 text-white/70" />
                        {submission.proof}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badge}`}>
                        <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-white">
                      ₹{submission.reward}
                    </td>
                    <td className="px-4 py-4 text-xs">{submission.submittedAt}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="inline-flex items-center gap-1 rounded-full border border-orange-500/40 px-4 py-1.5 text-xs font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/10"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-[#090C12] p-6 shadow-2xl transition-transform duration-300",
          selectedSubmission ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedSubmission && (
          <div className="flex h-full flex-col space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
                  Review submission
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  {selectedSubmission.id}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedSubmission.user} · {selectedSubmission.type} task
                </p>
              </div>
              <button
                className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
                onClick={() => setSelectedSubmission(undefined)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ImageIcon className="h-5 w-5 text-white/70" />
                Uploaded proof
              </div>
              <div className="mt-3 rounded-xl border border-dashed border-white/10 bg-[#050507] px-4 py-16 text-center text-sm text-muted-foreground">
                Proof preview placeholder
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Member info
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-white">
                  <span>User</span>
                  <span>{selectedSubmission.user}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>UPI ID</span>
                  <span>{selectedSubmission.upi}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reward</span>
                  <span className="font-semibold text-white">
                    ₹{selectedSubmission.reward}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Submitted</span>
                  <span>{selectedSubmission.submittedAt}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Task details</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-white">
                  <span>Task</span>
                  <span>{selectedSubmission.task}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Category</span>
                  <span>{selectedSubmission.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payout range</span>
                  <span className="font-semibold text-white">
                    {selectedSubmission.payoutRange}
                  </span>
                </div>
                <div>
                  <span className="text-white">Requirements</span>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                    {selectedSubmission.requirements.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-white">
                <Calendar className="h-4 w-4 text-orange-300" />
                Timeline
              </div>
              <div className="mt-4 space-y-3">
                {selectedSubmission.timeline.map((event) => (
                  <div key={event.label} className="flex items-start gap-3">
                    <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs text-orange-200">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div className="flex-1 text-sm text-muted-foreground">
                      <p className="font-semibold text-white">{event.label}</p>
                      <p>{event.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto flex gap-3">
              <button className="flex-1 rounded-2xl border border-red-500/40 px-4 py-3 text-sm font-semibold text-red-200 transition hover:border-red-500 hover:bg-red-500/10">
                Reject submission
              </button>
              <button className="flex-1 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:border-emerald-500 hover:bg-emerald-500/20">
                Approve & release
              </button>
            </div>
          </div>
        )}
      </div>
      {selectedSubmission && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedSubmission(undefined)}
        />
      )}
    </div>
  );
}

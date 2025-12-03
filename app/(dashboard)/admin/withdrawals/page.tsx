"use client";

import { useMemo, useState } from "react";
import { Wallet, ArrowUpRight, Filter, Search, X, Clock, CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type WithdrawalStatus = "Pending" | "Processing" | "Paid" | "Rejected";

const statusFilters: Array<WithdrawalStatus | "All"> = [
  "All",
  "Pending",
  "Processing",
  "Paid",
  "Rejected",
];

const mockWithdrawals = [
  {
    id: "WD-78421",
    user: "Ishita Shah",
    upi: "9213",
    amount: 5100,
    status: "Pending",
    requested: "Aug 22 · 09:42",
    updated: "—",
    utr: "UTR12839733",
    timeline: [
      { label: "Requested", value: "Aug 22 · 09:42" },
      { label: "Queued", value: "Aug 22 · 09:45" },
    ],
  },
  {
    id: "WD-78407",
    user: "Harish K",
    upi: "4810",
    amount: 7800,
    status: "Processing",
    requested: "Aug 22 · 08:11",
    updated: "Aug 22 · 08:44",
    utr: "UTR12839677",
    timeline: [
      { label: "Requested", value: "Aug 22 · 08:11" },
      { label: "Processing", value: "Aug 22 · 08:40" },
    ],
  },
  {
    id: "WD-78381",
    user: "Riddhi K",
    upi: "5571",
    amount: 2200,
    status: "Paid",
    requested: "Aug 21 · 22:09",
    updated: "Aug 21 · 22:24",
    utr: "UTR12838812",
    timeline: [
      { label: "Requested", value: "Aug 21 · 22:09" },
      { label: "Approved", value: "Aug 21 · 22:16" },
      { label: "Paid", value: "Aug 21 · 22:24" },
    ],
  },
  {
    id: "WD-78364",
    user: "Vishal Rai",
    upi: "3011",
    amount: 1250,
    status: "Rejected",
    requested: "Aug 21 · 19:52",
    updated: "Aug 21 · 20:20",
    utr: "UTR12838791",
    timeline: [
      { label: "Requested", value: "Aug 21 · 19:52" },
      { label: "Rejected (UPI mismatch)", value: "Aug 21 · 20:20" },
    ],
  },
  {
    id: "WD-78311",
    user: "Ananya P",
    upi: "2230",
    amount: 3980,
    status: "Pending",
    requested: "Aug 21 · 17:44",
    updated: "—",
    utr: "UTR12838155",
    timeline: [
      { label: "Requested", value: "Aug 21 · 17:44" },
      { label: "Queued", value: "Aug 21 · 17:48" },
    ],
  },
];

const statusStyles: Record<WithdrawalStatus, { badge: string; dot: string }> = {
  Pending: {
    badge: "bg-amber-500/10 text-amber-200 border border-amber-500/30",
    dot: "bg-amber-400",
  },
  Processing: {
    badge: "bg-blue-500/10 text-blue-200 border border-blue-500/30",
    dot: "bg-blue-400",
  },
  Paid: {
    badge: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  Rejected: {
    badge: "bg-red-500/10 text-red-200 border border-red-500/30",
    dot: "bg-red-400",
  },
};

export default function AdminWithdrawalsPage() {
  const [statusFilter, setStatusFilter] = useState<WithdrawalStatus | "All">("Pending");
  const [minAmount, setMinAmount] = useState("");
  const [search, setSearch] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<(typeof mockWithdrawals)[number]>();

  const filteredWithdrawals = useMemo(() => {
    return mockWithdrawals.filter((withdrawal) => {
      const matchesStatus =
        statusFilter === "All" || withdrawal.status === statusFilter;
      const matchesSearch =
        withdrawal.user.toLowerCase().includes(search.toLowerCase()) ||
        withdrawal.id.toLowerCase().includes(search.toLowerCase());
      const meetsMin =
        minAmount === "" || withdrawal.amount >= Number(minAmount || 0);
      return matchesStatus && matchesSearch && meetsMin;
    });
  }, [statusFilter, search, minAmount]);

  return (
    <section className="space-y-8 text-white">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
          Payout command
        </p>
        <h1 className="text-3xl font-semibold">Withdrawal processing</h1>
        <p className="text-sm text-muted-foreground">
          Keep instant payouts moving while flagging risky attempts.
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
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 focus-within:border-white/30">
              <Filter className="h-4 w-4" />
              Min amount
              <input
                value={minAmount}
                onChange={(event) => setMinAmount(event.target.value)}
                type="number"
                placeholder="₹0"
                className="w-24 bg-transparent text-white focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 focus-within:border-white/30">
              <Search className="h-4 w-4" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search user or ID"
                className="bg-transparent text-white placeholder:text-muted-foreground focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">UPI</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">UTR</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#090C12]">
              {filteredWithdrawals.map((withdrawal) => {
                const statusMeta = statusStyles[withdrawal.status as WithdrawalStatus];
                return (
                  <tr key={withdrawal.id} className="text-sm text-muted-foreground transition hover:bg-white/5">
                    <td className="px-4 py-4 font-semibold text-white">
                      {withdrawal.user}
                      <p className="text-xs text-muted-foreground">{withdrawal.id}</p>
                    </td>
                    <td className="px-4 py-4">••{withdrawal.upi}</td>
                    <td className="px-4 py-4 font-semibold text-white">
                      ₹{withdrawal.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badge}`}>
                        <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs">{withdrawal.requested}</td>
                    <td className="px-4 py-4 text-xs">{withdrawal.updated}</td>
                    <td className="px-4 py-4 text-xs">{withdrawal.utr}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setSelectedWithdrawal(withdrawal)}
                        className="inline-flex items-center gap-1 rounded-full border border-orange-500/40 px-4 py-1.5 text-xs font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/10"
                      >
                        Open
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
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
          selectedWithdrawal ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedWithdrawal && (
          <div className="flex h-full flex-col space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
                  Withdrawal review
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  {selectedWithdrawal.user}
                </h2>
                <p className="text-sm text-muted-foreground">{selectedWithdrawal.id}</p>
              </div>
              <button
                className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
                onClick={() => setSelectedWithdrawal(undefined)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  UPI
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  ••{selectedWithdrawal.upi}
                </p>
                <p className="text-xs">Masked for privacy</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  Amount
                </p>
                <p className="mt-2 text-lg font-semibold text-emerald-200">
                  ₹{selectedWithdrawal.amount.toLocaleString("en-IN")}
                </p>
                <p className="text-xs">Will release to UPI instantly</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-white">
                <Wallet className="h-4 w-4 text-orange-300" />
                Timeline
              </div>
              <div className="mt-4 space-y-3">
                {selectedWithdrawal.timeline.map((event) => (
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

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Status
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {selectedWithdrawal.status}
              </p>
              <p className="text-xs">Requested {selectedWithdrawal.requested}</p>
            </div>

            <div className="mt-auto flex gap-3">
              <button className="flex-1 rounded-2xl border border-red-500/40 px-4 py-3 text-sm font-semibold text-red-200 transition hover:border-red-500 hover:bg-red-500/10">
                <XCircle className="mr-2 inline h-4 w-4" />
                Reject payout
              </button>
              <button className="flex-1 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:border-emerald-500 hover:bg-emerald-500/20">
                <CheckCircle2 className="mr-2 inline h-4 w-4" />
                Approve payout
              </button>
            </div>
          </div>
        )}
      </div>
      {selectedWithdrawal && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedWithdrawal(undefined)}
        />
      )}
    </section>
  );
}

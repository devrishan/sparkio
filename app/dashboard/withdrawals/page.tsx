"use client";

import { useState } from "react";
import { CreditCard, Download, IndianRupee, X } from "lucide-react";

import { SectionCard, StatusPill } from "@/components/dashboard";
import { cn } from "@/lib/utils";

const withdrawableBalance = "₹18,950";
const minimumWithdrawal = 500;

const withdrawalHistory = [
  {
    amount: "₹5,100",
    status: "Paid",
    requestedAt: "Aug 19 · 11:02",
    completedAt: "Aug 19 · 11:31",
    upi: "••9213",
    utr: "UTR1283840",
  },
  {
    amount: "₹4,400",
    status: "Processing",
    requestedAt: "Aug 21 · 18:04",
    completedAt: "—",
    upi: "••1180",
    utr: "Awaiting",
  },
  {
    amount: "₹3,200",
    status: "Pending",
    requestedAt: "Aug 22 · 09:50",
    completedAt: "—",
    upi: "••5571",
    utr: "Awaiting",
  },
  {
    amount: "₹2,900",
    status: "Rejected",
    requestedAt: "Aug 18 · 16:14",
    completedAt: "Aug 18 · 17:02",
    upi: "••3011",
    utr: "UTR1283001",
  },
];

const statusTone: Record<string, "success" | "info" | "pending" | "danger"> = {
  Paid: "success",
  Processing: "info",
  Pending: "pending",
  Rejected: "danger",
};

export default function DashboardWithdrawalsPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: withdrawableBalance.replace(/[₹,]/g, ""),
    upi: "aditir@upi",
  });
  const [selectedEntry, setSelectedEntry] = useState<typeof withdrawalHistory[number] | null>(null);
  const withdrawableAmount = parseInt(withdrawableBalance.replace(/[₹,]/g, ""), 10);
  const progressToMin = Math.min(100, (withdrawableAmount / minimumWithdrawal) * 100);

  const handleChange = (key: "amount" | "upi", value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
          Wallet pulse
        </p>
        <h1 className="text-3xl font-semibold text-white">Withdraw instantly to UPI</h1>
        <p className="text-sm text-muted-foreground">
          This is a demo experience—no real payouts are triggered.
        </p>
      </header>

      <SectionCard title="Withdrawable balance" className="bg-gradient-to-br from-white/5 via-white/0 to-transparent">
        <div className="flex flex-col gap-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Ready to transfer</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight">{withdrawableBalance}</p>
            <div className="mt-3 h-2 rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                style={{ width: `${progressToMin}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              ₹{minimumWithdrawal} minimum per payout. Payouts are manual demo only; no actual money is sent.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-6 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
          >
            Request withdrawal
            <CreditCard className="h-4 w-4" />
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Withdrawal history" subtitle="Track every payout attempt and result.">
        {withdrawalHistory.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-[#050507] px-6 py-10 text-center text-sm text-muted-foreground">
            <div className="rounded-full border border-white/10 p-3 text-white/70">
              <CreditCard className="h-6 w-6" />
            </div>
            <p>No withdrawal requests yet. Once you submit a payout, it will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Requested</th>
                  <th className="px-4 py-3">Completed</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#090C12]">
                {withdrawalHistory.map((entry) => (
                  <tr key={entry.requestedAt} className="text-sm text-muted-foreground">
                    <td className="px-4 py-4 font-semibold text-white">{entry.amount}</td>
                    <td className="px-4 py-4">
                      <StatusPill label={entry.status} tone={statusTone[entry.status]} />
                    </td>
                    <td className="px-4 py-4 text-xs">{entry.requestedAt}</td>
                    <td className="px-4 py-4 text-xs">{entry.completedAt}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground transition hover:border-white/40 hover:text-white"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          All entries are mock data so you can see how the payout queue will look once live.
        </p>
      </SectionCard>

      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10 opacity-0 transition-opacity duration-200",
          open && "opacity-100"
        )}
        style={{ pointerEvents: open ? "auto" : "none" }}
        onClick={() => setOpen(false)}
      >
        <div
          className={cn(
            "w-full max-w-md transform rounded-3xl border border-white/10 bg-[#0b0f18] p-6 text-white shadow-2xl transition-all duration-200",
            open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
                Request withdrawal
              </p>
              <h3 className="text-2xl font-semibold">Demo-only form</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form className="mt-6 space-y-4 text-sm text-muted-foreground">
            <label className="space-y-2">
              <span>Amount (₹)</span>
              <input
                value={form.amount}
                onChange={(event) => handleChange("amount", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
              />
              <p className="text-xs text-muted-foreground">Min ₹{minimumWithdrawal}. Max ₹50,000 per request.</p>
            </label>
            <label className="space-y-2">
              <span>UPI ID</span>
              <input
                value={form.upi}
                onChange={(event) => handleChange("upi", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
              />
              <p className="text-xs text-muted-foreground">Example: aditir@upi · we mask it in history for safety.</p>
            </label>
            <p className="text-xs text-muted-foreground">
              This is a visual demo. Submission buttons do not trigger live payouts.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
            >
              Submit request (demo)
            </button>
          </form>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-[#090C12] p-6 shadow-2xl transition-transform duration-300",
          selectedEntry ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedEntry && (
          <div className="flex h-full flex-col space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Withdrawal details</p>
                <h2 className="text-2xl font-semibold text-white">{selectedEntry.amount}</h2>
                <p className="text-sm text-muted-foreground">{selectedEntry.requestedAt}</p>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground transition hover:border-white/40 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between text-white">
                <span>Status</span>
                <StatusPill label={selectedEntry.status} tone={statusTone[selectedEntry.status]} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span>UPI ID</span>
                <span>{selectedEntry.upi}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span>UTR</span>
                <span>{selectedEntry.utr}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Timeline</p>
              <ul className="mt-3 space-y-2 text-xs">
                <li>Requested: {selectedEntry.requestedAt}</li>
                <li>Completed: {selectedEntry.completedAt}</li>
              </ul>
            </div>
            <button className="mt-auto inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-muted-foreground transition hover:border-white/40 hover:text-white">
              <Download className="h-4 w-4" />
              Download receipt (demo)
            </button>
          </div>
        )}
      </div>
      {selectedEntry && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEntry(null)} />
      )}
    </div>
  );
}


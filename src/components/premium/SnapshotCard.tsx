"use client";

import React from "react";

import useCountTo from "@/hooks/useCountTo";

export default function SnapshotCard() {
  const earnings = useCountTo(1245, 900);
  const referrals = useCountTo(12, 800);
  const pending = useCountTo(400, 900);
  const rank = useCountTo(18, 700);

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/40 p-6 shadow-2xl backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/40">
      <div className="text-xs text-slate-500 dark:text-slate-400">Snapshot</div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Earnings</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white">
            ₹{earnings.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
          <div className="text-xs text-slate-500 dark:text-slate-400">Referrals</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white">{referrals}</div>
        </div>
        <div className="rounded-lg border bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
          <div className="text-xs text-slate-500 dark:text-slate-400">Pending</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white">
            ₹{pending.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
          <div className="text-xs text-slate-500 dark:text-slate-400">Rank</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white">#{rank}</div>
        </div>
      </div>
      <div className="mt-6">
        <a
          href="/member/withdraw"
          className="inline-block w-full rounded-full bg-emerald-500 px-4 py-3 text-center font-medium text-white"
        >
          Withdraw
        </a>
      </div>
    </aside>
  );
}



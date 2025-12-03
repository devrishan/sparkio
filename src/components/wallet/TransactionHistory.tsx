"use client";

import { ArrowDown, ArrowUp, CreditCard, RefreshCw, Wallet } from "lucide-react";

import type { WalletTransaction } from "@/lib/mock-data/wallet";
import { formatCurrency } from "@/lib/mock-data/wallet";
import { StatusPill } from "@/components/dashboard";
import { cn } from "@/lib/utils";

interface TransactionHistoryProps {
  transactions: WalletTransaction[];
}

const getTransactionIcon = (type: WalletTransaction["type"]) => {
  switch (type) {
    case "Top-Up":
      return <ArrowUp className="h-4 w-4 text-emerald-400" aria-hidden="true" />;
    case "Task Earning":
      return <Wallet className="h-4 w-4 text-orange-400" aria-hidden="true" />;
    case "Redemption":
    case "Withdrawal":
      return <ArrowDown className="h-4 w-4 text-red-400" aria-hidden="true" />;
    case "Refund":
      return <RefreshCw className="h-4 w-4 text-blue-400" aria-hidden="true" />;
    default:
      return <CreditCard className="h-4 w-4 text-white/50" aria-hidden="true" />;
  }
};

const getStatusTone = (status: WalletTransaction["status"]): "success" | "pending" | "danger" => {
  switch (status) {
    case "Completed":
      return "success";
    case "Pending":
      return "pending";
    case "Failed":
      return "danger";
    default:
      return "pending";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
};

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center">
        <Wallet className="h-12 w-12 text-white/30 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No transactions yet</h3>
        <p className="text-sm text-white/60">Your transaction history will appear here once you start earning or adding money.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" role="table" aria-label="Transaction history">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/70">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/70">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/70">
                Description
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-white/70">
                Amount
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white/70">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((transaction) => {
              const isPositive = transaction.amount > 0;
              return (
                <tr
                  key={transaction.id}
                  className="transition-colors hover:bg-white/5"
                  role="row"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      <span className="text-sm font-medium text-white">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-white/70">{formatDate(transaction.date)}</td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-white/70">{transaction.description || "—"}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isPositive ? "text-emerald-400" : "text-red-400",
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <StatusPill label={transaction.status} tone={getStatusTone(transaction.status)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {transactions.map((transaction) => {
          const isPositive = transaction.amount > 0;
          return (
            <div
              key={transaction.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white/5 p-2">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{transaction.type}</p>
                    <p className="text-xs text-white/60">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-base font-bold",
                    isPositive ? "text-emerald-400" : "text-red-400",
                  )}
                >
                  {isPositive ? "+" : ""}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>

              {transaction.description && (
                <p className="text-xs text-white/70">{transaction.description}</p>
              )}

              <div className="flex items-center justify-between">
                <StatusPill label={transaction.status} tone={getStatusTone(transaction.status)} />
                {transaction.referenceId && (
                  <span className="text-[10px] text-white/50">Ref: {transaction.referenceId}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


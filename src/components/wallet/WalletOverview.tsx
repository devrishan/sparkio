"use client";

import { Plus, Wallet } from "lucide-react";

import { StatCard } from "@/components/dashboard";
import { formatCurrency } from "@/lib/mock-data/wallet";
import type { WalletState } from "@/lib/mock-data/wallet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WalletOverviewProps {
  wallet: WalletState;
  onTopUp: () => void;
}

export function WalletOverview({ wallet, onTopUp }: WalletOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border p-6 sm:p-8",
          "border-orange-500/40 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent",
          "shadow-lg shadow-orange-500/20",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent" />
        
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-500/20 p-3">
                <Wallet className="h-6 w-6 text-orange-300" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-white/70">Available Balance</p>
                <p className="text-3xl sm:text-4xl font-bold text-white mt-1">
                  {formatCurrency(wallet.available)}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={onTopUp}
            className="w-full sm:w-auto bg-orange-500 text-white hover:bg-orange-600 h-11 min-h-[44px]"
            aria-label="Add money to wallet"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Money
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Earned"
          value={formatCurrency(wallet.totalEarned)}
          hint="From completed tasks"
          icon={<Wallet className="h-5 w-5" />}
          accent="from-emerald-500/10 via-emerald-500/0 to-transparent"
        />
        <StatCard
          label="Total Top-Ups"
          value={formatCurrency(wallet.totalTopUps)}
          hint="Money added to wallet"
          icon={<Plus className="h-5 w-5" />}
          accent="from-blue-500/10 via-blue-500/0 to-transparent"
        />
        <StatCard
          label="Total Redeemed"
          value={formatCurrency(wallet.totalRedeemed)}
          hint="Withdrawals & redemptions"
          icon={<Wallet className="h-5 w-5" />}
          accent="from-purple-500/10 via-purple-500/0 to-transparent"
        />
      </div>
    </div>
  );
}


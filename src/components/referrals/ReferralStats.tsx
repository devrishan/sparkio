"use client";

import { Award, Clock, Users } from "lucide-react";

import { StatCard } from "@/components/dashboard";
import type { ReferralStats } from "@/lib/mock-data/referrals";
import { formatPoints } from "@/lib/mock-data/referrals";

interface ReferralStatsProps {
  stats: ReferralStats;
  isLoading?: boolean;
}

export function ReferralStats({ stats, isLoading }: ReferralStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-3xl border border-white/5 bg-white/5"
          />
        ))}
      </div>
    );
  }

  const hasNoData = stats.totalPoints === 0 && stats.joined === 0 && stats.pending === 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total points earned"
          value={formatPoints(stats.totalPoints)}
          hint={stats.totalPoints > 0 ? "All-time earnings" : "Start referring to earn"}
          icon={<Award className="h-5 w-5" />}
          accent="from-emerald-500/10 via-emerald-500/0 to-transparent"
        />
        <StatCard
          label="Friends joined"
          value={stats.joined.toString()}
          hint={stats.joined > 0 ? "Active referrals" : "No referrals yet"}
          icon={<Users className="h-5 w-5" />}
          accent="from-blue-500/10 via-blue-500/0 to-transparent"
        />
        <StatCard
          label="Pending points"
          value={formatPoints(stats.pending)}
          hint={stats.pending > 0 ? "Awaiting verification" : "No pending points"}
          icon={<Clock className="h-5 w-5" />}
          accent="from-amber-500/10 via-amber-500/0 to-transparent"
        />
      </div>

      {hasNoData && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
          <Award className="mx-auto h-12 w-12 text-white/30 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No points yet</h3>
          <p className="text-sm text-white/60 max-w-md mx-auto">
            Start sharing your referral link to earn points. Each friend who joins and completes tasks 
            earns you rewards!
          </p>
        </div>
      )}
    </div>
  );
}


"use client";

import { useState } from "react";
import { Award, Trophy, Users } from "lucide-react";

import { SectionCard } from "@/components/dashboard";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/mock-data/referrals";
import { formatPoints } from "@/lib/mock-data/referrals";
import { cn } from "@/lib/utils";

export function ReferralLeaderboard() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const leaderboard = getLeaderboard(period);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Award className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-400" />;
    return null;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/40";
    if (rank === 2) return "bg-gradient-to-br from-gray-400/20 to-gray-500/10 border-gray-400/40";
    if (rank === 3) return "bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/40";
    return "bg-white/5 border-white/10";
  };

  return (
    <SectionCard
      title="Top Referrers"
      subtitle="See how you rank among the best referrers"
      actions={
        <div className="flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setPeriod("weekly")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              period === "weekly"
                ? "bg-orange-500 text-white"
                : "text-white/70 hover:text-white",
            )}
            aria-pressed={period === "weekly"}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              period === "monthly"
                ? "bg-orange-500 text-white"
                : "text-white/70 hover:text-white",
            )}
            aria-pressed={period === "monthly"}
          >
            Monthly
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        {leaderboard.map((entry) => (
          <div
            key={`${entry.period}-${entry.rank}`}
            className={cn(
              "flex items-center gap-4 rounded-2xl border p-4 transition-all",
              getRankBadgeColor(entry.rank),
              "hover:border-white/20",
            )}
          >
            {/* Rank */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
              {getRankIcon(entry.rank) || (
                <span className="text-lg font-bold text-white/70">{entry.rank}</span>
              )}
            </div>

            {/* Name and Referrals */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{entry.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-3.5 w-3.5 text-white/50" />
                <span className="text-xs text-white/60">{entry.referrals} referrals</span>
              </div>
            </div>

            {/* Points */}
            <div className="text-right">
              <p className="text-lg font-bold text-orange-200">{formatPoints(entry.points)}</p>
              <p className="text-xs text-white/50">points</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-white/60 text-center">
        Leaderboard updates every {period === "weekly" ? "Monday" : "1st of the month"}
      </p>
    </SectionCard>
  );
}


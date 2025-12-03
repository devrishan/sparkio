"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { getMockToken } from "@/lib/auth";
import { useSession } from "@/components/providers/session-provider";

interface LeaderboardEntry {
  rank: number;
  username: string;
  earnings: number;
  coins: number;
  level: string;
  referrals: number;
}

interface LeaderboardResponse {
  top10: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
}

async function fetchLeaderboard(): Promise<LeaderboardResponse> {
  const token = getMockToken();
  const response = await fetch("/api/mocks/leaderboard", {
    credentials: "include",
    headers: token ? { "x-mock-token": token } : {},
  });

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  return response.json();
}

export function Leaderboard() {
  const { user } = useSession();
  const { data, isLoading, error } = useQuery<LeaderboardResponse>({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
    retry: false,
  });

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-primary glow-sm";
    if (rank === 2) return "text-accent";
    if (rank === 3) return "text-primary/70";
    return "text-muted-foreground";
  };

  if (isLoading) {
    return (
      <Card className="border-border bg-card p-4 sm:p-6">
        <LoadingSkeleton className="h-64" />
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-border bg-card p-4 sm:p-6">
        <p className="text-sm text-muted-foreground">Failed to load leaderboard</p>
      </Card>
    );
  }

  const entries = data.top10 || [];
  const currentUser = data.currentUser;
  const currentUserRank = currentUser?.rank;

  return (
    <Card className="border-border bg-card p-4 sm:p-6">
      <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg font-semibold text-foreground">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <span className="hidden sm:inline">Top Referrers</span>
          <span className="sm:hidden">Leaderboard</span>
        </h3>
        {currentUserRank && (
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">You&apos;re #{currentUserRank}</span>
            <span className="sm:hidden">#{currentUserRank}</span>
          </div>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No leaderboard data available</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between gap-2 rounded-lg border p-2 sm:p-3 transition-all hover:border-primary/30 ${
                entry.rank === currentUserRank
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-muted/20"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full font-bold flex-shrink-0 ${
                    entry.rank <= 3 ? "bg-primary/20" : "bg-muted"
                  }`}
                >
                  <span className={`${getRankColor(entry.rank)} text-xs sm:text-sm`}>#{entry.rank}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base text-foreground truncate">{entry.username}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {entry.referrals} referrals • {entry.coins} coins • {entry.level}
                  </p>
                </div>
              </div>
              
              <span className="font-semibold text-sm sm:text-base text-primary flex-shrink-0">₹{entry.earnings}</span>
            </div>
          ))
        )}
        {currentUser && !entries.find((e) => e.rank === currentUser.rank) && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/50 bg-primary/5 p-2 sm:p-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full font-bold flex-shrink-0 bg-primary/20">
                  <span className="text-primary text-xs sm:text-sm">#{currentUser.rank}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base text-foreground truncate">{currentUser.username} (You)</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {currentUser.referrals} referrals • {currentUser.coins} coins • {currentUser.level}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-sm sm:text-base text-primary flex-shrink-0">₹{currentUser.earnings}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

"use client";

/**
 * Member Leaderboard Page
 * 
 * TO REPLACE MOCKS WITH REAL API:
 * 1. Replace useMockData hook with your API call:
 *    const { data } = useQuery({
 *      queryKey: ['leaderboard', period],
 *      queryFn: () => fetch(`/api/member/leaderboard?period=${period}`).then(r => r.json())
 *    });
 * 
 * 2. Update API endpoint: /api/member/leaderboard?period={daily|weekly|monthly|all-time}
 * 3. Expected response: Array of { rank, userId, name, earnings, tasksCompleted, referrals, change }
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useMockData, loadMockJson } from "@/hooks/useMockData";
import { formatAmount } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Period = "daily" | "weekly" | "monthly" | "all-time";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  earnings: number;
  tasksCompleted: number;
  referrals: number;
  change: number;
}

export default function MemberLeaderboardPage() {
  const [period, setPeriod] = useState<Period>("weekly");
  // Use useEffect to reload when period changes
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    loadMockJson<LeaderboardEntry[]>(`leaderboard?period=${period}`)
      .then((data) => {
        setLeaderboard(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [period]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
    if (rank === 2) return "bg-gray-400/20 text-gray-300 border-gray-400/40";
    if (rank === 3) return "bg-amber-600/20 text-amber-400 border-amber-600/40";
    return "bg-white/5 text-white/70 border-white/10";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  if (isLoading || !leaderboard) {
    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </header>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Leaderboard</p>
        <h1 className="text-3xl font-semibold text-white">Top Earners</h1>
        <p className="text-sm text-muted-foreground">
          See where you rank among the top performers.
        </p>
      </header>

      {/* Period Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
          <CardDescription>Select a time period to view rankings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(["daily", "weekly", "monthly", "all-time"] as Period[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod(p)}
                className="capitalize"
              >
                {p === "all-time" ? "All Time" : p}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>{period === "all-time" ? "All Time" : period.charAt(0).toUpperCase() + period.slice(1)} Leaderboard</CardTitle>
          <CardDescription>Top performers this {period}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const isYou = entry.name === "You";
              return (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl border p-4 transition",
                    isYou
                      ? "border-orange-500/40 bg-orange-500/10"
                      : "border-white/5 bg-white/5 hover:bg-white/10"
                  )}
                >
                  {/* Rank */}
                  <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-bold text-lg",
                    getRankBadge(entry.rank)
                  )}>
                    {getRankIcon(entry.rank) || entry.rank}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn("font-semibold", isYou ? "text-orange-200" : "text-white")}>
                        {entry.name}
                      </p>
                      {isYou && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                      <div className="flex items-center gap-1">
                        {getChangeIcon(entry.change)}
                        {entry.change !== 0 && (
                          <span className={cn(
                            "text-xs",
                            entry.change > 0 ? "text-green-500" : "text-red-500"
                          )}>
                            {Math.abs(entry.change)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{entry.tasksCompleted} tasks</span>
                      <span>{entry.referrals} referrals</span>
                    </div>
                  </div>

                  {/* Earnings */}
                  <div className="text-right">
                    <p className={cn("text-lg font-bold", isYou ? "text-orange-200" : "text-white")}>
                      {formatAmount(entry.earnings)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total earnings</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Your Stats */}
      <Card className="border-orange-500/40 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent">
        <CardHeader>
          <CardTitle className="text-white">Your Performance</CardTitle>
          <CardDescription className="text-white/70">How you're doing this {period}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-white/70">Your Rank</p>
              <p className="text-3xl font-bold text-white">#{leaderboard.find(e => e.name === "You")?.rank || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Your Earnings</p>
              <p className="text-3xl font-bold text-white">
                {formatAmount(leaderboard.find(e => e.name === "You")?.earnings || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70">Rank Change</p>
              <div className="flex items-center gap-2 mt-1">
                {getChangeIcon(leaderboard.find(e => e.name === "You")?.change || 0)}
                <p className="text-3xl font-bold text-white">
                  {leaderboard.find(e => e.name === "You")?.change || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


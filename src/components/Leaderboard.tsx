import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  earnings: number;
  referrals: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
}

export const Leaderboard = ({ entries, currentUserRank }: LeaderboardProps) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-primary glow-sm";
    if (rank === 2) return "text-accent";
    if (rank === 3) return "text-primary/70";
    return "text-muted-foreground";
  };

  return (
    <Card className="border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Trophy className="h-5 w-5 text-primary" />
          Top Referrers
        </h3>
        {currentUserRank && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            You're #{currentUserRank}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between rounded-lg border p-3 transition-all hover:border-primary/30 ${
              entry.rank === currentUserRank
                ? "border-primary/50 bg-primary/5"
                : "border-border bg-muted/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                  entry.rank <= 3 ? "bg-primary/20" : "bg-muted"
                }`}
              >
                <span className={getRankColor(entry.rank)}>#{entry.rank}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{entry.name}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.referrals} referrals
                </p>
              </div>
            </div>
            
            <span className="font-semibold text-primary">₹{entry.earnings}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

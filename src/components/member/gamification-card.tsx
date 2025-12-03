"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, Flame, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface GamificationData {
  coins: number;
  level: "Newbie" | "Pro" | "Elite";
  currentXP: number;
  nextLevelXP: number;
  streakDays: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    icon: string;
  }>;
}

interface GamificationCardProps {
  data?: GamificationData;
  isLoading?: boolean;
}

export function GamificationCard({ data, isLoading }: GamificationCardProps) {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const xpProgress = data.nextLevelXP > 0 
    ? (data.currentXP / data.nextLevelXP) * 100 
    : 0;

  const levelColors = {
    Newbie: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Pro: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Elite: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  const unlockedAchievements = data.achievements.filter((a) => a.unlocked);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Gamification
        </CardTitle>
        <CardDescription>Your progress and achievements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coins and Level */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="h-4 w-4" />
              Earniq Coins
            </div>
            <p className="text-2xl font-semibold">{data.coins.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Level
            </div>
            <Badge className={levelColors[data.level]} variant="outline">
              {data.level}
            </Badge>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">XP Progress</span>
            <span className="font-medium">
              {data.currentXP} / {data.nextLevelXP}
            </span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>

        {/* Streak */}
        {data.streakDays > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
            <Flame className="h-4 w-4 text-orange-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Streak</p>
              <p className="text-xs text-muted-foreground">{data.streakDays} days in a row</p>
            </div>
          </div>
        )}

        {/* Achievements Preview */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Achievements</p>
            <div className="flex flex-wrap gap-2">
              {unlockedAchievements.slice(0, 3).map((achievement) => (
                <Badge key={achievement.id} variant="secondary" className="text-xs">
                  <span className="mr-1">{achievement.icon}</span>
                  {achievement.name}
                </Badge>
              ))}
              {unlockedAchievements.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{unlockedAchievements.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


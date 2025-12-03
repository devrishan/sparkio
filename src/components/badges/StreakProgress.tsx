"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar, Flame, Gift, RotateCcw, X } from "lucide-react";

import { SectionCard, StatusPill } from "@/components/dashboard";
import { STREAK_EVENT, getStreakData, recordStreakActivity, resetStreakData } from "@/lib/mock-data/streaks";
import { cn } from "@/lib/utils";

export function StreakProgress() {
  const [streakData, setStreakData] = useState(getStreakData());
  const [showHistory, setShowHistory] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const refreshStreak = useCallback(() => {
    setStreakData(getStreakData());
  }, []);

  useEffect(() => {
    refreshStreak();
  }, [refreshStreak]);

  useEffect(() => {
    const handleUpdate = () => refreshStreak();
    window.addEventListener(STREAK_EVENT, handleUpdate);
    return () => window.removeEventListener(STREAK_EVENT, handleUpdate);
  }, [refreshStreak]);

  const progressPercent =
    streakData.nextMilestone > 0 ? Math.min(100, (streakData.currentStreak / streakData.nextMilestone) * 100) : 0;
  const today = new Date().toISOString().split("T")[0];
  const hasLoggedToday = streakData.lastActivityDate === today;

  const handleViewHistory = () => {
    setShowHistory(true);
  };

  const handleLogToday = () => {
    recordStreakActivity();
    refreshStreak();
    setAnnouncement("Logged today's activity — streak protected.");
  };

  const handleReset = () => {
    resetStreakData();
    refreshStreak();
    setAnnouncement("Streak reset for demo testing.");
  };

  return (
    <>
      <SectionCard title="Streak Progress" subtitle="Complete tasks daily to maintain your streak">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{streakData.currentStreak}</p>
                <p className="text-xs text-white/70">Current streak (days)</p>
              </div>
            </div>
            <StatusPill label={`${streakData.nextMilestone - streakData.currentStreak} days to next reward`} tone="brand" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Next milestone: {streakData.nextMilestone} days</span>
              <span className="font-semibold text-orange-400">{streakData.nextMilestoneReward}</span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={streakData.currentStreak}
                aria-valuemin={0}
                aria-valuemax={streakData.nextMilestone}
                aria-label={`Streak progress: ${streakData.currentStreak} of ${streakData.nextMilestone} days`}
              />
            </div>
          </div>

          {streakData.longestStreak > streakData.currentStreak && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Longest streak</span>
                <span className="font-semibold text-white">{streakData.longestStreak} days</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleLogToday}
              disabled={hasLoggedToday}
              className={cn(
                "flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-500/40",
                hasLoggedToday
                  ? "cursor-not-allowed border-white/10 bg-white/5 text-white/50"
                  : "border-orange-500/40 bg-orange-500/10 text-orange-100 hover:border-orange-500 hover:bg-orange-500/20",
              )}
            >
              {hasLoggedToday ? "You're covered for today" : "Log today's activity"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset demo streak
            </button>
          </div>

          <button
            onClick={handleViewHistory}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
          >
            <Calendar className="mr-2 inline h-4 w-4" />
            View Streak History
          </button>
        </div>
        <span className="sr-only" aria-live="polite">
          {announcement}
        </span>
      </SectionCard>

      {showHistory && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0A0D14] p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-white">Streak History</h3>
                  <p className="mt-1 text-sm text-white/70">Your activity over the last 30 days</p>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
                  aria-label="Close streak history"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-400" />
                    <span className="font-semibold text-white">Current Streak</span>
                  </div>
                  <span className="text-lg font-bold text-orange-400">{streakData.currentStreak} days</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-400" />
                    <span className="font-semibold text-white">Longest Streak</span>
                  </div>
                  <span className="text-lg font-bold text-white">{streakData.longestStreak} days</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold text-white">Total Active Days</span>
                  </div>
                  <span className="text-lg font-bold text-white">{streakData.streakHistory.length} days</span>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/70">
                  Complete at least one task each day to maintain your streak. Missing a day resets your current streak,
                  but your longest streak record remains.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}


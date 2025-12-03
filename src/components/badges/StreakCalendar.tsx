"use client";

import { useEffect, useState } from "react";
import { Calendar, Flame } from "lucide-react";

import { STREAK_EVENT, getStreakCalendar, getStreakData } from "@/lib/mock-data/streaks";
import { cn } from "@/lib/utils";

export function StreakCalendar() {
  const [calendar, setCalendar] = useState<Array<{ date: string; hasActivity: boolean }>>([]);
  const [streakData, setStreakData] = useState(getStreakData());

  useEffect(() => {
    setCalendar(getStreakCalendar());
    setStreakData(getStreakData());
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setCalendar(getStreakCalendar());
      setStreakData(getStreakData());
    };
    window.addEventListener(STREAK_EVENT, handleUpdate);
    return () => window.removeEventListener(STREAK_EVENT, handleUpdate);
  }, []);

  const formatDay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.getDate().toString();
  };

  const isToday = (dateStr: string): boolean => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr === today;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-orange-400" />
        <h3 className="text-lg font-semibold text-white">Streak Calendar</h3>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
          <div key={idx} className="p-2 text-xs font-semibold text-white/50">
            {day}
          </div>
        ))}
        
        {calendar.map((item) => (
          <div
            key={item.date}
            className={cn(
              "relative aspect-square rounded-lg border p-1 text-xs transition",
              item.hasActivity
                ? "border-orange-500/40 bg-gradient-to-br from-orange-500/30 to-orange-600/20"
                : "border-white/10 bg-white/5",
              isToday(item.date) && "ring-2 ring-orange-400 ring-offset-2 ring-offset-[#040507]"
            )}
            title={item.date}
          >
            <div
              className={cn(
                "flex h-full items-center justify-center rounded",
                item.hasActivity && "bg-orange-500/20"
              )}
            >
              {item.hasActivity ? (
                <Flame className="h-3 w-3 text-orange-400" />
              ) : (
                <span className={cn("text-white/40", isToday(item.date) && "text-white/70 font-semibold")}>
                  {formatDay(item.date)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/70">Current streak</span>
          <span className="flex items-center gap-1 font-bold text-orange-400">
            <Flame className="h-4 w-4" />
            {streakData.currentStreak} days
          </span>
        </div>
        {streakData.longestStreak > streakData.currentStreak && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-white/70">Longest streak</span>
            <span className="font-semibold text-white">{streakData.longestStreak} days</span>
          </div>
        )}
      </div>
    </div>
  );
}


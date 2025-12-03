"use client";

import { Award, CheckCircle2, Gift } from "lucide-react";

import { SectionCard } from "@/components/dashboard";
import { getMilestones, type Milestone } from "@/lib/mock-data/referrals";
import { formatPoints } from "@/lib/mock-data/referrals";
import { cn } from "@/lib/utils";

export function MilestoneBonuses() {
  const milestones = getMilestones();

  return (
    <SectionCard
      title="Milestone Bonuses"
      subtitle="Earn bonus points when you hit referral milestones"
    >
      <div className="space-y-4">
        {milestones.map((milestone) => {
          const progressPercent = Math.min(100, milestone.progress * 100);
          const isAchieved = milestone.achieved;

          return (
            <div
              key={milestone.id}
              className={cn(
                "rounded-2xl border p-4 transition-all",
                isAchieved
                  ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10"
                  : "border-white/10 bg-white/5",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    {isAchieved ? (
                      <div className="rounded-full bg-emerald-500/20 p-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-white/10 p-2">
                        <Gift className="h-5 w-5 text-white/50" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-white">
                        {milestone.targetReferrals} Referrals
                      </h3>
                      <p className="text-xs text-white/60">
                        {isAchieved ? "Milestone achieved!" : "Keep referring to unlock"}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {!isAchieved && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/70">
                          {Math.floor(milestone.progress * milestone.targetReferrals)} / {milestone.targetReferrals} referrals
                        </span>
                        <span className="text-white/70">{Math.floor(progressPercent)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                          role="progressbar"
                          aria-valuenow={Math.floor(milestone.progress * milestone.targetReferrals)}
                          aria-valuemin={0}
                          aria-valuemax={milestone.targetReferrals}
                        />
                      </div>
                    </div>
                  )}

                  {/* Achievement Date */}
                  {isAchieved && milestone.achievedDate && (
                    <p className="text-xs text-emerald-200/70">
                      Achieved on {new Date(milestone.achievedDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* Bonus Points */}
                <div className="text-right">
                  <div className="flex items-center gap-1.5 rounded-xl border border-orange-500/40 bg-orange-500/10 px-3 py-2">
                    <Award className="h-4 w-4 text-orange-300" />
                    <div>
                      <p className="text-xs text-white/70">Bonus</p>
                      <p className="text-base font-bold text-orange-200">
                        +{formatPoints(milestone.bonusPoints)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
        <p>
          💡 <strong className="text-white">Tip:</strong> Milestone bonuses are awarded automatically when you reach each target. 
          Keep referring friends to unlock bigger rewards!
        </p>
      </div>
    </SectionCard>
  );
}


"use client";

import { cn } from "@/lib/utils";

export type RiskLevel = "low" | "medium" | "high";

interface RiskScorePillProps {
  level: RiskLevel;
  score?: number;
  className?: string;
}

const riskStyles: Record<RiskLevel, string> = {
  low: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/30",
  medium: "bg-yellow-500/10 text-yellow-200 border border-yellow-500/30",
  high: "bg-red-500/10 text-red-200 border border-red-500/30",
};

const riskLabels: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
};

export function RiskScorePill({ level, score, className }: RiskScorePillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        riskStyles[level],
        className
      )}
      title={score !== undefined ? `Risk score: ${score}/100` : undefined}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
      {riskLabels[level]}
      {score !== undefined && <span className="opacity-70">({score})</span>}
    </span>
  );
}


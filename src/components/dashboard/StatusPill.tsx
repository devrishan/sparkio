"use client";

import { cn } from "@/lib/utils";

export type StatusTone =
  | "brand"
  | "info"
  | "pending"
  | "success"
  | "warning"
  | "danger";

const toneStyles: Record<StatusTone, string> = {
  brand: "bg-orange-500/10 text-orange-200 border border-orange-500/30",
  info: "bg-blue-500/10 text-blue-200 border border-blue-500/30",
  pending: "bg-amber-500/10 text-amber-200 border border-amber-500/30",
  success: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/30",
  warning: "bg-yellow-500/10 text-yellow-200 border border-yellow-500/30",
  danger: "bg-red-500/10 text-red-200 border border-red-500/30",
};

interface StatusPillProps {
  label: string;
  tone?: StatusTone;
  className?: string;
}

export function StatusPill({ label, tone = "brand", className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        toneStyles[tone],
        className
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}


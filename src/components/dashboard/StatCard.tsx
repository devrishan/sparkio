"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  accent?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "from-white/10 via-white/0 to-transparent",
  className,
}: StatCardProps) {
  return (
    <article
      className={cn(
        "rounded-3xl border border-white/5 bg-gradient-to-br p-5 text-white shadow-inner shadow-black/30",
        accent,
        className
      )}
    >
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        {icon ? <span className="text-white/70">{icon}</span> : null}
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="text-xs text-orange-200">{hint}</p> : null}
    </article>
  );
}


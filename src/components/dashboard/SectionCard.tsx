"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  actions,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/5 bg-[#0A0D14] p-6 shadow-xl shadow-black/50",
        className
      )}
    >
      {(title || subtitle || actions) && (
        <header className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {title ? (
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {actions ? <div className="text-sm text-muted-foreground">{actions}</div> : null}
        </header>
      )}
      <div className={cn(title || subtitle || actions ? "mt-4" : undefined)}>
        {children}
      </div>
    </section>
  );
}


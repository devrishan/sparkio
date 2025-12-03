"use client";

import { Award, Search, UserPlus } from "lucide-react";

import { SectionCard } from "@/components/dashboard";
import { REFERRAL_STEPS } from "@/lib/mock-data/referrals";
import { cn } from "@/lib/utils";

const iconMap = {
  UserPlus,
  Search,
  Award,
};

export function ReferralSteps() {
  return (
    <SectionCard
      title="How it works"
      subtitle="Earn points by referring friends in three simple steps"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {REFERRAL_STEPS.map((step, index) => {
          const Icon = iconMap[step.icon as keyof typeof iconMap] || UserPlus;
          
          return (
            <div
              key={step.number}
              className={cn(
                "relative space-y-4 rounded-2xl border p-6",
                "border-white/10 bg-gradient-to-br from-white/5 to-transparent",
                "transition-all hover:border-white/20 hover:bg-white/10",
              )}
            >
              {/* Step Number Badge */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-bold text-white shadow-lg shadow-orange-500/30">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                </div>
              </div>

              {/* Icon */}
              <div className="flex items-center justify-center rounded-xl bg-white/5 p-4">
                <Icon className="h-8 w-8 text-orange-400" aria-hidden="true" />
              </div>

              {/* Description */}
              <p className="text-sm text-white/70 leading-relaxed">{step.description}</p>

              {/* Connector Line (hidden on last item) */}
              {index < REFERRAL_STEPS.length - 1 && (
                <div
                  className="absolute -right-3 top-1/2 hidden h-0.5 w-6 -translate-y-1/2 bg-gradient-to-r from-orange-500/50 to-transparent md:block"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}


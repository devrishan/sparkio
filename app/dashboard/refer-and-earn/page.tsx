"use client";

import { useEffect, useState } from "react";

import { ReferralBanner } from "@/components/referrals/ReferralBanner";
import { ReferralSteps } from "@/components/referrals/ReferralSteps";
import { ReferralStats } from "@/components/referrals/ReferralStats";
import { ReferralLeaderboard } from "@/components/referrals/ReferralLeaderboard";
import { MilestoneBonuses } from "@/components/referrals/MilestoneBonuses";
import { ReferralActivityLog } from "@/components/referrals/ReferralActivityLog";
import {
  type ReferralStats as ReferralStatsType,
  getReferralStats,
  getReferralLink,
  REFERRAL_STORAGE_KEY,
} from "@/lib/mock-data/referrals";

export default function ReferAndEarnPage() {
  const [stats, setStats] = useState<ReferralStatsType>(getReferralStats());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Load initial stats
    setStats(getReferralStats());

    // Listen for storage changes (cross-tab sync)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === REFERRAL_STORAGE_KEY) {
        setStats(getReferralStats());
      }
    };

    window.addEventListener("storage", handleStorage);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleShare = () => {
    // Fallback share handler for browsers without Web Share API
    const referralLink = getReferralLink();
    const shareText = `Join Sparkio and start earning! Use my referral link: ${referralLink}`;
    
    // Try to open WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
          Refer and Earn
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Earn points by referring friends
        </h1>
        <p className="text-sm text-muted-foreground">
          Share your referral link and earn up to 7,500 points per month when your friends join and complete tasks.
        </p>
      </header>

      <ReferralBanner onShare={handleShare} />

      <ReferralStats stats={stats} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <MilestoneBonuses />
        <ReferralLeaderboard />
      </div>

      <ReferralActivityLog />

      <ReferralSteps />
    </div>
  );
}


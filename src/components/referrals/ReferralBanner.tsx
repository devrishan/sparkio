"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getReferralLink } from "@/lib/mock-data/referrals";
import { cn } from "@/lib/utils";

interface ReferralBannerProps {
  onShare?: () => void;
}

export function ReferralBanner({ onShare }: ReferralBannerProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = getReferralLink();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join Sparkio and start earning!",
        text: "Use my referral link to join Sparkio and earn rewards together!",
        url: referralLink,
      }).catch(() => {
        // User cancelled or error
      });
    } else {
      onShare?.();
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 sm:p-8",
        "border-orange-500/40 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent",
        "shadow-lg shadow-orange-500/20",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent" />
      
      <div className="relative space-y-6">
        {/* Headline and Description */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Refer friends and earn up to 7,500 points/month
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl">
            Share your unique referral link with friends. When they join and complete tasks, you both earn points. 
            The more friends you refer, the more you earn!
          </p>
        </div>

        {/* Referral Link Box */}
        <div className="space-y-3">
          <label htmlFor="referral-link" className="text-sm font-semibold text-white/90">
            Your referral link
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
              <input
                id="referral-link"
                type="text"
                value={referralLink}
                readOnly
                className="w-full bg-transparent font-mono text-sm text-white focus:outline-none"
                aria-label="Referral link"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 min-h-[44px]"
                aria-label={copied ? "Link copied" : "Copy referral link"}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                onClick={handleShare}
                className="bg-orange-500 text-white hover:bg-orange-600 min-h-[44px]"
                aria-label="Share referral link"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          <p className="text-xs text-white/60">
            Share this link via WhatsApp, email, or social media. Each friend who joins earns you points!
          </p>
        </div>
      </div>
    </div>
  );
}


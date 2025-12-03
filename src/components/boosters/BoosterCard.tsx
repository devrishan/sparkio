"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Zap } from "lucide-react";

import type { Booster } from "@/lib/mock-data/boosters";
import { claimBooster, getBoosterState, setBoosterActivation } from "@/lib/mock-data/boosters";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface BoosterCardProps {
  booster: Booster;
  onStateChange?: () => void;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function BoosterCard({ booster, onStateChange }: BoosterCardProps) {
  const [claimed, setClaimed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const multiplierText = useMemo(() => {
    if (booster.type === "multiplier" && booster.multiplier) {
      return `${booster.multiplier}×`;
    }
    if (booster.type === "category_boost" && booster.categoryBoost) {
      return `+${booster.categoryBoost.percentage}%`;
    }
    return "";
  }, [booster]);

  const hydrateState = () => {
    const state = getBoosterState(booster.id);
    setClaimed(state.isClaimed || booster.isClaimable === false);
    const active = state.isActive && !!state.expiresAt && state.expiresAt > Math.floor(Date.now() / 1000);
    setIsActive(active);
    setExpiresAt(state.expiresAt ?? null);
    if (!active) {
      setTimeRemaining(null);
    }
  };

  useEffect(() => {
    hydrateState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booster.id]);

  useEffect(() => {
    if (!isActive || !expiresAt) {
      setTimeRemaining(null);
      return;
    }

    const tick = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = expiresAt - now;
      setTimeRemaining(remaining > 0 ? remaining : 0);

      if (remaining <= 0) {
        setIsActive(false);
        setAnnouncement(`${booster.title} booster expired`);
        onStateChange?.();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [booster.title, expiresAt, isActive, onStateChange]);

  const handleClaim = () => {
    if (booster.isClaimable === false) return;
    claimBooster(booster.id);
    setClaimed(true);
    setAnnouncement(`${booster.title} claimed`);
    onStateChange?.();
  };

  const handleToggle = () => {
    const nextState = setBoosterActivation(booster, !isActive);
    setIsActive(nextState.isActive);
    setExpiresAt(nextState.expiresAt ?? null);
    setAnnouncement(
      nextState.isActive ? `${booster.title} activated for this session` : `${booster.title} paused`,
    );
    onStateChange?.();
  };

  const showCountdown = isActive && timeRemaining !== null && timeRemaining > 0;
  const hasExpired = !isActive && expiresAt !== null && expiresAt <= Math.floor(Date.now() / 1000);

  return (
    <div
      className={cn(
        "group relative rounded-2xl border p-4 transition-all focus-within:ring-2 focus-within:ring-orange-500/40",
        isActive
          ? "border-orange-500/40 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent shadow-lg shadow-orange-500/20"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Zap className={cn("h-5 w-5", isActive ? "text-orange-300" : "text-white/50")} aria-hidden="true" />
            <h3 className="font-semibold text-white">{booster.title}</h3>
            {multiplierText && (
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-xs font-bold uppercase tracking-wide",
                  isActive
                    ? "border-orange-500/40 bg-orange-500/20 text-orange-100"
                    : "border-white/20 bg-white/10 text-white/70",
                )}
              >
                {multiplierText}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-white/70">{booster.description}</p>

          {showCountdown && (
            <div
              className="mt-3 flex items-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/10 px-3 py-2"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <Clock className="h-4 w-4 text-orange-200" aria-hidden="true" />
              <span className="font-mono text-sm font-semibold text-orange-100">{formatTime(timeRemaining)}</span>
              <span className="text-xs text-orange-200/70">remaining</span>
            </div>
          )}

          {hasExpired && (
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-white/60" aria-live="polite">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-300" />
              Booster expired — claim again soon
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {claimed ? (
            <label className="flex items-center gap-2 text-xs text-white/70">
              <Switch
                checked={isActive}
                onCheckedChange={handleToggle}
                aria-label={`Toggle ${booster.title} booster`}
                className={cn(
                  "border border-white/10 data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-white/10",
                )}
              />
              Active
            </label>
          ) : booster.isClaimable !== false ? (
            <button
              onClick={handleClaim}
              className="rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-100 transition hover:border-orange-500 hover:bg-orange-500/20"
            >
              Claim booster
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-wide text-white/60">
              <CheckCircle2 className="h-3 w-3 text-emerald-300" />
              Auto-active
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-[11px] text-white/60">
        {booster.type === "multiplier" ? (
          <p>Applies to every task you complete while it stays active.</p>
        ) : (
          <p>
            Works on <span className="font-semibold text-white">{booster.categoryBoost?.category}</span> tasks for this
            session.
          </p>
        )}
      </div>

      <span className="sr-only" aria-live="assertive">
        {announcement}
      </span>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Settings, ToggleLeft, ToggleRight } from "lucide-react";

import { SectionCard } from "@/components/dashboard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WALLET_SETTINGS_KEY = "sparkio_wallet_settings";

interface WalletSettings {
  autoRedeem: boolean;
  monthlyLimit: number;
  defaultRedemptionMethod: "UPI" | "Digital Goods";
}

const defaultSettings: WalletSettings = {
  autoRedeem: false,
  monthlyLimit: 5000,
  defaultRedemptionMethod: "UPI",
};

export function WalletSettings() {
  const [settings, setSettings] = useState<WalletSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(WALLET_SETTINGS_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        // Use defaults
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(WALLET_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SectionCard
      title="Wallet Settings"
      subtitle="Manage your wallet preferences and redemption options"
    >
      <div className="space-y-6">
        {/* Auto-Redeem Toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex-1">
            <Label htmlFor="auto-redeem" className="text-sm font-semibold text-white cursor-pointer">
              Auto Redeem
            </Label>
            <p className="text-xs text-white/60 mt-1">
              Automatically redeem earnings when balance reaches a threshold
            </p>
          </div>
          <Switch
            id="auto-redeem"
            checked={settings.autoRedeem}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, autoRedeem: checked }))
            }
            className="data-[state=checked]:bg-orange-500"
            aria-label="Toggle auto redeem"
          />
        </div>

        {/* Monthly Limit */}
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <Label htmlFor="monthly-limit" className="text-sm font-semibold text-white">
            Monthly Spending Limit
          </Label>
          <Input
            id="monthly-limit"
            type="number"
            min="0"
            step="100"
            value={settings.monthlyLimit}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                monthlyLimit: Math.max(0, parseInt(e.target.value) || 0),
              }))
            }
            className="bg-white/5 border-white/10 text-white"
            aria-label="Monthly spending limit in rupees"
          />
          <p className="text-xs text-white/60">
            Set a maximum amount you can spend per month. Set to 0 for no limit.
          </p>
        </div>

        {/* Default Redemption Method */}
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <Label htmlFor="redemption-method" className="text-sm font-semibold text-white">
            Default Redemption Method
          </Label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({ ...prev, defaultRedemptionMethod: "UPI" }))
              }
              className={cn(
                "flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
                settings.defaultRedemptionMethod === "UPI"
                  ? "border-orange-500 bg-orange-500/20 text-orange-200"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20",
              )}
              aria-pressed={settings.defaultRedemptionMethod === "UPI"}
            >
              UPI ID
            </button>
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({ ...prev, defaultRedemptionMethod: "Digital Goods" }))
              }
              className={cn(
                "flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
                settings.defaultRedemptionMethod === "Digital Goods"
                  ? "border-orange-500 bg-orange-500/20 text-orange-200"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20",
              )}
              aria-pressed={settings.defaultRedemptionMethod === "Digital Goods"}
            >
              Digital Goods
            </button>
          </div>
          <p className="text-xs text-white/60">
            Choose your preferred method for redeeming wallet balance
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleSave}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Save Settings
          </Button>
          {saved && (
            <span className="text-xs text-emerald-400">Settings saved!</span>
          )}
        </div>
      </div>
    </SectionCard>
  );
}


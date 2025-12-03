"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, Plus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/mock-data/wallet";
import { cn } from "@/lib/utils";

interface TopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (amount: number) => void;
}

const PRESET_AMOUNTS = [50, 100, 250, 500];

export function TopUpModal({ open, onOpenChange, onSuccess }: TopUpModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Reset state when modal opens
      setSelectedAmount(null);
      setCustomAmount("");
      setError("");
      setIsLoading(false);
      // Focus first input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setError("");
  };

  const handleCustomChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    setError("");
  };

  const getFinalAmount = (): number | null => {
    if (selectedAmount !== null) {
      return selectedAmount;
    }
    if (customAmount.trim()) {
      const parsed = parseFloat(customAmount);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return null;
  };

  const handleConfirm = async () => {
    const amount = getFinalAmount();
    if (!amount || amount <= 0) {
      setError("Please select or enter a valid amount");
      return;
    }

    if (amount < 10) {
      setError("Minimum top-up amount is ₹10");
      return;
    }

    if (amount > 10000) {
      setError("Maximum top-up amount is ₹10,000");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate UPI payment flow
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Simulate payment success
      setIsLoading(false);
      onSuccess(amount);
      onOpenChange(false);
    } catch (err) {
      setIsLoading(false);
      setError("Payment failed. Please try again.");
    }
  };

  const finalAmount = getFinalAmount();
  const isValid = finalAmount !== null && finalAmount >= 10 && finalAmount <= 10000;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-md sm:max-w-lg"
        aria-labelledby="topup-title"
        aria-describedby="topup-description"
        onEscapeKeyDown={(e) => {
          if (isLoading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle id="topup-title">Add Money to Wallet</DialogTitle>
          <DialogDescription id="topup-description">
            Choose a preset amount or enter a custom amount. Payment will be processed via UPI.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preset Amounts */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white">Quick Select</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handlePresetClick(amount)}
                  disabled={isLoading}
                  className={cn(
                    "rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
                    selectedAmount === amount
                      ? "border-orange-500 bg-orange-500/20 text-orange-200 shadow-lg shadow-orange-500/20"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10",
                    isLoading && "opacity-50 cursor-not-allowed",
                  )}
                  aria-pressed={selectedAmount === amount}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-3">
            <Label htmlFor="custom-amount" className="text-sm font-semibold text-white">
              Or Enter Custom Amount
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">₹</div>
              <Input
                id="custom-amount"
                ref={inputRef}
                type="number"
                min="10"
                max="10000"
                step="10"
                value={customAmount}
                onChange={(e) => handleCustomChange(e.target.value)}
                placeholder="Enter amount (₹10 - ₹10,000)"
                disabled={isLoading}
                className="pl-8 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500"
                aria-label="Custom top-up amount"
                aria-describedby={error ? "amount-error" : undefined}
              />
            </div>
            {error && (
              <p id="amount-error" className="text-xs text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Summary */}
          {finalAmount && isValid && (
            <div className="rounded-xl border border-orange-500/40 bg-orange-500/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Amount to add</span>
                <span className="text-xl font-bold text-orange-200">{formatCurrency(finalAmount)}</span>
              </div>
              <p className="mt-2 text-xs text-white/60">
                This amount will be added to your wallet balance immediately after payment confirmation.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!isValid || isLoading}
              className="flex-1 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Confirm & Pay
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-white/50">
            By proceeding, you agree to process this payment via UPI. This is a demo transaction.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}


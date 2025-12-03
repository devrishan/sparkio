"use client";

import { useEffect, useState } from "react";

import { SectionCard } from "@/components/dashboard";
import { WalletOverview } from "@/components/wallet/WalletOverview";
import { TopUpModal } from "@/components/wallet/TopUpModal";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { WalletSettings } from "@/components/wallet/WalletSettings";
import {
  type WalletState,
  getWalletState,
  addTransaction,
  WALLET_STORAGE_KEY,
} from "@/lib/mock-data/wallet";

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletState>(getWalletState());
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    // Load initial state
    setWallet(getWalletState());

    // Listen for storage changes (e.g., from other tabs)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === WALLET_STORAGE_KEY) {
        setWallet(getWalletState());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleTopUpSuccess = (amount: number) => {
    const updated = addTransaction({
      type: "Top-Up",
      amount,
      status: "Completed",
      description: "Wallet top-up via UPI",
      referenceId: `UPI_${Date.now()}`,
    });
    setWallet(updated);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Wallet Management</p>
        <h1 className="text-3xl font-semibold text-white">My Wallet</h1>
        <p className="text-sm text-muted-foreground">
          Manage your balance, view transactions, and add money to your wallet.
        </p>
      </header>

      <WalletOverview wallet={wallet} onTopUp={() => setShowTopUpModal(true)} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Transaction History"
          subtitle="View all your wallet transactions and activity"
        >
          <TransactionHistory transactions={wallet.transactions} />
        </SectionCard>

        <WalletSettings />
      </div>

      <TopUpModal
        open={showTopUpModal}
        onOpenChange={setShowTopUpModal}
        onSuccess={handleTopUpSuccess}
      />
    </div>
  );
}


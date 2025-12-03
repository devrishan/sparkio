import { create } from "zustand";

interface WalletState {
  balance: number;
  withdrawable: number;
  pendingAmount: number;
  totalEarned: number;
  coins: number;
  setWallet: (wallet: {
    balance: number;
    withdrawable: number;
    pendingAmount: number;
    totalEarned: number;
    coins: number;
  }) => void;
  updateBalance: (amount: number) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  withdrawable: 0,
  pendingAmount: 0,
  totalEarned: 0,
  coins: 0,
  setWallet: (wallet) => set(wallet),
  updateBalance: (amount) =>
    set((state) => ({
      balance: state.balance + amount,
      withdrawable: state.withdrawable + amount,
    })),
  reset: () =>
    set({
      balance: 0,
      withdrawable: 0,
      pendingAmount: 0,
      totalEarned: 0,
      coins: 0,
    }),
}));


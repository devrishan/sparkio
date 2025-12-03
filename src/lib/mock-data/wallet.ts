/**
 * Mock data for wallet system
 * Wallet state and transactions are stored in localStorage
 */

export type TransactionType = "Task Earning" | "Top-Up" | "Redemption" | "Withdrawal" | "Refund";
export type TransactionStatus = "Completed" | "Pending" | "Failed";

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  date: string; // ISO date string
  amount: number; // positive for income, negative for expenses
  status: TransactionStatus;
  description?: string;
  referenceId?: string;
}

export interface WalletState {
  available: number;
  totalEarned: number;
  totalRedeemed: number;
  totalTopUps: number;
  transactions: WalletTransaction[];
}

export const WALLET_STORAGE_KEY = "sparkio_wallet_data";

const generateId = () => `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const defaultTransactions: WalletTransaction[] = [
  {
    id: generateId(),
    type: "Task Earning",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 80,
    status: "Completed",
    description: "App install task completed",
  },
  {
    id: generateId(),
    type: "Redemption",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    amount: -20,
    status: "Completed",
    description: "Redeemed for digital goods",
  },
  {
    id: generateId(),
    type: "Top-Up",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 100,
    status: "Completed",
    description: "Wallet top-up via UPI",
    referenceId: "UPI_REF_12345",
  },
  {
    id: generateId(),
    type: "Task Earning",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 120,
    status: "Completed",
    description: "UPI task completed",
  },
  {
    id: generateId(),
    type: "Task Earning",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 50,
    status: "Pending",
    description: "Social media task - under review",
  },
];

const calculateTotals = (transactions: WalletTransaction[]): Omit<WalletState, "transactions"> => {
  let available = 0;
  let totalEarned = 0;
  let totalRedeemed = 0;
  let totalTopUps = 0;

  for (const txn of transactions) {
    if (txn.status === "Completed") {
      if (txn.amount > 0) {
        if (txn.type === "Top-Up") {
          totalTopUps += txn.amount;
        } else if (txn.type === "Task Earning") {
          totalEarned += txn.amount;
        }
        available += txn.amount;
      } else {
        totalRedeemed += Math.abs(txn.amount);
        available += txn.amount; // negative amount
      }
    }
  }

  return { available, totalEarned, totalRedeemed, totalTopUps };
};

export const INITIAL_WALLET: WalletState = {
  ...calculateTotals(defaultTransactions),
  transactions: defaultTransactions,
};

/**
 * Get wallet state from localStorage or return initial state
 */
export function getWalletState(): WalletState {
  if (typeof window === "undefined") {
    return INITIAL_WALLET;
  }

  try {
    const stored = localStorage.getItem(WALLET_STORAGE_KEY);
    if (!stored) {
      return INITIAL_WALLET;
    }
    const parsed: WalletState = JSON.parse(stored);
    // Recalculate totals from transactions to ensure consistency
    const totals = calculateTotals(parsed.transactions);
    return {
      ...totals,
      transactions: parsed.transactions,
    };
  } catch {
    return INITIAL_WALLET;
  }
}

/**
 * Save wallet state to localStorage
 */
export function saveWalletState(state: WalletState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(state));
}

/**
 * Add a new transaction and update wallet state
 */
export function addTransaction(
  transaction: Omit<WalletTransaction, "id" | "date"> & { date?: string },
): WalletState {
  const current = getWalletState();
  const newTransaction: WalletTransaction = {
    ...transaction,
    id: generateId(),
    date: transaction.date || new Date().toISOString(),
  };

  const updatedTransactions = [newTransaction, ...current.transactions];
  const totals = calculateTotals(updatedTransactions);

  const updatedState: WalletState = {
    ...totals,
    transactions: updatedTransactions,
  };

  saveWalletState(updatedState);
  return updatedState;
}

/**
 * Update transaction status
 */
export function updateTransactionStatus(transactionId: string, status: TransactionStatus): WalletState {
  const current = getWalletState();
  const updatedTransactions = current.transactions.map((txn) =>
    txn.id === transactionId ? { ...txn, status } : txn,
  );

  const totals = calculateTotals(updatedTransactions);
  const updatedState: WalletState = {
    ...totals,
    transactions: updatedTransactions,
  };

  saveWalletState(updatedState);
  return updatedState;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}


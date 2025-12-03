/**
 * Mock data + client-only booster engine
 * Handles claiming, activation, countdowns, and payout calculations entirely in localStorage
 */

export type BoosterType = "multiplier" | "category_boost";

export type BoosterCategory = "App" | "UPI" | "Social" | "All";

export interface Booster {
  id: string;
  title: string;
  description: string;
  type: BoosterType;
  multiplier?: number;
  categoryBoost?: {
    category: BoosterCategory;
    percentage: number;
  };
  duration: number; // seconds
  isClaimable?: boolean;
}

export interface BoosterState {
  id: string;
  isClaimed: boolean;
  claimedAt?: number;
  isActive: boolean;
  activatedAt?: number;
  expiresAt?: number;
}

export const BOOSTER_STATE_STORAGE_KEY = "sparkio_booster_state";

const nowSeconds = () => Math.floor(Date.now() / 1000);

const defaultState = (id: string): BoosterState => ({
  id,
  isClaimed: false,
  isActive: false,
});

function readStates(): BoosterState[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(BOOSTER_STATE_STORAGE_KEY);
    if (!stored) return [];
    const parsed: BoosterState[] = JSON.parse(stored);
    return parsed.map((state) => sanitizeState(state));
  } catch {
    return [];
  }
}

function writeStates(states: BoosterState[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOOSTER_STATE_STORAGE_KEY, JSON.stringify(states));
}

function upsertState(newState: BoosterState) {
  const states = readStates();
  const index = states.findIndex((state) => state.id === newState.id);
  if (index === -1) {
    states.push(newState);
  } else {
    states[index] = newState;
  }
  writeStates(states);
  return newState;
}

function sanitizeState(state: BoosterState): BoosterState {
  const sanitized = { ...state };
  if (sanitized.expiresAt && sanitized.expiresAt <= nowSeconds()) {
    sanitized.isActive = false;
  }
  return sanitized;
}

export const AVAILABLE_BOOSTERS: Booster[] = [
  {
    id: "boost-2x-app-2h",
    title: "2× App Tasks",
    description: "Double your earnings from app install tasks for 2 hours",
    type: "multiplier",
    multiplier: 2,
    duration: 2 * 60 * 60,
    isClaimable: true,
  },
  {
    id: "boost-upi-30pct",
    title: "UPI Tasks +30%",
    description: "Earn 30% more from all UPI tasks for 4 hours",
    type: "category_boost",
    categoryBoost: {
      category: "UPI",
      percentage: 30,
    },
    duration: 4 * 60 * 60,
    isClaimable: true,
  },
  {
    id: "boost-social-25pct",
    title: "Social Tasks +25%",
    description: "Boost social media task earnings by 25% for 3 hours",
    type: "category_boost",
    categoryBoost: {
      category: "Social",
      percentage: 25,
    },
    duration: 3 * 60 * 60,
    isClaimable: true,
  },
  {
    id: "boost-all-1.5x",
    title: "1.5× All Tasks",
    description: "Multiply all task earnings by 1.5× for 1 hour",
    type: "multiplier",
    multiplier: 1.5,
    duration: 60 * 60,
    isClaimable: false,
  },
];

export function getBoosterState(boosterId: string): BoosterState {
  const states = readStates();
  const match = states.find((state) => state.id === boosterId);
  return match ? sanitizeState(match) : defaultState(boosterId);
}

export function claimBooster(boosterId: string): BoosterState {
  const existing = getBoosterState(boosterId);
  const updated: BoosterState = {
    ...existing,
    isClaimed: true,
    claimedAt: nowSeconds(),
  };
  return upsertState(updated);
}

export function setBoosterActivation(booster: Booster, shouldActivate: boolean): BoosterState {
  const existing = getBoosterState(booster.id);
  const now = nowSeconds();

  // Auto-claim non-claimable boosters when toggled
  const ensuredState = existing.isClaimed || booster.isClaimable === false ? existing : claimBooster(booster.id);

  const updated: BoosterState = {
    ...ensuredState,
    isClaimed: true,
    isActive: shouldActivate && booster.duration > 0,
    activatedAt: shouldActivate ? now : ensuredState.activatedAt,
    expiresAt: shouldActivate ? now + booster.duration : ensuredState.expiresAt,
  };

  if (!updated.isActive) {
    updated.expiresAt = shouldActivate ? now + booster.duration : undefined;
  }

  return upsertState(updated);
}

export function getActiveBoosters(): (Booster & { expiresAt?: number; claimedAt?: number })[] {
  const states = readStates();
  const activeStates = states.filter((state) => state.isActive && state.expiresAt && state.expiresAt > nowSeconds());

  return activeStates
    .map((state) => {
      const base = AVAILABLE_BOOSTERS.find((booster) => booster.id === state.id);
      if (!base) return null;
      return {
        ...base,
        isClaimable: base.isClaimable,
        isActive: true,
        expiresAt: state.expiresAt,
        claimedAt: state.claimedAt,
      };
    })
    .filter((booster): booster is Booster & { expiresAt?: number; claimedAt?: number } => Boolean(booster));
}

export function calculateBoostedPayout(
  basePayout: number,
  taskCategory: BoosterCategory,
  activeBoosters: Booster[] = getActiveBoosters(),
): number {
  let finalPayout = basePayout;

  for (const booster of activeBoosters) {
    if (booster.type === "multiplier" && booster.multiplier) {
      finalPayout *= booster.multiplier;
    }

    if (booster.type === "category_boost" && booster.categoryBoost) {
      const applies =
        booster.categoryBoost.category === "All" || booster.categoryBoost.category === taskCategory;
      if (applies) {
        finalPayout *= 1 + booster.categoryBoost.percentage / 100;
      }
    }
  }

  return Math.round(finalPayout);
}


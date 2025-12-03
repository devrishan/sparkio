/**
 * In-memory stores for OTP and users (development only)
 * These will be replaced with database in production
 */

export interface OtpEntry {
  phone: string;
  code: string;
  expiresAt: Date;
  consumed: boolean;
  attempts: number;
  lockedUntil?: Date;
}

export interface InMemoryUser {
  id: string;
  phone: string;
  role: "USER" | "ADMIN";
  referralCode?: string;
  referredById?: string;
  createdAt: Date;
}

// Constants for brute-force protection
const MAX_OTP_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// In-memory OTP store
const otpStore = new Map<string, OtpEntry>();

// In-memory user store
const userStore = new Map<string, InMemoryUser>();

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a referral code
 */
function generateReferralCode(): string {
  return `EQ${Date.now().toString(36).toUpperCase()}`;
}

/**
 * Store OTP with expiry
 */
export function storeOtp(phone: string, code: string, ttlSeconds: number = 300): void {
  // Clean up expired OTPs for this phone
  const existing = otpStore.get(phone);
  if (existing && existing.expiresAt < new Date()) {
    otpStore.delete(phone);
  }

  // If phone is locked, don't overwrite - let lockout expire first
  if (existing?.lockedUntil && existing.lockedUntil > new Date()) {
    return; // Respect existing lockout
  }

  otpStore.set(phone, {
    phone,
    code,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000),
    consumed: false,
    attempts: 0,
  });
}

/**
 * Verify and consume OTP with brute-force protection
 */
export interface OtpVerifyResult {
  success: boolean;
  locked: boolean;
  attemptsRemaining: number;
  lockoutExpiresAt?: Date;
}

export function verifyAndConsumeOtp(phone: string, code: string): OtpVerifyResult {
  const entry = otpStore.get(phone);

  if (!entry) {
    return { success: false, locked: false, attemptsRemaining: 0 };
  }

  // Check if locked
  if (entry.lockedUntil && entry.lockedUntil > new Date()) {
    return {
      success: false,
      locked: true,
      attemptsRemaining: 0,
      lockoutExpiresAt: entry.lockedUntil,
    };
  }

  // Check if expired
  if (entry.expiresAt < new Date()) {
    otpStore.delete(phone);
    return { success: false, locked: false, attemptsRemaining: 0 };
  }

  // Check if already consumed
  if (entry.consumed) {
    return { success: false, locked: false, attemptsRemaining: 0 };
  }

  // Check if code matches
  if (entry.code !== code) {
    entry.attempts = (entry.attempts || 0) + 1;

    if (entry.attempts >= MAX_OTP_ATTEMPTS) {
      entry.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
      otpStore.set(phone, entry);
      return {
        success: false,
        locked: true,
        attemptsRemaining: 0,
        lockoutExpiresAt: entry.lockedUntil,
      };
    }

    otpStore.set(phone, entry);
    return {
      success: false,
      locked: false,
      attemptsRemaining: MAX_OTP_ATTEMPTS - entry.attempts,
    };
  }

  // Success - mark as consumed
  entry.consumed = true;
  otpStore.set(phone, entry);
  return { success: true, locked: false, attemptsRemaining: 0 };
}

/**
 * Get OTP entry (for dev logging)
 */
export function getOtpEntry(phone: string): OtpEntry | null {
  const entry = otpStore.get(phone);
  if (!entry || entry.expiresAt < new Date()) {
    return null;
  }
  return entry;
}

/**
 * Find user by phone
 */
export function findUserByPhone(phone: string): InMemoryUser | null {
  for (const user of userStore.values()) {
    if (user.phone === phone) {
      return user;
    }
  }
  return null;
}

/**
 * Find user by ID
 */
export function findUserById(id: string): InMemoryUser | null {
  return userStore.get(id) || null;
}

/**
 * Create or find user
 */
export function createOrFindUser(
  phone: string,
  referralCode?: string
): { user: InMemoryUser; isNew: boolean } {
  // Check if user exists
  let user = findUserByPhone(phone);

  if (user) {
    return { user, isNew: false };
  }

  // Find referrer if referral code provided
  let referredById: string | undefined;
  if (referralCode) {
    for (const existingUser of userStore.values()) {
      if (existingUser.referralCode === referralCode) {
        referredById = existingUser.id;
        break;
      }
    }
  }

  // Create new user
  const newUser: InMemoryUser = {
    id: generateUserId(),
    phone,
    role: "USER",
    referralCode: generateReferralCode(),
    referredById,
    createdAt: new Date(),
  };

  userStore.set(newUser.id, newUser);

  return { user: newUser, isNew: true };
}

/**
 * Clear expired OTPs (cleanup utility)
 */
export function cleanupExpiredOtps(): void {
  const now = new Date();
  for (const [phone, entry] of otpStore.entries()) {
    if (entry.expiresAt < now) {
      otpStore.delete(phone);
    }
    // Also clean up expired lockouts
    if (entry.lockedUntil && entry.lockedUntil < now) {
      entry.lockedUntil = undefined;
      entry.attempts = 0;
      otpStore.set(phone, entry);
    }
  }
}

/**
 * Get all users (for debugging)
 */
export function getAllUsers(): InMemoryUser[] {
  return Array.from(userStore.values());
}

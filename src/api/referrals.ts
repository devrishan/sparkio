import apiClient from "./axios";

export interface Referral {
  id: string;
  referred_user: {
    id: string;
    username: string;
    email?: string;
    phone: string;
    created_at: string;
  };
  level: number;
  status: "pending" | "verified" | "rejected";
  commission_amount: number;
  created_at: string;
  updated_at: string;
}

export interface ReferralStats {
  total: number;
  verified: number;
  pending: number;
  total_commission: number;
}

export interface ReferralsResponse {
  success: boolean;
  referrals: Referral[];
  stats: ReferralStats;
  chain?: {
    referrer: any;
    direct_referrals: any[];
  };
  tree?: any;
}

/**
 * Get user's referrals
 */
export async function getReferrals(): Promise<ReferralsResponse> {
  try {
    const response = await apiClient.get<ReferralsResponse>("/api/member/referrals");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching referrals:", error);
    return {
      success: false,
      referrals: [],
      stats: {
        total: 0,
        verified: 0,
        pending: 0,
        total_commission: 0,
      },
    };
  }
}

/**
 * Mask phone number - show only last 3 digits
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 3) return phone;
  const last3 = phone.slice(-3);
  const masked = "*".repeat(phone.length - 3);
  return `${masked}${last3}`;
}

/**
 * Generate WhatsApp share URL
 */
export function getWhatsAppShareUrl(referralCode: string): string {
  const text = encodeURIComponent(
    `Join Earniq and earn rewards. Use my code: ${referralCode}`
  );
  return `https://wa.me/?text=${text}`;
}


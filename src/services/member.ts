import { redirect } from "next/navigation";

import { serverFetch } from "@/lib/server-api";

export interface MemberDashboardPayload {
  wallet: {
    balance: number;
    total_earned: number;
  };
  referrals: {
    total: number;
    verified: number;
    pending: number;
    success_rate: number;
  };
  top_referrers: Array<{
    username: string;
    referral_code: string;
    verified_referrals: number;
    total_earned: number;
  }>;
}

export interface MemberReferral {
  id: number;
  username: string;
  email: string;
  status: string;
  commission_amount: number;
  created_at: string;
  updated_at: string | null;
}

export async function getMemberDashboard(): Promise<MemberDashboardPayload> {
  try {
    const data = await serverFetch<{
      success: boolean;
      wallet: MemberDashboardPayload["wallet"];
      referrals: MemberDashboardPayload["referrals"];
      top_referrers: MemberDashboardPayload["top_referrers"];
    }>("/api/member/dashboard.php");
    if (!data.success) {
      redirect("/login");
    }
    return {
      wallet: data.wallet,
      referrals: data.referrals,
      top_referrers: data.top_referrers,
    };
  } catch {
    redirect("/login");
  }
}

export async function getMemberReferrals(): Promise<MemberReferral[]> {
  try {
    const data = await serverFetch<{ success: boolean; referrals: MemberReferral[] }>("/api/member/referrals.php");
    if (!data.success) {
      redirect("/login");
    }
    return data.referrals;
  } catch {
    redirect("/login");
  }
}

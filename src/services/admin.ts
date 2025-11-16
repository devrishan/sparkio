import { redirect } from "next/navigation";

import { serverFetch } from "@/lib/server-api";

export interface AdminDashboardMetrics {
  metrics: {
    total_users: number;
    pending_withdrawals: {
      count: number;
      amount: number;
    };
    total_earnings_paid: number;
  };
}

export interface AdminReferral {
  id: number;
  status: "pending" | "verified" | "rejected";
  commission_amount: number;
  created_at: string;
  updated_at: string | null;
  referrer: {
    username: string;
    email: string;
  };
  referred: {
    username: string;
    email: string;
  };
}

export interface AdminWithdrawal {
  id: number;
  amount: number;
  status: "pending" | "processed" | "failed";
  upi_id: string;
  created_at: string;
  processed_at: string | null;
  user: {
    username: string;
    email: string;
  };
}

export interface AdminAd {
  id: number;
  name: string;
  ad_placement_id: string;
  ad_code_snippet: string;
  is_active: boolean;
}

interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export async function getAdminDashboard(): Promise<AdminDashboardMetrics> {
  try {
    const data = await serverFetch<{ success: boolean } & AdminDashboardMetrics>("/api/admin/dashboard.php");
    if (!data.success) {
      redirect("/login");
    }
    return {
      metrics: data.metrics,
    };
  } catch {
    redirect("/login");
  }
}

export async function getAdminReferrals(
  searchParams?: Record<string, string>,
): Promise<{
  data: AdminReferral[];
  pagination: PaginationMeta;
}> {
  try {
    const query = new URLSearchParams(searchParams);
    const path = `/api/admin/referrals.php${query.toString() ? `?${query.toString()}` : ""}`;
    const data = await serverFetch<{ success: boolean; data: AdminReferral[]; pagination: PaginationMeta }>(path);
    if (!data.success) {
      redirect("/login");
    }
    return {
      data: data.data,
      pagination: data.pagination,
    };
  } catch {
    redirect("/login");
  }
}

export async function getAdminWithdrawals(status: string = "pending"): Promise<AdminWithdrawal[]> {
  try {
    const data = await serverFetch<{ success: boolean; withdrawals: AdminWithdrawal[] }>(
      `/api/admin/withdrawals.php?status=${encodeURIComponent(status)}`,
    );
    if (!data.success) {
      redirect("/login");
    }
    return data.withdrawals;
  } catch {
    redirect("/login");
  }
}

export async function getAdminAds(): Promise<AdminAd[]> {
  try {
    const data = await serverFetch<{ success: boolean; ads: AdminAd[] }>("/api/admin/ads.php");
    if (!data.success) {
      redirect("/login");
    }
    return data.ads;
  } catch {
    redirect("/login");
  }
}


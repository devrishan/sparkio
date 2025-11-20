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
  id: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  upi_id: string;
  upi_qr_url?: string | null;
  created_at: string;
  processed_at: string | null;
  tx_id?: string | null;
  receipt_url?: string | null;
  notes?: string | null;
  user: {
    username: string | null;
    email: string | null;
    phone: string;
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

export async function getAdminWithdrawals(status: string = "PENDING"): Promise<AdminWithdrawal[]> {
  try {
    const data = await serverFetch<{ success: boolean; withdrawals: AdminWithdrawal[] }>(
      `/api/admin/withdrawals?status=${encodeURIComponent(status)}`,
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

export interface TaskSubmission {
  id: string;
  task: {
    id: string;
    title: string;
    slug: string;
    reward_amount: number;
    reward_coins: number;
  };
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
  };
  status: "SUBMITTED" | "REVIEWING" | "APPROVED" | "REJECTED" | "DELETED";
  proof_url: string;
  proof_type: string | null;
  notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewer: {
    id: string;
    username: string;
  } | null;
}

export async function getTaskSubmissions(
  filters?: {
    status?: string;
    task_id?: string;
    user_id?: string;
    page?: number;
    per_page?: number;
  },
): Promise<{
  data: TaskSubmission[];
  pagination: PaginationMeta;
}> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.task_id) params.append("task_id", filters.task_id);
    if (filters?.user_id) params.append("user_id", filters.user_id);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.per_page) params.append("per_page", filters.per_page.toString());
    const query = params.toString();
    const path = `/api/admin/tasks/submissions${query ? `?${query}` : ""}`;
    const data = await serverFetch<{ success: boolean; data: TaskSubmission[]; pagination: PaginationMeta }>(path);
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

export interface UpdateSubmissionStatusResponse {
  message: string;
  submission_id: string;
  status: string;
  reviewed_at: string;
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: "APPROVED" | "REJECTED" | "REVIEWING",
  reviewNotes?: string,
): Promise<UpdateSubmissionStatusResponse> {
  try {
    const data = await serverFetch<{ success: boolean } & UpdateSubmissionStatusResponse>(
      "/api/admin/tasks/submissions/update",
      {
        method: "PUT",
        body: JSON.stringify({
          submission_id: submissionId,
          new_status: status,
          review_notes: reviewNotes,
        }),
      },
    );
    if (!data.success) {
      redirect("/login");
    }
    return {
      message: data.message,
      submission_id: data.submission_id,
      status: data.status,
      reviewed_at: data.reviewed_at,
    };
  } catch {
    redirect("/login");
  }
}


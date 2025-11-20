import { redirect } from "next/navigation";

import { serverFetch } from "@/lib/server-api";

// Re-export types for convenience
export type { Task } from "./member-client";

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
  id: string;
  referred_user: {
    id: string;
    username: string | null;
    email: string | null;
    phone: string;
    created_at: string;
  };
  level: number;
  status: string;
  commission_amount: number;
  created_at: string;
  updated_at: string;
}

export async function getMemberDashboard(): Promise<MemberDashboardPayload> {
  try {
    const data = await serverFetch<{
      success: boolean;
      wallet: MemberDashboardPayload["wallet"];
      referrals: MemberDashboardPayload["referrals"];
      top_referrers: MemberDashboardPayload["top_referrers"];
    }>("/api/member/dashboard");
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


// Server-side version (for Server Components)
export async function getTasks(categoryId?: string, isActive?: boolean): Promise<import("./member-client").Task[]> {
  try {
    const params = new URLSearchParams();
    if (categoryId) params.append("category_id", categoryId);
    if (isActive !== undefined) params.append("is_active", isActive ? "1" : "0");
    const query = params.toString();
    const path = `/api/member/tasks/tasks.php${query ? `?${query}` : ""}`;
    const data = await serverFetch<{ success: boolean; tasks: Task[] }>(path);
    if (!data.success) {
      redirect("/login");
    }
    return data.tasks;
  } catch {
    redirect("/login");
  }
}


export interface TaskSubmissionResponse {
  message: string;
  submission_id: string;
  task_id: string;
  status: string;
}

export async function submitTask(
  taskId: string,
  proofFile: File,
  notes?: string,
): Promise<TaskSubmissionResponse> {
  try {
    const formData = new FormData();
    formData.append("task_id", taskId);
    formData.append("proof", proofFile);
    if (notes) formData.append("notes", notes);

    const cookieStore = await import("next/headers").then((m) => m.cookies());
    const token = cookieStore.get("sparkio_token")?.value;

    const response = await fetch(`${process.env.API_BASE_URL || "http://localhost:8080"}/api/member/tasks/submit.php`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to submit task" }));
      throw new Error(error.error || "Failed to submit task");
    }

    const data = (await response.json()) as { success: boolean } & TaskSubmissionResponse;
    if (!data.success) {
      throw new Error("Failed to submit task");
    }

    return {
      message: data.message,
      submission_id: data.submission_id,
      task_id: data.task_id,
      status: data.status,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to submit task");
  }
}
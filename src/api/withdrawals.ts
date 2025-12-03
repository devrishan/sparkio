import apiClient from "./axios";

export interface Withdrawal {
  id: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "PAID" | "REJECTED";
  upi_id: string;
  requested_at: string;
  approved_at?: string | null;
  paid_at?: string | null;
  rejected_at?: string | null;
  receipt_url?: string | null;
}

export interface RequestWithdrawalPayload {
  amount: number;
  upiId: string;
}

export interface RequestWithdrawalResponse {
  success: boolean;
  message?: string;
  withdrawal?: {
    id: string;
    amount: number;
    status: string;
    upi_id: string;
    requested_at: string;
  };
  error?: string;
}

export interface WithdrawalHistoryResponse {
  success: boolean;
  withdrawals: Withdrawal[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Request a withdrawal
 */
export async function requestWithdrawal(
  amount: number,
  upiId: string
): Promise<RequestWithdrawalResponse> {
  try {
    const response = await apiClient.post<RequestWithdrawalResponse>("/api/member/withdraw", {
      amount,
      upiId,
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to request withdrawal",
    };
  }
}

/**
 * Get withdrawal history
 */
export async function getWithdrawalHistory(filters?: {
  status?: string;
  page?: number;
  perPage?: number;
}): Promise<WithdrawalHistoryResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.perPage) params.append("perPage", filters.perPage.toString());

    const response = await apiClient.get<WithdrawalHistoryResponse>(
      `/api/member/withdrawals?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching withdrawal history:", error);
    return {
      success: false,
      withdrawals: [],
      pagination: {
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 0,
      },
    };
  }
}

/**
 * Validate UPI ID format
 */
export function validateUpiId(upiId: string): boolean {
  // UPI ID format: username@paytm, username@ybl, username@okaxis, etc.
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiRegex.test(upiId);
}


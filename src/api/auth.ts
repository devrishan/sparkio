import apiClient from "./axios";

export interface LoginWithPhoneResponse {
  ok: boolean;
  error?: string;
  message?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  user?: {
    id: string;
    phone: string;
    username: string;
    email?: string;
    role: "member" | "admin";
    referral_code?: string;
  };
  error?: string;
}

export interface User {
  id: string;
  phone: string;
  username: string;
  email?: string;
  role: "member" | "admin";
  referral_code?: string;
  upi_id?: string;
}

/**
 * Request OTP for phone number
 */
export async function loginWithPhone(phone: string): Promise<LoginWithPhoneResponse> {
  try {
    const response = await apiClient.post<LoginWithPhoneResponse>("/api/auth/otp/request", {
      phone,
    });
    return response.data;
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || "Failed to send OTP",
    };
  }
}

/**
 * Verify OTP and complete login
 */
export async function verifyOtp(
  phone: string,
  otp: string,
  referralCode?: string
): Promise<VerifyOtpResponse> {
  try {
    const response = await apiClient.post<VerifyOtpResponse>("/api/auth/otp/verify", {
      phone,
      otp,
      referral_code: referralCode,
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to verify OTP",
    };
  }
}

/**
 * Get current user session
 */
export async function getSession(): Promise<User | null> {
  try {
    const response = await apiClient.get<{ user?: User; success: boolean }>("/api/auth/session");
    if (response.data.success && response.data.user) {
      return response.data.user;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post("/api/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
}


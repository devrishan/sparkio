import apiClient from "./axios";

export interface UserProfile {
  id: string;
  username: string;
  phone: string;
  email?: string;
  upi_id?: string;
  referral_code?: string;
}

export interface UpdateProfilePayload {
  username?: string;
  upi_id?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const response = await apiClient.get<{ user: UserProfile; success: boolean }>(
      "/api/member/profile"
    );
    return response.data.user || null;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
  try {
    const response = await apiClient.put<UpdateProfileResponse>("/api/member/profile", payload);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update profile",
    };
  }
}


/**
 * OTP-based phone authentication client utilities
 * Uses cookie-based authentication (httpOnly cookies)
 */

export interface OtpAuthUser {
  id: string;
  phone: string;
  role: 'member' | 'admin';
}

export interface OtpRequestResponse {
  ok: boolean;
  ttl?: number;
  message?: string;
  error?: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  user?: OtpAuthUser;
  error?: string;
}

/**
 * Request OTP for phone number
 */
export async function loginWithOtpRequest(phone: string): Promise<OtpRequestResponse> {
  try {
    const response = await fetch('/api/auth/otp/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: data.error || 'Failed to request OTP',
      };
    }

    return {
      ok: true,
      ttl: data.ttl,
      message: data.message,
    };
  } catch (error) {
    console.error('[Auth OTP] Request error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Verify OTP and log in
 */
export async function verifyOtp(
  phone: string,
  otp: string,
  referralCode?: string
): Promise<{ success: boolean; user?: OtpAuthUser; error?: string }> {
  try {
    const response = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ phone, otp, referralCode }),
    });

    const data: OtpVerifyResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to verify OTP',
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    console.error('[Auth OTP] Verify error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Logout - clears cookies
 */
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('[Auth OTP] Logout error:', error);
    // Continue anyway - cookies may still be cleared
  }
}

/**
 * Get current session
 */
export async function getSession(): Promise<OtpAuthUser | null> {
  try {
    const response = await fetch('/api/auth/session', {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.user) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error('[Auth OTP] Session error:', error);
    return null;
  }
}


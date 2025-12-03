import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getMaintenanceState } from "@/lib/maintenance";
import { setAuthCookies } from "@/lib/auth-cookies";
import { isMockModeEnabled, mockAuthService } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const maintenanceState = await getMaintenanceState();
    if (maintenanceState.enabled) {
      return NextResponse.json(
        {
          success: false,
          error: maintenanceState.message ?? "Login is temporarily disabled for maintenance. Please try again later.",
        },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => null);

    if (!body?.email || !body?.password) {
      return NextResponse.json({ success: false, error: "Missing credentials." }, { status: 400 });
    }

    // Check if mock mode is enabled
    if (isMockModeEnabled()) {
      console.log("[Login] Using mock authentication");
      const mockResult = await mockAuthService.login(body.email, body.password);
      
      if (!mockResult.success || !mockResult.user || !mockResult.token) {
        return NextResponse.json(
          { success: false, error: mockResult.error ?? "Invalid credentials." },
          { status: 401 },
        );
      }

      const keepSignedIn = body.keep_me_signed_in === true;
      const expiresIn = 3600; // 1 hour default

      // Map mock user to expected format
      // Convert role: USER -> member, ADMIN -> admin
      const roleMap: Record<string, 'member' | 'admin'> = {
        'USER': 'member',
        'ADMIN': 'admin',
        'VERIFIER': 'admin',
        'PAYOUT_MANAGER': 'admin',
      };
      
      const user = {
        id: parseInt(mockResult.user.id.split('_')[1] || '1') || 1,
        username: mockResult.user.username || mockResult.user.phone || 'user',
        email: mockResult.user.email || body.email,
        role: roleMap[mockResult.user.role] || 'member' as 'member' | 'admin',
        referral_code: mockResult.user.referralCode,
      };

      console.log("[Login] Mock login successful for user:", {
        email: user.email,
        role: user.role,
        keepSignedIn,
      });

      const res = NextResponse.json({
        success: true,
        user,
      });

      try {
        setAuthCookies(res, {
          accessToken: mockResult.token,
          refreshToken: mockResult.token,
          user,
          keepSignedIn,
          accessTokenTTL: expiresIn,
          refreshTokenTTL: keepSignedIn ? 2592000 : 86400,
        });
        console.log("[Login] Auth cookies set successfully");
      } catch (cookieError) {
        console.error("[Login] Failed to set auth cookies:", cookieError);
      }

      return res;
    }

    // Real API fallback (if API_BASE_URL is configured)
    // If API_BASE_URL is not configured, default to mock mode
    if (!env.API_BASE_URL || env.API_BASE_URL.includes('8080') || env.API_BASE_URL.includes('/api/')) {
      console.warn("[Login] API_BASE_URL not configured or points to removed PHP backend. Using mock authentication.");
      const mockResult = await mockAuthService.login(body.email, body.password);
      
      if (!mockResult.success || !mockResult.user || !mockResult.token) {
        return NextResponse.json(
          { success: false, error: mockResult.error ?? "Invalid credentials." },
          { status: 401 },
        );
      }

      const keepSignedIn = body.keep_me_signed_in === true;
      const expiresIn = 3600;

      const roleMap: Record<string, 'member' | 'admin'> = {
        'USER': 'member',
        'ADMIN': 'admin',
        'VERIFIER': 'admin',
        'PAYOUT_MANAGER': 'admin',
      };
      
      const user = {
        id: parseInt(mockResult.user.id.split('_')[1] || '1') || 1,
        username: mockResult.user.username || mockResult.user.phone || 'user',
        email: mockResult.user.email || body.email,
        role: roleMap[mockResult.user.role] || 'member' as 'member' | 'admin',
        referral_code: mockResult.user.referralCode,
      };

      const res = NextResponse.json({
        success: true,
        user,
      });

      try {
        setAuthCookies(res, {
          accessToken: mockResult.token,
          refreshToken: mockResult.token,
          user,
          keepSignedIn,
          accessTokenTTL: expiresIn,
          refreshTokenTTL: keepSignedIn ? 2592000 : 86400,
        });
      } catch (cookieError) {
        console.error("[Login] Failed to set auth cookies:", cookieError);
      }

      return res;
    }

    let response: Response;
    try {
      response = await fetch(`${env.API_BASE_URL}/api/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
          keep_me_signed_in: body.keep_me_signed_in ?? false,
        }),
      });
    } catch (fetchError) {
      console.error("[Login] Failed to connect to API:", fetchError);
      // Fall back to mock mode if API connection fails
      console.warn("[Login] Falling back to mock authentication");
      const mockResult = await mockAuthService.login(body.email, body.password);
      
      if (!mockResult.success || !mockResult.user || !mockResult.token) {
        return NextResponse.json(
          { success: false, error: mockResult.error ?? "Invalid credentials." },
          { status: 401 },
        );
      }

      const keepSignedIn = body.keep_me_signed_in === true;
      const expiresIn = 3600;

      const roleMap: Record<string, 'member' | 'admin'> = {
        'USER': 'member',
        'ADMIN': 'admin',
        'VERIFIER': 'admin',
        'PAYOUT_MANAGER': 'admin',
      };
      
      const user = {
        id: parseInt(mockResult.user.id.split('_')[1] || '1') || 1,
        username: mockResult.user.username || mockResult.user.phone || 'user',
        email: mockResult.user.email || body.email,
        role: roleMap[mockResult.user.role] || 'member' as 'member' | 'admin',
        referral_code: mockResult.user.referralCode,
      };

      const res = NextResponse.json({
        success: true,
        user,
      });

      try {
        setAuthCookies(res, {
          accessToken: mockResult.token,
          refreshToken: mockResult.token,
          user,
          keepSignedIn,
          accessTokenTTL: expiresIn,
          refreshTokenTTL: keepSignedIn ? 2592000 : 86400,
        });
      } catch (cookieError) {
        console.error("[Login] Failed to set auth cookies:", cookieError);
      }

      return res;
    }

    let result: any;
    try {
      const responseText = await response.text();
      console.log("[Login] API response status:", response.status);
      console.log("[Login] API response text:", responseText.substring(0, 200));
      
      if (!responseText.trim()) {
        console.error("[Login] Empty response from API");
        return NextResponse.json(
          { success: false, error: "Empty response from authentication server." },
          { status: 500 },
        );
      }
      
      result = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("[Login] Failed to parse API response:", jsonError);
      console.error("[Login] Response status:", response.status);
      console.error("[Login] Response headers:", Object.fromEntries(response.headers.entries()));
      return NextResponse.json(
        { success: false, error: "Invalid response from authentication server." },
        { status: 500 },
      );
    }

    if (!response.ok || !result?.success || !result?.token) {
      console.error("[Login] PHP API returned error:", {
        status: response.status,
        success: result?.success,
        hasToken: !!result?.token,
        error: result?.error,
      });
      return NextResponse.json(
        { success: false, error: result?.error ?? "Failed to login." },
        { status: response.status || 401 },
      );
    }

    // Validate that we have the required user data
    if (!result.user || !result.user.role) {
      console.error("[Login] PHP API response missing user data:", result);
      return NextResponse.json(
        { success: false, error: "Invalid response from authentication server." },
        { status: 500 },
      );
    }

    const expiresIn = typeof result.expires_in === "number" ? result.expires_in : 3600;
    const keepSignedIn = body.keep_me_signed_in === true;

    console.log("[Login] Successful login for user:", {
      email: result.user.email,
      role: result.user.role,
      keepSignedIn,
    });

    const res = NextResponse.json({
      success: true,
      user: result.user,
    });

    try {
      setAuthCookies(res, {
        accessToken: result.token,
        refreshToken: result.token,
        user: result.user,
        keepSignedIn,
        accessTokenTTL: expiresIn,
        refreshTokenTTL: keepSignedIn ? 2592000 : 86400,
      });
      console.log("[Login] Auth cookies set successfully");
    } catch (cookieError) {
      console.error("[Login] Failed to set auth cookies:", cookieError);
    }

    return res;
  } catch (error) {
    console.error("[Login] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}

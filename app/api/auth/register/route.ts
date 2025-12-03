import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { setAuthCookies } from "@/lib/auth-cookies";
import { isMockModeEnabled, mockAuthService } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body?.username || !body?.email || !body?.password) {
      return NextResponse.json({ success: false, error: "Missing registration fields." }, { status: 400 });
    }

    // Check if mock mode is enabled
    if (isMockModeEnabled()) {
      console.log("[Register] Using mock authentication");
      const mockResult = await mockAuthService.register({
        username: body.username,
        email: body.email,
        password: body.password,
        referral_code: body.referral_code,
      });

      if (!mockResult.success || !mockResult.user || !mockResult.token) {
        return NextResponse.json(
          { success: false, error: mockResult.error ?? "Registration failed." },
          { status: 400 },
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

      console.log("[Register] Mock registration successful for user:", {
        email: user.email,
        role: user.role,
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
        console.log("[Register] Auth cookies set successfully");
      } catch (cookieError) {
        console.error("[Register] Failed to set auth cookies:", cookieError);
      }

      return res;
    }

    if (!env.API_BASE_URL) {
      console.error("[Register] API_BASE_URL is not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error. Please contact support." },
        { status: 500 },
      );
    }

    let registerResponse: Response;
    try {
      registerResponse = await fetch(`${env.API_BASE_URL}/api/auth/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: body.username,
          email: body.email,
          password: body.password,
          referral_code: body.referral_code,
        }),
      });
    } catch (fetchError) {
      console.error("[Register] Failed to connect to API:", fetchError);
      // Fall back to mock mode if API connection fails
      console.warn("[Register] Falling back to mock authentication");
      const mockResult = await mockAuthService.register({
        username: body.username,
        email: body.email,
        password: body.password,
        referral_code: body.referral_code,
      });

      if (!mockResult.success || !mockResult.user || !mockResult.token) {
        return NextResponse.json(
          { success: false, error: mockResult.error ?? "Registration failed." },
          { status: 400 },
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
        console.error("[Register] Failed to set auth cookies:", cookieError);
      }

      return res;
    }

    let registerResult: any;
    try {
      registerResult = await registerResponse.json();
    } catch (jsonError) {
      console.error("[Register] Failed to parse API response:", jsonError);
      return NextResponse.json(
        { success: false, error: "Invalid response from authentication server." },
        { status: 500 },
      );
    }

    if (!registerResponse.ok || !registerResult?.success) {
      return NextResponse.json(
        { success: false, error: registerResult?.error ?? "Failed to register." },
        { status: registerResponse.status || 500 },
      );
    }

    // Auto-login after successful registration
    // Pass keep_me_signed_in if provided (though typically false for new registrations)
    const keepSignedIn = body.keep_me_signed_in === true;
    let loginResponse: Response;
    try {
      loginResponse = await fetch(`${env.API_BASE_URL}/api/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
          keep_me_signed_in: keepSignedIn,
        }),
      });
    } catch (fetchError) {
      console.error("[Register] Failed to connect to API for auto-login:", fetchError);
      return NextResponse.json(
        {
          success: false,
          error: "Registration succeeded but unable to log you in. Please try logging in manually.",
        },
        { status: 503 },
      );
    }

    let loginResult: any;
    try {
      loginResult = await loginResponse.json();
    } catch (jsonError) {
      console.error("[Register] Failed to parse login response:", jsonError);
      return NextResponse.json(
        {
          success: false,
          error: "Registration succeeded but unable to log you in. Please try logging in manually.",
        },
        { status: 500 },
      );
    }

    if (!loginResponse.ok || !loginResult?.success || !loginResult?.token) {
      return NextResponse.json(
        { success: false, error: loginResult?.error ?? "Registration succeeded but login failed." },
        { status: loginResponse.status || 500 },
      );
    }

    const expiresIn = typeof loginResult.expires_in === "number" ? loginResult.expires_in : 3600;

    const res = NextResponse.json({
      success: true,
      user: loginResult.user,
    });

    // Use the new cookie helper to set both access and refresh tokens
    // The refresh token is the same as access token from PHP API (we treat it as access token)
    try {
      setAuthCookies(res, {
        accessToken: loginResult.token,
        refreshToken: loginResult.token, // PHP API returns single token, we use it for both
        user: loginResult.user,
        keepSignedIn,
        accessTokenTTL: expiresIn,
        refreshTokenTTL: keepSignedIn ? 2592000 : 86400, // 30 days if keepSignedIn, else 1 day
      });
    } catch (cookieError) {
      console.error("[Register] Failed to set auth cookies:", cookieError);
      // Still return success but log the error
    }

    return res;
  } catch (error) {
    console.error("[Register] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}

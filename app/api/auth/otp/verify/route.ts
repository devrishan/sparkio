import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizePhone, validateIndianPhone } from '@/lib/phone-utils';
import { verifyAndConsumeOtp, createOrFindUser } from '@/lib/auth/in-memory-store';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { logSecurityEvent } from '@/lib/security-logger';
import { getMaintenanceState } from '@/lib/maintenance';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { prisma } from '@/lib/prisma';

const verifySchema = z.object({
  phone: z.string(),
  otp: z.string().length(6),
  referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Check feature flag
    const otpEnabled = await isFeatureEnabled('OTP_ENABLED');
    if (!otpEnabled && process.env.FEATURE_OTP_ENABLED !== 'true') {
      return NextResponse.json(
        { error: 'OTP authentication is temporarily disabled' },
        { status: 503 }
      );
    }

    // Check maintenance mode
    const maintenanceState = await getMaintenanceState();
    if (maintenanceState.enabled) {
      return NextResponse.json(
        {
          error: maintenanceState.message ?? 'Service temporarily unavailable for maintenance',
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { phone, otp, referralCode } = verifySchema.parse(body);

    // Normalize and validate phone number
    const normalizedPhone = normalizePhone(phone);
    if (!validateIndianPhone(normalizedPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Sanitize referral code if provided
    const sanitizedReferralCode = referralCode?.trim().toUpperCase().slice(0, 20);

    // Verify OTP with brute-force protection
    const verifyResult = verifyAndConsumeOtp(normalizedPhone, otp);

    if (verifyResult.locked) {
      logSecurityEvent('otp_lockout', {
        identifier: normalizedPhone,
        metadata: {
          lockoutExpiresAt: verifyResult.lockoutExpiresAt?.toISOString(),
        },
      });

      const lockoutMinutes = verifyResult.lockoutExpiresAt
        ? Math.ceil((verifyResult.lockoutExpiresAt.getTime() - Date.now()) / 60000)
        : 15;

      return NextResponse.json(
        {
          error: `Account locked due to too many failed attempts. Please try again after ${lockoutMinutes} minutes.`,
          locked: true,
          lockoutExpiresAt: verifyResult.lockoutExpiresAt?.toISOString(),
        },
        { status: 429 }
      );
    }

    if (!verifyResult.success) {
      logSecurityEvent('invalid_otp', {
        identifier: normalizedPhone,
        metadata: {
          attemptsRemaining: verifyResult.attemptsRemaining,
        },
      });

      // Don't reveal if account is locked or OTP doesn't exist
      return NextResponse.json(
        {
          error: 'Invalid or expired OTP',
          attemptsRemaining: verifyResult.attemptsRemaining,
        },
        { status: 400 }
      );
    }

    // OTP verified successfully - create or find user
    const { user: inMemoryUser, isNew } = createOrFindUser(normalizedPhone, sanitizedReferralCode);

    // Try to get or create user in Prisma
    let dbUser = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: inMemoryUser.id },
        select: {
          id: true,
          phone: true,
          username: true,
          email: true,
          referralCode: true,
          upiId: true,
          role: true,
        },
      });

      // If user doesn't exist in Prisma but is new, create it
      if (!dbUser && isNew) {
        try {
          dbUser = await prisma.user.create({
            data: {
              id: inMemoryUser.id,
              phone: inMemoryUser.phone,
              referralCode: inMemoryUser.referralCode,
              role: inMemoryUser.role,
            },
            select: {
              id: true,
              phone: true,
              username: true,
              email: true,
              referralCode: true,
              upiId: true,
              role: true,
            },
          });
        } catch (createError) {
          // If Prisma create fails, continue with in-memory user
          if (process.env.NODE_ENV === "development") {
            console.warn("[OTP Verify] Failed to create user in Prisma:", createError);
          }
        }
      }
    } catch (prismaError) {
      // If Prisma fails, continue with in-memory user
      if (process.env.NODE_ENV === "development") {
        console.warn("[OTP Verify] Prisma lookup failed, using in-memory user:", prismaError);
      }
    }

    // Use Prisma user if available, otherwise use in-memory user
    const user = dbUser || inMemoryUser;

    // Generate tokens
    const accessToken = signAccessToken({
      sub: user.id,
      role: dbUser?.role || inMemoryUser.role,
    });

    // For refresh token, we'll use a simple session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const refreshToken = signRefreshToken({
      sub: user.id,
      sid: sessionId,
    });

    // Build user response with all available fields
    const userResponse = dbUser
      ? {
          id: dbUser.id,
          phone: dbUser.phone,
          username: dbUser.username || null,
          email: dbUser.email || null,
          referral_code: dbUser.referralCode || null,
          upi_id: dbUser.upiId || null,
          role: dbUser.role === 'ADMIN' ? 'admin' : 'member',
        }
      : {
          id: inMemoryUser.id,
          phone: inMemoryUser.phone,
          username: null,
          email: null,
          referral_code: inMemoryUser.referralCode || null,
          upi_id: null,
          role: inMemoryUser.role === 'ADMIN' ? 'admin' : 'member',
        };

    // Set cookies with security hardening
    const response = NextResponse.json({
      success: true,
      user: userResponse,
    });

    const isProduction = process.env.NODE_ENV === 'production';
    const accessTtlSeconds = Number(process.env.JWT_ACCESS_TOKEN_TTL_SECONDS ?? 900); // 15 minutes
    const refreshTtlSeconds = Number(
      process.env.JWT_REFRESH_TOKEN_TTL_SECONDS ?? 60 * 60 * 24 * 30
    ); // 30 days

    // Set access token cookie (httpOnly, secure)
    response.cookies.set('earniq_access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: accessTtlSeconds,
      path: '/',
    });

    // Set refresh token cookie (httpOnly, secure)
    response.cookies.set('earniq_refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: refreshTtlSeconds,
      path: '/',
    });

    // Note: Removed earniq_user cookie - user data should be fetched via /api/auth/session endpoint

    return response;
  } catch (error: unknown) {
    console.error('OTP verify error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.flatten() },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}

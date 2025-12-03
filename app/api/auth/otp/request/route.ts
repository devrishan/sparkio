import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizePhone, validateIndianPhone } from '@/lib/phone-utils';
import { storeOtp, cleanupExpiredOtps } from '@/lib/auth/in-memory-store';
import { getClientIp } from '@/lib/rate-limit';
import { checkRateLimit } from '@/lib/rate-limit';
import { checkRateLimitMemory } from '@/lib/rate-limit-memory';
import { logSecurityEvent } from '@/lib/security-logger';
import { getMaintenanceState } from '@/lib/maintenance';
import { isFeatureEnabled } from '@/lib/feature-flags';

const requestSchema = z.object({
  phone: z.string().min(10).max(15),
});

function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
    const { phone } = requestSchema.parse(body);

    // Normalize phone number
    const normalizedPhone = normalizePhone(phone);

    // Validate phone format
    if (!validateIndianPhone(normalizedPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const ipAddress = getClientIp(req);

    // Rate limiting: per phone (5 requests/hour)
    const phoneRateLimit = await checkRateLimit({
      identifier: normalizedPhone,
      type: 'otp_request',
      limit: 5,
      windowSeconds: 3600,
    }).catch(() => {
      // Fallback to memory-based rate limiting if Redis unavailable
      return checkRateLimitMemory({
        identifier: normalizedPhone,
        type: 'otp_request',
        limit: 5,
        windowSeconds: 3600,
      });
    });

    if (!phoneRateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        identifier: normalizedPhone,
        metadata: { type: 'phone', limit: 5, windowSeconds: 3600 },
      });

      return NextResponse.json(
        {
          error: 'Too many OTP requests. Please try again later.',
          retryAfter: Math.ceil((phoneRateLimit.resetAt.getTime() - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // Rate limiting: per IP (10 requests/hour)
    const ipRateLimit = await checkRateLimit({
      identifier: ipAddress,
      type: 'otp_request_ip',
      limit: 10,
      windowSeconds: 3600,
    }).catch(() => {
      return checkRateLimitMemory({
        identifier: ipAddress,
        type: 'otp_request_ip',
        limit: 10,
        windowSeconds: 3600,
      });
    });

    if (!ipRateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        identifier: ipAddress,
        metadata: { type: 'ip', limit: 10, windowSeconds: 3600 },
      });

      return NextResponse.json(
        {
          error: 'Too many requests from this IP address.',
          retryAfter: Math.ceil((ipRateLimit.resetAt.getTime() - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // Cleanup expired OTPs
    cleanupExpiredOtps();

    // Generate OTP
    const code = generateOtpCode();
    const ttl = 300; // 5 minutes

    // Store OTP in memory
    storeOtp(normalizedPhone, code, ttl);

    // Get OTP provider from env
    const provider = process.env.OTP_PROVIDER || 'dev';

    // Send OTP based on provider
    if (provider === 'dev' || process.env.NODE_ENV !== 'production') {
      // In dev mode, log OTP to console
      console.log(`[OTP][DEV] OTP for ${normalizedPhone}: ${code}`);
      console.log(`[OTP][DEV] Valid for ${ttl} seconds`);
    } else if (provider === 'msg91') {
      const { sendOtp } = await import('@/lib/otp-provider');
      await sendOtp({ phone: normalizedPhone });
    } else if (provider === 'twilio') {
      const { sendOtp } = await import('@/lib/otp-provider');
      await sendOtp({ phone: normalizedPhone });
    } else {
      // Fallback to dev mode
      console.log(`[OTP][DEV] OTP for ${normalizedPhone}: ${code}`);
    }

    return NextResponse.json({
      ok: true,
      ttl,
      message: provider === 'dev' || process.env.NODE_ENV !== 'production'
        ? 'OTP sent (check server logs)'
        : 'OTP sent successfully',
    });
  } catch (error: unknown) {
    console.error('OTP request error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.flatten() },
        { status: 400 },
      );
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
    const statusCode = errorMessage.includes('Rate limit') ? 429 : 500;
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

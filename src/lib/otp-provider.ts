import { z } from 'zod';
import { getRedis } from './redis';
import { prisma } from './prisma';
import crypto from 'crypto';

const phoneSchema = z
  .string()
  .min(10)
  .max(15)
  .regex(/^[0-9]+$/, 'Invalid phone number');

export type OtpChannel = 'sms';

export interface SendOtpOptions {
  phone: string;
  channel?: OtpChannel;
}

export interface VerifyOtpOptions {
  phone: string;
  code: string;
}

function generateOtpCode(): string {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export async function sendOtp({ phone, channel = 'sms' }: SendOtpOptions): Promise<void> {
  const parsedPhone = phoneSchema.parse(phone);

  const code = generateOtpCode();
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.otpRequest.create({
    data: {
      phone: parsedPhone,
      codeHash,
      expiresAt,
    },
  });

  const provider = process.env.OTP_PROVIDER;

  // Simple rate limiting & last-code caching via Redis
  const redis = getRedis();
  if (redis) {
    const key = `otp:last:${parsedPhone}`;
    await redis.set(key, code, 'EX', 300);
  }

  if (provider === 'twilio') {
    // TODO: integrate Twilio client here
    console.log(`[OTP][Twilio] Sending code ${code} to ${parsedPhone} via ${channel}`);
  } else if (provider === 'msg91') {
    // TODO: integrate MSG91 client here
    console.log(`[OTP][MSG91] Sending code ${code} to ${parsedPhone} via ${channel}`);
  } else {
    // Fallback for development only
    console.log(`[OTP][DEV] Code for ${parsedPhone}: ${code}`);
  }
}

export async function verifyOtp({ phone, code }: VerifyOtpOptions): Promise<boolean> {
  const parsedPhone = phoneSchema.parse(phone);
  const codeHash = hashCode(code);

  const request = await prisma.otpRequest.findFirst({
    where: { phone: parsedPhone },
    orderBy: { createdAt: 'desc' },
  });

  if (!request) return false;
  if (request.expiresAt < new Date()) return false;
  if (request.consumedAt || request.verifiedAt) return false;
  if (request.codeHash !== codeHash) return false;

  await prisma.otpRequest.update({
    where: { id: request.id },
    data: {
      verifiedAt: new Date(),
      consumedAt: new Date(),
      attempts: { increment: 1 },
    },
  });

  return true;
}



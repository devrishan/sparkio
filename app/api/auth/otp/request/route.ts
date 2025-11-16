import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendOtp } from '@/src/lib/otp-provider';

const requestSchema = z.object({
  phone: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = requestSchema.parse(body);

    await sendOtp({ phone });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('OTP request error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.flatten() },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}



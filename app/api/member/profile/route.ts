import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProfileSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  upi_id: z.string().min(1).max(255).optional(),
});

export async function GET() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('earniq_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthenticated' },
        { status: 401 },
      );
    }

    let userId: string;
    try {
      const payload = verifyAccessToken(accessToken);
      userId = payload.sub;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 },
      );
    }

    // Get user profile from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        username: true,
        email: true,
        referralCode: true,
        upiId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        username: user.username || null,
        email: user.email || null,
        referral_code: user.referralCode || null,
        upi_id: user.upiId || null,
        role: user.role === 'ADMIN' ? 'admin' : 'member',
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('earniq_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthenticated' },
        { status: 401 },
      );
    }

    let userId: string;
    try {
      const payload = verifyAccessToken(accessToken);
      userId = payload.sub;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { username, email, upi_id } = validation.data;

    // Build update object with only provided fields
    const updateData: {
      username?: string;
      email?: string;
      upiId?: string;
    } = {};

    if (username !== undefined) {
      updateData.username = username;
    }
    if (email !== undefined) {
      updateData.email = email;
    }
    if (upi_id !== undefined) {
      updateData.upiId = upi_id;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 },
      );
    }

    // Check for duplicate username if provided
    if (username && username !== existingUser.username) {
      const usernameExists = await prisma.user.findFirst({
        where: {
          username,
          id: { not: userId },
        },
      });

      if (usernameExists) {
        return NextResponse.json(
          { success: false, error: 'Username already taken' },
          { status: 409 },
        );
      }
    }

    // Check for duplicate email if provided
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      });

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 409 },
        );
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        phone: true,
        username: true,
        email: true,
        referralCode: true,
        upiId: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        username: updatedUser.username || null,
        email: updatedUser.email || null,
        referral_code: updatedUser.referralCode || null,
        upi_id: updatedUser.upiId || null,
        role: updatedUser.role === 'ADMIN' ? 'admin' : 'member',
        created_at: updatedUser.createdAt.toISOString(),
        updated_at: updatedUser.updatedAt.toISOString(),
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 },
    );
  }
}


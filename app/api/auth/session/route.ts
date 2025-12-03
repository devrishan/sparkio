import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { findUserById } from "@/lib/auth/in-memory-store";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("earniq_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ success: false, user: null });
    }

    try {
      // Verify JWT token
      const payload = verifyAccessToken(accessToken);
      const userId = payload.sub;

      // Try to get user from Prisma first
      let user = null;
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
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

        if (dbUser) {
          user = {
            id: dbUser.id,
            phone: dbUser.phone,
            username: dbUser.username || null,
            email: dbUser.email || null,
            referral_code: dbUser.referralCode || null,
            upi_id: dbUser.upiId || null,
            role: dbUser.role === "ADMIN" ? "admin" : "member",
          };
        }
      } catch (prismaError) {
        // If Prisma fails, fall back to in-memory store
        if (process.env.NODE_ENV === "development") {
          console.warn("[Session] Prisma lookup failed, using in-memory store:", prismaError);
        }
      }

      // Fall back to in-memory store if Prisma didn't return a user
      if (!user) {
        const inMemoryUser = findUserById(userId);
        if (inMemoryUser) {
          user = {
            id: inMemoryUser.id,
            phone: inMemoryUser.phone,
            username: null,
            email: null,
            referral_code: inMemoryUser.referralCode || null,
            upi_id: null,
            role: inMemoryUser.role === "ADMIN" ? "admin" : "member",
          };
        }
      }

      if (!user) {
        // User not found - invalid session
        return NextResponse.json({ success: false, user: null });
      }

      // Return full user data
      return NextResponse.json({
        success: true,
        user,
      });
    } catch (error) {
      // Token verification failed
      if (process.env.NODE_ENV === "development") {
        console.warn("[Session] Token verification failed:", error);
      }
      return NextResponse.json({ success: false, user: null });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Session route unexpected error:", error);
    }
    return NextResponse.json({ success: false, user: null });
  }
}

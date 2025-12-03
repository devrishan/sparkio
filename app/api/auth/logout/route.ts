import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    const response = NextResponse.json({ success: true });

    const isProduction = process.env.NODE_ENV === "production";

    // Clear all auth cookies
    response.cookies.set("earniq_access_token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    response.cookies.set("earniq_refresh_token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    response.cookies.set("earniq_user", "", {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    // Clear legacy cookies for backward compatibility
    response.cookies.set("sparkio_token", "", {
      maxAge: 0,
      path: "/",
    });
    response.cookies.set("sparkio_user", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error", error);
    return NextResponse.json(
      { success: false, error: "Failed to logout" },
      { status: 500 }
    );
  }
}

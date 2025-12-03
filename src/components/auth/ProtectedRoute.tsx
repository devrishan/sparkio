"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/components/providers/session-provider";
import { useAuth } from "@/context/AuthProvider";
import { isAuthenticated, getMockToken } from "@/lib/auth";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: "admin" | "member";
}

/**
 * ProtectedRoute - Client component that redirects unauthenticated users to login
 * Checks both SessionProvider and mock auth
 */
export function ProtectedRoute({ children, fallback, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user } = useSession();
  const { isAuthenticated: isOtpAuthenticated, isLoading: isOtpLoading, user: otpUser } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // First check OTP auth (cookie-based)
      if (!isOtpLoading) {
        if (isOtpAuthenticated && otpUser) {
          // Check role if required
          const userRole = otpUser.role === "admin" ? "admin" : "member";
          if (requiredRole && userRole !== requiredRole) {
            router.push("/unauthorized");
            setIsChecking(false);
            return;
          }
          setIsAuth(true);
          setIsChecking(false);
          return;
        }
      }

      // Fallback to SessionProvider (for backward compatibility)
      if (status === "authenticated" && user) {
        // Check role if required
        if (requiredRole && user.role !== requiredRole) {
          router.push("/unauthorized");
          setIsChecking(false);
          return;
        }
        setIsAuth(true);
        setIsChecking(false);
        return;
      }

      // If both are still loading, wait
      if (status === "loading" || isOtpLoading) {
        // Check mock token directly as fallback
        const mockToken = getMockToken();
        if (mockToken && isAuthenticated()) {
          setIsAuth(true);
          setIsChecking(false);
          return;
        }
        // Still loading, keep checking
        return;
      }

      // Not authenticated - redirect to login with next param
      if (status === "unauthenticated" && !isOtpAuthenticated) {
        const mockToken = getMockToken();
        if (!mockToken || !isAuthenticated()) {
          const currentPath = pathname || "/member/dashboard";
          router.push(`/login?next=${encodeURIComponent(currentPath)}`);
          setIsChecking(false);
          return;
        } else {
          // Has mock token but providers don't know about it yet
          // Wait a bit for providers to catch up
          setTimeout(() => {
            setIsChecking(false);
          }, 500);
          return;
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [status, user, router, pathname, isOtpAuthenticated, isOtpLoading, otpUser, requiredRole]);

  // Show loading skeleton while checking
  if (isChecking) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSkeleton className="h-64 w-full max-w-4xl" />
      </div>
    );
  }

  // If not authenticated, don't render (will redirect)
  if (!isAuth && status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}


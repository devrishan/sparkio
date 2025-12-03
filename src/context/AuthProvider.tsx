"use client";

import * as React from "react";
import { getSession, logout as authLogout } from "@/lib/auth-otp";
import type { OtpAuthUser } from "@/lib/auth-otp";

interface AuthContextValue {
  user: OtpAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<OtpAuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Initialize session on mount
  const initializeSession = React.useCallback(async () => {
    try {
      const sessionUser = await getSession();
      setUser(sessionUser);
    } catch (error) {
      console.error("[AuthProvider] Failed to initialize session:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize on mount
  React.useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Logout function
  const handleLogout = React.useCallback(async () => {
    await authLogout();
    setUser(null);
    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  // Refetch session
  const refetch = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const sessionUser = await getSession();
      setUser(sessionUser);
    } catch (error) {
      console.error("[AuthProvider] Failed to refetch session:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextValue = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      logout: handleLogout,
      refetch,
    }),
    [user, isLoading, handleLogout, refetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}


"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { getMockToken, getSession, logout as authLogout, autoLogin as authAutoLogin } from "@/lib/auth";

type UserSession = {
  id: number | string;
  username: string;
  name?: string;
  email: string;
  role: "member" | "admin";
  referral_code?: string;
};

type SessionContextValue = {
  user: UserSession | null;
  status: "loading" | "authenticated" | "unauthenticated";
  refetch: () => void;
  signOut: () => void;
  initialize: () => Promise<void>;
};

const SessionContext = React.createContext<SessionContextValue | undefined>(undefined);

async function fetchSession(): Promise<UserSession | null> {
  // First try mock session (/api/mocks/session)
  const mockToken = getMockToken();
  if (mockToken) {
    try {
      const response = await fetch("/api/mocks/session", {
        cache: "no-store",
        credentials: "include",
        headers: {
          "x-mock-token": mockToken,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Convert mock user format to UserSession format
        const role = data.user.email?.includes("admin") || data.user.email?.startsWith("admin") 
          ? "admin" 
          : "member";
        
        return {
          id: data.user.id || 1,
          username: data.user.name || data.user.email?.split("@")[0] || "user",
          name: data.user.name,
          email: data.user.email,
          role,
          referral_code: data.user.referral_code || "DEMO001",
        };
      }
    } catch (error) {
      console.warn("[SessionProvider] Mock session fetch failed, trying fallback:", error);
    }
  }

  // Fallback to original /api/auth/session
  try {
    const response = await fetch("/api/auth/session", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user ?? null;
  } catch (error) {
    console.warn("[SessionProvider] Auth session fetch failed:", error);
    return null;
  }
}

async function logoutRequest() {
  // Try to call logout endpoint, but don't fail if it doesn't exist
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (error) {
    // Ignore errors
  }
  // Always clear mock auth
  authLogout("/login");
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = React.useState(false);

  const { data, status, refetch } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: isInitialized, // Only fetch after initialization
  });

  const mutation = useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: ["session"] });
    },
  });

  // Initialize function - calls auto-login on mount
  const initialize = React.useCallback(async () => {
    if (isInitialized) return;
    
    try {
      // Try auto-login with mock token
      const session = await authAutoLogin();
      if (session) {
        // Session restored, refetch to update React Query cache
        await refetch();
      }
    } catch (error) {
      console.warn("[SessionProvider] Auto-login failed:", error);
    } finally {
      setIsInitialized(true);
    }
  }, [isInitialized, refetch]);

  // Run initialization on mount
  React.useEffect(() => {
    initialize();
  }, [initialize]);

  const value: SessionContextValue = React.useMemo(() => {
    const signOut = () => {
      mutation.mutate(undefined, {
        onSuccess: () => {
          queryClient.removeQueries({ queryKey: ["session"] });
          // authLogout already handles redirect
        },
      });
    };

    return {
      user: data ?? null,
      status: !isInitialized || status === "pending" ? "loading" : data ? "authenticated" : "unauthenticated",
      refetch,
      signOut,
      initialize,
    };
  }, [data, status, refetch, mutation, queryClient, initialize, isInitialized]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}


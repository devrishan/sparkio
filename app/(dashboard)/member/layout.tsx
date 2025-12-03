"use client";

import { AppShell } from "@/components/layout/app-shell";
import { memberNavigation } from "@/config/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FloatingSupportButton } from "@/components/support/FloatingSupportButton";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell sidebarItems={memberNavigation} fallbackRole="member">
        {children}
      </AppShell>
      <FloatingSupportButton />
    </ProtectedRoute>
  );
}


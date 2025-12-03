"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Share2,
  Wallet,
  Megaphone,
  ShieldCheck,
  Shield,
  Wrench,
} from "lucide-react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { adminNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

const iconMap = {
  dashboard: LayoutDashboard,
  submissions: ClipboardList,
  referrals: Share2,
  withdraw: Wallet,
  ads: Megaphone,
  admins: ShieldCheck,
  members: Users,
  security: Shield,
  maintenance: Wrench,
} as const;

interface AdminLayoutProps {
  children: ReactNode;
}

function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <nav className="mt-10 space-y-1">
      {adminNavigation.map((item) => {
        const Icon = iconMap[item.icon];
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors",
              "hover:text-white hover:bg-white/5",
              isActive &&
                "bg-orange-500/10 text-white shadow-inner shadow-orange-500/20"
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-muted-foreground transition",
                isActive && "bg-orange-500/20 text-orange-200"
              )}
              aria-hidden="true"
            >
              <Icon className="h-4 w-4" />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-white/5 bg-[#090B11]/80 px-4 py-3 text-xs text-muted-foreground backdrop-blur lg:hidden">
      {adminNavigation.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full border px-3 py-1 transition",
              isActive
                ? "border-orange-500/70 bg-orange-500/10 text-white"
                : "border-white/10"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-[#040507] text-white">
        <aside className="hidden w-[280px] flex-col border-r border-white/5 bg-gradient-to-b from-[#0B0E13] to-[#05060A] px-6 py-8 lg:flex">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-lg font-semibold tracking-tight"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-lg font-bold text-black">
              E
            </span>
            <div className="leading-tight">
              Earniq Admin
              <p className="text-xs font-normal text-muted-foreground">
                Ops control center
              </p>
            </div>
          </Link>

          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
            <p className="text-sm font-semibold text-white">Sandbox demo</p>
            Frontend-only mock data.
          </div>

          <SidebarNav pathname={pathname} />

          <div className="mt-auto space-y-3 text-xs text-muted-foreground">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Shift handoff</p>
              Monitor withdrawals, fraud, and member escalations in one panel.
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80">
              © {new Date().getFullYear()} Earniq
            </p>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <MobileNav pathname={pathname} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-6xl space-y-8">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}


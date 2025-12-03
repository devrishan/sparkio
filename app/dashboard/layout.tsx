"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/member/dashboard" },
  { label: "Tasks", href: "/member/tasks" },
  { label: "Referrals", href: "/member/referrals" },
  { label: "Withdrawals", href: "/member/withdraw" },
  { label: "Creator", href: "/member/my-products" },
  { label: "Furniture", href: "/member/products?category=furniture" },
  { label: "Insights", href: "/member/leaderboard" },
  { label: "Support", href: "/member/support" },
  { label: "Profile", href: "/member/settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#040507] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
        <header className="rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 via-transparent to-transparent px-6 py-6 shadow-lg shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Earniq member console</p>
              <h1 className="text-3xl font-semibold">Your earning workspace</h1>
            </div>
            <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-xs text-muted-foreground">
              Mock data · Sandbox
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Earnings shown here are demo-only; no real payouts yet. Use this space to practise referrals, tasks, and
            withdrawals safely.
          </p>
          <nav className="mt-5 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== "/member/dashboard" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-full border px-4 py-1.5 text-sm transition",
                    "bg-[#0B0F18]/70 border-white/10 text-white/70 hover:text-white hover:border-white/30",
                    isActive && "border-orange-500/60 bg-orange-500/15 text-white shadow-inner",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mt-8">{children}</main>

        <footer className="mt-12 rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-xs text-muted-foreground">
          Never share OTP, UPI PIN, or passwords. Earniq will never ask for them.
        </footer>
      </div>
    </div>
  );
}


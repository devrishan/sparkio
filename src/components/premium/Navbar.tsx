"use client";

import React from "react";

import { ThemeToggle } from "@/components/ThemeToggle";

export default function PremiumNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/50 backdrop-blur-md dark:border-slate-700/30 dark:bg-slate-900/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <a href="/" className="text-2xl font-extrabold tracking-tight">
            Earnkio
          </a>
          <nav className="hidden gap-4 text-sm text-slate-700 dark:text-slate-300 lg:flex">
            <a href="/member/dashboard">Dashboard</a>
            <a href="/member/tasks">Tasks</a>
            <a href="/member/referrals">Referrals</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="/member/login"
            className="rounded-full border bg-white/30 px-4 py-2 text-sm text-slate-800 dark:bg-transparent dark:text-slate-100"
          >
            Sign in
          </a>
          <a
            href="/member/signup"
            className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow cta-glow"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}



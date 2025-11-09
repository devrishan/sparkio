"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-12 px-6 py-24 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
          <Sparkles className="h-4 w-4" />
          Welcome to Sparkio
        </span>
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
          Grow faster with a referral platform that glows
        </h1>
        <p className="max-w-2xl text-balance text-muted-foreground md:text-lg">
          Sparkio helps your members share, track, and earn commissions with gamified dashboards and instant wallet
          insights built for growth teams.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/login">Member Login</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/register">Create an Account</Link>
        </Button>
      </div>
    </main>
  );
}


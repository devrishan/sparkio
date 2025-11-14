"use client";

import Link from "next/link";
import { Sparkles, TrendingUp, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <div className="flex flex-col items-center gap-6 max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-sm font-medium text-primary border border-primary/20">
            <Sparkles className="h-4 w-4" />
            Transparent. Smart. Rewarding.
          </span>
          <h1 className="text-balance text-5xl font-bold tracking-tight md:text-7xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Earn Real Rewards for Simple Online Tasks
          </h1>
          <p className="max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            Join India's most transparent earning platform. Complete tasks, refer friends, and withdraw your earnings instantly via UPI.
          </p>
          <Button asChild size="lg" className="mt-4 h-12 px-8 text-base">
            <Link href="/register">Start Earning Now</Link>
          </Button>
        </div>
      </section>

      {/* Trust Counters Section */}
      <section className="border-t bg-muted/30 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-primary/20">
              <CardContent className="flex flex-col items-center gap-2 p-6">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div className="text-3xl font-bold">₹50,000+</div>
                <p className="text-sm text-muted-foreground">Total Paid Out</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="flex flex-col items-center gap-2 p-6">
                <Users className="h-8 w-8 text-primary" />
                <div className="text-3xl font-bold">2,500+</div>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="flex flex-col items-center gap-2 p-6">
                <Shield className="h-8 w-8 text-primary" />
                <div className="text-3xl font-bold">100%</div>
                <p className="text-sm text-muted-foreground">Secure Payments</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to start earning
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold">Find a Task</h3>
                <p className="text-muted-foreground">
                  Browse available tasks like social media engagement, surveys, and more. Each task shows the reward amount upfront.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold">Complete & Submit Proof</h3>
                <p className="text-muted-foreground">
                  Complete the task and upload proof (screenshot). Our team verifies submissions within 24 hours.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold">Get Rewarded</h3>
                <p className="text-muted-foreground">
                  Once approved, earnings are added to your wallet. Withdraw anytime via UPI with no minimum threshold.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t px-6 py-20 bg-muted/30">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Start Earning?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of Indians already earning on Earniq
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/register">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8">
              <Link href="/login">Member Login</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}


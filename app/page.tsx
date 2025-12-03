"use client";

import dynamic from "next/dynamic";

import { ScrollProgress } from "@/components/marketing/ScrollProgress";
import { ScrollToTop } from "@/components/marketing/ScrollToTop";
import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { EarningStreams } from "@/components/marketing/EarningStreams";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { WhyDifferent } from "@/components/marketing/WhyDifferent";
import { Testimonials } from "@/components/marketing/Testimonials";
import { SupportCTA } from "@/components/marketing/SupportCTA";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { LazySection } from "@/components/marketing/LazySection";
import { ErrorBoundary } from "@/components/marketing/ErrorBoundary";

const DynamicLiveStats = dynamic(
  () => import("@/components/marketing/LiveStats").then((m) => m.LiveStats),
  {
    ssr: false,
    loading: () => (
      <div
        className="px-6 py-20 lg:px-12"
        aria-label="Loading live statistics"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto max-w-6xl animate-pulse space-y-4 rounded-2xl border border-white/10 bg-background/40 p-10">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="h-20 rounded-xl bg-muted" />
            <div className="h-20 rounded-xl bg-muted" />
            <div className="h-20 rounded-xl bg-muted" />
            <div className="h-20 rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#020617,_#020617_50%,_#020617_85%)] text-foreground">
      {/* Floating soft shapes / Apple-style blobs */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 left-[-10%] h-80 w-80 rounded-full bg-gradient-to-br from-primary/25 via-sky-500/20 to-transparent blur-3xl opacity-70 motion-safe:animate-pulse" />
        <div className="absolute -top-20 right-[-10%] h-72 w-72 rounded-full bg-gradient-to-br from-emerald-400/20 via-primary/25 to-transparent blur-3xl opacity-60 motion-safe:animate-pulse" />
        <div className="absolute bottom-[-10%] left-[10%] h-72 w-72 rounded-full bg-gradient-to-br from-purple-500/20 via-primary/15 to-transparent blur-3xl opacity-60 motion-safe:animate-pulse" />
        <div className="absolute bottom-[-20%] right-[5%] h-96 w-96 rounded-full bg-gradient-to-br from-amber-400/20 via-rose-400/20 to-transparent blur-3xl opacity-50 motion-safe:animate-pulse" />
      </div>

      {/* Scroll progress bar */}
      <ScrollProgress />

      {/* Sticky, blurred navbar */}
      <Navbar />

      {/* Animated hero with deep glass snapshot card */}
      <Hero />

      {/* Luxury sections with scroll reveal + glass cards */}
      <ErrorBoundary>
        <LazySection>
          <DynamicLiveStats />
        </LazySection>
      </ErrorBoundary>

      <ErrorBoundary>
        <LazySection>
          <EarningStreams />
        </LazySection>
      </ErrorBoundary>

      <ErrorBoundary>
        <LazySection>
          <HowItWorks />
        </LazySection>
      </ErrorBoundary>

      <ErrorBoundary>
        <LazySection>
          <WhyDifferent />
        </LazySection>
      </ErrorBoundary>

      <ErrorBoundary>
        <LazySection>
          <Testimonials />
        </LazySection>
      </ErrorBoundary>

      <ErrorBoundary>
        <LazySection>
          <SupportCTA />
        </LazySection>
      </ErrorBoundary>

      {/* Polished footer with glass treatment */}
      <SiteFooter />

      {/* Scroll-to-top FAB with motion-safe animation */}
      <ScrollToTop />
    </main>
  );
}



"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { fadeInUp, viewport } from "@/components/marketing/animations";

interface ActivityEvent {
  type: "approved" | "payout";
  amount: number;
  task: string;
  location: string;
}

const activityEvents: ActivityEvent[] = [
  { type: "approved", amount: 160, task: "Navi UPI referral", location: "Kochi" },
  { type: "payout", amount: 500, task: "UPI tasks", location: "Bengaluru" },
  { type: "approved", amount: 250, task: "WhatsApp status", location: "Mumbai" },
  { type: "payout", amount: 1200, task: "App referral", location: "Delhi" },
  { type: "approved", amount: 750, task: "UPI purchase", location: "Hyderabad" },
  { type: "payout", amount: 1800, task: "App referral", location: "Pune" },
  { type: "approved", amount: 320, task: "UPI task", location: "Chennai" },
  { type: "payout", amount: 950, task: "Social task", location: "Kolkata" },
  { type: "approved", amount: 420, task: "App referral", location: "Ahmedabad" },
  { type: "payout", amount: 1500, task: "UPI purchase", location: "Jaipur" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ActivityEventRow({ event, index }: { event: ActivityEvent; index: number }) {
  return (
    <div className="flex items-start gap-3 py-3 px-4 rounded-lg hover:bg-white/5 transition-colors duration-200 border-b border-white/5 last:border-b-0">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-xs font-semibold text-primary">{index + 1}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-primary">{formatCurrency(event.amount)}</span>
          <span className="text-xs text-muted-foreground">{event.type === "approved" ? "approved" : "payout processed"}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {event.task} · {event.location}
        </p>
      </div>
    </div>
  );
}

export function SparkWall() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Duplicate content for seamless loop
    const clonedContent = content.cloneNode(true) as HTMLElement;
    container.appendChild(clonedContent);

    let scrollPosition = 0;
    const scrollSpeed = 1;

    const animate = () => {
      scrollPosition += scrollSpeed;
      container.scrollTop = scrollPosition;

      if (scrollPosition >= content.scrollHeight) {
        scrollPosition = 0;
        container.scrollTop = 0;
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleMouseEnter = () => {
      const currentScroll = scrollPosition;
      container.style.scrollBehavior = "auto";
      container.scrollTop = currentScroll;
    };

    const handleMouseLeave = () => {
      container.style.scrollBehavior = "";
      scrollPosition = container.scrollTop;
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.section
      className="px-6 py-12 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeInUp}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">See earnings move in real time</h3>
            <p className="text-base text-muted-foreground">
              Anonymous live activity from across the Earniq community.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Recent withdrawals
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Task approvals
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Referral milestones
              </li>
            </ul>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-background/40 backdrop-blur-xl p-6 shadow-lg shadow-black/5 overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Live Activity
              </h4>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="h-[300px] overflow-hidden relative"
              style={{
                maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              }}
            >
              <div ref={contentRef}>
                {activityEvents.map((event, index) => (
                  <ActivityEventRow key={`${event.task}-${index}`} event={event} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

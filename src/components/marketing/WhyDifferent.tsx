"use client";

import { CheckCircle, ClipboardList, MessageCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { fadeInUp, stagger, viewport } from "@/components/marketing/animations";
import { Button } from "@/components/ui/button";

const differentiators = [
  {
    title: "No joining fee",
    description: "Start earning with zero upfront charges or hidden fees.",
    icon: CheckCircle,
  },
  {
    title: "Verified tasks only",
    description: "We list trusted apps and brands—no fake or shady offers.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent wallet history",
    description: "See every credit, debit, and withdrawal with downloadable receipts.",
    icon: ClipboardList,
  },
  {
    title: "Support that actually replies",
    description: "In-app help desk and chatbot with real people reviewing behind the scenes.",
    icon: MessageCircle,
  },
];

export function WhyDifferent() {
  return (
    <motion.section
      className="relative isolate overflow-hidden px-6 pb-20 pt-24 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
    >
      {/* Aurora background effect */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/25 to-transparent blur-3xl" />
        <div className="absolute left-[10%] top-20 h-48 w-48 rounded-full bg-primary/15 blur-3xl animate-pulse" />
        <div className="absolute right-[10%] top-40 h-56 w-56 rounded-full bg-secondary/10 blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        <motion.div className="space-y-3 text-center" variants={fadeInUp}>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Why Earniq is different</h2>
          <p className="text-base text-muted-foreground md:text-lg">
            Built for trust, speed, and transparency—because every rupee deserves a clean record.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <motion.div className="grid gap-6 sm:grid-cols-2" variants={stagger}>
            {differentiators.map((item) => (
              <motion.div
                key={item.title}
                className="group relative h-full rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 card-3d gradient-border glass-premium"
                variants={fadeInUp}
                whileHover={{ scale: 1.02, rotateY: 2 }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                  <motion.div 
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                  >
                    <item.icon className="h-5 w-5" />
                  </motion.div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">{item.title}</h3>
                    <p className="text-base leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-6 shadow-lg shadow-primary/10"
            variants={fadeInUp}
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">Compliance-first</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">Dashboard</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every payout is tied to proof, audit logs, and GST-ready invoices.
                </p>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-background/40 backdrop-blur-sm p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dispute resolution</span>
                  <span className="font-semibold text-foreground">97% within 12h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fraud blocked</span>
                  <span className="font-semibold text-foreground">11,420+ fake installs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dashboard uptime</span>
                  <span className="font-semibold text-foreground">99.98%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-8 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
          variants={fadeInUp}
        >
          <p className="text-lg font-semibold text-foreground mb-4">
            Need help with a task, referral, or withdrawal?
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto button-shine">
            <Link href="/support-center">Open support center</Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}



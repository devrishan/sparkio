"use client";

import { BadgeCheck, Share2, WalletMinimal } from "lucide-react";
import { motion } from "framer-motion";

import { fadeInUp, stagger, viewport } from "@/components/marketing/animations";

const steps = [
  {
    title: "Sign up & verify",
    description: "Create your account with OTP login and add your UPI details securely.",
    detail: "Takes less than 2 minutes with PAN + selfie verification.",
    icon: BadgeCheck,
  },
  {
    title: "Complete tasks & refer",
    description: "Finish simple tasks, share apps, post status, and invite friends using your unique referral link.",
    detail: "Every task includes proof requirements, payout amount, and SLA.",
    icon: Share2,
  },
  {
    title: "Withdraw instantly",
    description: "Watch your wallet grow and withdraw to UPI once you hit the minimum balance.",
    detail: "Transfer history + downloadable receipts keep everything compliant.",
    icon: WalletMinimal,
  },
];

export function HowItWorks() {
  return (
    <motion.section
      id="how-it-works"
      className="px-6 py-20 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <motion.div className="space-y-3 text-center" variants={fadeInUp}>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">Steps</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">How it works</h2>
          <p className="text-base text-muted-foreground md:text-lg">
            Become an earner in minutes, track everything in real time, and cash out without friction.
          </p>
        </motion.div>

        <motion.ol className="grid gap-6 md:grid-cols-3" variants={stagger}>
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              className="group relative flex h-full flex-col rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl p-6 shadow-lg shadow-black/5 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 card-3d gradient-border glass-premium"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, rotateY: 2 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary transition-colors group-hover:bg-primary/20 group-hover:scale-110">
                    {index + 1}
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/5 text-primary transition-all group-hover:scale-110 group-hover:border-primary/50 group-hover:bg-primary/10">
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">{step.description}</p>
                <p className="rounded-2xl border border-dashed border-white/10 bg-muted/5 p-3 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:bg-primary/5">
                  {step.detail}
                </p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </motion.section>
  );
}



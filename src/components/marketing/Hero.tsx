"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, Coins, ShieldCheck, Users, CreditCard, Lock, Headphones, Star } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { fadeInUp, stagger, viewport } from "@/components/marketing/animations";
import { AnimatedCounter } from "./AnimatedCounter";

const highlights = [
  { label: "Avg payout time", value: "58", valueUnit: " min", icon: Clock3, isCounter: true },
  { label: "₹12L+ cleared", value: 120000, valueUnit: "+ cleared", icon: Coins, isCounter: true, prefix: "₹", suffix: "+" },
  { label: "38K+ verified", value: 38000, valueUnit: "+ verified", icon: Users, isCounter: true, suffix: "+" },
];

const checklist = [
  "100% KYC compliant",
  "OTP-secured dashboard",
  "Live wallet + task tracker",
];

export function Hero() {
  return (
    <motion.section
      id="hero"
      className="relative isolate overflow-hidden px-6 pb-24 pt-28 sm:pb-32 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Mesh Gradient Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 gradient-mesh" />
      
      {/* Animated Tech Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "mesh-move 20s ease infinite",
          }}
        />
      </div>
      
      {/* Enhanced Gradient Orbs with Multiple Layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[5%] top-40 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
        <div className="absolute right-[10%] top-12 h-56 w-56 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute left-[50%] bottom-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary/15 to-orange-500/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute right-[30%] top-60 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/10 blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Animated Particles */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_minmax(0,1fr)]">
        <motion.div className="space-y-6 text-center lg:text-left" variants={stagger}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-primary/80">
            New payouts weekly
          </span>

          <motion.div className="space-y-5 text-center lg:text-left" variants={fadeInUp}>
            <h1 className="text-balance tracking-tight">
              <motion.span 
                className="block text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl text-gradient"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Make every install, task, and share count
              </motion.span>
              <motion.span 
                className="block text-4xl font-semibold sm:text-5xl lg:text-6xl text-[#ebebeb] mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                toward real cash
              </motion.span>
            </h1>
            <motion.p 
              className="text-balance text-base leading-relaxed text-[#ebebeb] sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Earniq turns app referrals, UPI tasks, and daily actions into transparent earnings with live tracking and instant UPI withdrawals.
            </motion.p>
          </motion.div>

              <motion.div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-center lg:justify-start" variants={fadeInUp}>
                <Button 
                  asChild 
                  size="lg" 
                  className="text-base button-shine transition-all duration-[180ms] ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-blue-500/50 relative overflow-hidden"
                  aria-label="Launch member dashboard to start earning"
                >
                  <Link href="/member/dashboard">
                    Launch dashboard
                    <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="text-base transition-all duration-[180ms] ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
                  aria-label="Create a free Earniq account"
                >
                  <Link href="/register">Create free account</Link>
                </Button>
              </motion.div>

          {/* Social Proof Pill */}
          <motion.div
            className="flex items-center justify-center lg:justify-start"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-foreground">
                Trusted by{" "}
                <span className="font-semibold text-primary">
                  <AnimatedCounter value={10000} duration={2} suffix="+" />
                </span>{" "}
                Earners
              </span>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 text-left text-sm text-muted-foreground lg:justify-start"
            variants={fadeInUp}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 backdrop-blur-sm px-3 py-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>100% KYC compliant</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 backdrop-blur-sm px-3 py-1.5">
              <Lock className="h-4 w-4 text-primary" />
              <span>OTP-secured login</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 backdrop-blur-sm px-3 py-1.5">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Transparent wallet history</span>
            </span>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#b3b3b3] lg:justify-start"
            variants={fadeInUp}
          >
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary/80" />
              UPI payouts
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary/80" />
              KYC-secure
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5 text-primary/80" />
              24/7 support
            </span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="relative" 
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-tr from-primary/30 via-primary/5 to-transparent blur-3xl glow-primary" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl shadow-primary/10 transition-all duration-300 hover:shadow-primary/20 hover:border-primary/30 card-3d gradient-border">
            <div className="space-y-6 px-8 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Wallet snapshot</p>
                  <p className="text-3xl font-semibold text-foreground">₹1,24,800</p>
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  +₹9,200 today
                </span>
              </div>

              {/* Gamification Progress Bar */}
              <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span className="text-sm font-semibold text-foreground">Level 8</span>
                  </div>
                  <span className="text-xs text-muted-foreground">2,450 / 3,000 XP to Level 9</span>
                </div>
                <div className="relative h-3 rounded-full bg-background/60 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary"
                    initial={{ width: 0 }}
                    animate={{ width: "81.67%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
                <p className="text-xs text-muted-foreground text-center">550 XP to level up</p>
              </div>

              <div className="grid gap-4 rounded-2xl border border-white/5 bg-muted/5 backdrop-blur-sm p-4 sm:grid-cols-2">
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={highlight.label}
                    className="space-y-1 rounded-xl border border-white/5 bg-background/60 backdrop-blur-sm p-3 transition-all duration-300 hover:border-primary/20 hover:bg-primary/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                      <highlight.icon className="h-4 w-4 text-primary" />
                      {highlight.label}
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      {highlight.isCounter ? (
                        <>
                          {highlight.prefix || ""}
                          <AnimatedCounter
                            value={typeof highlight.value === "number" ? highlight.value : parseFloat(highlight.value)}
                            duration={2}
                            suffix={highlight.suffix || ""}
                          />
                          {highlight.valueUnit || ""}
                        </>
                      ) : (
                        highlight.value
                      )}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4 rounded-2xl border border-white/5 bg-background/80 backdrop-blur-sm p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Task approvals</span>
                  <span>92% this week</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-[92%] rounded-full bg-primary" />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Referral conversions</span>
                  <span>48 new installs</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full bg-secondary" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}



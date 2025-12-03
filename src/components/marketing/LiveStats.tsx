"use client";

import { Coins, Users, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { fadeInUp, stagger, viewport } from "@/components/marketing/animations";
import { AnimatedCounter } from "./AnimatedCounter";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const stats: Stat[] = [
  { label: "Total Paid Out", value: 425000, icon: Coins, prefix: "₹", suffix: "+", decimals: 0 },
  { label: "Active Earners", value: 10000, icon: Users, suffix: "+", decimals: 0 },
  { label: "Success Rate", value: 98, icon: TrendingUp, suffix: "%", decimals: 0 },
  { label: "Support Available", value: 24, icon: Clock, suffix: "/7", decimals: 0 },
];

export function LiveStats() {
  return (
    <motion.section
      className="px-6 py-20 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="glass-card rounded-2xl p-8 lg:p-12"
          variants={fadeInUp}
        >
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={stagger}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center text-center space-y-3"
                variants={fadeInUp}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-foreground lg:text-4xl">
                    {stat.prefix && <span>{stat.prefix}</span>}
                    <AnimatedCounter
                      value={stat.value}
                      duration={2}
                      suffix=""
                      decimals={stat.decimals || 0}
                    />
                    {stat.suffix && <span>{stat.suffix}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

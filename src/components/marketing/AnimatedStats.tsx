"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Coins, Clock } from "lucide-react";
import { fadeInUp, stagger, viewport } from "@/components/marketing/animations";
import { AnimatedCounter } from "./AnimatedCounter";

const stats = [
  {
    label: "Total Earners",
    value: 38000,
    suffix: "+",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    description: "Active users earning daily",
  },
  {
    label: "Total Cleared",
    value: 1200000,
    prefix: "₹",
    suffix: "+",
    icon: Coins,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    description: "Amount paid out to earners",
  },
  {
    label: "Avg Payout Time",
    value: 58,
    suffix: " min",
    icon: Clock,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    description: "Average withdrawal processing",
  },
  {
    label: "Growth Rate",
    value: 127,
    suffix: "%",
    icon: TrendingUp,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    description: "Month-over-month growth",
  },
];

export function AnimatedStats() {
  return (
    <motion.section
      className="px-6 pb-20 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <motion.div className="space-y-3 text-center" variants={fadeInUp}>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Real numbers, real impact
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            See how Earniq is transforming how India earns online.
          </p>
        </motion.div>

        <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" variants={stagger}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="group relative rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 glass-premium gradient-border card-3d"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, rotateY: 2 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 space-y-4">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor} ${stat.borderColor} border transition-all group-hover:scale-110`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
                    {stat.prefix || ""}
                    <AnimatedCounter value={stat.value} duration={2} />
                    {stat.suffix}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}


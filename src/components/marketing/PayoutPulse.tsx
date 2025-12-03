"use client";

import { TrendingUp, Clock, Zap, Shield, AlertCircle, CheckCircle2, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, stagger, viewport } from "@/components/marketing/animations";

const payoutStats = [
  { label: "Avg. approval time", value: "3h 14m", icon: Clock, color: "text-blue-400" },
  { label: "Fastest withdrawal", value: "41s", icon: Zap, color: "text-emerald-400" },
  { label: "Pending disputes", value: "12 (0.04%)", icon: AlertCircle, color: "text-amber-400" },
  { label: "Fraud blocked", value: "11,420+ installs", icon: Shield, color: "text-red-400" },
];

const weeklyBreakdown = [
  { day: "Mon", amount: 42000, percentage: 85 },
  { day: "Tue", amount: 51000, percentage: 100 },
  { day: "Wed", amount: 48000, percentage: 94 },
  { day: "Thu", amount: 45000, percentage: 88 },
  { day: "Fri", amount: 52000, percentage: 100 },
  { day: "Sat", amount: 38000, percentage: 73 },
  { day: "Sun", amount: 40000, percentage: 77 },
];

const recentActivity = [
  { type: "Withdrawal", amount: "₹2,500", status: "completed", time: "2m ago" },
  { type: "Task approval", amount: "₹160", status: "completed", time: "5m ago" },
  { type: "Referral bonus", amount: "₹420", status: "completed", time: "12m ago" },
  { type: "Withdrawal", amount: "₹1,800", status: "processing", time: "18m ago" },
];

export function PayoutPulse() {
  const maxAmount = Math.max(...weeklyBreakdown.map((d) => d.amount));

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
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-emerald-500/20 to-transparent blur-3xl" />
        <div className="absolute left-[10%] top-20 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl animate-pulse" />
        <div className="absolute right-[10%] top-40 h-56 w-56 rounded-full bg-blue-500/10 blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Section Header */}
        <motion.div className="space-y-3 text-center" variants={fadeInUp}>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Payout Pulse & Metrics</h2>
          <p className="text-base text-muted-foreground md:text-lg">
            Real-time insights into withdrawals, approvals, and platform health
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Left: Main Payout Pulse Card */}
          <motion.div
            className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-primary/5 via-background/90 to-background p-8 shadow-2xl shadow-primary/10 backdrop-blur-xl glass-premium"
            variants={fadeInUp}
            whileHover={{ scale: 1.01 }}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary/80">Payout pulse</p>
                </div>
                <p className="mt-2 text-4xl font-bold text-foreground">₹2.7L released this week</p>
                <p className="mt-1 text-sm text-muted-foreground">Live approvals, dispute queue, and withdrawal velocity</p>
              </div>
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="h-6 w-6" />
              </motion.div>
            </div>

            {/* Weekly Breakdown Chart */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>Weekly breakdown</span>
                <span className="text-emerald-400">+12% vs last week</span>
              </div>
              <div className="flex h-32 items-end justify-between gap-2">
                {weeklyBreakdown.map((day, index) => (
                  <motion.div
                    key={day.day}
                    className="flex flex-1 flex-col items-center gap-2"
                    initial={{ opacity: 0, scaleY: 0 }}
                    whileInView={{ opacity: 1, scaleY: 1 }}
                    viewport={viewport}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative w-full">
                      <div className="h-24 w-full rounded-t-lg bg-gradient-to-t from-emerald-500/40 to-emerald-400/60" style={{ height: `${day.percentage}%` }} />
                      <div className="absolute inset-0 rounded-t-lg bg-gradient-to-t from-emerald-600/60 to-transparent" style={{ height: `${day.percentage}%` }} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-foreground">{day.day}</p>
                      <p className="text-[10px] text-muted-foreground">₹{(day.amount / 1000).toFixed(0)}k</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {payoutStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="group/stat rounded-2xl border border-white/5 bg-background/60 backdrop-blur-sm p-4 transition-all hover:border-white/10 hover:bg-background/80"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-5 w-5 ${stat.color} opacity-60`} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Smart Routing Info */}
            <motion.div
              className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewport}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-foreground">Smart routing</p>
                  <p className="text-sm text-muted-foreground">
                    High-performing earners unlock surge payouts, higher task caps, and early settlement windows.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Side Cards */}
          <div className="space-y-6">
            {/* Instant UPI Card */}
            <motion.div
              className="group relative overflow-hidden rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-emerald-500/5 p-8 text-emerald-50 shadow-2xl shadow-emerald-400/20 backdrop-blur-xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-300" />
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100/80">Instant UPI</p>
                </div>
                <p className="text-4xl font-bold text-white">₹82,400</p>
                <p className="mt-1 text-sm text-emerald-100/90">released in the last 24h</p>
                <p className="mt-4 text-sm leading-relaxed text-emerald-100/80">
                  Every withdrawal is OTP-verified, GST-ready, and logged for your records. No hidden processing fee—ever.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-emerald-100/70">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1">UPI rails</span>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1">RazorpayX</span>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1">Axis Bank</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity Card */}
            <motion.div
              className="rounded-3xl border border-white/10 bg-background/60 backdrop-blur-xl p-6 shadow-lg"
              variants={fadeInUp}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Recent activity</p>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-background/40 p-3 backdrop-blur-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewport}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        activity.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {activity.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{activity.type}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{activity.amount}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Platform Health Card */}
            <motion.div
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/5 p-6 backdrop-blur-xl"
              variants={fadeInUp}
            >
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Platform health</p>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-semibold text-emerald-400">99.98%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-background/40">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      initial={{ width: 0 }}
                      whileInView={{ width: "99.98%" }}
                      viewport={viewport}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Dispute resolution</span>
                    <span className="font-semibold text-blue-400">97% within 12h</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-background/40">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                      initial={{ width: 0 }}
                      whileInView={{ width: "97%" }}
                      viewport={viewport}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Fraud prevention</span>
                    <span className="font-semibold text-purple-400">11,420+ blocked</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-background/40">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                      initial={{ width: 0 }}
                      whileInView={{ width: "98%" }}
                      viewport={viewport}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

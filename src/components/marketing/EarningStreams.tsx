"use client";

import { Briefcase, Gift, MessagesSquare } from "lucide-react";
import { motion } from "framer-motion";

import { fadeInUp, stagger, viewport } from "@/components/marketing/animations";

const earnings = [
  {
    title: "App referrals",
    description: "Earn per verified install or signup from your unique link. No shady APKs—only audited partner apps.",
    icon: Briefcase,
    rate: "₹42 - ₹160 / install",
    meta: "₹42–₹160 per verified install — auto-tracked & fraud-filtered",
  },
  {
    title: "UPI & purchase rewards",
    description: "Get paid for completing UPI-first tasks or product purchases tracked through proof uploads.",
    icon: Gift,
    rate: "₹25 - ₹500 / task",
    meta: "₹25–₹500 per task — proof-verified & instant credit",
  },
  {
    title: "Social tasks & status",
    description: "Earn for WhatsApp status, follows, and engagement tasks with screenshot-backed approvals.",
    icon: MessagesSquare,
    rate: "₹8 - ₹60 / publish",
    meta: "₹8–₹60 per publish — screenshot-verified & auto-approved",
  },
];

export function EarningStreams() {
  return (
    <motion.section
      id="features"
      className="px-6 pb-20 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
    >
      <div className="mx-auto max-w-5xl space-y-12">
        <motion.div className="space-y-3 text-center" variants={fadeInUp}>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Earning streams that keep money moving daily
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            Mix referrals, UPI-backed tasks, and social drops. Diversify your wallet without juggling shady apps.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div className="grid gap-6 md:grid-cols-3 md:grid-rows-2" variants={stagger}>
          {/* Large Featured Card - spans 2 columns */}
          {(() => {
            const featuredEarning = earnings[0];
            const FeaturedIcon = featuredEarning.icon;
            return (
              <motion.div
                key={featuredEarning.title}
                className="group md:col-span-2 flex h-full flex-col rounded-2xl border border-white/6 glass-premium p-8 shadow-[0_8px_24px_rgba(2,6,23,0.6)] transition-all duration-[180ms] ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(2,6,23,0.7)] hover:border-primary/40 min-h-[44px] card-3d gradient-border glow-primary-hover"
                variants={fadeInUp}
                whileHover={{ rotateY: 1 }}
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/30 text-blue-400 transition-all duration-[180ms] ease-out group-hover:ring-blue-500/50 group-hover:scale-110">
                  <FeaturedIcon className="h-7 w-7 transition-all duration-[180ms] ease-out" />
                </div>
                <div className="mt-6 space-y-4">
                  <h3 className="text-2xl font-semibold text-foreground">{featuredEarning.title}</h3>
                  <p className="text-base leading-relaxed text-[#ebebeb]">{featuredEarning.description}</p>
                  <div className="rounded-xl border border-white/6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-[14px] py-3">
                    <p className="text-sm font-semibold text-blue-400">{featuredEarning.rate}</p>
                    <p className="mt-1.5 text-xs text-blue-400/80">{featuredEarning.meta}</p>
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {/* Smaller Cards - 1 column each */}
          {earnings.slice(1).map((earning, index) => (
            <motion.div
              key={earning.title}
              className="group flex h-full flex-col rounded-2xl border border-white/6 glass-premium p-7 shadow-[0_8px_24px_rgba(2,6,23,0.6)] transition-all duration-[180ms] ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(2,6,23,0.7)] hover:border-primary/40 min-h-[44px] card-3d gradient-border"
              variants={fadeInUp}
              whileHover={{ rotateY: -1 }}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${
                index === 0 
                  ? "bg-gradient-to-br from-cyan-500/20 to-primary/20 ring-1 ring-cyan-500/30 text-cyan-400" 
                  : "bg-gradient-to-br from-primary/20 to-orange-500/20 ring-1 ring-primary/30 text-primary"
              } transition-all duration-[180ms] ease-out group-hover:scale-110`}>
                <earning.icon className="h-6 w-6 transition-all duration-[180ms] ease-out" />
              </div>
              <div className="mt-6 space-y-3">
                <h3 className="text-xl font-semibold text-foreground">{earning.title}</h3>
                <p className="text-sm leading-relaxed text-[#ebebeb]">{earning.description}</p>
                <div className={`rounded-xl border border-white/6 px-[14px] py-2.5 ${
                  index === 0 
                    ? "bg-gradient-to-r from-cyan-500/10 to-primary/10" 
                    : "bg-primary/8"
                }`}>
                  <p className={`text-sm font-semibold ${index === 0 ? "text-cyan-400" : "text-primary"}`}>
                    {earning.rate}
                  </p>
                  <p className={`mt-1.5 text-xs ${index === 0 ? "text-cyan-400/80" : "text-primary/80"}`}>
                    {earning.meta}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}



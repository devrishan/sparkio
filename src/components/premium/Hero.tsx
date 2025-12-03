"use client";

import React from "react";
import { motion } from "framer-motion";

import GradientBeam from "@/ui/premium/beam";
import { usePremiumVariants } from "@/ui/premium/motion";
import SnapshotCard from "@/components/premium/SnapshotCard";

export default function PremiumHero() {
  const { container, fadeUp, lift } = usePremiumVariants();

  return (
    <section className="relative py-24 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="order-2 space-y-6 lg:order-1"
        >
          <motion.h1
            variants={fadeUp}
            className="max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-slate-50"
          >
            Turn small tasks into{" "}
            <span className="text-gradient">reliable earnings</span>
            {" "}— fast.
          </motion.h1>

          <GradientBeam className="mt-4" />

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-2xl text-base text-slate-700 sm:text-lg md:text-xl dark:text-slate-300"
          >
            Earnkio matches short verified tasks with earners, routes payouts through UPI, and gives you
            receipts, privacy-first referrals, and a live wallet — all in one dashboard.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <motion.a
              variants={lift}
              whileHover="hover"
              href="/member/signup"
              className="inline-flex items-center gap-3 rounded-full bg-rose-600 px-6 py-3 text-sm font-medium text-white shadow-lg cta-glow"
              aria-label="Create an Earnkio account"
            >
              Get started
              <span aria-hidden>→</span>
            </motion.a>
            <motion.a
              whileHover={{ y: -3 }}
              href="/member/referrals"
              className="inline-flex items-center rounded-full border px-5 py-3 text-sm text-rose-700 bg-white/40 dark:border-slate-700 dark:bg-slate-900/40 dark:text-rose-200"
            >
              Invite friends
            </motion.a>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="mt-8 grid grid-cols-1 gap-4 text-sm text-slate-700 sm:grid-cols-3 dark:text-slate-300"
          >
            <li className="rounded-xl border border-white/80 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <div className="text-xs text-slate-500 dark:text-slate-400">Secure withdrawals</div>
              <div className="font-semibold text-slate-900 dark:text-slate-50">
                UPI payouts &amp; PDF receipts
              </div>
            </li>
            <li className="rounded-xl border border-white/80 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <div className="text-xs text-slate-500 dark:text-slate-400">Privacy-first</div>
              <div className="font-semibold text-slate-900 dark:text-slate-50">
                Partial phone masking &amp; sharing
              </div>
            </li>
            <li className="rounded-xl border border-white/80 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <div className="text-xs text-slate-500 dark:text-slate-400">Gamified</div>
              <div className="font-semibold text-slate-900 dark:text-slate-50">
                Badges &amp; leaderboards
              </div>
            </li>
          </motion.ul>
        </motion.div>

        <div className="order-1 lg:order-2">
          <SnapshotCard />
        </div>
      </div>
    </section>
  );
}



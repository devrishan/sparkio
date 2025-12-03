 "use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import useCountTo from "@/hooks/useCountTo";
import MobileStickyCTA from "@/components/MobileStickyCTA";

const makeVariants = (reduceMotion: boolean) => ({
  container: {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: { opacity: 1, transition: { staggerChildren: reduceMotion ? 0 : 0.08 } },
  },
  fadeUp: {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 12 },
    visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: reduceMotion ? 0 : 0.5 } },
  },
  lift: {
    rest: { y: 0 },
    hover: { y: reduceMotion ? 0 : -4, transition: { duration: 0.18 } },
  },
  pulse: {
    rest: { scale: 1 },
    hover: { scale: reduceMotion ? 1 : 1.03, transition: { duration: reduceMotion ? 0 : 0.18 } },
  },
});

export default function Home() {
  const reduceMotion = useReducedMotion();
  const variants = makeVariants(reduceMotion);

  // Replace these with API-driven numbers when wiring to backend
  const earnings = useCountTo(1245, reduceMotion ? 0 : 900);
  const referrals = useCountTo(12, reduceMotion ? 0 : 800);
  const pending = useCountTo(400, reduceMotion ? 0 : 900);
  const rank = useCountTo(18, reduceMotion ? 0 : 700);

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-rose-100 to-amber-50">
      {/* Warm full-bleed gradient background with centered content */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
        <header className="relative z-20">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <a href="/" className="inline-block text-2xl font-extrabold tracking-tight text-slate-900">
              Earniq
            </a>
            <nav className="hidden lg:flex gap-4 text-sm text-slate-700">
              <motion.a whileHover={reduceMotion ? {} : { y: -2 }} href="/member/dashboard">
                Dashboard
              </motion.a>
              <motion.a whileHover={reduceMotion ? {} : { y: -2 }} href="/member/tasks">
                Tasks
              </motion.a>
              <motion.a whileHover={reduceMotion ? {} : { y: -2 }} href="/member/referrals">
                Referrals
              </motion.a>
              <motion.a whileHover={reduceMotion ? {} : { y: -2 }} href="/member/wallet">
                Wallet
              </motion.a>
              <motion.a whileHover={reduceMotion ? {} : { y: -2 }} href="/member/leaderboard">
                Leaderboard
              </motion.a>
            </nav>

            <div className="flex items-center gap-3">
              <a href="/member/login" className="px-4 py-2 border rounded-md text-sm text-slate-800 bg-white/40">
                Sign in
              </a>
              <motion.a
                whileHover={reduceMotion ? {} : { scale: 1.02 }}
                whileTap={reduceMotion ? {} : { scale: 0.98 }}
                href="/member/signup"
                className="px-4 py-2 bg-rose-600 text-white rounded-md text-sm shadow"
              >
                Get started
              </motion.a>
            </div>
          </div>
        </header>

        {/* Glass hero shell */}
        <section className="pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-3xl bg-white/6 backdrop-blur-xl border border-white/10 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-2xl">
              {/* Left: hero content */}
              <motion.div initial="hidden" animate="visible" variants={variants.container} className="order-2 lg:order-1">
                <motion.h1
                  variants={variants.fadeUp}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 max-w-2xl"
                >
                  Earn with your time. Share with your circle. Grow together.
                </motion.h1>

                <motion.p variants={variants.fadeUp} className="mt-4 text-lg text-slate-700 max-w-xl">
                  Earniq combines short verified tasks, privacy-first referrals, and secure payouts — all in a friendly,
                  community-first platform.
                </motion.p>

                <motion.div variants={variants.fadeUp} className="mt-8 flex flex-wrap gap-3 items-center">
                  <motion.a
                    variants={variants.pulse}
                    whileHover="hover"
                    href="/member/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-full font-medium shadow-md"
                    aria-label="Create an account"
                  >
                    Get started
                    <span className="text-sm opacity-80">→</span>
                  </motion.a>

                  <motion.a
                    whileHover={reduceMotion ? {} : { y: -3 }}
                    href="/member/referrals"
                    className="inline-flex items-center px-5 py-3 border rounded-full text-rose-700 bg-white/10"
                    aria-label="Invite friends"
                  >
                    Invite friends
                  </motion.a>
                </motion.div>

                <motion.ul
                  variants={variants.fadeUp}
                  className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-700"
                >
                  <li className="bg-white/40 rounded-lg px-4 py-3 border border-white/80">
                    <div className="text-xs text-slate-500">Secure withdrawals</div>
                    <div className="font-semibold">UPI payouts & PDF receipts</div>
                  </li>
                  <li className="bg-white/40 rounded-lg px-4 py-3 border border-white/80">
                    <div className="text-xs text-slate-500">Privacy-first</div>
                    <div className="font-semibold">Partial phone masking & sharing</div>
                  </li>
                  <li className="bg-white/40 rounded-lg px-4 py-3 border border-white/80">
                    <div className="text-xs text-slate-500">Gamified</div>
                    <div className="font-semibold">Badges & leaderboards</div>
                  </li>
                </motion.ul>
              </motion.div>

              {/* Right: snapshot card (glass) */}
              <motion.aside
                initial="hidden"
                animate="visible"
                variants={variants.fadeUp}
                className="order-1 lg:order-2 rounded-2xl p-6 bg-white/80 border border-white/80 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Snapshot</div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-md border border-slate-100">
                        <div className="text-xs text-slate-400">Total Earnings</div>
                        <div className="text-2xl font-semibold text-slate-900">₹{earnings.toLocaleString()}</div>
                      </div>
                      <div className="p-3 bg-white rounded-md border border-slate-100">
                        <div className="text-xs text-slate-400">Referrals</div>
                        <div className="text-2xl font-semibold text-slate-900">{referrals}</div>
                      </div>
                      <div className="p-3 bg-white rounded-md border border-slate-100">
                        <div className="text-xs text-slate-400">Pending</div>
                        <div className="text-2xl font-semibold text-slate-900">₹{pending.toLocaleString()}</div>
                      </div>
                      <div className="p-3 bg-white rounded-md border border-slate-100">
                        <div className="text-xs text-slate-400">Rank</div>
                        <div className="text-2xl font-semibold text-slate-900">#{rank}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <motion.a
                    whileHover={reduceMotion ? {} : { scale: 1.02 }}
                    whileTap={reduceMotion ? {} : { scale: 0.98 }}
                    href="/member/withdraw"
                    className="inline-block w-full text-center px-4 py-2 bg-emerald-500 text-white rounded-full font-medium"
                  >
                    Withdraw
                  </motion.a>
                </div>

                <div className="mt-3 text-xs text-slate-400">
                  All figures are sample — connect your account for live stats.
                </div>
              </motion.aside>
            </div>
          </div>
        </section>

        {/* Remaining content sections kept concise — include your existing content below */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              initial={reduceMotion ? {} : { opacity: 0, y: 8 }}
              animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
              className="text-2xl font-semibold text-slate-900"
            >
              How Earniq works
            </motion.h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <article className="p-6 bg-white/70 rounded-md border border-slate-100">
                <h3 className="font-medium text-slate-900">Complete verified tasks</h3>
                <p className="text-sm text-slate-700 mt-2">Accept short tasks and earn after approval.</p>
              </article>
              <article className="p-6 bg-white/70 rounded-md border border-slate-100">
                <h3 className="font-medium text-slate-900">Share &amp; refer</h3>
                <p className="text-sm text-slate-700 mt-2">Share referral links or WhatsApp directly.</p>
              </article>
              <article className="p-6 bg-white/70 rounded-md border border-slate-100">
                <h3 className="font-medium text-slate-900">Withdraw with receipts</h3>
                <p className="text-sm text-slate-700 mt-2">Timestamps, approval logs, and PDF receipts.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Mobile sticky CTA */}
        <MobileStickyCTA />

        <footer className="border-t mt-12">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="font-semibold text-slate-900">Earniq</div>
              <div className="text-sm text-slate-700">Transparent. Smart. Rewarding.</div>
            </div>

            <div className="flex gap-10">
              <div>
                <div className="text-xs text-slate-500">Product</div>
                <ul className="mt-2 text-sm text-slate-700">
                  <li>
                    <a href="/member/dashboard">Dashboard</a>
                  </li>
                  <li>
                    <a href="/member/tasks">Tasks</a>
                  </li>
                  <li>
                    <a href="/member/referrals">Referrals</a>
                  </li>
                </ul>
              </div>

              <div>
                <div className="text-xs text-slate-500">Company</div>
                <ul className="mt-2 text-sm text-slate-700">
                  <li>
                    <a href="/about">About</a>
                  </li>
                  <li>
                    <a href="/privacy">Privacy</a>
                  </li>
                  <li>
                    <a href="/terms">Terms</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}


"use client";

import React from "react";
import { motion } from "framer-motion";

import { usePremiumVariants } from "@/ui/premium/motion";

const items = [
  {
    title: "Complete verified tasks",
    desc: "Short, clearly defined tasks approved by providers.",
  },
  {
    title: "Share & refer",
    desc: "Invite friends via WhatsApp, links, and app referrals.",
  },
  {
    title: "Withdraw securely",
    desc: "UPI payouts with receipts and full audit history.",
  },
];

export default function HowItWorks() {
  const { fadeUp } = usePremiumVariants();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="space-y-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
            Steps
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            How it works
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Become an earner in minutes, track everything in real time, and cash out without friction.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
              className="group rounded-2xl border border-white/10 bg-background/40 p-6 shadow-lg shadow-black/5 backdrop-blur-xl ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}



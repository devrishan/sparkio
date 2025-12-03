"use client";

import React from "react";
import { motion } from "framer-motion";

const quotes = [
  {
    text: '"Earnkio made it simple to earn extra money — withdrawals are fast and tracked."',
    author: "Priya, Bangalore",
  },
  {
    text: '"I love the referrals feature — quick sharing and clear tracking."',
    author: "Arjun, Mumbai",
  },
  {
    text: '"The leaderboard keeps me motivated to climb ranks every week."',
    author: "Neha, Kochi",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          What members say
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {quotes.map((quote) => (
            <motion.blockquote
              key={quote.author}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-3xl border border-white/10 bg-background/40 p-6 text-left shadow-lg shadow-black/5 backdrop-blur-xl"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">{quote.text}</p>
              <footer className="mt-3 text-xs text-muted-foreground/70">— {quote.author}</footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}



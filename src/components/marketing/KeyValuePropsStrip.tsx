"use client";

import { motion } from "framer-motion";
import { fadeInUp, viewport } from "@/components/marketing/animations";

const valueProps = [
  "No joining fee",
  "Transparent proofs",
  "Instant UPI",
  "Multi-app tracking",
  "24×7 support",
];

export function KeyValuePropsStrip() {
  return (
    <motion.section
      className="px-6 py-8 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeInUp}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:justify-center md:overflow-x-visible">
          {valueProps.map((prop, index) => (
            <motion.span
              key={prop}
              className="flex-shrink-0 rounded-full border border-white/10 bg-background/40 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ delay: index * 0.05 }}
            >
              {prop}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}


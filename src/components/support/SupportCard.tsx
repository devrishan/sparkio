"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SupportCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}

export function SupportCard({ icon: Icon, title, description, index = 0 }: SupportCardProps) {
  return (
    <motion.div
      className="group relative h-full rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">{title}</h3>
          <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}


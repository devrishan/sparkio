"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { fadeInUp, viewport } from "@/components/marketing/animations";

export function SupportCTA() {
  return (
    <motion.section
      className="px-6 pb-20 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeInUp}
      aria-label="Support call to action"
    >
      <div className="mx-auto max-w-5xl rounded-3xl border border-primary/20 bg-primary/5 p-10 text-center shadow-lg shadow-primary/10 md:text-left">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Need a human?
            </p>
            <h2 className="text-3xl font-semibold text-foreground">
              Support replies in under 15 minutes.
            </h2>
            <p className="text-base text-muted-foreground">
              Login, open the support center, or drop us an email. Your tasks and withdrawals never wait.
            </p>
            <p className="text-sm text-muted-foreground">Prefer email? Write to hello@earniq.in</p>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <Button asChild size="lg" className="w-full rounded-full button-shine">
              <Link href="/support-center">Login &amp; open support</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full rounded-full border border-white/10">
              <Link href="/support">Visit support section</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}



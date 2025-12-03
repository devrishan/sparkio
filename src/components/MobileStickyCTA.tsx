"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STORAGE_KEY = "earniq_sticky_cta_dismissed";

export default function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY) === "true";
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={reduceMotion ? {} : { y: 80, opacity: 0 }}
      animate={reduceMotion ? {} : { y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rose-200/70 bg-rose-50/95 px-4 py-3 shadow-[0_-6px_24px_rgba(15,23,42,0.22)] backdrop-blur md:hidden"
      aria-label="Quick start earning"
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            if (typeof window !== "undefined") {
              window.localStorage.setItem(STORAGE_KEY, "true");
            }
          }}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-200/80 bg-white/80 text-xs text-rose-500"
          aria-label="Dismiss earnings prompt"
        >
          ×
        </button>

        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">Start earning</p>
          <p className="text-sm text-slate-900">
            Complete your first task in under <span className="font-semibold">5 minutes</span>.
          </p>
        </div>

        <motion.div whileHover={reduceMotion ? {} : { scale: 1.03 }} whileTap={reduceMotion ? {} : { scale: 0.97 }}>
          <Link
            href="/member/signup"
            className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm"
          >
            Let&apos;s go
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}



"use client";

import { useReducedMotion, type Variants } from "framer-motion";

export function usePremiumVariants() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: { opacity: reduce ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reduce ? 0 : 0.06 },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: "easeOut", duration: reduce ? 0 : 0.5 },
    },
  };

  const lift: Variants = {
    rest: { y: 0 },
    hover: {
      y: reduce ? 0 : -6,
      transition: { duration: 0.18 },
    },
  };

  return { container, fadeUp, lift };
}



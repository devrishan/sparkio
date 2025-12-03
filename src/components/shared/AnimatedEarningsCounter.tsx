"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface AnimatedEarningsCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedEarningsCounter({
  value,
  prefix = "₹",
  suffix = "",
  decimals = 2,
  className,
}: AnimatedEarningsCounterProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 50, damping: 30 });
  const display = useTransform(spring, (current) =>
    current.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );

  React.useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return (
    <motion.span className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
}


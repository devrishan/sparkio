"use client";

import { useEffect, useState } from "react";

/**
 * Simple count-up hook using requestAnimationFrame.
 * If duration is 0, it jumps straight to the target.
 */
export default function useCountTo(target: number, duration: number = 800): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (duration === 0) {
      setValue(target);
      return;
    }

    let start: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const next = Math.floor(progress * target);
      setValue(next);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [target, duration]);

  return value;
}



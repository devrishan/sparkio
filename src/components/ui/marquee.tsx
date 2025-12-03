"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  pauseOnHover?: boolean;
  speed?: number;
  className?: string;
}

export function Marquee({
  children,
  direction = "left",
  pauseOnHover = true,
  speed = 50,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group relative flex overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 gap-4 [--gap:1rem]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          direction === "left" && "animate-marquee-left",
          direction === "right" && "animate-marquee-right",
          !direction && "animate-marquee-left"
        )}
        style={
          {
            "--speed": `${speed}s`,
          } as React.CSSProperties
        }
      >
        {React.Children.map(children, (child) => (
          <div className="flex shrink-0">{child}</div>
        ))}
        {React.Children.map(children, (child) => (
          <div className="flex shrink-0">{child}</div>
        ))}
      </div>
    </div>
  );
}

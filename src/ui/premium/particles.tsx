"use client";

import React from "react";

interface ParticlesProps {
  count?: number;
}

export default function Particles({ count = 22 }: ParticlesProps) {
  const nodes = Array.from({ length: count });

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      {nodes.map((_, index) => (
        <div
          // Using index is fine here because particles are purely decorative
          // and never re-ordered.
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="absolute rounded-full bg-white/30 dark:bg-white/10 blur-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 12}px`,
            height: `${6 + Math.random() * 12}px`,
            transform: "translate3d(0,0,0)",
            animation: `premiumFloat ${8 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}



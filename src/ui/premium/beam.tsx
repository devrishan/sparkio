"use client";

import React from "react";

interface GradientBeamProps {
  className?: string;
}

export default function GradientBeam({ className = "" }: GradientBeamProps) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <div className="mx-auto h-[2px] w-48 rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-pink-500 opacity-70 animate-beam" />
    </div>
  );
}



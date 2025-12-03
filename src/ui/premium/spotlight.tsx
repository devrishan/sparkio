"use client";

import React, { useEffect, useState } from "react";

export default function Spotlight() {
  const [pos, setPos] = useState({ x: 9999, y: 9999 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      setPos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-10 opacity-30 mix-blend-screen"
      style={{
        background: `radial-gradient(420px at ${pos.x}px ${pos.y}px, rgba(255,240,236,0.48), rgba(255,240,236,0) 45%)`,
      }}
    />
  );
}



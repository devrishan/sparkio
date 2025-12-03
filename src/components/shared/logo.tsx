"use client";

import Link from "next/link";

export function EarniqLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        E
      </span>
      <span className="text-lg">Earniq</span>
    </Link>
  );
}

// Keep SparkioLogo as alias for backward compatibility during migration
export const SparkioLogo = EarniqLogo;


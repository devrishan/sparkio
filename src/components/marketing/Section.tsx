import * as React from "react";

import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  asChild?: boolean;
  containerClassName?: string;
}

export function Section({
  children,
  className,
  asChild = false,
  containerClassName,
  ...props
}: SectionProps) {
  if (asChild) {
    return (
      <Slot className={cn("py-16 md:py-20 lg:py-24", className)} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <section className={cn("py-16 md:py-20 lg:py-24", className)} {...props}>
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}




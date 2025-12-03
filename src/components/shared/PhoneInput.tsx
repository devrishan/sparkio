"use client";

import * as React from "react";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow digits
      const digits = e.target.value.replace(/\D/g, "");
      onChange(digits);
    };

    return (
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={value}
          onChange={handleChange}
          className={cn("pl-9", className)}
          placeholder="9876543210"
          maxLength={15}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";


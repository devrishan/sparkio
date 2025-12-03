"use client";

import * as React from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export interface OtpInputsProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export const OtpInputs = React.forwardRef<HTMLInputElement, OtpInputsProps>(
  ({ value, onChange, disabled, className, error }, ref) => {
    return (
      <InputOTP
        ref={ref}
        maxLength={6}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(error && "ring-destructive", className)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    );
  }
);

OtpInputs.displayName = "OtpInputs";


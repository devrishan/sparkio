"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles, Phone, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { loginWithOtpRequest, verifyOtp } from "@/lib/auth-otp";
import { useAuth } from "@/context/AuthProvider";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { EarniqLogo } from "./EarniqLogo";

const phoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  referralCode: z.string().optional(),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export function OtpLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || searchParams?.get("redirect");
  const redirectPath = nextPath || "/member/dashboard";
  const { user, isAuthenticated, isLoading, refetch } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
      referralCode: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const destination = user.role === "admin" ? "/admin/dashboard" : redirectPath;
      router.push(destination);
    }
  }, [isLoading, isAuthenticated, user, router, redirectPath]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestOtp = async (values: PhoneFormValues) => {
    setIsRequestingOtp(true);
    try {
      const result = await loginWithOtpRequest(values.phone);

      if (!result.ok) {
        throw new Error(result.error || "Failed to request OTP");
      }

      setPhone(values.phone);
      setOtpSent(true);
      setStep("otp");
      setCountdown(60); // 60 second cooldown

      toast.success("OTP sent!", {
        description: result.message || "Check your phone for the verification code.",
      });
    } catch (error) {
      console.error("[OtpLoginForm] Request OTP error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
      toast.error("Failed to send OTP", { description: errorMessage });
      phoneForm.setError("root", { message: errorMessage });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleVerifyOtp = async (values: OtpFormValues) => {
    setIsVerifying(true);
    try {
      const result = await verifyOtp(phone, values.otp, values.referralCode);

      if (!result.success || !result.user) {
        throw new Error(result.error || "Invalid OTP");
      }

      toast.success("Welcome!", { description: "You are now signed in." });

      // Refetch session to update auth state
      await refetch();

      // Determine redirect based on user role
      const destination = result.user.role === "admin" ? "/admin/dashboard" : redirectPath;

      // Redirect after a short delay
      setTimeout(() => {
        router.push(destination);
      }, 100);
    } catch (error) {
      console.error("[OtpLoginForm] Verify OTP error:", error);
      const errorMessage = error instanceof Error ? error.message : "Invalid OTP";
      toast.error("Verification failed", { description: errorMessage });
      otpForm.setError("root", { message: errorMessage });
      otpForm.setValue("otp", ""); // Clear OTP input
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsRequestingOtp(true);
    try {
      const result = await loginWithOtpRequest(phone);

      if (!result.ok) {
        throw new Error(result.error || "Failed to resend OTP");
      }

      setCountdown(60);
      toast.success("OTP resent!", {
        description: result.message || "Check your phone for the verification code.",
      });
    } catch (error) {
      console.error("[OtpLoginForm] Resend OTP error:", error);
      toast.error("Failed to resend OTP", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleDemoLogin = async () => {
    // Demo phone number
    const demoPhone = "9876543210";

    // Prefill phone
    phoneForm.setValue("phone", demoPhone);
    
    // Request OTP (will auto-advance to OTP step on success)
    await handleRequestOtp({ phone: demoPhone });
    
    // Show message to check server logs for OTP in dev mode
    toast.info("Demo OTP sent", {
      description: "Check server console logs for the OTP code. In dev mode, OTPs are logged to the console.",
    });
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtpSent(false);
    otpForm.reset();
  };

  if (step === "otp") {
    return (
      <div className="space-y-8">
        {/* Logo and Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <EarniqLogo href="/" />
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Enter Verification Code</h1>
            <p className="text-base text-muted-foreground">
              We sent a code to <span className="font-medium text-foreground">{phone}</span>
            </p>
          </div>
        </div>

        {/* OTP Form */}
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
            {otpForm.formState.errors.root && (
              <div
                className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
                role="alert"
              >
                {otpForm.formState.errors.root.message}
              </div>
            )}

            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000000"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="one-time-code"
                      aria-invalid={fieldState.invalid}
                      disabled={isVerifying}
                      className={cn(
                        "text-center text-2xl tracking-widest",
                        fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                      )}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={otpForm.control}
              name="referralCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Code (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter referral code"
                      disabled={isVerifying}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Sign In"
              )}
            </Button>
          </form>
        </Form>

        {/* Resend OTP */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          <Button
            type="button"
            variant="link"
            onClick={handleResendOtp}
            disabled={countdown > 0 || isRequestingOtp}
            className="h-auto p-0"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
          </Button>
        </div>

        {/* Back to phone */}
        <Button
          type="button"
          variant="ghost"
          onClick={handleBackToPhone}
          className="w-full"
          disabled={isVerifying}
        >
          ← Change phone number
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Logo and Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <EarniqLogo href="/" />
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome to Earniq</h1>
          <p className="text-base text-muted-foreground">
            Sign in with your phone number to continue.
          </p>
        </div>
      </div>

      {/* Phone Form */}
      <Form {...phoneForm}>
        <form onSubmit={phoneForm.handleSubmit(handleRequestOtp)} className="space-y-6">
          {phoneForm.formState.errors.root && (
            <div
              className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
            >
              {phoneForm.formState.errors.root.message}
            </div>
          )}

          <FormField
            control={phoneForm.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="9876543210"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      aria-invalid={fieldState.invalid}
                      disabled={isRequestingOtp}
                      className={cn(
                        "pl-9",
                        fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                      )}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 15);
                        field.onChange(value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  We'll send a 6-digit verification code to this number
                </p>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isRequestingOtp}
          >
            {isRequestingOtp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Send Verification Code
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Demo Login Button */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleDemoLogin}
        disabled={isRequestingOtp || isVerifying}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Demo Login
      </Button>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <span className="font-semibold text-primary">Sign in with phone</span>
      </p>
    </div>
  );
}


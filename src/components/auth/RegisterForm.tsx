"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { register as authRegister, isAuthenticated } from "@/lib/auth";
import { useSession } from "@/components/providers/session-provider";
import type { PasswordStrength } from "./PasswordStrength";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { EarniqLogo } from "./EarniqLogo";
import { PasswordInput } from "./PasswordInput";

const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required.")
    .min(3, "Choose a username with at least 3 characters.")
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email."),
  password: z.string().min(1, "Password is required.").min(8, "Use at least 8 characters."),
  referral_code: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val && val.length > 0 ? val.toUpperCase() : undefined)),
  accept_terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms and Privacy Policy to continue.",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { status, user, refetch } = useSession();
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("none");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      referral_code: "",
      accept_terms: false,
    },
    mode: "onBlur", // Validate on blur for inline feedback
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && user) {
      router.push("/member/dashboard");
    } else if (status === "loading") {
      // Check mock auth while SessionProvider is loading
      if (isAuthenticated()) {
        const timer = setTimeout(() => {
          if (status === "authenticated" || isAuthenticated()) {
            router.push("/member/dashboard");
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [status, user, router]);

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setIsRedirecting(true);

    try {
      // Use new auth utilities
      const result = await authRegister(
        values.email,
        values.password,
        values.username,
        values.referral_code
      );

      if (!result.success || !result.session) {
        throw new Error(result.error || "Registration failed");
      }

      toast.success("Account created", { description: "Welcome to Earniq!" });

      // Refetch session to update SessionProvider
      await refetch();

      // Small delay to show the loading state, then redirect to dashboard
      setTimeout(() => {
        router.push("/member/dashboard");
      }, 500);
    } catch (error) {
      console.error("[RegisterForm] Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast.error("Registration failed", { description: errorMessage });
      form.setError("root", { message: errorMessage });
      setIsSubmitting(false);
      setIsRedirecting(false);
    }
  };

  // Demo account handler
  const handleDemoRegister = async () => {
    setIsSubmitting(true);
    try {
      // Use demo credentials
      const demoEmail = `demo_${Date.now()}@example.com`;
      const demoPassword = "demo12345";
      const demoUsername = `demo_${Date.now().toString().slice(-6)}`;

      // Prefill form
      form.setValue("username", demoUsername);
      form.setValue("email", demoEmail);
      form.setValue("password", demoPassword);
      form.setValue("accept_terms", true);

      // Submit
      await onSubmit({
        username: demoUsername,
        email: demoEmail,
        password: demoPassword,
        referral_code: undefined,
        accept_terms: true,
      });
    } catch (error) {
      console.error("[RegisterForm] Demo registration error:", error);
      setIsSubmitting(false);
      setIsRedirecting(false);
    }
  };

  const passwordValue = form.watch("password");

  // Show loading state during redirect
  if (isRedirecting) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <EarniqLogo href="/" />
          <div className="space-y-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Creating your dashboard...
              </h2>
              <p className="text-sm text-muted-foreground">
                We're setting everything up for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Logo and Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <EarniqLogo href="/" />
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create your Earniq account</h1>
          <p className="text-base text-muted-foreground">
            Track tasks, referrals, and withdrawals in one place.
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Server error message */}
          {form.formState.errors.root && (
            <div
              className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
              aria-live="polite"
            >
              {form.formState.errors.root.message}
            </div>
          )}

          <FormField
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="register-username">Username</FormLabel>
                <FormControl>
                  <Input
                    id="register-username"
                    placeholder="john_doe"
                    autoComplete="username"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.error ? "register-username-error" : undefined}
                    disabled={isSubmitting}
                    className={cn(
                      fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage id="register-username-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="register-email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="register-email"
                    placeholder="john@example.com"
                    type="email"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.error ? "register-email-error" : undefined}
                    disabled={isSubmitting}
                    className={cn(
                      fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage id="register-email-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="register-password">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="register-password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.error
                        ? "register-password-error"
                        : passwordValue
                          ? "register-password-hint"
                          : undefined
                    }
                    disabled={isSubmitting}
                    showStrengthIndicator={true}
                    onStrengthChange={setPasswordStrength}
                    className={cn(
                      fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage id="register-password-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referral_code"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="register-referral-code">
                  Referral Code <span className="font-normal text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="register-referral-code"
                    placeholder="SPARK123"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.error ? "register-referral-error" : "register-referral-hint"}
                    disabled={isSubmitting}
                    className={cn(
                      fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().trim();
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <p id="register-referral-hint" className="text-xs text-muted-foreground">
                  If someone invited you, add their code so they earn too.
                </p>
                <FormMessage id="register-referral-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accept_terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    id="accept_terms"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel
                    htmlFor="accept_terms"
                    className="text-sm font-normal cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </Link>
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Creating account..." : "Create your account"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </Form>

      {/* Demo Account Button */}
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
        onClick={handleDemoRegister}
        disabled={isSubmitting}
        aria-label="Create a demo account instantly"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Create demo account
      </Button>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

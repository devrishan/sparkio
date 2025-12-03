"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { login as authLogin, isAuthenticated } from "@/lib/auth";
import { useSession } from "@/components/providers/session-provider";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { EarniqLogo } from "./EarniqLogo";
import { PasswordInput } from "./PasswordInput";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Please enter a valid email."),
  password: z.string().min(1, "Password is required.").min(8, "Use at least 8 characters."),
  keep_me_signed_in: z.boolean().optional().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || searchParams?.get("redirect");
  const redirectPath = nextPath || "/member/dashboard";
  const { status, user, refetch } = useSession();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      keep_me_signed_in: false,
    },
    mode: "onBlur", // Validate on blur for inline feedback
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && user) {
      // Determine redirect based on user role
      const destination = user.role === "admin" ? "/admin/dashboard" : redirectPath;
      router.push(destination as any);
    } else if (status === "loading") {
      // Check mock auth while SessionProvider is loading
      if (isAuthenticated()) {
        // Wait a bit for SessionProvider to catch up, then redirect
        const timer = setTimeout(() => {
          // Double-check authentication status before redirecting
          // (SessionProvider might have updated by now)
          if (isAuthenticated()) {
            router.push(redirectPath as any);
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [status, user, router, redirectPath]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      // Use new auth utilities
      const result = await authLogin(values.email, values.password);

      if (!result.success || !result.session) {
        throw new Error(result.error || "Login failed");
      }

      toast.success("Welcome back!", { description: "You are now signed in." });

      // Determine redirect based on user role from session
      const userRole = result.session?.user?.role || 
        (values.email.toLowerCase().includes("admin") || values.email.toLowerCase() === "admin@earniq.app" ? "admin" : "member");
      const destination = userRole === "admin" ? "/admin/dashboard" : redirectPath;

      // Refetch session to update SessionProvider (with timeout to prevent hanging)
      try {
        await Promise.race([
          refetch(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Session refresh timeout")), 2000)
          ),
        ]);
      } catch (refetchError) {
        console.warn("[LoginForm] Session refetch failed or timed out:", refetchError);
        // Continue anyway - localStorage is already set
      }

      // Redirect immediately after a short delay
      setTimeout(() => {
        router.push(destination as any);
        // Reset submitting state as fallback
        setIsSubmitting(false);
      }, 100);
    } catch (error) {
      console.error("[LoginForm] Login error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast.error("Login failed", { description: errorMessage });
      form.setError("root", { message: errorMessage });
      setIsSubmitting(false);
    }
  };

  // Demo account handler
  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      // Use demo credentials
      const demoEmail = "demo@example.com";
      const demoPassword = "demo12345";

      // Prefill form
      form.setValue("email", demoEmail);
      form.setValue("password", demoPassword);

      // Submit
      await onSubmit({
        email: demoEmail,
        password: demoPassword,
        keep_me_signed_in: false,
      });
    } catch (error) {
      console.error("[LoginForm] Demo login error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Logo and Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <EarniqLogo href="/" />
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back to Earniq</h1>
          <p className="text-base text-muted-foreground">
            Sign in to see your dashboard, wallet, and tasks.
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
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="login-email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="login-email"
                    placeholder="john@example.com"
                    type="email"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.error ? "login-email-error" : undefined}
                    disabled={isSubmitting}
                    className={cn(
                      fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage id="login-email-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="login-password">Password</FormLabel>
                  <ForgotPasswordDialog />
                </div>
                <FormControl>
                  <PasswordInput
                    id="login-password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.error ? "login-password-error" : undefined}
                    disabled={isSubmitting}
                    className={cn(
                      fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...field}
                    onKeyDown={(e) => {
                      // Allow form submission on Enter key (works on both desktop and mobile)
                      if (e.key === "Enter" && !isSubmitting) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage id="login-password-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keep_me_signed_in"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    id="keep_me_signed_in"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel
                    htmlFor="keep_me_signed_in"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Keep me signed in
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Stay logged in for 30 days
                  </p>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Signing in..." : "Sign in to your account"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              "Sign in"
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
        onClick={handleDemoLogin}
        disabled={isSubmitting}
        aria-label="Use demo account to sign in instantly"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Use demo account
      </Button>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        New to Earniq?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

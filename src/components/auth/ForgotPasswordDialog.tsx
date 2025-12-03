"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Please enter a valid email."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordDialogProps {
  trigger?: React.ReactNode;
}

export function ForgotPasswordDialog({ trigger }: ForgotPasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);

    try {
      // Mock password reset flow - simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      toast.success("Reset link sent!", {
        description: `We've sent a password reset link to ${values.email}. Please check your inbox.`,
      });

      setIsSubmitted(true);
      form.reset();

      // Close dialog after 3 seconds
      setTimeout(() => {
        setOpen(false);
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("[ForgotPassword] Error:", error);
      toast.error("Failed to send reset link", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <button
      type="button"
      className="text-xs font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
    >
      Forgot password?
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Check your email</h3>
              <p className="text-sm text-muted-foreground">
                We've sent a password reset link to your email address.
              </p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel htmlFor="forgot-email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="forgot-email"
                        placeholder="john@example.com"
                        type="email"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.error ? "forgot-email-error" : undefined}
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage id="forgot-email-error" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                aria-label={isSubmitting ? "Sending reset link..." : "Send reset link"}
              >
                {isSubmitting ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </Form>
        )}

        {!isSubmitted && (
          <p className="text-xs text-center text-muted-foreground">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Sign in
            </button>
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}


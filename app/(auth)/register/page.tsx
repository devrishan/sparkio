"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { SparkioLogo } from "@/components/shared/logo";

const registerSchema = z.object({
  username: z.string().min(3, "Choose a username with at least 3 characters."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
  referral_code: z.string().trim().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      referral_code: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          referral_code: values.referral_code?.toUpperCase() || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unable to register." }));
        throw new Error(error.error || "Unable to register.");
      }

      return (await response.json()) as { user: { role: "member" | "admin" } };
    },
    onSuccess: ({ user }) => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Account created", { description: "Welcome to Sparkio!" });
      router.replace(user.role === "admin" ? "/admin/dashboard" : "/member/dashboard");
    },
    onError: (error: Error) => {
      toast.error("Registration failed", { description: error.message });
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <SparkioLogo />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Join Sparkio</h1>
          <p className="text-sm text-muted-foreground">Invite friends, grow your network, and earn rewards.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="john_doe" autoComplete="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@sparkio.app" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referral_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referral Code (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="SPARK123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

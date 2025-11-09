"use client";

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { SparkioLogo } from "@/components/shared/logo";
import { env } from "@/lib/env";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get("redirect") ?? "/member/dashboard";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unable to login." }));
        throw new Error(error.error || "Unable to login.");
      }

      return (await response.json()) as { user: { role: "member" | "admin" } };
    },
    onSuccess: ({ user }) => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Welcome back!", { description: "You are now signed in." });
      const destination = user.role === "admin" ? "/admin/dashboard" : redirectPath;
      router.replace(destination as any);
    },
    onError: (error: Error) => {
      toast.error("Login failed", { description: error.message });
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <SparkioLogo />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to track your referrals and earnings.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@sparkio.app" type="email" autoComplete="email" {...field} />
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
                  <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing in..." : "Continue"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        New to Sparkio?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}


"use client";

import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

const MAX_WITHDRAWAL_AMOUNT = 100;

const schema = z.object({
  amount: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      return typeof value === "number" ? value : Number(value);
    },
    z
      .number({ invalid_type_error: "Enter a valid amount." })
      .min(1, "Minimum withdrawal is ₹1.")
      .max(MAX_WITHDRAWAL_AMOUNT, `Maximum withdrawal is ₹${MAX_WITHDRAWAL_AMOUNT}.`),
  ),
  upi_id: z.string().min(5, "Enter a valid UPI ID."),
});

type WithdrawFormValues = z.infer<typeof schema>;

interface MemberWithdrawFormProps {
  balance: number;
}

export function MemberWithdrawForm({ balance }: MemberWithdrawFormProps) {
  const router = useRouter();
  const maxAmount = balance > 0 ? Math.min(balance, MAX_WITHDRAWAL_AMOUNT) : MAX_WITHDRAWAL_AMOUNT;

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 1,
      upi_id: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: WithdrawFormValues) => {
      const response = await fetch("/api/member/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json().catch(() => ({ success: false, error: "Unable to submit." }));

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to submit withdrawal.");
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Withdrawal requested", {
        description: "We will process your UPI payout shortly.",
      });
      form.reset();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error("Withdrawal failed", { description: error.message });
    },
  });

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur">
      <div>
        <h3 className="text-xl font-semibold text-foreground">Request Withdrawal</h3>
        <p className="text-sm text-muted-foreground">
          Available balance <span className="font-medium text-foreground">₹{balance.toFixed(2)}</span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min={1}
                    max={maxAmount}
                    placeholder="100.00"
                    value={field.value === undefined || Number.isNaN(field.value) ? "" : field.value}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      field.onChange(event.target.value === "" ? undefined : Number(event.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="upi_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPI ID</FormLabel>
                <FormControl>
                  <Input placeholder="username@upi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit Withdrawal"}
          </Button>
        </form>
      </Form>
    </div>
  );
}


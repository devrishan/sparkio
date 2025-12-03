"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Download, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { getMockToken } from "@/lib/auth";
import { useSession } from "@/components/providers/session-provider";

const schema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .transform((value) => parseFloat(value))
    .refine((value) => !isNaN(value) && value > 0, "Enter a positive amount")
    .refine((value) => value >= 100, "Minimum withdrawal is ₹100")
    .refine((value) => value <= 1000000, "Maximum withdrawal is ₹10,00,000"),
  upi_id: z
    .string()
    .min(5, "Enter a valid UPI ID")
    .regex(/^[\w.-]+@[\w]+$/, "Invalid UPI ID format (e.g., username@upi)"),
});

type WithdrawFormValues = z.infer<typeof schema>;

interface Withdrawal {
  id: string;
  amount: number;
  upiId: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  conformanceTime: number | null; // in hours
}

interface WithdrawHistoryResponse {
  withdrawals: Withdrawal[];
}

async function fetchWithdrawHistory(): Promise<WithdrawHistoryResponse> {
  const token = getMockToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch("/api/mocks/member/withdraw", {
    credentials: "include",
    headers: {
      "x-mock-token": token,
    },
  });

  if (response.status === 401) {
    // Redirect to login on 401
    if (typeof window !== "undefined") {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    throw new Error("Failed to fetch withdrawal history");
  }

  return response.json();
}

async function submitWithdrawal(values: WithdrawFormValues): Promise<{ success: boolean; withdrawal: Withdrawal }> {
  const token = getMockToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch("/api/mocks/member/withdraw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-mock-token": token,
    },
    credentials: "include",
    body: JSON.stringify({
      amount: values.amount,
      upiId: values.upi_id,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to submit withdrawal" }));
    throw new Error(error.error || "Failed to submit withdrawal");
  }

  return response.json();
}

function downloadReceipt(withdrawal: Withdrawal) {
  // Generate CSV receipt
  const rows = [
    ["Withdrawal Receipt", ""],
    ["", ""],
    ["Withdrawal ID", withdrawal.id],
    ["Amount", `₹${withdrawal.amount.toFixed(2)}`],
    ["UPI ID", withdrawal.upiId],
    ["Status", withdrawal.status.toUpperCase()],
    ["Requested At", new Date(withdrawal.requestedAt).toLocaleString()],
    ...(withdrawal.approvedAt ? [["Approved At", new Date(withdrawal.approvedAt).toLocaleString()]] : []),
    ...(withdrawal.rejectedAt ? [["Rejected At", new Date(withdrawal.rejectedAt).toLocaleString()]] : []),
    ...(withdrawal.conformanceTime ? [["Conformance Time", `${withdrawal.conformanceTime.toFixed(2)} hours`]] : []),
  ];

  const csvContent = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `withdrawal-${withdrawal.id}-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getStatusBadge(status: Withdrawal["status"]) {
  switch (status) {
    case "approved":
      return (
        <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/20">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/20">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-500/20 text-red-600 border-red-500/20">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      );
  }
}

export function MemberWithdrawClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const balance = user?.wallet || 0;

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: "",
      upi_id: "",
    },
  });

  const { data: historyData, isLoading: historyLoading } = useQuery<WithdrawHistoryResponse>({
    queryKey: ["withdrawal-history"],
    queryFn: fetchWithdrawHistory,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: submitWithdrawal,
    onSuccess: () => {
      toast.success("Withdrawal requested", {
        description: "We will process your UPI payout shortly.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["withdrawal-history"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error("Withdrawal failed", { description: error.message });
    },
  });

  const maxAmount = Math.min(balance, 1000000);
  const minAmount = 100;

  return (
    <div className="space-y-6">
      {/* Withdrawal Form */}
      <Card className="border-border bg-card/80 shadow-lg">
        <CardHeader>
          <CardTitle>Request Withdrawal</CardTitle>
          <CardDescription>
            Available balance: <span className="font-medium text-foreground">₹{balance.toFixed(2)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        min={minAmount}
                        max={maxAmount}
                        placeholder="100.00"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                          // Validate against balance
                          const numValue = parseFloat(value);
                          if (!isNaN(numValue) && numValue > balance) {
                            form.setError("amount", {
                              type: "manual",
                              message: `Amount cannot exceed available balance (₹${balance.toFixed(2)})`,
                            });
                          } else {
                            form.clearErrors("amount");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Minimum: ₹{minAmount.toLocaleString()} | Maximum: ₹{maxAmount.toLocaleString()}
                    </p>
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
                    <p className="text-xs text-muted-foreground">Format: username@upi (e.g., john@paytm)</p>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={mutation.isPending || balance < minAmount}>
                {mutation.isPending ? "Submitting..." : "Submit Withdrawal"}
              </Button>
              {balance < minAmount && (
                <p className="text-sm text-muted-foreground text-center">
                  You need at least ₹{minAmount} to make a withdrawal.
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Track all your withdrawal requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-2">
              <LoadingSkeleton className="h-12" />
              <LoadingSkeleton className="h-12" />
              <LoadingSkeleton className="h-12" />
            </div>
          ) : historyData && historyData.withdrawals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>UPI ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Conformance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData.withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-medium">₹{withdrawal.amount.toFixed(2)}</TableCell>
                      <TableCell className="font-mono text-sm">{withdrawal.upiId}</TableCell>
                      <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(withdrawal.requestedAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {withdrawal.approvedAt
                          ? new Date(withdrawal.approvedAt).toLocaleString()
                          : withdrawal.rejectedAt
                            ? new Date(withdrawal.rejectedAt).toLocaleString()
                            : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {withdrawal.conformanceTime
                          ? `${withdrawal.conformanceTime.toFixed(2)} hours`
                          : withdrawal.status === "pending"
                            ? "Pending"
                            : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadReceipt(withdrawal)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No withdrawals yet</h3>
              <p className="text-sm text-muted-foreground">
                Your withdrawal history will appear here once you make your first request.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


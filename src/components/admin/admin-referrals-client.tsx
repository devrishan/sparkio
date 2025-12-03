"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Filter, XCircle, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { getMockToken } from "@/lib/auth";

interface AdminReferral {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  referral: {
    id: string;
    username: string;
    phone: string;
  };
  status: "verified" | "pending" | "rejected";
  userReward: number;
  ourReward: number;
  profit: number;
  date: string;
  platform: string;
}

interface AdminReferralsResponse {
  success: boolean;
  referrals: AdminReferral[];
  summary: {
    totalUserPayouts: number;
    totalIncoming: number;
    totalProfit: number;
    totalReferrals: number;
    verifiedReferrals: number;
    pendingReferrals: number;
    rejectedReferrals: number;
  };
}

async function fetchAdminReferrals(status?: string): Promise<AdminReferralsResponse> {
  const token = getMockToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const url = status && status !== "all"
    ? `/api/mocks/admin/referrals?status=${status}`
    : "/api/mocks/admin/referrals";

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "x-mock-token": token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch referrals");
  }

  return response.json();
}

const statusBadge: Record<AdminReferral["status"], string> = {
  verified: "bg-green-500/20 text-green-600 border-green-500/20",
  pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/20",
  rejected: "bg-red-500/20 text-red-600 border-red-500/20",
};

export function AdminReferralsClient() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<AdminReferralsResponse>({
    queryKey: ["adminReferrals", statusFilter],
    queryFn: () => fetchAdminReferrals(statusFilter),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async ({ referralId, newStatus }: { referralId: string; newStatus: "verified" | "rejected" }) => {
      // Mock update - in real app this would call an API
      return { success: true, referralId, newStatus };
    },
    onSuccess: (_, { newStatus }) => {
      toast.success("Referral updated", {
        description: `Referral marked as ${newStatus}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["adminReferrals"] });
    },
    onError: (error: Error) => {
      toast.error("Update failed", { description: error.message });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="h-48" />
        <LoadingSkeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load referrals</h3>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "An error occurred while loading referrals"}
        </p>
      </div>
    );
  }

  const referrals = data?.referrals || [];
  const summary = data?.summary;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total User Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{summary.totalUserPayouts.toLocaleString()}</div>
              <CardDescription className="text-xs mt-1">Paid to users for referrals</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Incoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{summary.totalIncoming.toLocaleString()}</div>
              <CardDescription className="text-xs mt-1">Total revenue from referrals</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{summary.totalProfit.toLocaleString()}</div>
              <CardDescription className="text-xs mt-1">Net profit (Incoming - Payouts)</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{summary.totalReferrals}</div>
              <CardDescription className="text-xs mt-1">
                {summary.verifiedReferrals} verified, {summary.pendingReferrals} pending
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Referrals Table */}
      <Card className="border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-4 sm:p-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Referral Pipeline</h2>
            <p className="text-sm text-muted-foreground">
              Review member invites, verify commissions, and keep quality high.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Referral</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">User Reward</TableHead>
                <TableHead className="text-right">Our Reward</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No referrals found
                  </TableCell>
                </TableRow>
              ) : (
                referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{referral.user.username}</div>
                        <div className="text-xs text-muted-foreground">{referral.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{referral.referral.username}</div>
                        <div className="text-xs text-muted-foreground">{referral.referral.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge[referral.status]}>
                        {referral.status === "verified" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {referral.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                        {referral.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">₹{referral.userReward}</TableCell>
                    <TableCell className="text-right font-medium text-primary">₹{referral.ourReward}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">₹{referral.profit}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{referral.platform}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(referral.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {referral.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => mutation.mutate({ referralId: referral.id, newStatus: "verified" })}
                              disabled={mutation.isPending}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => mutation.mutate({ referralId: referral.id, newStatus: "rejected" })}
                              disabled={mutation.isPending}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

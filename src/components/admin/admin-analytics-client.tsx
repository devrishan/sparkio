"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { AlertCircle, TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react";
import { getMockToken } from "@/lib/auth";

interface NaviAnalytics {
  summary: {
    totalNaviReferrals: number;
    coinsPerReferral: number;
    userSharePerReferral: number;
    ourSharePerReferral: number;
    totalOurProfit: number;
    totalPaidToUsers: number;
    avgReferralsPerUser: number;
  };
  breakdown: Array<{
    refId: string;
    userId: string;
    username: string;
    naviCoins: number;
    naviAmount: number;
    userPayout: number;
    ourProfit: number;
    status: "pending" | "verified" | "rejected";
    createdAt: string;
  }>;
}

async function fetchNaviAnalytics(): Promise<NaviAnalytics> {
  const token = getMockToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch("/api/mocks/admin/analytics", {
    credentials: "include",
    headers: {
      "x-mock-token": token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}

function getStatusBadge(status: string) {
  switch (status) {
    case "verified":
      return (
        <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/20">
          Verified
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/20">
          Pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-500/20 text-red-600 border-red-500/20">
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export function AdminAnalyticsClient() {
  const [sortBy, setSortBy] = useState<"profit" | "payout" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, error } = useQuery<NaviAnalytics>({
    queryKey: ["adminAnalytics"],
    queryFn: fetchNaviAnalytics,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
        <LoadingSkeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load analytics</h3>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "An error occurred while loading analytics"}
        </p>
      </div>
    );
  }

  const summary = data?.summary;
  const breakdown = data?.breakdown || [];

  // Sort breakdown
  const sortedBreakdown = [...breakdown].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "profit":
        comparison = a.ourProfit - b.ourProfit;
        break;
      case "payout":
        comparison = a.userPayout - b.userPayout;
        break;
      case "date":
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Navi Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{summary.totalNaviReferrals}</div>
              <CardDescription className="text-xs mt-1">
                {summary.avgReferralsPerUser.toFixed(1)} avg per user
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total Our Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{summary.totalOurProfit.toLocaleString()}</div>
              <CardDescription className="text-xs mt-1">
                ₹{summary.ourSharePerReferral} per referral
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Paid to Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{summary.totalPaidToUsers.toLocaleString()}</div>
              <CardDescription className="text-xs mt-1">
                ₹{summary.userSharePerReferral} per referral
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Navi Amount Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ₹{(summary.totalOurProfit + summary.totalPaidToUsers).toLocaleString()}
              </div>
              <CardDescription className="text-xs mt-1">
                {summary.coinsPerReferral} coins = ₹{summary.ourSharePerReferral + summary.userSharePerReferral}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Profit Breakdown</CardTitle>
          <CardDescription>
            Detailed breakdown of Navi referrals showing user payouts and platform profit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <label className="text-sm font-medium">Sort by:</label>
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "profit" | "payout" | "date")}
            >
              <option value="date">Date</option>
              <option value="profit">Profit</option>
              <option value="payout">User Payout</option>
            </select>
            <button
              className="rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Navi Coins</TableHead>
                  <TableHead className="text-right">Navi Amount</TableHead>
                  <TableHead className="text-right">User Payout</TableHead>
                  <TableHead className="text-right">Our Profit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBreakdown.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No Navi referrals found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedBreakdown.map((item) => (
                    <TableRow key={item.refId}>
                      <TableCell className="font-mono text-sm">{item.refId.slice(-8)}</TableCell>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>{item.naviCoins.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">₹{item.naviAmount}</TableCell>
                      <TableCell className="text-right font-medium text-primary">₹{item.userPayout}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">₹{item.ourProfit}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

/**
 * Member Wallet Page
 * 
 * TO REPLACE MOCKS WITH REAL API:
 * 1. Replace useMockData hook with your API call:
 *    const { data, isLoading } = useQuery({
 *      queryKey: ['wallet'],
 *      queryFn: () => fetch('/api/member/wallet').then(r => r.json())
 *    });
 * 
 * 2. Update API endpoint: /api/member/wallet
 * 3. Expected response shape: { balance, coins, totalEarned, todayChange, transactions[], earningsByCategory }
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, TrendingUp, TrendingDown, Download, ArrowUpRight } from "lucide-react";
import { useMockData, loadMockJson } from "@/hooks/useMockData";
import { formatAmount } from "@/lib/utils";

interface WalletData {
  balance: number;
  coins: number;
  totalEarned: number;
  todayChange: number;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    timestamp: string;
    status: string;
  }>;
  earningsByCategory: {
    tasks: number;
    referrals: number;
    bonuses: number;
    withdrawn: number;
  };
}

export default function MemberWalletPage() {
  const { data: walletData, isLoading } = useMockData<WalletData>(
    () => loadMockJson("wallet")
  );

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "withdrawal":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "referral":
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (isLoading || !walletData) {
    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Wallet</p>
        <h1 className="text-3xl font-semibold text-white">Your Wallet</h1>
        <p className="text-sm text-muted-foreground">
          Manage your earnings, view transactions, and track your balance.
        </p>
      </header>

      {/* Wallet Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-orange-500/40 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Balance</CardTitle>
            <Wallet className="h-5 w-5 text-orange-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatAmount(walletData.balance)}</div>
            <p className="text-xs text-white/70 mt-1">Available for withdrawal</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/40 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Coins</CardTitle>
            <span className="text-2xl">🪙</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{walletData.coins.toLocaleString()}</div>
            <p className="text-xs text-white/70 mt-1">Redeemable coins</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Earned</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatAmount(walletData.totalEarned)}</div>
            <p className="text-xs text-white/70 mt-1">All-time earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Earnings Summary</CardTitle>
              <CardDescription>Breakdown of your earnings by category</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">From Tasks</p>
              <p className="text-2xl font-bold text-white">{formatAmount(walletData.earningsByCategory.tasks)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">From Referrals</p>
              <p className="text-2xl font-bold text-white">{formatAmount(walletData.earningsByCategory.referrals)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bonuses</p>
              <p className="text-2xl font-bold text-white">{formatAmount(walletData.earningsByCategory.bonuses)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Withdrawn</p>
              <p className="text-2xl font-bold text-white">{formatAmount(walletData.earningsByCategory.withdrawn)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your wallet transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/member/withdraw"}>
              Withdraw <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletData.transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No transactions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  walletData.transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(tx.type)}
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{tx.description}</TableCell>
                      <TableCell>
                        <span className={tx.amount >= 0 ? "text-green-500" : "text-red-500"}>
                          {tx.amount >= 0 ? "+" : ""}{formatAmount(tx.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
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


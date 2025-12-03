"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/providers/session-provider";
import { getMockToken, logout as authLogout } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton, WalletSkeleton } from "@/components/LoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Download,
  Zap,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { GamificationCard } from "@/components/member/gamification-card";
import { AnimatedEarningsCounter } from "@/components/shared";

interface DashboardData {
  wallet: {
    balance: number;
    todayChange: number;
  };
  payoutPulse: {
    avgApprovalTime: string;
    fastestWithdrawal: string;
    pendingDisputes: number;
  };
  referralStats: {
    verified: number;
    weeklyReleases: number;
  };
  recentTasks: Array<{
    id: string;
    title: string;
    status: "approved" | "pending" | "rejected";
    reward: number;
  }>;
}

interface GamificationData {
  coins: number;
  level: "Newbie" | "Pro" | "Elite";
  currentXP: number;
  nextLevelXP: number;
  streakDays: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    icon: string;
  }>;
}

async function fetchGamification(): Promise<GamificationData> {
  const token = getMockToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch("/api/mocks/member/gamification", {
    credentials: "include",
    headers: {
      "x-mock-token": token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch gamification data");
  }

  return response.json();
}

async function fetchDashboard(): Promise<DashboardData> {
  const token = getMockToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch("/api/mocks/dashboard", {
    credentials: "include",
    headers: {
      "x-mock-token": token,
    },
  });

  if (response.status === 401) {
    // Force logout on 401
    authLogout("/login");
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatAmount(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function MemberDashboardPage() {
  const router = useRouter();
  const { user } = useSession();

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    retry: false,
  });

  const { data: gamificationData, isLoading: isGamificationLoading } = useQuery<GamificationData>({
    queryKey: ["gamification"],
    queryFn: fetchGamification,
    retry: false,
    staleTime: 30000, // 30 seconds
  });

  // Handle download receipt
  const handleDownloadReceipt = () => {
    if (!data) return;

    // Generate simple CSV receipt
    const csvContent = [
      "Earniq Wallet Receipt",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "Summary",
      `Balance: ${formatAmount(data.wallet.balance)}`,
      `Today's Change: ${formatAmount(data.wallet.todayChange)}`,
      `Verified Referrals: ${data.referralStats.verified}`,
      "",
      "Recent Tasks",
      ...data.recentTasks.map((task) =>
        `${task.title},${task.status},${formatAmount(task.reward)}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earniq-receipt-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Receipt downloaded", {
      description: "Your wallet receipt has been downloaded.",
    });
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <header className="space-y-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <WalletSkeleton key={i} />
          ))}
        </div>
        <LoadingSkeleton className="h-48" />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track your earnings, tasks, and referrals in one place.
          </p>
        </header>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Failed to load dashboard
            </CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : "An error occurred while loading your dashboard."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.refresh()}>Try again</Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const walletChange = data.wallet.todayChange;
  const isPositiveChange = walletChange >= 0;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your earnings, tasks, and referrals in one place.
        </p>
      </header>

      {/* Wallet Snapshot Card */}
      <Card className="border-border bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wallet Snapshot</CardTitle>
          <Wallet className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="space-y-1">
              <div className="text-3xl font-bold">
                <AnimatedEarningsCounter value={data.wallet.balance} decimals={2} />
              </div>
              <div className="flex items-center gap-2 text-sm">
                {isPositiveChange ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={isPositiveChange ? "text-green-600" : "text-red-600"}>
                  {isPositiveChange ? "+" : ""}{formatAmount(Math.abs(walletChange))} today
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadReceipt}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Gamification Card */}
        <GamificationCard data={gamificationData} isLoading={isGamificationLoading} />
        
        {/* Payout Pulse */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payout Pulse</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Avg Approval</span>
              <span className="text-sm font-medium">{data.payoutPulse.avgApprovalTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Fastest Withdrawal</span>
              <span className="text-sm font-medium">{data.payoutPulse.fastestWithdrawal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Pending Disputes</span>
              <Badge variant="outline">{data.payoutPulse.pendingDisputes}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Referral Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Stats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Verified</span>
              <span className="text-2xl font-bold text-green-600">{data.referralStats.verified}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Weekly Releases</span>
              <span className="text-sm font-medium">{formatCurrency(data.referralStats.weeklyReleases)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentTasks.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.recentTasks.filter((t) => t.status === "approved").length} approved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>Your latest task submissions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No tasks yet. Check out available tasks to start earning!
            </p>
          ) : (
            <div className="space-y-3">
              {data.recentTasks.map((task) => {
                const statusColors = {
                  approved: "bg-green-500/10 text-green-600 border-green-500/20",
                  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
                };

                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {task.status === "approved" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                      {task.status === "pending" && <Clock className="h-5 w-5 text-yellow-600" />}
                      {task.status === "rejected" && <AlertCircle className="h-5 w-5 text-red-600" />}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Reward: {formatAmount(task.reward)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusColors[task.status]}
                    >
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => router.push("/member/tasks")}
          >
            View All Tasks <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

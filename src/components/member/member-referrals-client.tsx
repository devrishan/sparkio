"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Clock, Copy, Share2, Check } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { toast } from "@/components/ui/sonner";
import { useSession } from "@/components/providers/session-provider";

interface Referral {
  id: string;
  referred_user: {
    id: string;
    username: string | null;
    email: string | null;
    phone: string;
    created_at: string;
  };
  level: number;
  status: string;
  commission_amount: number;
  created_at: string;
  updated_at: string;
}

interface ReferralStats {
  total: number;
  verified: number;
  pending: number;
  total_commission: number;
}

interface ReferralChain {
  referrer: { id: string; referralCode: string; username: string | null } | null;
  direct_referrals: Array<{ id: string; referralCode: string; username: string | null }>;
}

interface ReferralData {
  referrals: Referral[];
  stats: ReferralStats;
  chain: ReferralChain;
  tree: ReferralLevel[] | null;
}

interface ReferralLevel {
  level: number;
  userId: string;
  referralCode: string;
  username: string | null;
  phone: string;
}

// Simplified referral interface matching /api/mocks/referrals
interface MockReferral {
  id: string;
  name: string;
  phone: string; // Already masked
  status: "verified" | "pending" | "rejected";
  reward: number;
  createdAt: string;
}

async function getMemberReferralsClient(statusFilter?: string): Promise<MockReferral[]> {
  const params = new URLSearchParams();
  if (statusFilter && statusFilter !== "all") {
    params.append("status", statusFilter);
  }

  // Try mock API first
  const token = typeof window !== "undefined" ? localStorage.getItem("mockToken") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["x-mock-token"] = token;
  }

  const response = await fetch(`/api/mocks/referrals?${params.toString()}`, {
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    // Fallback to existing API
    try {
      const fallbackResponse = await fetch(`/api/member/referrals?${params.toString()}`, {
        credentials: "include",
      });
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        // Convert to MockReferral format
        return (fallbackData.referrals || []).map((r: any) => ({
          id: r.id,
          name: r.referred_user?.username || r.referred_user?.name || `User ${r.referred_user?.phone?.slice(-4) || ""}`,
          phone: r.referred_user?.phone ? `xxxxxx${r.referred_user.phone.slice(-3)}` : "xxxxxx000",
          status: r.status || "pending",
          reward: r.commission_amount || 0,
          createdAt: r.created_at || r.referred_user?.created_at || new Date().toISOString(),
        }));
      }
    } catch {
      // Ignore fallback errors
    }

    const errorData = await response.json().catch(() => ({ error: "Failed to fetch referrals" }));
    throw new Error(errorData.error || "Failed to fetch referrals");
  }

  return response.json();
}

function getStatusBadge(status: string) {
  switch (status) {
    case "verified":
      return (
        <Badge variant="outline" className="bg-green-500/20 text-green-600">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-500/20 text-red-600">
          <AlertCircle className="mr-1 h-3 w-3" /> Rejected
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getLevelBadge(level: number) {
  const colors = {
    1: "bg-blue-500/20 text-blue-600",
    2: "bg-green-500/20 text-green-600",
    3: "bg-purple-500/20 text-purple-600",
  };
  return (
    <Badge variant="outline" className={colors[level as keyof typeof colors] || ""}>
      L{level}
    </Badge>
  );
}

export function MemberReferralsClient() {
  const router = useRouter();
  const { user } = useSession();
  const [showTree, setShowTree] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Generate referral link
  const referralLink = useMemo(() => {
    const code = user?.referral_code || "DEMO001";
    return `https://r.navi.com/${code}`;
  }, [user]);

  const { data, isLoading, error } = useQuery<MockReferral[]>({
    queryKey: ["memberReferrals", statusFilter],
    queryFn: () => getMemberReferralsClient(statusFilter),
  });

  // Copy referral link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedId("main");
      toast.success("Link copied!", { description: "Referral link copied to clipboard" });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy", { description: "Could not copy link to clipboard" });
    }
  };

  // Share via WhatsApp
  const handleWhatsAppShare = () => {
    const code = user?.referral_code || "DEMO001";
    const text = `Join Earniq and earn rewards. Use my code: ${code}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Copy individual referral's link (if applicable)
  const handleCopyReferralLink = async (referralId: string) => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedId(referralId);
      toast.success("Link copied!", { description: "Referral link copied to clipboard" });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy", { description: "Could not copy link to clipboard" });
    }
  };

  const referrals = data || [];

  // Calculate stats from current referrals
  const stats = useMemo(() => {
    const total = referrals.length;
    const verified = referrals.filter((r) => r.status === "verified").length;
    const pending = referrals.filter((r) => r.status === "pending").length;
    const rejected = referrals.filter((r) => r.status === "rejected").length;
    const totalCommission = referrals
      .filter((r) => r.status === "verified")
      .reduce((sum, r) => sum + r.reward, 0);

    return { total, verified, pending, rejected, totalCommission };
  }, [referrals]);

  // Filter referrals by status (client-side since API may already filter)
  const filteredReferrals = useMemo(() => {
    if (statusFilter === "all") return referrals;
    return referrals.filter((r) => r.status === statusFilter);
  }, [referrals, statusFilter]);

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

  return (
    <div className="space-y-6">
      {/* Referral Link Share Section */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn rewards when friends join</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg border bg-background p-3">
            <code className="flex-1 text-sm font-mono text-foreground break-all">{referralLink}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              className="shrink-0"
              aria-label="Copy referral link"
            >
              {copiedId === "main" ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex-1"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              onClick={handleWhatsAppShare}
              className="flex-1"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share on WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{stats.totalCommission.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>Users who joined using your referral code</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="verified">Verified ({stats.verified})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              {stats.rejected > 0 && <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>}
            </TabsList>
          </Tabs>

          {/* Referrals Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Reward</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      {statusFilter === "all" 
                        ? "No referrals yet. Start sharing your referral code!"
                        : `No ${statusFilter} referrals found.`}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReferrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <span className="font-medium">{referral.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground font-mono">{referral.phone}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(referral.status)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{referral.reward.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyReferralLink(referral.id)}
                          aria-label="Copy referral link"
                        >
                          {copiedId === referral.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
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


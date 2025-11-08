import { useState, useEffect } from "react";
import { Users, TrendingUp, Zap, Gift } from "lucide-react";
import { WalletCard } from "@/components/WalletCard";
import { StatsCard } from "@/components/StatsCard";
import { ReferralList } from "@/components/ReferralList";
import { Leaderboard } from "@/components/Leaderboard";
import { UploadProofDialog } from "@/components/UploadProofDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  WalletSkeleton,
  StatsCardSkeleton,
  ReferralListSkeleton,
  LeaderboardSkeleton,
} from "@/components/LoadingSkeleton";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [balance] = useState(145);
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const mockReferrals = [
    {
      id: "1",
      name: "Rahul Sharma",
      amount: 50,
      status: "verified" as const,
      date: "2 hours ago",
    },
    {
      id: "2",
      name: "Priya Patel",
      amount: 40,
      status: "verified" as const,
      date: "5 hours ago",
    },
    {
      id: "3",
      name: "Amit Kumar",
      amount: 35,
      status: "pending" as const,
      date: "1 day ago",
    },
    {
      id: "4",
      name: "Sneha Desai",
      amount: 20,
      status: "rejected" as const,
      date: "2 days ago",
    },
  ];

  const mockLeaderboard = [
    { rank: 1, name: "Vikram Singh", earnings: 2450, referrals: 49 },
    { rank: 2, name: "Anjali Mehta", earnings: 2100, referrals: 42 },
    { rank: 3, name: "You", earnings: 145, referrals: 3 },
    { rank: 4, name: "Rohan Gupta", earnings: 890, referrals: 18 },
    { rank: 5, name: "Kavya Iyer", earnings: 650, referrals: 13 },
  ];

  const handleWithdraw = () => {
    toast({
      title: "Ready to withdraw? Let's spark that joy.",
      description: "Enter your UPI ID to receive ₹145 instantly.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/20 p-1.5 sm:p-2 glow-sm">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Sparkio</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-primary/30 bg-primary/5 px-2 sm:px-4 py-1.5 sm:py-2">
              <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary animate-pulse-glow" />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                <span className="hidden sm:inline">3 Active Referrals</span>
                <span className="sm:hidden">3 Active</span>
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, Champ! 🔥
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Every tap is a win. Keep that energy flowing.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column - Main Actions */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            {loading ? (
              <>
                <WalletSkeleton />
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatsCardSkeleton />
                  <StatsCardSkeleton />
                  <StatsCardSkeleton />
                </div>
                <ReferralListSkeleton />
              </>
            ) : (
              <>
                {/* Wallet Card */}
                <WalletCard balance={balance} onWithdraw={handleWithdraw} />

                {/* Stats Grid */}
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 sm:gap-4">
                  <StatsCard
                    title="Total Earned"
                    value={`₹${balance}`}
                    subtitle="+₹50 this week"
                    icon={TrendingUp}
                    trend="up"
                  />
                  <StatsCard
                    title="Referrals"
                    value={3}
                    subtitle="1 pending"
                    icon={Users}
                    trend="neutral"
                  />
                  <div className="col-span-2 sm:col-span-1">
                    <StatsCard
                      title="Success Rate"
                      value="75%"
                      subtitle="3 of 4 verified"
                      icon={Zap}
                      trend="up"
                    />
                  </div>
                </div>

                {/* Upload Button */}
                <div className="animate-float">
                  <UploadProofDialog />
                </div>

                {/* Referral List */}
                <ReferralList referrals={mockReferrals} />
              </>
            )}
          </div>

          {/* Right Column - Leaderboard */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {loading ? (
                <LeaderboardSkeleton />
              ) : (
                <Leaderboard entries={mockLeaderboard} currentUserRank={3} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 border-t border-border bg-card/50 py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p>Powered by trust. Energized by you.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

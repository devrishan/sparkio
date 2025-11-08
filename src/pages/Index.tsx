import { useState } from "react";
import { Users, TrendingUp, Zap, Gift } from "lucide-react";
import { WalletCard } from "@/components/WalletCard";
import { StatsCard } from "@/components/StatsCard";
import { ReferralList } from "@/components/ReferralList";
import { Leaderboard } from "@/components/Leaderboard";
import { UploadProofDialog } from "@/components/UploadProofDialog";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [balance] = useState(145);

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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/20 p-2 glow-sm">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Sparkio</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2">
            <Gift className="h-4 w-4 text-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-foreground">3 Active Referrals</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Welcome back, Champ! 🔥
          </h2>
          <p className="text-muted-foreground">
            Every tap is a win. Keep that energy flowing.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Actions */}
          <div className="space-y-6 lg:col-span-2">
            {/* Wallet Card */}
            <WalletCard balance={balance} onWithdraw={handleWithdraw} />

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
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
              <StatsCard
                title="Success Rate"
                value="75%"
                subtitle="3 of 4 verified"
                icon={Zap}
                trend="up"
              />
            </div>

            {/* Upload Button */}
            <div className="animate-float">
              <UploadProofDialog />
            </div>

            {/* Referral List */}
            <ReferralList referrals={mockReferrals} />
          </div>

          {/* Right Column - Leaderboard */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Leaderboard entries={mockLeaderboard} currentUserRank={3} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by trust. Energized by you.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

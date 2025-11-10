import { MemberReferralsTable } from "@/components/member/member-referrals-table";
import { ReferralActions } from "@/components/member/referral-actions";
import { ReferralInsightsChart } from "@/components/member/referral-insights-chart";
import { StatsCard } from "@/components/StatsCard";
import { getMemberReferrals } from "@/services/member";
import { Users, TrendingUp } from "lucide-react";

export default async function MemberReferralsPage() {
  const referrals = await getMemberReferrals();

  // Mock data for demo
  const referralLink = "https://earniq.app/ref/USER123";
  const referralCode = "USER123";
  const totalEarnings = referrals.reduce((sum, ref) => sum + ref.commission_amount, 0);

  const chartData = [
    { week: "W1", referrals: 2 },
    { week: "W2", referrals: 5 },
    { week: "W3", referrals: 3 },
    { week: "W4", referrals: 8 },
    { week: "W5", referrals: 4 },
    { week: "W6", referrals: 6 },
    { week: "W7", referrals: 7 },
    { week: "W8", referrals: 10 },
  ];

  return (
    <section className="space-y-4 sm:space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Referrals</h1>
        <p className="text-sm text-muted-foreground">Manage referrals and track your earnings</p>
      </header>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatsCard
          title="Total Referrals"
          value={referrals.length.toString()}
          icon={Users}
          subtitle={`${referrals.filter(r => r.status === "verified").length} verified`}
          trend="up"
        />
        <StatsCard
          title="Total Earnings"
          value={`₹${totalEarnings.toFixed(2)}`}
          icon={TrendingUp}
          subtitle="From referrals"
          trend="up"
        />
      </div>

      {/* Action Buttons */}
      <ReferralActions referralLink={referralLink} referralCode={referralCode} />

      {/* Referrals Table */}
      <MemberReferralsTable referrals={referrals} />

      {/* Insights Chart */}
      <ReferralInsightsChart data={chartData} />
    </section>
  );
}


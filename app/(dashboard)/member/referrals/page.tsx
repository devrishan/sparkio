import { MemberReferralsTable } from "@/components/member/member-referrals-table";
import { getMemberReferrals } from "@/services/member";

export default async function MemberReferralsPage() {
  const referrals = await getMemberReferrals();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Referrals</h1>
        <p className="text-sm text-muted-foreground">See who joined using your code and monitor their status.</p>
      </header>

      <MemberReferralsTable referrals={referrals} />
    </section>
  );
}


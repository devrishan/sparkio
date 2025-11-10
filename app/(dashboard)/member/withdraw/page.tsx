import { WalletBalanceCard } from "@/components/member/wallet-balance-card";
import { TransactionList } from "@/components/member/transaction-list";
import { WithdrawWithQr } from "@/components/member/withdraw-with-qr";
import { getMemberDashboard } from "@/services/member";

export default async function MemberWithdrawPage() {
  const dashboard = await getMemberDashboard();

  // Mock transaction data
  const transactions = [
    {
      id: "1",
      type: "credit" as const,
      amount: 50,
      status: "completed" as const,
      description: "Referral Commission",
      date: new Date("2025-01-05"),
    },
    {
      id: "2",
      type: "debit" as const,
      amount: 100,
      status: "pending" as const,
      description: "UPI Withdrawal",
      date: new Date("2025-01-10"),
    },
    {
      id: "3",
      type: "credit" as const,
      amount: 25,
      status: "completed" as const,
      description: "Bonus Reward",
      date: new Date("2025-01-08"),
    },
  ];

  // Mock wallet data
  const totalBalance = dashboard.wallet.total_earned;
  const pendingBalance = 50;
  const availableBalance = dashboard.wallet.balance;

  return (
    <section className="space-y-4 sm:space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Wallet & Withdraw</h1>
        <p className="text-sm text-muted-foreground">
          Manage your earnings and request withdrawals
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <WalletBalanceCard
            totalBalance={totalBalance}
            pendingBalance={pendingBalance}
            availableBalance={availableBalance}
          />
          <WithdrawWithQr availableBalance={availableBalance} />
        </div>

        <TransactionList transactions={transactions} />
      </div>
    </section>
  );
}


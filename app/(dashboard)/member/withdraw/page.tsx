import { WalletBalanceCard } from "@/components/member/wallet-balance-card";
import { TransactionList } from "@/components/member/transaction-list";
import { WithdrawWithQr } from "@/components/member/withdraw-with-qr";
import { getMemberDashboard } from "@/services/member";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatCurrency, maskUpiId } from "@/lib/format";

export default async function MemberWithdrawPage() {
  const dashboard = await getMemberDashboard();

  // Mock transaction history with timestamps
  const withdrawalHistory = [
    {
      id: "WD001",
      amount: 100,
      upiId: "user@paytm",
      status: "completed",
      requestedAt: "2025-01-05 10:30 AM",
      approvedAt: "2025-01-05 11:15 AM",
      conformedAt: "2025-01-05 11:45 AM",
    },
    {
      id: "WD002",
      amount: 50,
      upiId: "user@phonepe",
      status: "pending",
      requestedAt: "2025-01-10 02:20 PM",
      approvedAt: null,
      conformedAt: null,
    },
    {
      id: "WD003",
      amount: 75,
      upiId: "user@paytm",
      status: "rejected",
      requestedAt: "2025-01-08 09:00 AM",
      approvedAt: null,
      conformedAt: null,
      rejectionReason: "Invalid UPI ID format",
    },
  ];

  const totalBalance = dashboard.wallet.total_earned;
  const pendingBalance = 50;
  const availableBalance = dashboard.wallet.balance;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Wallet & Withdraw</h1>
        <p className="text-sm text-muted-foreground">
          Manage your earnings and request withdrawals
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <WalletBalanceCard
            totalBalance={totalBalance}
            pendingBalance={pendingBalance}
            availableBalance={availableBalance}
          />
          <WithdrawWithQr availableBalance={availableBalance} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>
              Track all your withdrawal requests with complete timestamps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {withdrawalHistory.map((withdrawal) => (
              <Card key={withdrawal.id} className="border-l-4" style={{
                borderLeftColor: withdrawal.status === "completed" ? "hsl(var(--primary))" : 
                               withdrawal.status === "rejected" ? "hsl(var(--destructive))" : 
                               "hsl(var(--muted-foreground))"
              }}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-lg">{formatCurrency(withdrawal.amount)}</div>
                      <div className="text-sm text-muted-foreground">
                        UPI: {maskUpiId(withdrawal.upiId)}
                      </div>
                    </div>
                    <Badge variant={
                      withdrawal.status === "completed" ? "default" :
                      withdrawal.status === "rejected" ? "destructive" :
                      "secondary"
                    }>
                      {withdrawal.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {withdrawal.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                      {withdrawal.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {withdrawal.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Requested: {withdrawal.requestedAt}</div>
                    {withdrawal.approvedAt && (
                      <div>Approved: {withdrawal.approvedAt}</div>
                    )}
                    {withdrawal.conformedAt && (
                      <div>Confirmed: {withdrawal.conformedAt}</div>
                    )}
                    {withdrawal.status === "rejected" && withdrawal.rejectionReason && (
                      <div className="text-destructive">Reason: {withdrawal.rejectionReason}</div>
                    )}
                  </div>

                  {withdrawal.status === "completed" && (
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Download PDF Receipt
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


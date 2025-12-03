"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, ErrorScreen, EmptyState, WithdrawalStatusBadge, TimestampList } from "@/components/shared";
import { getWithdrawalHistory } from "@/api/withdrawals";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { CheckCircle2, Wallet, XCircle } from "lucide-react";

export default function WithdrawalHistoryPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["withdrawal-history"],
    queryFn: () => getWithdrawalHistory(),
  });

  const handleDownloadReceipt = (receiptUrl: string | null, withdrawalId: string) => {
    if (receiptUrl) {
      window.open(receiptUrl, "_blank");
    } else {
      // Generate a simple receipt if backend doesn't provide one
      const receiptContent = `Earniq Withdrawal Receipt\n\nWithdrawal ID: ${withdrawalId}\nGenerated: ${new Date().toLocaleString()}\n\nThis is a temporary receipt. Please contact support for an official receipt.`;
      const blob = new Blob([receiptContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `withdrawal-receipt-${withdrawalId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return <Loader text="Loading withdrawal history..." />;
  }

  if (error) {
    return (
      <ErrorScreen
        title="Failed to load history"
        message="Unable to fetch your withdrawal history. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const withdrawals = data?.withdrawals || [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Withdrawal History</h1>
        <p className="text-sm text-muted-foreground">
          View all your withdrawal requests and their status
        </p>
      </header>

      {withdrawals.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No withdrawals yet"
          description="You haven't made any withdrawal requests. Start earning and withdraw your balance when ready."
          action={
            <Button asChild>
              <a href="/member/withdraw">Request Withdrawal</a>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => {
            const timestamps = [
              {
                label: "Requested",
                timestamp: withdrawal.requested_at,
                icon: FileText,
              },
              {
                label: "Approved",
                timestamp: withdrawal.approved_at,
                icon: CheckCircle2,
              },
              {
                label: "Paid",
                timestamp: withdrawal.paid_at,
                icon: Wallet,
              },
              {
                label: "Rejected",
                timestamp: withdrawal.rejected_at,
                icon: XCircle,
              },
            ].filter((item) => item.timestamp);

            return (
              <Card key={withdrawal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        ₹{withdrawal.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        UPI: {withdrawal.upi_id}
                      </CardDescription>
                    </div>
                    <WithdrawalStatusBadge status={withdrawal.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TimestampList items={timestamps} />
                  {withdrawal.receipt_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReceipt(withdrawal.receipt_url, withdrawal.id)}
                      className="w-full sm:w-auto"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF Receipt
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


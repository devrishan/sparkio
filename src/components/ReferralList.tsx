import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface Referral {
  id: string;
  name: string;
  amount: number;
  status: "verified" | "pending" | "rejected";
  date: string;
}

interface ReferralListProps {
  referrals: Referral[];
}

export const ReferralList = ({ referrals }: ReferralListProps) => {
  const statusConfig = {
    verified: {
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
      label: "Verified",
    },
    pending: {
      icon: Clock,
      color: "text-primary",
      bg: "bg-primary/10",
      label: "Pending",
    },
    rejected: {
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      label: "Rejected",
    },
  };

  return (
    <Card className="border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Referrals</h3>
      
      <div className="space-y-3">
        {referrals.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No referrals yet — your first spark is waiting.
            </p>
          </div>
        ) : (
          referrals.map((referral) => {
            const config = statusConfig[referral.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={referral.id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-all hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full ${config.bg} p-2`}>
                    <StatusIcon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{referral.name}</p>
                    <p className="text-xs text-muted-foreground">{referral.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-primary">+₹{referral.amount}</span>
                  <Badge variant="outline" className={config.bg}>
                    {config.label}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

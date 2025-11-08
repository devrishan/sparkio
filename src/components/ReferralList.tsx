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
    <Card className="border-border bg-card p-4 sm:p-6">
      <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-foreground">Recent Referrals</h3>
      
      <div className="space-y-2 sm:space-y-3">
        {referrals.length === 0 ? (
          <div className="py-6 sm:py-8 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
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
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 p-2.5 sm:p-3 transition-all hover:border-primary/30"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className={`rounded-full ${config.bg} p-1.5 sm:p-2 flex-shrink-0`}>
                    <StatusIcon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${config.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base text-foreground truncate">{referral.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{referral.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className="font-semibold text-sm sm:text-base text-primary">+₹{referral.amount}</span>
                  <Badge variant="outline" className={`${config.bg} text-[10px] sm:text-xs hidden sm:inline-flex`}>
                    {config.label}
                  </Badge>
                  <div className={`sm:hidden rounded-full ${config.bg} p-1`}>
                    <StatusIcon className={`h-3 w-3 ${config.color}`} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

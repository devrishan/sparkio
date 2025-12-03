"use client";

import * as React from "react";
import { Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { maskPhoneNumber } from "@/api/referrals";
import { format } from "date-fns";

export interface ReferralItemCardProps {
  phone: string;
  dateJoined: string;
  status: "pending" | "verified" | "rejected";
  commissionAmount?: number;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  verified: {
    icon: CheckCircle2,
    label: "Verified",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

export function ReferralItemCard({
  phone,
  dateJoined,
  status,
  commissionAmount,
}: ReferralItemCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const maskedPhone = maskPhoneNumber(phone);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{maskedPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(dateJoined), "MMM dd, yyyy")}</span>
            </div>
            {commissionAmount !== undefined && commissionAmount > 0 && (
              <div className="mt-2 text-sm font-medium text-primary">
                Commission: ₹{commissionAmount.toFixed(2)}
              </div>
            )}
          </div>
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}


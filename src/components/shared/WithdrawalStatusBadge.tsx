"use client";

import * as React from "react";
import { CheckCircle2, Clock, XCircle, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type WithdrawalStatus = "PENDING" | "APPROVED" | "PAID" | "REJECTED";

export interface WithdrawalStatusBadgeProps {
  status: WithdrawalStatus;
  className?: string;
}

const statusConfig: Record<WithdrawalStatus, { icon: React.ElementType; label: string; className: string }> = {
  PENDING: {
    icon: Clock,
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  APPROVED: {
    icon: CheckCircle2,
    label: "Approved",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  PAID: {
    icon: Wallet,
    label: "Paid",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  REJECTED: {
    icon: XCircle,
    label: "Rejected",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

export function WithdrawalStatusBadge({ status, className }: WithdrawalStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1", config.className, className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}


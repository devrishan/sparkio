"use client";

import * as React from "react";
import { format } from "date-fns";
import { Clock, CheckCircle2, Wallet, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimestampItem {
  label: string;
  timestamp: string | null;
  icon?: React.ElementType;
}

export interface TimestampListProps {
  items: TimestampItem[];
  className?: string;
}

export function TimestampList({ items, className }: TimestampListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const Icon = item.icon || Clock;
        return (
          <div key={index} className="flex items-center gap-3 text-sm">
            <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <span className="text-muted-foreground">{item.label}:</span>
              <span className="ml-2 font-medium">
                {item.timestamp ? format(new Date(item.timestamp), "MMM dd, yyyy 'at' hh:mm a") : "N/A"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}


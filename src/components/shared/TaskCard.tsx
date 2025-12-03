"use client";

import * as React from "react";
import { ArrowRight, Coins, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  type: string;
  rewardAmount: number;
  rewardCoins: number;
  status?: string;
  className?: string;
}

export function TaskCard({
  id,
  title,
  description,
  type,
  rewardAmount,
  rewardCoins,
  status,
  className,
}: TaskCardProps) {
  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{title}</CardTitle>
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          </div>
          {status && (
            <Badge variant="outline" className="ml-2">
              {status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          {rewardAmount > 0 && (
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              <DollarSign className="h-4 w-4" />
              <span>₹{rewardAmount.toFixed(2)}</span>
            </div>
          )}
          {rewardCoins > 0 && (
            <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
              <Coins className="h-4 w-4" />
              <span>{rewardCoins} coins</span>
            </div>
          )}
        </div>
        <Badge variant="secondary" className="text-xs">
          {type}
        </Badge>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="default">
          <Link href={`/member/tasks/${id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


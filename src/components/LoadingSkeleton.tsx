import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const WalletSkeleton = () => (
  <Card className="relative overflow-hidden border-border bg-card p-6">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
);

export const StatsCardSkeleton = () => (
  <Card className="border-border bg-card p-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-9 w-9 rounded-lg" />
    </div>
  </Card>
);

export const ReferralListSkeleton = () => (
  <Card className="border-border bg-card p-6">
    <Skeleton className="mb-4 h-6 w-40" />
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export const LeaderboardSkeleton = () => (
  <Card className="border-border bg-card p-6">
    <div className="mb-4 flex items-center justify-between">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-24" />
    </div>
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-12" />
        </div>
      ))}
    </div>
  </Card>
);

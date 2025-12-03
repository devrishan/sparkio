"use client";

import { Activity, Clock, TrendingUp, UserCheck, UserX } from "lucide-react";

import { SectionCard, StatusPill } from "@/components/dashboard";
import { getReferralActivity, type ReferralActivity, formatReferralDate, formatPoints } from "@/lib/mock-data/referrals";
import { cn } from "@/lib/utils";

export function ReferralActivityLog() {
  const activities = getReferralActivity();

  const getStatusIcon = (status: ReferralActivity["status"]) => {
    switch (status) {
      case "active":
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-400" />;
      case "dormant":
        return <UserX className="h-4 w-4 text-white/40" />;
      default:
        return <Activity className="h-4 w-4 text-white/50" />;
    }
  };

  const getStatusTone = (status: ReferralActivity["status"]): "success" | "pending" | "warning" => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "pending";
      case "dormant":
        return "warning";
      default:
        return "pending";
    }
  };

  if (activities.length === 0) {
    return (
      <SectionCard
        title="Referral Activity"
        subtitle="Track who joined using your referral link and the points you earned"
      >
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center">
          <Activity className="h-12 w-12 text-white/30 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No activity yet</h3>
          <p className="text-sm text-white/60 max-w-md">
            When friends join using your referral link, their activity and your earned points will appear here.
          </p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Referral Activity"
      subtitle="Track who joined using your referral link and the points you earned"
    >
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" role="table" aria-label="Referral activity log">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/70">
                Friend
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/70">
                Joined
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/70">
                Last Activity
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-white/70">
                Points Earned
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white/70">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className="transition-colors hover:bg-white/5"
                role="row"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(activity.status)}
                    <span className="font-medium text-white">{activity.friendName}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-white/70">
                  {formatReferralDate(activity.joinedDate)}
                </td>
                <td className="px-4 py-4 text-sm text-white/70">
                  {activity.lastActivity ? formatReferralDate(activity.lastActivity) : "—"}
                </td>
                <td className="px-4 py-4 text-right">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      activity.pointsEarned > 0 ? "text-emerald-400" : "text-white/50",
                    )}
                  >
                    {activity.pointsEarned > 0 ? "+" : ""}
                    {formatPoints(activity.pointsEarned)}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <StatusPill
                    label={activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    tone={getStatusTone(activity.status)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/5 p-2">
                  {getStatusIcon(activity.status)}
                </div>
                <div>
                  <p className="font-semibold text-white">{activity.friendName}</p>
                  <p className="text-xs text-white/60">Joined {formatReferralDate(activity.joinedDate)}</p>
                </div>
              </div>
              <StatusPill
                label={activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                tone={getStatusTone(activity.status)}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                {activity.lastActivity && (
                  <p className="text-xs text-white/60">
                    Last active: {formatReferralDate(activity.lastActivity)}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60">Points earned</p>
                <p
                  className={cn(
                    "text-base font-bold",
                    activity.pointsEarned > 0 ? "text-emerald-400" : "text-white/50",
                  )}
                >
                  {activity.pointsEarned > 0 ? "+" : ""}
                  {formatPoints(activity.pointsEarned)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}


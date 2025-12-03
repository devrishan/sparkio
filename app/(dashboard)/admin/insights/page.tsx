"use client";

import { useMemo, useState } from "react";
import { Search, AlertTriangle, CreditCard, Share2, Megaphone, Shield, ArrowUpRight, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";

import { SectionCard, StatCard, StatusPill } from "@/components/dashboard";
import { cn } from "@/lib/utils";

type TimeRange = "1h" | "6h" | "24h" | "7d";
type EventType = "All" | "Flagged" | "UPI" | "Referral" | "Campaign" | "Moderator Action";

type EventSeverity = "low" | "medium" | "high";

interface InsightEvent {
  id: string;
  timestamp: string; // e.g., "12 mins ago"
  eventType: Exclude<EventType, "All">;
  description: string;
  severity: EventSeverity;
  linkTo?: {
    type: "task" | "campaign" | "user";
    id: string;
    label: string;
  };
}

const MOCK_INSIGHTS_EVENTS: InsightEvent[] = [
  {
    id: "INS-1001",
    timestamp: "2 mins ago",
    eventType: "Flagged",
    description: "User USR-4821 flagged for duplicate proof image",
    severity: "high",
    linkTo: { type: "task", id: "TASK-92184", label: "View task" },
  },
  {
    id: "INS-1002",
    timestamp: "8 mins ago",
    eventType: "UPI",
    description: "UPI transaction verified: ₹320 payout processed to mohit.v@upi",
    severity: "low",
    linkTo: { type: "user", id: "USR-4756", label: "View user" },
  },
  {
    id: "INS-1003",
    timestamp: "15 mins ago",
    eventType: "Referral",
    description: "New referral chain: USR-4691 referred USR-4823 (Level 2)",
    severity: "low",
  },
  {
    id: "INS-1004",
    timestamp: "22 mins ago",
    eventType: "Campaign",
    description: "Campaign 'Navi UPI Rush' reached 60% budget threshold",
    severity: "medium",
    linkTo: { type: "campaign", id: "CAMP-001", label: "View campaign" },
  },
  {
    id: "INS-1005",
    timestamp: "35 mins ago",
    eventType: "Moderator Action",
    description: "Admin-203 approved 5 tasks in batch review",
    severity: "low",
  },
  {
    id: "INS-1006",
    timestamp: "48 mins ago",
    eventType: "Flagged",
    description: "Auto-flag triggered: Same IP used 6 times today (182.70.14.11)",
    severity: "high",
  },
  {
    id: "INS-1007",
    timestamp: "1h ago",
    eventType: "UPI",
    description: "UPI withdrawal blocked: UTR reuse detected (UTR1283840)",
    severity: "high",
  },
  {
    id: "INS-1008",
    timestamp: "1h 15 mins ago",
    eventType: "Referral",
    description: "Referral milestone: User USR-4512 reached 50 referrals",
    severity: "low",
  },
  {
    id: "INS-1009",
    timestamp: "1h 30 mins ago",
    eventType: "Campaign",
    description: "Campaign 'Weekend Surge' started: 950 tasks allocated",
    severity: "low",
    linkTo: { type: "campaign", id: "CAMP-003", label: "View campaign" },
  },
  {
    id: "INS-1010",
    timestamp: "2h ago",
    eventType: "Moderator Action",
    description: "Admin-177 suspended user USR-4756 for KYC mismatch",
    severity: "high",
    linkTo: { type: "user", id: "USR-4756", label: "View user" },
  },
  {
    id: "INS-1011",
    timestamp: "2h 20 mins ago",
    eventType: "Flagged",
    description: "Task TASK-92031 flagged: Copy does not match approved template",
    severity: "medium",
    linkTo: { type: "task", id: "TASK-92031", label: "View task" },
  },
  {
    id: "INS-1012",
    timestamp: "3h ago",
    eventType: "UPI",
    description: "Bulk UPI payout: 12 transactions processed (₹3,240 total)",
    severity: "low",
  },
  {
    id: "INS-1013",
    timestamp: "4h ago",
    eventType: "Referral",
    description: "Top referrer alert: Aarav J. earned ₹4,820 this week",
    severity: "low",
  },
  {
    id: "INS-1014",
    timestamp: "5h ago",
    eventType: "Campaign",
    description: "Campaign 'Influencer Sprint' completed: 94.8% conversion rate",
    severity: "low",
    linkTo: { type: "campaign", id: "CAMP-004", label: "View campaign" },
  },
  {
    id: "INS-1015",
    timestamp: "6h ago",
    eventType: "Moderator Action",
    description: "Admin-112 reviewed 15 tasks: 12 approved, 3 rejected",
    severity: "low",
  },
];

const getEventTypeIcon = (type: Exclude<EventType, "All">) => {
  switch (type) {
    case "Flagged":
      return <AlertTriangle className="h-4 w-4 text-yellow-300" />;
    case "UPI":
      return <CreditCard className="h-4 w-4 text-blue-300" />;
    case "Referral":
      return <Share2 className="h-4 w-4 text-purple-300" />;
    case "Campaign":
      return <Megaphone className="h-4 w-4 text-orange-300" />;
    case "Moderator Action":
      return <Shield className="h-4 w-4 text-emerald-300" />;
  }
};

const getEventTypeTone = (type: Exclude<EventType, "All">): StatusPill["tone"] => {
  switch (type) {
    case "Flagged":
      return "warning";
    case "UPI":
      return "info";
    case "Referral":
      return "brand";
    case "Campaign":
      return "success";
    case "Moderator Action":
      return "info";
    default:
      return "brand";
  }
};

const getSeverityColor = (severity: EventSeverity) => {
  switch (severity) {
    case "high":
      return "border-l-red-500 bg-red-500/5";
    case "medium":
      return "border-l-yellow-500 bg-yellow-500/5";
    case "low":
      return "border-l-white/20 bg-white/5";
  }
};

const formatTimeRange = (range: TimeRange) => {
  switch (range) {
    case "1h":
      return "Last 1 hour";
    case "6h":
      return "Last 6 hours";
    case "24h":
      return "Last 24 hours";
    case "7d":
      return "Last 7 days";
  }
};

export default function AdminInsightsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = useMemo(() => {
    let filtered = MOCK_INSIGHTS_EVENTS;

    if (eventTypeFilter !== "All") {
      filtered = filtered.filter((event) => event.eventType === eventTypeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.id.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.eventType.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [eventTypeFilter, searchQuery]);

  const summaryStats = [
    {
      label: "Flagged events today",
      value: MOCK_INSIGHTS_EVENTS.filter((e) => e.eventType === "Flagged").length.toString(),
      hint: "Requires review",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-300" />,
      accent: "from-yellow-500/10 via-yellow-500/0 to-transparent",
    },
    {
      label: "Approvals this week",
      value: "142",
      hint: "Tasks approved",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-300" />,
      accent: "from-emerald-500/10 via-emerald-500/0 to-transparent",
    },
    {
      label: "Most active campaign",
      value: "Navi UPI Rush",
      hint: "892 completions",
      icon: <TrendingUp className="h-4 w-4 text-orange-300" />,
      accent: "from-orange-500/10 via-orange-500/0 to-transparent",
    },
    {
      label: "Avg. review time",
      value: "18 min",
      hint: "This week",
      icon: <Clock className="h-4 w-4 text-blue-300" />,
      accent: "from-blue-500/10 via-blue-500/0 to-transparent",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Platform Insights</p>
        <h1 className="text-3xl font-semibold text-white">Track events, trends, and operational signals across Sparkio</h1>
        <p className="text-sm text-muted-foreground">Real-time visibility into platform behavior and system events.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            icon={stat.icon}
            accent={stat.accent}
          />
        ))}
      </section>

      <SectionCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-white/60">Time range</span>
            <div className="flex flex-wrap gap-1.5">
              {(["1h", "6h", "24h", "7d"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition",
                    timeRange === range
                      ? "border-orange-500/70 bg-orange-500/15 text-white shadow-inner"
                      : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30"
                  )}
                >
                  {formatTimeRange(range)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-white/60">Event type</span>
            <div className="flex flex-wrap gap-1.5">
              {(["All", "Flagged", "UPI", "Referral", "Campaign", "Moderator Action"] as EventType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventTypeFilter(type)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition",
                    eventTypeFilter === type
                      ? "border-emerald-500/70 bg-emerald-500/15 text-white shadow-inner"
                      : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <label className="relative flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 focus-within:border-white/30 focus-within:text-white">
            <Search className="h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events or ID"
              className="bg-transparent text-white placeholder:text-white/50 focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-6 space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center">
              <p className="text-sm text-muted-foreground">No events found matching your filters.</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border-l-4 border-white/10 bg-white/5 p-4 transition hover:bg-white/10",
                  getSeverityColor(event.severity)
                )}
              >
                <div className="mt-0.5 shrink-0">{getEventTypeIcon(event.eventType)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <StatusPill label={event.eventType} tone={getEventTypeTone(event.eventType)} />
                    <span className="text-xs text-white/60">{event.timestamp}</span>
                    <span className="text-xs text-white/40">•</span>
                    <span className="text-xs font-mono text-white/50">{event.id}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{event.description}</p>
                  {event.linkTo && (
                    <button
                      type="button"
                      onClick={() => {
                        const path =
                          event.linkTo?.type === "task"
                            ? `/admin/tasks`
                            : event.linkTo?.type === "campaign"
                            ? `/admin/campaigns`
                            : `/admin/members`;
                        alert(`Would navigate to ${path} (${event.linkTo?.id}) in production`);
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-orange-300 transition hover:text-orange-200"
                    >
                      {event.linkTo.label}
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
}


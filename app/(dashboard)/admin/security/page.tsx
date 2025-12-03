"use client";

import { useState } from "react";
import { AlertTriangle, Shield, ShieldCheck, Clock, ToggleLeft, ToggleRight, Activity, Plus, X } from "lucide-react";

import { SectionCard, StatCard, StatusPill } from "@/components/dashboard";
import { cn } from "@/lib/utils";

type AuditEventType = "Rejected" | "Suspended" | "Flagged" | "Blocked" | "Approved" | "Login" | "Rule Triggered";

interface AuditEvent {
  id: string;
  date: string;
  eventType: AuditEventType;
  actor: string;
  affectedUser?: string;
  affectedTask?: string;
  ipAddress: string;
  details?: string;
}

interface FraudRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface SuspiciousActivity {
  id: string;
  message: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
}

interface ModerationTrigger {
  id: string;
  conditionType: string;
  threshold: number;
  action: string;
  enabled: boolean;
}

type ConditionType = "Same IP count" | "Duplicate proof" | "Device fingerprint" | "UPI reuse" | "Withdrawal velocity" | "KYC mismatch";
type ActionType = "Auto-flag" | "Auto-reject" | "Auto-block" | "Require review" | "Suspend user";

const SECURITY_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "AUD-1001",
    date: "Aug 22 · 14:32",
    eventType: "Rejected",
    actor: "Admin-203",
    affectedTask: "TASK-92184",
    ipAddress: "103.211.35.218",
    details: "Task rejected due to duplicate proof image",
  },
  {
    id: "AUD-1002",
    date: "Aug 22 · 13:15",
    eventType: "Flagged",
    actor: "System",
    affectedUser: "USR-4821",
    ipAddress: "182.70.14.11",
    details: "Auto-flagged: Same IP used 6 times today",
  },
  {
    id: "AUD-1003",
    date: "Aug 22 · 12:48",
    eventType: "Suspended",
    actor: "Admin-177",
    affectedUser: "USR-4756",
    ipAddress: "49.32.18.90",
    details: "User suspended for KYC mismatch",
  },
  {
    id: "AUD-1004",
    date: "Aug 22 · 11:22",
    eventType: "Blocked",
    actor: "System",
    affectedTask: "TASK-92052",
    ipAddress: "14.141.78.119",
    details: "Withdrawal blocked: UTR reused in last 30 days",
  },
  {
    id: "AUD-1005",
    date: "Aug 22 · 10:05",
    eventType: "Rule Triggered",
    actor: "System",
    affectedUser: "USR-4691",
    ipAddress: "52.95.120.6",
    details: "Fraud rule: Duplicate UPI detected",
  },
  {
    id: "AUD-1006",
    date: "Aug 22 · 09:18",
    eventType: "Approved",
    actor: "Admin-112",
    affectedTask: "TASK-92075",
    ipAddress: "203.145.67.89",
    details: "Task approved after manual review",
  },
  {
    id: "AUD-1007",
    date: "Aug 22 · 08:42",
    eventType: "Login",
    actor: "Admin-203",
    ipAddress: "103.211.35.218",
    details: "Admin login from new device",
  },
  {
    id: "AUD-1008",
    date: "Aug 21 · 23:15",
    eventType: "Flagged",
    actor: "System",
    affectedTask: "TASK-92031",
    ipAddress: "182.70.14.11",
    details: "Auto-flagged: Proof image hash matches previous submission",
  },
];

const FRAUD_RULES: FraudRule[] = [
  {
    id: "RULE-001",
    name: "Duplicate proof image detection",
    description: "Reject task if proof image is reused across users",
    enabled: true,
  },
  {
    id: "RULE-002",
    name: "IP velocity limit",
    description: "Auto-flag task if submitted from same IP 5+ times/day",
    enabled: true,
  },
  {
    id: "RULE-003",
    name: "UTR reuse blocker",
    description: "Block withdrawal if UTR is reused in last 30 days",
    enabled: true,
  },
  {
    id: "RULE-004",
    name: "Device fingerprint tracking",
    description: "Flag suspicious device patterns across multiple accounts",
    enabled: false,
  },
  {
    id: "RULE-005",
    name: "KYC mismatch auto-suspend",
    description: "Automatically suspend account on KYC verification failure",
    enabled: true,
  },
  {
    id: "RULE-006",
    name: "Velocity alert for withdrawals",
    description: "Flag if user requests >3 payouts in 30 minutes",
    enabled: true,
  },
];

const SUSPICIOUS_ACTIVITY: SuspiciousActivity[] = [
  {
    id: "ACT-001",
    message: "User USR-4821 triggered auto-flag for duplicate UPI",
    timestamp: "2h ago",
    severity: "high",
  },
  {
    id: "ACT-002",
    message: "Admin Admin-203 rejected 8 submissions in 30 mins",
    timestamp: "4h ago",
    severity: "medium",
  },
  {
    id: "ACT-003",
    message: "2 users submitted same proof image today",
    timestamp: "6h ago",
    severity: "high",
  },
  {
    id: "ACT-004",
    message: "IP 182.70.14.11 used across 6 different accounts",
    timestamp: "8h ago",
    severity: "medium",
  },
  {
    id: "ACT-005",
    message: "User USR-4756 attempted withdrawal with blocked UTR",
    timestamp: "12h ago",
    severity: "low",
  },
];

const getEventTypeTone = (type: AuditEventType): StatusPill["tone"] => {
  switch (type) {
    case "Rejected":
    case "Suspended":
    case "Blocked":
      return "danger";
    case "Flagged":
      return "warning";
    case "Approved":
      return "success";
    case "Login":
      return "info";
    case "Rule Triggered":
      return "brand";
    default:
      return "brand";
  }
};

const getSeverityColor = (severity: "low" | "medium" | "high") => {
  switch (severity) {
    case "high":
      return "text-red-300 border-red-500/30 bg-red-500/10";
    case "medium":
      return "text-orange-300 border-orange-500/30 bg-orange-500/10";
    case "low":
      return "text-yellow-300 border-yellow-500/30 bg-yellow-500/10";
  }
};

export default function AdminSecurityPage() {
  const [rules, setRules] = useState<FraudRule[]>(FRAUD_RULES);

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule))
    );
  };

  const securityStats = [
    {
      label: "Fraud alerts this week",
      value: "24",
      hint: "+3 vs last week",
      icon: <AlertTriangle className="h-4 w-4 text-red-300" />,
      accent: "from-red-500/10 via-red-500/0 to-transparent",
    },
    {
      label: "Blocked tasks",
      value: "12",
      hint: "Auto-blocked by rules",
      icon: <Shield className="h-4 w-4 text-orange-300" />,
      accent: "from-orange-500/10 via-orange-500/0 to-transparent",
    },
    {
      label: "Suspicious UPI activity",
      value: "8",
      hint: "Requires review",
      icon: <Activity className="h-4 w-4 text-yellow-300" />,
      accent: "from-yellow-500/10 via-yellow-500/0 to-transparent",
    },
    {
      label: "Avg. time to review",
      value: "18 min",
      hint: "Flagged submissions",
      icon: <Clock className="h-4 w-4 text-blue-300" />,
      accent: "from-blue-500/10 via-blue-500/0 to-transparent",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Security & Compliance</p>
        <h1 className="text-3xl font-semibold text-white">Monitor fraud risk, audit events, and platform rules</h1>
        <p className="text-sm text-muted-foreground">Track security events, manage fraud detection rules, and review suspicious activity.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {securityStats.map((stat) => (
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

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Audit log" subtitle="All security events and admin actions.">
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Event type</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Affected user/task</th>
                  <th className="px-4 py-3">IP address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#090C12]">
                {SECURITY_AUDIT_EVENTS.map((event) => (
                  <tr
                    key={event.id}
                    className={cn(
                      "text-sm text-muted-foreground transition hover:bg-white/5",
                      event.eventType === "Rejected" || event.eventType === "Suspended" || event.eventType === "Blocked"
                        ? "bg-red-500/5"
                        : event.eventType === "Flagged"
                        ? "bg-yellow-500/5"
                        : event.eventType === "Approved"
                        ? "bg-emerald-500/5"
                        : ""
                    )}
                  >
                    <td className="px-4 py-4 text-xs">{event.date}</td>
                    <td className="px-4 py-4">
                      <StatusPill label={event.eventType} tone={getEventTypeTone(event.eventType)} />
                    </td>
                    <td className="px-4 py-4 font-semibold text-white">{event.actor}</td>
                    <td className="px-4 py-4 text-xs">
                      {event.affectedUser && <span className="text-white">{event.affectedUser}</span>}
                      {event.affectedTask && <span className="text-white">{event.affectedTask}</span>}
                      {!event.affectedUser && !event.affectedTask && <span className="text-white/50">—</span>}
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-white/70">{event.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Suspicious activity feed" subtitle="Recent automated alerts and flags.">
          <div className="space-y-3">
            {SUSPICIOUS_ACTIVITY.map((activity) => (
              <div
                key={activity.id}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-xs",
                  getSeverityColor(activity.severity)
                )}
              >
                <p className="font-semibold">{activity.message}</p>
                <p className="mt-1 text-xs opacity-70">{activity.timestamp}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Fraud rules" subtitle="Automated detection and prevention rules.">
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-white">{rule.name}</p>
                  <StatusPill
                    label={rule.enabled ? "Active" : "Inactive"}
                    tone={rule.enabled ? "success" : "warning"}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{rule.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleRule(rule.id)}
                className="ml-4 flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
                aria-label={`${rule.enabled ? "Disable" : "Enable"} rule ${rule.name}`}
              >
                {rule.enabled ? (
                  <>
                    <ToggleRight className="h-4 w-4 text-emerald-300" />
                    Enabled
                  </>
                ) : (
                  <>
                    <ToggleLeft className="h-4 w-4 text-white/40" />
                    Disabled
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <ModerationTriggersBuilder />
    </div>
  );
}

function ModerationTriggersBuilder() {
  const [triggers, setTriggers] = useState<ModerationTrigger[]>([
    {
      id: "TRIG-001",
      conditionType: "Same IP count",
      threshold: 5,
      action: "Auto-flag",
      enabled: true,
    },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTrigger, setNewTrigger] = useState<Partial<ModerationTrigger>>({
    conditionType: "Same IP count",
    threshold: 3,
    action: "Auto-flag",
    enabled: true,
  });

  const conditionTypes: ConditionType[] = [
    "Same IP count",
    "Duplicate proof",
    "Device fingerprint",
    "UPI reuse",
    "Withdrawal velocity",
    "KYC mismatch",
  ];

  const actions: ActionType[] = ["Auto-flag", "Auto-reject", "Auto-block", "Require review", "Suspend user"];

  const handleCreateTrigger = () => {
    if (newTrigger.conditionType && newTrigger.action && newTrigger.threshold !== undefined) {
      const trigger: ModerationTrigger = {
        id: `TRIG-${Date.now()}`,
        conditionType: newTrigger.conditionType,
        threshold: newTrigger.threshold,
        action: newTrigger.action,
        enabled: newTrigger.enabled ?? true,
      };
      setTriggers([...triggers, trigger]);
      setNewTrigger({
        conditionType: "Same IP count",
        threshold: 3,
        action: "Auto-flag",
        enabled: true,
      });
      setIsCreating(false);
    }
  };

  const handleDeleteTrigger = (id: string) => {
    setTriggers(triggers.filter((t) => t.id !== id));
  };

  const handleToggleTrigger = (id: string) => {
    setTriggers(triggers.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
  };

  return (
    <SectionCard
      title="Moderation triggers builder"
      subtitle="Create custom rules with visual condition builders."
      actions={
        !isCreating ? (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
          >
            <Plus className="h-3.5 w-3.5" />
            New trigger
          </button>
        ) : null
      }
    >
      <div className="space-y-4">
        {isCreating && (
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Create new trigger</p>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="rounded-full border border-white/10 p-1 text-white/70 transition hover:border-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs text-white/60">If</label>
                <select
                  value={newTrigger.conditionType || ""}
                  onChange={(e) => setNewTrigger({ ...newTrigger, conditionType: e.target.value as ConditionType })}
                  className="w-full rounded-xl border border-white/10 bg-[#050712] px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                >
                  {conditionTypes.map((type) => (
                    <option key={type} value={type} className="bg-[#050712]">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs text-white/60">Threshold</label>
                <input
                  type="number"
                  value={newTrigger.threshold || ""}
                  onChange={(e) => setNewTrigger({ ...newTrigger, threshold: parseInt(e.target.value, 10) || 0 })}
                  placeholder="e.g., 3"
                  className="w-full rounded-xl border border-white/10 bg-[#050712] px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs text-white/60">Then</label>
                <select
                  value={newTrigger.action || ""}
                  onChange={(e) => setNewTrigger({ ...newTrigger, action: e.target.value as ActionType })}
                  className="w-full rounded-xl border border-white/10 bg-[#050712] px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                >
                  {actions.map((action) => (
                    <option key={action} value={action} className="bg-[#050712]">
                      {action}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTrigger}
                className="rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
              >
                Create trigger
              </button>
            </div>
          </div>
        )}

        {triggers.map((trigger) => (
          <div
            key={trigger.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-white">
                  If task has <span className="text-orange-300">{trigger.conditionType}</span> {">"}
                  {trigger.threshold}x, then <span className="text-emerald-300">{trigger.action}</span>
                </p>
                <StatusPill
                  label={trigger.enabled ? "Active" : "Inactive"}
                  tone={trigger.enabled ? "success" : "warning"}
                />
              </div>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleTrigger(trigger.id)}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
              >
                {trigger.enabled ? (
                  <>
                    <ToggleRight className="h-4 w-4 text-emerald-300" />
                    Enabled
                  </>
                ) : (
                  <>
                    <ToggleLeft className="h-4 w-4 text-white/40" />
                    Disabled
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTrigger(trigger.id)}
                className="rounded-full border border-red-500/40 bg-red-500/10 p-1.5 text-red-200 transition hover:border-red-500 hover:bg-red-500/20"
                aria-label="Delete trigger"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {triggers.length === 0 && !isCreating && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">No custom triggers yet. Create your first one above.</p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

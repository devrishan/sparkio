"use client";

import { useMemo, useState } from "react";
import { Search, Filter, ShieldCheck, AlertTriangle, Users, X, ToggleLeft, ToggleRight } from "lucide-react";

import { cn } from "@/lib/utils";

type KycStatus = "Verified" | "Unverified";
type MemberStatus = "Active" | "Suspended";

const members = [
  {
    name: "Lakshmi Menon",
    joined: "Jun 12, 2024",
    earnings: "₹38,200",
    lastTask: "UPI task · Aug 22",
    kyc: "Verified",
    status: "Active",
    referrals: 54,
    flags: "—",
    history: [
      "UPI payout approved · Aug 22 · ₹2,800",
      "Referral approved · Aug 21 · ₹160",
      "Task rejected · Aug 20 · proof mismatch",
    ],
  },
  {
    name: "Parth Wadhwa",
    joined: "May 02, 2024",
    earnings: "₹21,560",
    lastTask: "Social drop · Aug 21",
    kyc: "Verified",
    status: "Active",
    referrals: 33,
    flags: "—",
    history: [
      "Story proof approved · Aug 21 · ₹60",
      "Referral pending · Aug 20",
      "UPI task approved · Aug 20 · ₹320",
    ],
  },
  {
    name: "Chirag Patel",
    joined: "Jul 01, 2024",
    earnings: "₹12,400",
    lastTask: "App install · Aug 21",
    kyc: "Unverified",
    status: "Suspended",
    referrals: 12,
    flags: "Velocity spike · Aug 20",
    history: [
      "Account suspended · Aug 21 · risk",
      "KYC pending · Aug 20",
      "Referral rejected · Aug 20",
    ],
  },
  {
    name: "Raveena Dsouza",
    joined: "Apr 18, 2024",
    earnings: "₹47,600",
    lastTask: "Referral · Aug 22",
    kyc: "Verified",
    status: "Active",
    referrals: 71,
    flags: "—",
    history: [
      "Referral approved · Aug 22 · ₹120",
      "UPI payout processed · Aug 21 · ₹3,900",
      "Referral approved · Aug 21 · ₹95",
    ],
  },
  {
    name: "Naman Khurana",
    joined: "Mar 30, 2024",
    earnings: "₹8,320",
    lastTask: "UPI task · Aug 19",
    kyc: "Unverified",
    status: "Active",
    referrals: 8,
    flags: "Needs KYC follow-up",
    history: [
      "Reminder sent · Aug 21",
      "UPI pending · Aug 19",
      "Referral pending · Aug 19",
    ],
  },
];

export default function MemberManagementPage() {
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState<"All" | KycStatus>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | MemberStatus>("All");
  const [selectedMember, setSelectedMember] = useState<(typeof members)[number]>();

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.lastTask.toLowerCase().includes(search.toLowerCase());
      const matchesKyc = kycFilter === "All" || member.kyc === kycFilter;
      const matchesStatus = statusFilter === "All" || member.status === statusFilter;
      return matchesSearch && matchesKyc && matchesStatus;
    });
  }, [search, kycFilter, statusFilter]);

  return (
    <section className="space-y-8 text-white">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
          Member directory
        </p>
        <h1 className="text-3xl font-semibold">Accounts & health</h1>
        <p className="text-sm text-muted-foreground">
          Keep every earner verified, compliant, and active.
        </p>
      </header>

      <section className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-6 shadow-xl shadow-black/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 focus-within:border-white/30">
              <Search className="h-4 w-4" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search member or task"
                className="bg-transparent text-white placeholder:text-muted-foreground focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 focus-within:border-white/30">
              <Filter className="h-4 w-4" />
              KYC
              <select
                value={kycFilter}
                onChange={(event) => setKycFilter(event.target.value as "All" | KycStatus)}
                className="bg-transparent text-white focus:outline-none"
              >
                {["All", "Verified", "Unverified"].map((option) => (
                  <option key={option} value={option} className="bg-[#050507]">
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 focus-within:border-white/30">
              Status
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "All" | MemberStatus)
                }
                className="bg-transparent text-white focus:outline-none"
              >
                {["All", "Active", "Suspended"].map((option) => (
                  <option key={option} value={option} className="bg-[#050507]">
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-orange-300" />
            {filteredMembers.length} members shown
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Total earnings</th>
                <th className="px-4 py-3">Last task</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">KYC</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#090C12]">
              {filteredMembers.map((member) => (
                <tr
                  key={member.name}
                  className="text-sm text-muted-foreground transition hover:bg-white/5"
                >
                  <td className="px-4 py-4 font-semibold text-white">{member.name}</td>
                  <td className="px-4 py-4 text-xs">{member.joined}</td>
                  <td className="px-4 py-4 font-semibold text-white">{member.earnings}</td>
                  <td className="px-4 py-4 text-xs">{member.lastTask}</td>
                  <td className="px-4 py-4 text-xs">{member.flags}</td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                        member.kyc === "Verified"
                          ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                          : "border border-white/20 text-white"
                      )}
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {member.kyc}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                        member.status === "Active"
                          ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                          : "border border-red-500/40 bg-red-500/10 text-red-200"
                      )}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="rounded-full border border-orange-500/40 px-4 py-1.5 text-xs font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/10"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-[#090C12] p-6 shadow-2xl transition-transform duration-300",
          selectedMember ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedMember && (
          <div className="flex h-full flex-col space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
                  Member profile
                </p>
                <h2 className="text-2xl font-semibold text-white">{selectedMember.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Joined {selectedMember.joined} · {selectedMember.referrals} referrals
                </p>
              </div>
              <button
                onClick={() => setSelectedMember(undefined)}
                className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Overview</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-white">
                  <span>Total earnings</span>
                  <span>{selectedMember.earnings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last task</span>
                  <span>{selectedMember.lastTask}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>KYC</span>
                  <span>{selectedMember.kyc}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Flags</span>
                  <span>{selectedMember.flags}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-white">
                <AlertTriangle className="h-4 w-4 text-orange-300" />
                Task history
              </div>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                {selectedMember.history.map((entry) => (
                  <div key={entry} className="rounded-xl border border-white/5 bg-[#050507] px-3 py-2">
                    {entry}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Account status</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-white">{selectedMember.status}</span>
                <button className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs text-white transition hover:border-white/40">
                  {selectedMember.status === "Active" ? (
                    <>
                      <ToggleRight className="h-4 w-4 text-emerald-300" />
                      Suspend
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4 text-red-300" />
                      Activate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedMember && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedMember(undefined)}
        />
      )}
    </section>
  );
}

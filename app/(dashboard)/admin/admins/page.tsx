"use client";

import { useState } from "react";
import { ShieldCheck, UserRound, CheckCircle2, CircleSlash, X } from "lucide-react";

import { cn } from "@/lib/utils";

const admins = [
  { name: "Suhani Rao", role: "Super admin", lastLogin: "Aug 22 · 08:15", status: "Active" },
  { name: "Marcus Jose", role: "Finance ops", lastLogin: "Aug 22 · 07:42", status: "Active" },
  { name: "Devika Nair", role: "Support lead", lastLogin: "Aug 21 · 23:04", status: "Active" },
  { name: "Rohit Singh", role: "Fraud analyst", lastLogin: "Aug 21 · 19:10", status: "Suspended" },
  { name: "Ankita Patil", role: "Campaign ops", lastLogin: "Aug 21 · 17:22", status: "Active" },
];

export default function AdminManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Support lead" });

  return (
    <section className="space-y-8 text-white">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Access control</p>
          <h1 className="text-3xl font-semibold">Admin management</h1>
          <p className="text-sm text-muted-foreground">
            Control who can access payouts, submissions, and security tools.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/50 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
        >
          Invite new admin
        </button>
      </header>

      <section className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-6 shadow-xl shadow-black/50">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-orange-300" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Admin roster
            </p>
            <h2 className="text-xl font-semibold text-white">Active accounts</h2>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Last login</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#090C12]">
              {admins.map((admin) => (
                <tr key={admin.name} className="text-sm text-muted-foreground transition hover:bg-white/5">
                  <td className="px-4 py-4 font-semibold text-white">{admin.name}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white">
                      <UserRound className="h-3 w-3 text-orange-300" />
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs">{admin.lastLogin}</td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                        admin.status === "Active"
                          ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                          : "border border-red-500/40 bg-red-500/10 text-red-200"
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          admin.status === "Active" ? "bg-emerald-400" : "bg-red-400"
                        )}
                      />
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-xs">
                    <button className="rounded-full border border-white/10 px-3 py-1 text-muted-foreground transition hover:border-white/30 hover:text-white">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0f18] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">
                    Invite admin
                  </p>
                  <h3 className="text-2xl font-semibold text-white">Grant dashboard access</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:border-white/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form className="mt-6 space-y-4 text-sm text-muted-foreground">
                <label className="space-y-2">
                  <span>Full name</span>
                  <input
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Devika Nair"
                  />
                </label>
                <label className="space-y-2">
                  <span>Email</span>
                  <input
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="admin@earniq.in"
                  />
                </label>
                <label className="space-y-2">
                  <span>Role</span>
                  <select
                    value={formData.role}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, role: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="Super admin" className="bg-[#050507]">
                      Super admin
                    </option>
                    <option value="Finance ops" className="bg-[#050507]">
                      Finance ops
                    </option>
                    <option value="Support lead" className="bg-[#050507]">
                      Support lead
                    </option>
                    <option value="Fraud analyst" className="bg-[#050507]">
                      Fraud analyst
                    </option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/50 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Send invite (demo)
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-muted-foreground transition hover:border-red-400 hover:text-red-200"
                >
                  <CircleSlash className="h-4 w-4" />
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

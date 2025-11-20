import { LayoutDashboard, Megaphone, ShieldCheck, UserCheck, Wallet, ClipboardList, FileCheck, Package } from "lucide-react";

export const memberNavigation = [
  { href: "/member/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/member/referrals", label: "Referrals", icon: UserCheck },
  { href: "/member/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/member/products", label: "My Products", icon: Package },
  { href: "/member/withdraw", label: "Withdraw", icon: Wallet },
];

export const adminNavigation = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/referrals", label: "Referrals", icon: UserCheck },
  { href: "/admin/tasks", label: "Task Submissions", icon: FileCheck },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: Wallet },
  { href: "/admin/ads", label: "Ads", icon: Megaphone },
  { href: "/admin/security", label: "Security", icon: ShieldCheck },
];


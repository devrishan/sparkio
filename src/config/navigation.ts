import { LayoutDashboard, Megaphone, ShieldCheck, UserCheck, Wallet } from "lucide-react";

export const memberNavigation = [
  { href: "/member/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/member/referrals", label: "Referrals", icon: UserCheck },
  { href: "/member/withdraw", label: "Withdraw", icon: Wallet },
];

export const adminNavigation = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/referrals", label: "Referrals", icon: UserCheck },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: Wallet },
  { href: "/admin/ads", label: "Ads", icon: Megaphone },
  { href: "/admin/security", label: "Security", icon: ShieldCheck },
];


export type NavigationIcon = "dashboard" | "referrals" | "withdraw" | "ads" | "security";

export type NavigationItem = {
  href: string;
  label: string;
  icon: NavigationIcon;
};

export const memberNavigation: NavigationItem[] = [
  { href: "/member/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/member/referrals", label: "Referrals", icon: "referrals" },
  { href: "/member/withdraw", label: "Withdraw", icon: "withdraw" },
];

export const adminNavigation: NavigationItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/referrals", label: "Referrals", icon: "referrals" },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: "withdraw" },
  { href: "/admin/ads", label: "Ads", icon: "ads" },
  { href: "/admin/security", label: "Security", icon: "security" },
];


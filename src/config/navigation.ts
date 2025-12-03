export type NavigationIcon =
  | "dashboard"
  | "referrals"
  | "withdraw"
  | "ads"
  | "admins"
  | "members"
  | "security"
  | "submissions"
  | "maintenance";

export type NavigationItem = {
  href: string;
  label: string;
  icon: NavigationIcon;
};

export const memberNavigation: NavigationItem[] = [
  { href: "/member/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/member/tasks", label: "Tasks", icon: "dashboard" },
  { href: "/member/wallet", label: "Wallet", icon: "dashboard" },
  { href: "/member/referrals", label: "Referrals", icon: "referrals" },
  { href: "/member/leaderboard", label: "Leaderboard", icon: "dashboard" },
  { href: "/member/gamification", label: "Gamification", icon: "dashboard" },
  { href: "/member/products", label: "Products", icon: "dashboard" },
  { href: "/member/support", label: "Support", icon: "dashboard" },
  { href: "/member/settings", label: "Settings", icon: "dashboard" },
  { href: "/member/withdraw", label: "Withdraw", icon: "withdraw" },
];

export const adminNavigation: NavigationItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/submissions", label: "Submissions", icon: "submissions" },
  { href: "/admin/tasks", label: "Tasks", icon: "dashboard" },
  { href: "/admin/referrals", label: "Referrals", icon: "referrals" },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: "withdraw" },
  { href: "/admin/products", label: "Products", icon: "dashboard" },
  { href: "/admin/members", label: "Members", icon: "members" },
  { href: "/admin/analytics", label: "Analytics", icon: "dashboard" },
  { href: "/admin/spark-wall", label: "Spark Wall", icon: "dashboard" },
  { href: "/admin/feature-flags", label: "Feature Flags", icon: "dashboard" },
  { href: "/admin/ads", label: "Ads", icon: "ads" },
  { href: "/admin/admins", label: "Admins", icon: "admins" },
  { href: "/admin/security", label: "Security", icon: "security" },
  { href: "/admin/maintenance", label: "Maintenance", icon: "maintenance" },
  { href: "/admin/finance", label: "Finance", icon: "dashboard" },
  { href: "/admin/advertisers", label: "Advertisers", icon: "ads" },
];


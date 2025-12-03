/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/member/dashboard",
        permanent: true,
      },
      {
        source: "/dashboard/tasks",
        destination: "/member/tasks",
        permanent: true,
      },
      {
        source: "/dashboard/referrals",
        destination: "/member/referrals",
        permanent: true,
      },
      {
        source: "/dashboard/withdrawals",
        destination: "/member/withdraw",
        permanent: true,
      },
      {
        source: "/dashboard/creator",
        destination: "/member/my-products",
        permanent: true,
      },
      {
        source: "/dashboard/furniture",
        destination: "/member/products?category=furniture",
        permanent: true,
      },
      {
        source: "/dashboard/insights",
        destination: "/member/leaderboard",
        permanent: true,
      },
      {
        source: "/dashboard/support",
        destination: "/member/support",
        permanent: true,
      },
      {
        source: "/dashboard/profile",
        destination: "/member/settings",
        permanent: true,
      },
      {
        source: "/dashboard/wallet",
        destination: "/member/wallet",
        permanent: true,
      },
      {
        source: "/dashboard/refer-and-earn",
        destination: "/member/referrals",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;


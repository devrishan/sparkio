# Dashboard Scaffold - Implementation Guide

## Overview

This document explains how the dashboard scaffold is organized and how to transition from mock data to real API integration.

## File Structure

```
app/(dashboard)/
├── member/
│   ├── wallet/page.tsx          ✅ NEW - Wallet management
│   ├── leaderboard/page.tsx     ✅ NEW - Leaderboard rankings
│   ├── support/page.tsx          ✅ NEW - Support tickets
│   └── settings/page.tsx         ✅ NEW - User settings
└── admin/
    ├── spark-wall/page.tsx       ✅ NEW - Spark wall management
    ├── finance/page.tsx           ✅ NEW - Finance dashboard
    └── advertisers/page.tsx       ✅ NEW - Advertiser campaigns

src/lib/mocks/
├── wallet.json                    ✅ Mock wallet data
├── leaderboard.json               ✅ Mock leaderboard data
├── supportTickets.json            ✅ Mock support tickets
├── sparkEvents.json               ✅ Mock spark events
├── financeOverview.json          ✅ Mock finance data
└── advertisers.json                ✅ Mock advertiser campaigns

src/hooks/
└── useMockData.ts                 ✅ Hook for loading mock data

app/api/mocks/
├── wallet/route.ts                ✅ API route for wallet
├── leaderboard/route.ts           ✅ API route for leaderboard
├── support-tickets/route.ts       ✅ API route for support
├── spark-events/route.ts          ✅ API route for spark events
├── finance/route.ts               ✅ API route for finance
└── advertisers/route.ts           ✅ API route for advertisers

src/components/dashboard/
└── DemoBanner.tsx                  ✅ Demo mode banner component
```

## Mock Data Organization

### Location
All mock data files are stored in `src/lib/mocks/` as JSON files.

### Structure
Each JSON file contains realistic sample data that matches the expected API response shape:

- **wallet.json**: Wallet balance, transactions, earnings breakdown
- **leaderboard.json**: Rankings for different time periods
- **supportTickets.json**: Support tickets with messages
- **sparkEvents.json**: Spark wall events
- **financeOverview.json**: Finance metrics and transactions
- **advertisers.json**: Advertiser campaigns with demographics

### Loading Mock Data

The `useMockData` hook provides a consistent way to load mock data:

```typescript
import { useMockData, loadMockJson } from "@/hooks/useMockData";

const { data, isLoading, error } = useMockData<WalletData>(
  () => loadMockJson("wallet")
);
```

The hook:
- Simulates a network delay (500-800ms)
- Shows loading state automatically
- Handles errors gracefully
- Works with TypeScript types

## Switching from Mock Data to Real APIs

### Step 1: Update the Hook Call

**Before (Mock):**
```typescript
const { data, isLoading } = useMockData<WalletData>(
  () => loadMockJson("wallet")
);
```

**After (Real API):**
```typescript
import { useQuery } from "@tanstack/react-query";

const { data, isLoading } = useQuery<WalletData>({
  queryKey: ["wallet"],
  queryFn: async () => {
    const response = await fetch("/api/member/wallet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch wallet");
    return response.json();
  },
});
```

### Step 2: Update API Endpoints

Replace mock API routes with real backend endpoints:

| Mock Endpoint | Real Endpoint | Method |
|--------------|---------------|--------|
| `/api/mocks/wallet` | `/api/member/wallet` | GET |
| `/api/mocks/leaderboard?period=weekly` | `/api/member/leaderboard?period=weekly` | GET |
| `/api/mocks/support-tickets` | `/api/member/support/tickets` | GET |
| `/api/mocks/spark-events` | `/api/admin/spark-wall/events` | GET |
| `/api/mocks/finance` | `/api/admin/finance` | GET |
| `/api/mocks/advertisers` | `/api/admin/advertisers` | GET |

### Step 3: Update Response Types

Ensure your TypeScript interfaces match the backend response:

```typescript
// Update interfaces in the page file or a shared types file
interface WalletData {
  balance: number;
  coins: number;
  totalEarned: number;
  todayChange: number;
  transactions: Transaction[];
  earningsByCategory: {
    tasks: number;
    referrals: number;
    bonuses: number;
    withdrawn: number;
  };
}
```

### Step 4: Remove Demo Banners

Remove or conditionally hide the `DemoBanner` component:

```typescript
// Remove this line:
<DemoBanner />

// Or conditionally show:
{process.env.NODE_ENV === "development" && <DemoBanner />}
```

### Step 5: Update Error Handling

Add proper error handling for API failures:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["wallet"],
  queryFn: fetchWallet,
  onError: (error) => {
    toast.error("Failed to load wallet data");
    console.error(error);
  },
});
```

## Authentication Integration

### Current State
The app uses a mock authentication system via:
- `ProtectedRoute` component
- `useSession` hook from `@/components/providers/session-provider`
- Mock token stored in localStorage

### Replacing with Real Auth

1. **Update Session Provider**
   Replace `src/components/providers/session-provider.tsx` to fetch from real auth API:

```typescript
// Replace mock session with real API call
const { data: user } = useQuery({
  queryKey: ["session"],
  queryFn: async () => {
    const response = await fetch("/api/auth/session");
    if (!response.ok) throw new Error("Unauthorized");
    return response.json();
  },
});
```

2. **Update ProtectedRoute**
   Ensure `ProtectedRoute` checks real authentication:

```typescript
// In ProtectedRoute component
if (!user || !isAuthenticated) {
  redirect("/login");
}
```

3. **Add Token to API Calls**
   Include authentication tokens in API requests:

```typescript
const response = await fetch("/api/member/wallet", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

## Settings Page - localStorage Integration

The settings page currently uses `localStorage` for persistence. To switch to API:

1. **Replace localStorage with API calls:**

```typescript
// Before
localStorage.setItem("profile_name", profile.name);

// After
await fetch("/api/member/profile", {
  method: "PUT",
  body: JSON.stringify({ name: profile.name }),
});
```

2. **Load initial data from API:**

```typescript
// Replace localStorage.getItem with API call
const { data: profile } = useQuery({
  queryKey: ["profile"],
  queryFn: () => fetch("/api/member/profile").then(r => r.json()),
});
```

## Testing Checklist

See `docs/dashboard-scaffold-checklist.md` for a complete testing checklist.

## Common Issues

### Issue: Mock data not loading
**Solution**: Check that API routes in `app/api/mocks/` are accessible and JSON files exist in `src/lib/mocks/`.

### Issue: TypeScript errors
**Solution**: Ensure all interfaces match the mock data structure. Update types if backend response differs.

### Issue: Skeleton loaders not showing
**Solution**: Verify `isLoading` state is properly checked before rendering content.

## Support

For questions or issues:
1. Check the code comments in each page file (they include API integration notes)
2. Review the TypeScript interfaces
3. Check the browser console for errors
4. Verify API routes are accessible


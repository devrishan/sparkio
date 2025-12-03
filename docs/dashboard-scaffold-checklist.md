# Dashboard Scaffold Checklist

## ✅ Completed Tasks

### 1. Mock Data System
- [x] Created mock JSON files in `src/lib/mocks/`
  - `memberDashboard.json`
  - `wallet.json`
  - `leaderboard.json`
  - `supportTickets.json`
  - `sparkEvents.json`
  - `financeOverview.json`
  - `advertisers.json`
- [x] Created `useMockData` hook in `src/hooks/useMockData.ts`
- [x] Created API routes in `app/api/mocks/` to serve mock data

### 2. Member Dashboards
- [x] `/member/wallet` - Wallet page with transactions
- [x] `/member/leaderboard` - Leaderboard with period filters
- [x] `/member/support` - Support tickets with chat UI
- [x] `/member/settings` - Settings with localStorage persistence

### 3. Admin Dashboards
- [x] `/admin/spark-wall` - Spark wall event management
- [x] `/admin/finance` - Finance dashboard with P&L
- [x] `/admin/advertisers` - Advertiser campaign management

### 4. Components & Utilities
- [x] `DemoBanner` component for admin pages
- [x] Skeleton loaders on all pages
- [x] Updated navigation with all new routes

## 🧪 Testing Checklist

### Manual Testing

#### Member Pages
- [ ] Navigate to `/member/wallet`
  - [ ] Page loads without errors
  - [ ] Skeleton loader appears briefly
  - [ ] Wallet data displays correctly
  - [ ] Transaction table shows data
  - [ ] "Withdraw" button links to `/member/withdraw`

- [ ] Navigate to `/member/leaderboard`
  - [ ] Page loads without errors
  - [ ] Period filter works (daily/weekly/monthly/all-time)
  - [ ] Leaderboard entries display correctly
  - [ ] User's rank is highlighted
  - [ ] Rank change indicators show correctly

- [ ] Navigate to `/member/support`
  - [ ] Page loads without errors
  - [ ] Ticket list displays
  - [ ] Create ticket form works
  - [ ] Ticket detail view opens
  - [ ] Messages display in chat UI

- [ ] Navigate to `/member/settings`
  - [ ] Page loads without errors
  - [ ] Profile form loads with saved data
  - [ ] UPI ID saves to localStorage
  - [ ] Notification toggles work
  - [ ] Privacy settings save correctly
  - [ ] Logout button works

#### Admin Pages
- [ ] Navigate to `/admin/spark-wall`
  - [ ] Demo banner appears
  - [ ] Page loads without errors
  - [ ] Event type toggles work
  - [ ] Pending events list displays
  - [ ] Approve/Reject buttons work
  - [ ] Approved events list displays

- [ ] Navigate to `/admin/finance`
  - [ ] Demo banner appears
  - [ ] Page loads without errors
  - [ ] Finance metrics display correctly
  - [ ] Revenue/Payout/Profit cards show data
  - [ ] Category breakdown displays
  - [ ] Monthly comparison table shows data

- [ ] Navigate to `/admin/advertisers`
  - [ ] Demo banner appears
  - [ ] Page loads without errors
  - [ ] Campaign list displays
  - [ ] Campaign cards show all metrics
  - [ ] Demographics data displays
  - [ ] Pause/Resume buttons work

### Build & TypeScript
- [ ] Run `npm run build` - should complete without errors
- [ ] Run `npm run dev` - should start without errors
- [ ] Check TypeScript errors: `npx tsc --noEmit`

### Navigation
- [ ] Sidebar shows all member routes
- [ ] Sidebar shows all admin routes
- [ ] Active route is highlighted
- [ ] Mobile navigation works
- [ ] All links are clickable and navigate correctly

## 📝 Notes

### Mock Data Organization
- All mock data files are in `src/lib/mocks/` as JSON
- API routes in `app/api/mocks/` serve these files
- `useMockData` hook fetches from API routes with simulated delay

### Replacing Mocks with Real APIs
1. Update the `useMockData` hook calls to use `useQuery` from React Query
2. Replace API endpoints (`/api/mocks/*`) with real endpoints (`/api/member/*`, `/api/admin/*`)
3. Update response types to match backend schema
4. Remove `DemoBanner` components from admin pages
5. Update error handling for real API responses

### Authentication
- Currently using mock auth via `ProtectedRoute` component
- Replace with real auth provider when backend is ready
- Update `useSession` hook to fetch from real auth API

## 🐛 Known Issues
- None currently

## 🚀 Next Steps
1. Connect to real backend APIs
2. Add real authentication
3. Add error boundaries
4. Add loading states for mutations
5. Add optimistic updates
6. Add real-time updates (WebSocket/SSE)


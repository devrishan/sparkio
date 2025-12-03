# feat(frontend): complete Earniq member frontend (tasks, referrals, withdrawals, animated counter)

## Summary

This PR completes the Earniq member frontend implementation with all core features requested in the frontend specification.

### Key Additions

- **API Integration Layer** (`src/api/*`): Complete API client with Axios, including auth, tasks, referrals, withdrawals, and user management
- **State Management**: Zustand stores for auth, wallet, and global loading state
- **Dashboard**: Enhanced with animated earnings counter, task previews, and referral summary
- **Task Detail Page**: New page at `/member/tasks/[id]` with proof upload and success modal
- **Withdrawal Pages**: Request page with validation and history page with timestamps + receipt download
- **Referrals**: Updated with masked phone display & WhatsApp share functionality
- **Universal Components**: PhoneInput, OtpInputs, Loader, ErrorScreen, EmptyState
- **Special Components**: AnimatedEarningsCounter, ReferralItemCard, TaskCard, WithdrawalStatusBadge, TimestampList

## Changes

### New Files

- `src/api/axios.ts` - Axios instance with interceptors
- `src/api/auth.ts` - Authentication API functions
- `src/api/tasks.ts` - Tasks API functions
- `src/api/referrals.ts` - Referrals API functions
- `src/api/withdrawals.ts` - Withdrawals API functions
- `src/api/user.ts` - User profile API functions
- `src/stores/auth-store.ts` - Auth Zustand store
- `src/stores/wallet-store.ts` - Wallet Zustand store
- `src/stores/loading-store.ts` - Loading Zustand store
- `src/components/shared/PhoneInput.tsx` - Phone input component
- `src/components/shared/OtpInputs.tsx` - 6-box OTP input
- `src/components/shared/EmptyState.tsx` - Empty state component
- `src/components/shared/Loader.tsx` - Loading component
- `src/components/shared/ErrorScreen.tsx` - Error display component
- `src/components/shared/AnimatedEarningsCounter.tsx` - Animated counter
- `src/components/shared/ReferralItemCard.tsx` - Referral card
- `src/components/shared/TaskCard.tsx` - Task card
- `src/components/shared/WithdrawalStatusBadge.tsx` - Status badge
- `src/components/shared/TimestampList.tsx` - Timestamp display
- `app/(dashboard)/member/tasks/[id]/page.tsx` - Task detail page
- `app/(dashboard)/member/withdraw/history/page.tsx` - Withdrawal history
- `app/api/member/withdrawals/route.ts` - Withdrawal history API endpoint

### Modified Files

- `app/(dashboard)/member/dashboard/page.tsx` - Added animated earnings counter
- `src/components/member/member-referrals-client.tsx` - Updated WhatsApp share format
- `package.json` - Added Zustand and Axios dependencies

## Testing

Follow the QA checklist in: `docs/QA_FRONTEND_CHECKLIST.md`

### Critical Test Areas

1. **Authentication**: OTP flow, rate limiting, session management
2. **Dashboard**: Animated counter, task previews, CTAs
3. **Tasks**: List filters, detail page, proof upload, submission
4. **Referrals**: Masked phones, WhatsApp share
5. **Withdrawals**: Request validation, history, receipt download
6. **Protected Routes**: Auto-redirect logic

## API Contracts

### Backend Endpoints Required

- `POST /auth/send-otp` - Send OTP
- `POST /auth/verify-otp` - Verify OTP
- `GET /me` - Get user profile
- `GET /tasks` - List tasks
- `GET /tasks/:id` - Task detail
- `POST /tasks/:id/submit` - Submit task
- `GET /member/referrals` - Get referrals
- `POST /member/withdraw` - Request withdrawal
- `GET /member/withdrawals` - Withdrawal history
- `GET /member/withdrawals/:id/receipt` - Download receipt PDF
- `GET /leaderboards` - Leaderboard data
- `GET /member/dashboard` - Dashboard data
- `PATCH /me` - Update profile

### Request/Response Shapes

See `src/api/*.ts` files for detailed TypeScript interfaces.

## Notes

- **Backend Endpoint**: `/api/member/withdrawals/route.ts` created; ensure backend contract matches the request/response shapes in `src/api/withdrawals.ts`
- **CI**: Lint and unit tests must pass
- **Review Required**: Request review from @backend-team for API contract verification
- **Dependencies**: Added `zustand` and `axios` - ensure these are approved

## Deployment

See `docs/DEPLOYMENT_CHECKLIST.md` for deployment steps.

## Screenshots

(Add screenshots of key features if available)

## Related Issues

- Closes #[issue-number]
- Related to #[issue-number]

---

**Reviewers**: Please verify:
1. API contracts match backend implementation
2. All TypeScript types are correct
3. Error handling is comprehensive
4. Mobile responsiveness works correctly


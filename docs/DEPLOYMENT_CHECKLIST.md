# Earniq Frontend — Deployment & Release Checklist

## Backend Readiness

- [ ] Confirm API endpoints exist in staging as used by frontend:
  - [ ] `/auth/send-otp` (POST)
  - [ ] `/auth/verify-otp` (POST)
  - [ ] `/auth/logout` (POST)
  - [ ] `/me` (GET) - User profile
  - [ ] `/tasks` (GET) - List tasks
  - [ ] `/tasks/:id` (GET) - Task detail
  - [ ] `/tasks/:id/submit` (POST) - Submit task
  - [ ] `/member/referrals` (GET) - Get referrals
  - [ ] `/member/withdraw` (POST) - Request withdrawal
  - [ ] `/member/withdrawals` (GET) - Withdrawal history
  - [ ] `/member/withdrawals/:id/receipt` (GET) - Download receipt
  - [ ] `/leaderboards` (GET) - Leaderboard data
  - [ ] `/member/dashboard` (GET) - Dashboard data
- [ ] Backend team confirms API contract matches frontend expectations
- [ ] Rate limiting configured for OTP endpoints

## Environment Variables

- [ ] `NEXT_PUBLIC_API_BASE` set to staging URL: `https://staging.api.earniq.app`
- [ ] `NODE_ENV=production` for production builds
- [ ] `SENTRY_DSN` (optional) - Error tracking
- [ ] `ANALYTICS_KEY` (optional) - Analytics integration
- [ ] Verify all env vars are set in deployment platform (Vercel/Netlify/etc.)

## CI Pipeline

- [ ] Run: `npm run lint` → passes with zero critical errors
- [ ] Run: `npm run build` → succeeds without errors
- [ ] Run: `npm run test` → all tests pass (if tests exist)
- [ ] TypeScript compilation succeeds
- [ ] No build warnings (or acceptable warnings documented)

## Preview Deploy

- [ ] Deploy to Vercel / Netlify / staging server
- [ ] Verify preview URL is accessible
- [ ] Check build logs for errors
- [ ] Verify environment variables are loaded correctly
- [ ] Test critical paths on preview:
  - [ ] Login flow
  - [ ] Dashboard loads
  - [ ] Task submission
  - [ ] Withdrawal request

## Database & Migrations

- [ ] Ensure migration for new withdrawals endpoint:
  - [ ] `requested_at` timestamp
  - [ ] `approved_at` timestamp (nullable)
  - [ ] `paid_at` timestamp (nullable)
  - [ ] `rejected_at` timestamp (nullable)
  - [ ] `receipt_url` field (nullable)
- [ ] Migration applied to staging database
- [ ] Verify withdrawal history query works correctly

## Release

- [ ] Tag release: `frontend/v1.2.0-earn-frontend`
- [ ] Update release notes (see PR template)
- [ ] Create GitHub release with changelog
- [ ] Notify team of release

## Post-Release

### Smoke Tests

- [ ] **Login**: OTP flow works end-to-end
- [ ] **Task submit**: Complete task submission flow
- [ ] **Withdrawal request**: Submit and verify in history
- [ ] **Referral share**: WhatsApp share works correctly
- [ ] **Dashboard**: Animated counter displays correctly

### Monitoring

- [ ] Monitor logs & errors (Sentry/Cloudwatch)
- [ ] Check error rates in first hour
- [ ] Verify API response times are acceptable
- [ ] Check for 4xx/5xx errors in logs
- [ ] Monitor user session creation rates

### Rollback Plan

- [ ] Previous version tagged and accessible
- [ ] Rollback procedure documented
- [ ] Team notified of rollback process

## Production Deployment Steps

1. **Pre-deployment**
   - [ ] All checks above completed
   - [ ] Team notified of deployment window
   - [ ] Database backup created (if needed)

2. **Deployment**
   - [ ] Merge to main/production branch
   - [ ] CI/CD pipeline triggers automatically
   - [ ] Monitor deployment logs
   - [ ] Verify deployment success

3. **Post-deployment**
   - [ ] Run smoke tests on production
   - [ ] Check error monitoring dashboard
   - [ ] Verify analytics tracking
   - [ ] Monitor for 15-30 minutes

4. **Communication**
   - [ ] Update team on deployment status
   - [ ] Document any issues encountered
   - [ ] Update release notes if needed

---

## Rollback Procedure

If critical issues are found:

1. Revert to previous Git tag
2. Trigger deployment pipeline
3. Verify rollback success
4. Investigate issue in staging
5. Fix and redeploy

---

## Notes

- Keep staging and production environments in sync
- Document any environment-specific configurations
- Maintain changelog for all releases


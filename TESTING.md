# Frontend Mock Auth & Dashboard Testing Guide

## Overview
This document outlines manual testing procedures for the frontend-only mock authentication and dashboard system. The system uses `/api/mocks/*` endpoints and localStorage-based session management.

## Prerequisites
1. Clear browser localStorage before testing
2. Ensure Next.js dev server is running (`npm run dev`)
3. Have browser DevTools console open to monitor network requests

## Test Environment Setup

### 1. Initial State Check
- [ ] Clear localStorage (DevTools > Application > Local Storage > Clear All)
- [ ] Visit `http://localhost:3000/login`
- [ ] Verify login page displays correctly
- [ ] Verify no console errors

## Authentication Tests

### 2. Demo Account Login
- [ ] Click "Use demo account" button on login page
- [ ] Verify automatic login within 2 seconds
- [ ] Verify redirect to `/member/dashboard`
- [ ] Verify dashboard loads with mock data
- [ ] Check localStorage: `mockToken`, `mockUser`, `mockExpiresAt` should exist

### 3. Manual Login
- [ ] Enter email: `demo@example.com` (or any email)
- [ ] Enter password: `demo12345` (or any password ≥8 chars)
- [ ] Click "Sign in"
- [ ] Verify login succeeds
- [ ] Verify redirect to dashboard
- [ ] Verify toast notification appears

### 4. Admin Login
- [ ] Enter email: `admin@earniq.app` or any email containing "admin"
- [ ] Enter password: any password ≥8 chars
- [ ] Click "Sign in"
- [ ] Verify redirect to `/admin/dashboard`
- [ ] Verify admin dashboard displays analytics cards

### 5. Registration Flow
- [ ] Visit `/register`
- [ ] Fill in username, email, password
- [ ] Check "I agree to Terms and Privacy Policy" checkbox
- [ ] Click "Create account"
- [ ] Verify registration succeeds
- [ ] Verify redirect to `/member/dashboard`
- [ ] Verify account is created (check localStorage)

### 6. Demo Account Registration
- [ ] Click "Create demo account" button
- [ ] Verify automatic registration and login
- [ ] Verify redirect to dashboard

### 7. Forgot Password Flow
- [ ] Click "Forgot password?" link on login page
- [ ] Enter email address in modal
- [ ] Click "Send reset link"
- [ ] Verify success message appears
- [ ] Verify modal closes after 3 seconds

## Auto-Login Tests

### 8. Session Persistence
- [ ] Login successfully
- [ ] Refresh the page (`F5` or `Ctrl+R`)
- [ ] Verify auto-login occurs within 2 seconds
- [ ] Verify dashboard loads without requiring re-login
- [ ] Verify skeleton loading state appears briefly

### 9. Auto-Redirect When Authenticated
- [ ] Ensure you're logged in
- [ ] Visit `/login` directly
- [ ] Verify automatic redirect to `/member/dashboard` within 2 seconds
- [ ] Visit `/register` directly
- [ ] Verify automatic redirect to `/member/dashboard` within 2 seconds

### 10. Protected Route Access
- [ ] Logout (if logged in)
- [ ] Visit `/member/dashboard` directly
- [ ] Verify redirect to `/login?next=/member/dashboard`
- [ ] Login
- [ ] Verify redirect to `/member/dashboard` (respects `?next=` param)

## Dashboard Tests

### 11. Member Dashboard Loading
- [ ] Login as member (non-admin email)
- [ ] Visit `/member/dashboard`
- [ ] Verify loading skeleton appears initially
- [ ] Verify dashboard loads within 2 seconds
- [ ] Verify no blank screen

### 12. Wallet Snapshot Widget
- [ ] Verify wallet balance displays (e.g., "₹1,24,800")
- [ ] Verify today's change displays with trend indicator (up/down arrow)
- [ ] Click "Download Receipt" button
- [ ] Verify CSV file downloads
- [ ] Open CSV and verify it contains wallet data

### 13. Payout Pulse Widget
- [ ] Verify "Avg Approval" time displays (e.g., "3h 14m")
- [ ] Verify "Fastest Withdrawal" displays (e.g., "41s")
- [ ] Verify "Pending Disputes" count displays with badge

### 14. Referral Stats Widget
- [ ] Verify "Verified" count displays in green
- [ ] Verify "Weekly Releases" displays (e.g., "₹2,70,000+")

### 15. Recent Tasks List
- [ ] Verify recent tasks display (3-5 items)
- [ ] Verify status badges: Approved (green), Pending (yellow), Rejected (red)
- [ ] Verify reward amounts display correctly
- [ ] Click "View All Tasks" button
- [ ] Verify navigation to tasks page (if exists)

### 16. Dashboard Error Handling
- [ ] Clear localStorage while on dashboard
- [ ] Refresh page
- [ ] Verify 401 error handling
- [ ] Verify redirect to `/login`
- [ ] Verify no blank screen - error message should display

## Referrals Page Tests

### 17. Referrals Page Access
- [ ] Login as member
- [ ] Navigate to `/member/referrals`
- [ ] Verify page loads with mock referrals data

### 18. Referral Link Sharing
- [ ] Verify referral link displays (format: `https://r.navi.com/DEMO001`)
- [ ] Click "Copy Link" button
- [ ] Verify toast notification: "Link copied!"
- [ ] Verify clipboard contains referral link
- [ ] Click "Share on WhatsApp" button
- [ ] Verify WhatsApp opens in new tab with pre-filled message

### 19. Phone Number Masking
- [ ] Verify phone numbers display as `xxxxxx789` (last 3 digits visible)
- [ ] Verify no full phone numbers are visible

### 20. Status Filters
- [ ] Click "All" tab - verify all referrals display
- [ ] Click "Verified" tab - verify only verified referrals display
- [ ] Click "Pending" tab - verify only pending referrals display
- [ ] Click "Rejected" tab (if available) - verify only rejected referrals display
- [ ] Verify count badges on tabs match filtered results

### 21. Referrals Stats Cards
- [ ] Verify "Total Referrals" card displays correct count
- [ ] Verify "Verified" card displays count in green
- [ ] Verify "Pending" card displays count in yellow
- [ ] Verify "Total Commission" displays sum in primary color

### 22. Individual Referral Actions
- [ ] Click copy icon on any referral row
- [ ] Verify referral link copied to clipboard
- [ ] Verify toast notification appears

## Homepage Tests

### 23. Hero Section
- [ ] Visit homepage (`/`)
- [ ] Verify hero heading displays
- [ ] Verify CTA buttons are centered (or left-aligned on desktop)
- [ ] Verify interactive stat cards display
- [ ] Verify animated counters count up on page load (wait 2-3 seconds)
- [ ] Verify trust signals display (KYC compliant, secure, etc.)

### 24. How It Works Section
- [ ] Verify 3 cards display in grid layout
- [ ] Verify cards have icons and clear copy
- [ ] Hover over cards - verify hover effects (scale, border color change)
- [ ] Verify smooth animations on scroll into view

## Admin Dashboard Tests

### 25. Admin Dashboard Access
- [ ] Login as admin (email containing "admin")
- [ ] Verify redirect to `/admin/dashboard`
- [ ] Verify analytics cards display:
  - Total Payouts
  - Fraud Blocked count
  - Dispute Resolution percentage

### 26. Admin Analytics Data
- [ ] Verify "Total Payouts" displays formatted currency (e.g., "₹45L+")
- [ ] Verify "Fraud Blocked" displays count in red
- [ ] Verify "Dispute Resolution" displays percentage in green (e.g., "94%")
- [ ] Verify all cards have loading skeletons on initial load

## Logout Tests

### 27. Logout Functionality
- [ ] Click logout button/user menu
- [ ] Verify localStorage is cleared (`mockToken`, `mockUser`, `mockExpiresAt` removed)
- [ ] Verify redirect to `/login`
- [ ] Try to access `/member/dashboard` directly
- [ ] Verify redirect back to `/login`

## Edge Cases & Error Handling

### 28. Invalid Token Handling
- [ ] Manually set invalid `mockToken` in localStorage
- [ ] Refresh dashboard
- [ ] Verify 401 error handling
- [ ] Verify redirect to login

### 29. Expired Token Handling
- [ ] Set `mockExpiresAt` to past date in localStorage
- [ ] Try to access dashboard
- [ ] Verify token expiration check
- [ ] Verify redirect to login

### 30. Network Error Handling
- [ ] Stop Next.js dev server
- [ ] Try to login
- [ ] Verify error message displays
- [ ] Restart server and verify recovery

## Accessibility Tests

### 31. Keyboard Navigation
- [ ] Tab through login form - verify focus order
- [ ] Verify all buttons/keyboard-focusable elements receive focus
- [ ] Verify Enter key submits forms
- [ ] Verify Escape key closes dialogs/modals

### 32. Screen Reader Support
- [ ] Verify form labels are properly associated with inputs
- [ ] Verify error messages are announced
- [ ] Verify ARIA labels on buttons
- [ ] Verify dialog titles are present (forgot password modal)

### 33. Color Contrast
- [ ] Verify text contrast meets WCAG AA standards
- [ ] Verify error states are distinguishable
- [ ] Verify focus indicators are visible

## Performance Tests

### 34. Loading Performance
- [ ] Verify auto-login completes within 2 seconds
- [ ] Verify dashboard loads within 2 seconds
- [ ] Verify skeleton states appear during loading
- [ ] Verify no blank screens during transitions

### 35. Data Fetching
- [ ] Open Network tab in DevTools
- [ ] Login and navigate to dashboard
- [ ] Verify API calls to `/api/mocks/dashboard` succeed
- [ ] Verify responses are cached appropriately (30s stale time)

## Acceptance Criteria Checklist

- [x] Visiting `/login` when a mock token exists triggers auto-login and redirects to `/member/dashboard` within 2s
- [x] Login and Register pages validate inputs and provide demo login button
- [x] `/member/dashboard` displays wallet snapshot, referral stats, and recent tasks loaded from `/api/mocks/dashboard`
- [x] `/member/referrals` lists mock referrals and allows copying/sharing referral link
- [x] Protected routes redirect unauthenticated users to `/login?next=...`
- [x] No blank screen: when data is missing, show clear message or skeletons, not an empty page
- [x] All new code is on branch `feature/frontend-auth-dashboard-mocks` with incremental commits

## Quick Test Checklist (5-minute smoke test)

1. Clear localStorage
2. Visit `/login`
3. Click "Use demo account"
4. Verify redirect to dashboard
5. Visit `/member/referrals`
6. Click "Copy Link" button
7. Verify link copied
8. Logout
9. Verify redirect to `/login`

## Known Issues / Notes

- Mock tokens are stored in localStorage (not httpOnly cookies for simplicity)
- Auto-login may take up to 2 seconds on slower connections
- Referral links use format: `https://r.navi.com/{referralCode}`
- Phone numbers are masked server-side by `/api/mocks/referrals`

## Test Data Reference

### Demo Credentials
- **Member**: Any email + password (≥8 chars)
- **Admin**: Email containing "admin" + password (≥8 chars)
- **Demo Account**: Click "Use demo account" button (auto-creates session)

### Mock Data Ranges
- Wallet balance: ~₹1,24,800 (varies)
- Referrals: 3-10 items (mock)
- Tasks: 3-5 recent items
- Admin payouts: ~₹45L+ (varies)

---

**Last Updated**: Created for frontend mock auth & dashboard implementation
**Branch**: `feature/frontend-auth-dashboard-mocks`


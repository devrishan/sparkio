# API Endpoints — End-to-End QA Checklist

## 📋 Overview

This checklist covers end-to-end testing of all API endpoints used by the Earniq frontend. Test each endpoint in the order listed, verifying request/response shapes, status codes, and error handling.

**Test Environment**: Staging (`NEXT_PUBLIC_API_BASE=https://staging.api.earniq.app`)

**Tools**: Browser DevTools Network tab, Postman/Insomnia (optional), Frontend application

---

## 🔐 Authentication Endpoints

### 1. Request OTP

**Endpoint**: `POST /api/auth/otp/request`

- [ ] **Valid Request**
  - [ ] Send valid phone number (10-15 digits)
  - [ ] Verify response: `{ ok: true, ttl: 300, message: "..." }`
  - [ ] Check status code: `200`
  - [ ] Verify OTP received (SMS or console log in dev)

- [ ] **Invalid Phone Format**
  - [ ] Send phone with < 10 digits → `400` with error message
  - [ ] Send phone with > 15 digits → `400` with error message
  - [ ] Send non-numeric phone → `400` with error message

- [ ] **Rate Limiting**
  - [ ] Request OTP 5 times for same phone → All succeed
  - [ ] Request OTP 6th time → `429` with `retryAfter` field
  - [ ] Wait for retry period → Can request again
  - [ ] Request from same IP 10 times → `429` for IP limit

- [ ] **Maintenance Mode**
  - [ ] Enable maintenance mode → `503` with message
  - [ ] Disable maintenance mode → Request succeeds

---

### 2. Verify OTP

**Endpoint**: `POST /api/auth/otp/verify`

- [ ] **Valid OTP**
  - [ ] Send correct OTP within 5 minutes
  - [ ] Verify response: `{ success: true, user: { id, phone, role } }`
  - [ ] Check status code: `200`
  - [ ] Verify cookies set: `earniq_access_token`, `earniq_refresh_token`
  - [ ] Verify cookies are httpOnly and secure (in production)
  - [ ] Verify user can access protected routes after verification

- [ ] **Invalid OTP**
  - [ ] Send wrong OTP → `400` with `attemptsRemaining`
  - [ ] Send expired OTP → `400` with error
  - [ ] Send OTP for different phone → `400` with error

- [ ] **Account Lockout**
  - [ ] Enter wrong OTP 5 times → `429` with `locked: true`
  - [ ] Verify `lockoutExpiresAt` timestamp
  - [ ] Try again before lockout expires → `429`
  - [ ] Wait for lockout to expire → Can verify again

- [ ] **Referral Code**
  - [ ] Include valid referral code → User created with referral
  - [ ] Include invalid referral code → User created without referral
  - [ ] Omit referral code → User created normally

- [ ] **Response Completeness** ⚠️
  - [ ] Verify user object includes: `id`, `phone`, `role`
  - [ ] **MISSING**: `username`, `email`, `referral_code` (backend fix needed)

---

### 3. Get Session

**Endpoint**: `GET /api/auth/session`

- [ ] **Authenticated Request**
  - [ ] Send request with valid access token cookie
  - [ ] Verify response: `{ success: true, user: { id, phone, role } }`
  - [ ] Check status code: `200`

- [ ] **Unauthenticated Request**
  - [ ] Send request without cookie → `{ success: false, user: null }`
  - [ ] Check status code: `200` (not 401)

- [ ] **Invalid Token**
  - [ ] Send request with invalid/expired token → `{ success: false, user: null }`
  - [ ] Check status code: `200` (not 401)

- [ ] **Response Completeness** ⚠️
  - [ ] Verify user object includes: `id`, `phone`, `role`
  - [ ] **MISSING**: `username`, `email`, `referral_code`, `upi_id` (backend fix needed)

---

### 4. Logout

**Endpoint**: `POST /api/auth/logout`

- [ ] **Valid Logout**
  - [ ] Send POST request (authenticated or not)
  - [ ] Verify response: `{ success: true }`
  - [ ] Check status code: `200`
  - [ ] Verify cookies cleared: `earniq_access_token`, `earniq_refresh_token`, `earniq_user`
  - [ ] Verify user redirected to login after logout

---

## 📋 Tasks Endpoints

### 5. List Tasks

**Endpoint**: `GET /api/tasks`

- [ ] **Basic Request**
  - [ ] Send GET request (no auth required)
  - [ ] Verify response: `{ success: true, tasks: [...], pagination: {...} }`
  - [ ] Check status code: `200`
  - [ ] Verify tasks array contains expected fields
  - [ ] Verify pagination object present

- [ ] **Filters**
  - [ ] Filter by `category_id` → Tasks filtered correctly
  - [ ] Filter by `is_active=true` → Only active tasks returned
  - [ ] Filter by `difficulty` → Tasks filtered correctly
  - [ ] Use `limit` and `offset` → Pagination works
  - [ ] **MISSING**: `type` and `min_points` filters (frontend uses these)

- [ ] **Response Shape**
  - [ ] Verify each task has: `id`, `title`, `slug`, `description`, `reward_amount`, `reward_coins`, `category`
  - [ ] Verify `category` is object with `id`, `name`, `slug`
  - [ ] Verify `pagination` has: `total`, `limit`, `offset`, `hasMore`

---

### 6. Get Task Detail

**Endpoint**: `GET /api/tasks/:id`

- [ ] **Valid Task ID**
  - [ ] Send GET request with valid task ID
  - [ ] Verify response: `{ success: true, task: {...} }`
  - [ ] Check status code: `200`
  - [ ] Verify task has all expected fields

- [ ] **Invalid Task ID**
  - [ ] Send GET request with non-existent ID → `404`
  - [ ] Verify error message

- [ ] **Authenticated vs Unauthenticated**
  - [ ] Request without auth → Task returned (no user-specific fields)
  - [ ] Request with auth → Task returned with `user_submission_count`, `can_submit`

- [ ] **Response Shape**
  - [ ] Verify task has: `id`, `title`, `description`, `reward_amount`, `reward_coins`, `category`
  - [ ] Verify `user_submission_count`, `can_submit`, `is_expired` present (if authenticated)
  - [ ] **MISSING**: `type`, `status`, `updated_at` (frontend expects these)

---

### 7. Submit Task

**Endpoint**: `POST /api/member/tasks/submit` ⚠️ **URL MISMATCH**

- [ ] **Valid Submission**
  - [ ] Send FormData with `task_id`, `proof` (File), `notes` (optional)
  - [ ] Verify Content-Type: `multipart/form-data`
  - [ ] Verify response: `{ success: true, message: "...", submission: {...} }`
  - [ ] Check status code: `200`
  - [ ] Verify submission created in database
  - [ ] Verify proof file uploaded to S3

- [ ] **Missing Fields**
  - [ ] Omit `task_id` → `400` with error
  - [ ] Omit `proof` file → `400` with error

- [ ] **Invalid File**
  - [ ] Send invalid file type → `400` with validation error
  - [ ] Send file too large → `400` with error

- [ ] **Task Constraints**
  - [ ] Submit to expired task → `400` with "Task has expired"
  - [ ] Submit to inactive task → `404` with "Task not found or inactive"
  - [ ] Submit when max submissions reached → `400` with error
  - [ ] Submit when pending submission exists → `400` with error

- [ ] **Authentication**
  - [ ] Submit without auth → `401` Unauthenticated

- [ ] **URL Mismatch** ⚠️
  - [ ] Frontend currently calls `/api/member/submit-task` (wrong)
  - [ ] Should call `/api/member/tasks/submit` (correct)
  - [ ] Frontend sends JSON (wrong) → Should send FormData (correct)

---

### 8. Get Task Submissions

**Endpoint**: `GET /api/member/tasks/submissions`

- [ ] **Basic Request**
  - [ ] Send GET request (authenticated)
  - [ ] Verify response: `{ success: true, data: [...], pagination: {...} }`
  - [ ] Check status code: `200`

- [ ] **Filters**
  - [ ] Filter by `status=APPROVED` → Only approved submissions
  - [ ] Filter by `status=PENDING` → Only pending submissions
  - [ ] Use `page` and `perPage` → Pagination works

- [ ] **Response Shape**
  - [ ] Verify each submission has: `id`, `task`, `status`, `proof_url`, `submitted_at`
  - [ ] Verify `task` object has: `id`, `title`, `slug`, `reward_amount`, `reward_coins`
  - [ ] Verify `pagination` has: `page`, `per_page`, `total`, `total_pages`

- [ ] **Authentication**
  - [ ] Request without auth → `401` Unauthenticated

---

## 👥 Referrals Endpoints

### 9. Get Referrals

**Endpoint**: `GET /api/member/referrals`

- [ ] **Basic Request**
  - [ ] Send GET request (authenticated)
  - [ ] Verify response: `{ success: true, referrals: [...], stats: {...}, chain: {...} }`
  - [ ] Check status code: `200`

- [ ] **Response Shape**
  - [ ] Verify `referrals` array with expected structure
  - [ ] Verify each referral has: `id`, `referred_user`, `level`, `status`, `commission_amount`
  - [ ] Verify `referred_user` has: `id`, `username`, `email`, `phone`, `created_at`
  - [ ] Verify `stats` has: `total`, `verified`, `pending`, `total_commission`
  - [ ] Verify `chain` has: `referrer`, `direct_referrals`

- [ ] **Query Parameters**
  - [ ] Include `include_tree=true` → `tree` field present in response

- [ ] **Authentication**
  - [ ] Request without auth → Falls back to mock data or `401`

---

## 💰 Withdrawals Endpoints

### 10. Request Withdrawal

**Endpoint**: `POST /api/member/withdraw`

- [ ] **Valid Request**
  - [ ] Send `{ amount: 100, upiId: "user@paytm" }`
  - [ ] Verify user has sufficient balance
  - [ ] Verify response: `{ success: true, message: "...", withdrawal: {...} }`
  - [ ] Check status code: `200`
  - [ ] Verify withdrawal created in database
  - [ ] Verify wallet balance updated (withdrawable decreased, pending increased)

- [ ] **Validation**
  - [ ] Amount < 100 → `400` with "Minimum withdrawal amount is ₹100"
  - [ ] Amount > withdrawable balance → `400` with "Insufficient withdrawable balance"
  - [ ] Invalid UPI format → `400` with validation error
  - [ ] Missing `amount` → `400` with validation error
  - [ ] Missing `upiId` → `400` with validation error

- [ ] **Authentication**
  - [ ] Request without auth → `401` Unauthenticated

- [ ] **Wallet Not Found**
  - [ ] User without wallet → `404` with "Wallet not found"

---

### 11. Get Withdrawal History

**Endpoint**: `GET /api/member/withdrawals`

- [ ] **Basic Request**
  - [ ] Send GET request (authenticated)
  - [ ] Verify response: `{ success: true, withdrawals: [...], pagination: {...} }`
  - [ ] Check status code: `200`

- [ ] **Filters**
  - [ ] Filter by `status=PENDING` → Only pending withdrawals
  - [ ] Filter by `status=PAID` → Only paid withdrawals
  - [ ] Use `page` and `perPage` → Pagination works

- [ ] **Response Shape**
  - [ ] Verify each withdrawal has: `id`, `amount`, `status`, `upi_id`, `requested_at`
  - [ ] Verify timestamps: `approved_at`, `paid_at`, `rejected_at` (nullable)
  - [ ] Verify `receipt_url` (nullable)
  - [ ] Verify `pagination` has: `page`, `per_page`, `total`, `total_pages`

- [ ] **Authentication**
  - [ ] Request without auth → `401` Unauthenticated

---

### 12. Download Withdrawal Receipt

**Endpoint**: `GET /api/member/withdrawals/:id/receipt`

- [ ] **Valid Request**
  - [ ] Send GET request with valid withdrawal ID
  - [ ] Verify response: PDF file stream
  - [ ] Check Content-Type: `application/pdf`
  - [ ] Check status code: `200`
  - [ ] Verify PDF contains: amount, UPI ID, dates, status

- [ ] **Invalid ID**
  - [ ] Send non-existent withdrawal ID → `404`

- [ ] **No Receipt**
  - [ ] Request receipt for withdrawal without receipt → `404` or `400`

- [ ] **Authentication**
  - [ ] Request without auth → `401` Unauthenticated
  - [ ] Request receipt for another user's withdrawal → `403` or `404`

---

## 👤 User Profile Endpoints

### 13. Get User Profile

**Endpoint**: `GET /api/member/profile` ⚠️ **MISSING**

- [ ] **Endpoint Exists**
  - [ ] Send GET request → Endpoint responds (not 404)
  - [ ] **STATUS**: Currently returns 404 - endpoint needs to be created

- [ ] **Expected Behavior** (once implemented)
  - [ ] Send GET request (authenticated)
  - [ ] Verify response: `{ success: true, user: { id, username, phone, email, upi_id, referral_code } }`
  - [ ] Check status code: `200`
  - [ ] Verify all user fields present

- [ ] **Authentication**
  - [ ] Request without auth → `401` Unauthenticated

---

### 14. Update User Profile

**Endpoint**: `PUT /api/member/profile` ⚠️ **MISSING**

- [ ] **Endpoint Exists**
  - [ ] Send PUT request → Endpoint responds (not 404)
  - [ ] **STATUS**: Currently returns 404 - endpoint needs to be created

- [ ] **Expected Behavior** (once implemented)
  - [ ] Send `{ username: "newusername" }` → `200` with updated user
  - [ ] Send `{ upi_id: "new@paytm" }` → `200` with updated user
  - [ ] Send both fields → Both updated
  - [ ] Verify changes persisted in database

- [ ] **Validation**
  - [ ] Send invalid username format → `400` with validation error
  - [ ] Send invalid UPI format → `400` with validation error

- [ ] **Authentication**
  - [ ] Request without auth → `401` Unauthenticated

---

## 📊 Dashboard Endpoints

### 15. Get Dashboard Data

**Endpoint**: `GET /api/member/dashboard`

- [ ] **Basic Request**
  - [ ] Send GET request (authenticated)
  - [ ] Verify response: `{ success: true, wallet: {...}, referrals: {...}, top_referrers: [...] }`
  - [ ] Check status code: `200`

- [ ] **Response Shape**
  - [ ] Verify `wallet` has: `balance`, `total_earned`
  - [ ] Verify `referrals` has: `total`, `verified`, `pending`, `success_rate`
  - [ ] Verify `top_referrers` array with expected structure

- [ ] **Authentication**
  - [ ] Request without auth → `401` Unauthenticated

---

### 16. Get Wallet

**Endpoint**: `GET /api/member/wallet`

- [ ] **Basic Request**
  - [ ] Send GET request (authenticated)
  - [ ] Verify response: `{ success: true, wallet: {...} }`
  - [ ] Check status code: `200`

- [ ] **Response Shape**
  - [ ] Verify wallet has: `balance`, `pending_amount`, `withdrawable`, `locked_amount`, `coins`, `total_earned`, `currency`

- [ ] **Wallet Creation**
  - [ ] Request for user without wallet → Wallet created automatically
  - [ ] Verify wallet created with zero balances

- [ ] **Authentication**
  - [ ] Request without auth → `401` Unauthenticated

---

## 🏆 Leaderboard Endpoints

### 17. Get Leaderboard

**Endpoint**: `GET /api/leaderboards`

- [ ] **Basic Request**
  - [ ] Send GET request (no auth required)
  - [ ] Verify response: `{ success: true, period: "...", metric: "...", entries: [...] }`
  - [ ] Check status code: `200`

- [ ] **Query Parameters**
  - [ ] Use `period=weekly` → Weekly leaderboard
  - [ ] Use `period=monthly` → Monthly leaderboard
  - [ ] Use `metric=earnings` → Earnings leaderboard
  - [ ] Use `metric=referrals` → Referrals leaderboard
  - [ ] Use `limit=5` → Top 5 users only

- [ ] **Response Shape**
  - [ ] Verify `entries` array with rank, userId, username, score
  - [ ] Verify entries sorted by score (descending)

---

### 18. Get User Leaderboard Stats

**Endpoint**: `POST /api/leaderboards`

- [ ] **Valid Request**
  - [ ] Send `{ userId: "...", period: "weekly", metric: "xp" }`
  - [ ] Verify response: `{ success: true, userId, period, metric, rank, score }`
  - [ ] Check status code: `200`

- [ ] **Missing userId**
  - [ ] Omit `userId` → `400` with "userId is required"

- [ ] **Invalid Parameters**
  - [ ] Invalid `period` → `400` or uses default
  - [ ] Invalid `metric` → `400` or uses default

---

## 🔄 Integration Tests

### End-to-End Flows

- [ ] **Complete Auth Flow**
  1. Request OTP → Receive OTP
  2. Verify OTP → Get session cookies
  3. Get session → Verify user data
  4. Access protected route → Success
  5. Logout → Cookies cleared

- [ ] **Complete Task Flow**
  1. List tasks → See available tasks
  2. Get task detail → See full task info
  3. Submit task → Submission created
  4. Get submissions → See submission in list
  5. Wait for approval → Status changes to APPROVED

- [ ] **Complete Withdrawal Flow**
  1. Get wallet → See balance
  2. Request withdrawal → Withdrawal created
  3. Get withdrawal history → See withdrawal in list
  4. Wait for approval → Status changes
  5. Download receipt → PDF received

- [ ] **Complete Referral Flow**
  1. Get referrals → See referral list
  2. Verify phone masking → Only last 3 digits visible
  3. Share WhatsApp link → Link opens correctly

---

## 🐛 Error Handling Tests

- [ ] **Network Errors**
  - [ ] Simulate network failure → Error handled gracefully
  - [ ] Verify user sees error message (not crash)

- [ ] **401 Handling**
  - [ ] All protected endpoints return 401 when unauthenticated
  - [ ] Frontend redirects to login on 401

- [ ] **Rate Limiting**
  - [ ] Verify rate limit errors show retry time
  - [ ] Verify user can retry after cooldown

- [ ] **Validation Errors**
  - [ ] Verify validation errors show specific field errors
  - [ ] Verify user can correct and resubmit

---

## 📱 Cross-Browser Testing

- [ ] **Chrome** - All endpoints work
- [ ] **Firefox** - All endpoints work
- [ ] **Safari** - All endpoints work
- [ ] **Edge** - All endpoints work
- [ ] **Mobile Safari** - All endpoints work
- [ ] **Chrome Mobile** - All endpoints work

---

## 🔒 Security Tests

- [ ] **CSRF Protection**
  - [ ] Verify SameSite cookie attributes
  - [ ] Verify cookies are httpOnly

- [ ] **Token Security**
  - [ ] Verify tokens not exposed in client-side code
  - [ ] Verify tokens expire correctly

- [ ] **Input Validation**
  - [ ] Verify SQL injection attempts blocked
  - [ ] Verify XSS attempts sanitized
  - [ ] Verify file uploads validated

---

## 📊 Performance Tests

- [ ] **Response Times**
  - [ ] All endpoints respond in < 2 seconds
  - [ ] Dashboard loads in < 3 seconds
  - [ ] Task list loads in < 2 seconds

- [ ] **Caching**
  - [ ] Verify leaderboard cached (5 minutes)
  - [ ] Verify static data cached appropriately

---

## ✅ Completion Checklist

- [ ] All endpoints tested
- [ ] All mismatches documented
- [ ] All errors handled gracefully
- [ ] All edge cases covered
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Cross-browser tested

---

**Test Date**: _______________  
**Tester**: _______________  
**Environment**: Staging  
**Notes**: _______________


# API Mismatch Analysis — Frontend vs Backend

## 🔍 Analysis Summary

This document compares all frontend API functions (`src/api/*`) with backend API routes (`app/api/*`) to identify mismatches in URLs, methods, payloads, and response shapes.

---

## ❌ Critical Mismatches Found

### 1. **Task Submission — MAJOR MISMATCH**

**Frontend Function**: `submitTask()` in `src/api/tasks.ts`
- **URL**: `/api/member/submit-task`
- **Method**: POST
- **Payload**: JSON `{ task_id, proof_url?, proof_type?, notes? }`

**Backend Route**: `app/api/member/tasks/submit/route.ts`
- **URL**: `/api/member/tasks/submit` ❌ (Different path)
- **Method**: POST ✅
- **Payload**: FormData `{ task_id, proof (File), notes? }` ❌ (Different format)

**Issues**:
1. URL mismatch: `/api/member/submit-task` vs `/api/member/tasks/submit`
2. Content-Type mismatch: JSON vs FormData
3. Payload mismatch: `proof_url` (string) vs `proof` (File)

**Fix Needed**:
- **Option A (Recommended)**: Update frontend to use FormData and correct URL
- **Option B**: Update backend to accept JSON with `proof_url`

---

### 2. **User Profile Endpoints — MISSING**

**Frontend Functions**: `getUserProfile()` and `updateUserProfile()` in `src/api/user.ts`
- **GET**: `/api/member/profile`
- **PUT**: `/api/member/profile`

**Backend Routes**: ❌ **DO NOT EXIST**

**Fix Needed**: Create backend endpoints:
- `app/api/member/profile/route.ts` with GET and PUT methods

---

### 3. **Auth Session Response — INCOMPLETE**

**Frontend Function**: `getSession()` in `src/api/auth.ts`
- **Expected Response**: `{ success: boolean, user?: User }`
- **User Shape**: `{ id, phone, username, email?, role, referral_code?, upi_id? }`

**Backend Route**: `app/api/auth/session/route.ts`
- **Actual Response**: `{ success: boolean, user: { id, phone, role } }`
- **Missing Fields**: `username`, `email`, `referral_code`, `upi_id`

**Fix Needed**: Update backend to return full user object from database

---

### 4. **OTP Verify Response — INCOMPLETE**

**Frontend Function**: `verifyOtp()` in `src/api/auth.ts`
- **Expected Response**: `{ success: boolean, user?: { id, phone, username, email?, role, referral_code? }, error? }`

**Backend Route**: `app/api/auth/otp/verify/route.ts`
- **Actual Response**: `{ success: true, user: { id, phone, role } }`
- **Missing Fields**: `username`, `email`, `referral_code`

**Fix Needed**: Update backend to return full user object after OTP verification

---

### 5. **Tasks List Filters — MISMATCH**

**Frontend Function**: `getTasks()` in `src/api/tasks.ts`
- **Query Params**: `type`, `min_points`

**Backend Route**: `app/api/tasks/route.ts`
- **Query Params**: `category_id`, `is_active`, `difficulty`, `limit`, `offset`
- **Missing**: `type`, `min_points` filters

**Fix Needed**:
- **Option A**: Update frontend to use `category_id` and `difficulty` instead
- **Option B**: Update backend to support `type` and `min_points` filters

---

### 6. **Task Detail Response — MISSING FIELDS**

**Frontend Function**: `getTask()` in `src/api/tasks.ts`
- **Expected Response**: `{ task: Task, success: boolean }`
- **Task Shape**: `{ id, title, description, slug, type, reward_amount, reward_coins, status, created_at, updated_at }`

**Backend Route**: `app/api/tasks/[id]/route.ts`
- **Actual Response**: Has `category`, `user_submission_count`, `can_submit`, `is_expired`
- **Missing Fields**: `type`, `status` (has `is_active` instead)
- **Extra Fields**: `category` (object), `user_submission_count`, `can_submit`, `is_expired`

**Fix Needed**: 
- Update frontend Task interface to include backend fields OR
- Update backend to include `type` and `status` fields

---

## ✅ Matches (No Issues)

### Auth
- ✅ `loginWithPhone()` → `/api/auth/otp/request` - Matches (response shape compatible)
- ✅ `logout()` → `/api/auth/logout` - Matches

### Referrals
- ✅ `getReferrals()` → `/api/member/referrals` - Matches

### Withdrawals
- ✅ `requestWithdrawal()` → `/api/member/withdraw` - Matches
- ✅ `getWithdrawalHistory()` → `/api/member/withdrawals` - Matches

### Task Submissions
- ✅ `getTaskSubmissions()` → `/api/member/tasks/submissions` - Matches

---

## 📋 Detailed Mismatch Breakdown

### Mismatch #1: Task Submission

| Aspect | Frontend | Backend | Status |
|--------|----------|---------|--------|
| URL | `/api/member/submit-task` | `/api/member/tasks/submit` | ❌ Mismatch |
| Method | POST | POST | ✅ Match |
| Content-Type | `application/json` | `multipart/form-data` | ❌ Mismatch |
| Payload | `{ task_id, proof_url?, proof_type?, notes? }` | `{ task_id, proof (File), notes? }` | ❌ Mismatch |
| Response | `{ success, submission?, error? }` | `{ success, message, submission: { id, task_id, status, submitted_at } }` | ⚠️ Partial |

**Fix Required**: Update `src/api/tasks.ts` `submitTask()` function:
```typescript
// Change from JSON to FormData
const formData = new FormData();
formData.append('task_id', taskId);
if (payload.proof_file) {
  formData.append('proof', payload.proof_file);
}
if (payload.notes) {
  formData.append('notes', payload.notes);
}

const response = await apiClient.post("/api/member/tasks/submit", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
```

---

### Mismatch #2: User Profile Endpoints

| Aspect | Frontend | Backend | Status |
|--------|----------|---------|--------|
| GET URL | `/api/member/profile` | ❌ Does not exist | ❌ Missing |
| PUT URL | `/api/member/profile` | ❌ Does not exist | ❌ Missing |

**Fix Required**: Create `app/api/member/profile/route.ts`:
```typescript
// GET /api/member/profile
export async function GET() {
  // Get user from session
  // Return { success: true, user: { id, username, phone, email, upi_id, referral_code } }
}

// PUT /api/member/profile
export async function PUT(request: NextRequest) {
  // Update user profile
  // Accept { username?, upi_id? }
  // Return { success: true, user: {...} }
}
```

---

### Mismatch #3: Auth Session Response

| Field | Frontend Expects | Backend Returns | Status |
|-------|------------------|-----------------|--------|
| `id` | ✅ | ✅ | ✅ Match |
| `phone` | ✅ | ✅ | ✅ Match |
| `username` | ✅ | ❌ Missing | ❌ Mismatch |
| `email` | ✅ (optional) | ❌ Missing | ❌ Mismatch |
| `role` | ✅ | ✅ | ✅ Match |
| `referral_code` | ✅ (optional) | ❌ Missing | ❌ Mismatch |
| `upi_id` | ✅ (optional) | ❌ Missing | ❌ Mismatch |

**Fix Required**: Update `app/api/auth/session/route.ts` to fetch full user from database:
```typescript
// Get user from Prisma instead of in-memory store
const user = await prisma.user.findUnique({
  where: { id: payload.sub },
  select: { id, phone, username, email, role, referralCode, upiId }
});

return NextResponse.json({
  success: true,
  user: {
    id: user.id,
    phone: user.phone,
    username: user.username,
    email: user.email,
    role: user.role === 'ADMIN' ? 'admin' : 'member',
    referral_code: user.referralCode,
    upi_id: user.upiId,
  }
});
```

---

### Mismatch #4: OTP Verify Response

| Field | Frontend Expects | Backend Returns | Status |
|-------|------------------|-----------------|--------|
| `id` | ✅ | ✅ | ✅ Match |
| `phone` | ✅ | ✅ | ✅ Match |
| `username` | ✅ | ❌ Missing | ❌ Mismatch |
| `email` | ✅ (optional) | ❌ Missing | ❌ Mismatch |
| `role` | ✅ | ✅ | ✅ Match |
| `referral_code` | ✅ (optional) | ❌ Missing | ❌ Mismatch |

**Fix Required**: Update `app/api/auth/otp/verify/route.ts` to return full user object after creating/finding user.

---

### Mismatch #5: Tasks List Filters

| Filter | Frontend Uses | Backend Supports | Status |
|--------|---------------|-------------------|--------|
| `type` | ✅ | ❌ | ❌ Missing |
| `min_points` | ✅ | ❌ | ❌ Missing |
| `category_id` | ❌ | ✅ | ⚠️ Available |
| `difficulty` | ❌ | ✅ | ⚠️ Available |
| `is_active` | ❌ | ✅ | ⚠️ Available |

**Fix Required**: 
- Update frontend to use `category_id` and `difficulty` instead of `type` and `min_points`
- OR add `type` and `min_points` support to backend

---

### Mismatch #6: Task Detail Response

| Field | Frontend Expects | Backend Returns | Status |
|-------|-----------------|------------------|--------|
| `id` | ✅ | ✅ | ✅ Match |
| `title` | ✅ | ✅ | ✅ Match |
| `description` | ✅ | ✅ | ✅ Match |
| `slug` | ✅ | ✅ | ✅ Match |
| `type` | ✅ | ❌ Missing | ❌ Mismatch |
| `reward_amount` | ✅ | ✅ | ✅ Match |
| `reward_coins` | ✅ | ✅ | ✅ Match |
| `status` | ✅ | ❌ Missing | ❌ Mismatch |
| `created_at` | ✅ | ✅ | ✅ Match |
| `updated_at` | ✅ | ❌ Missing | ❌ Mismatch |
| `category` | ❌ | ✅ (object) | ⚠️ Extra |
| `is_active` | ❌ | ✅ | ⚠️ Extra |
| `user_submission_count` | ❌ | ✅ | ⚠️ Extra |
| `can_submit` | ❌ | ✅ | ⚠️ Extra |
| `is_expired` | ❌ | ✅ | ⚠️ Extra |

**Fix Required**: 
- Update frontend Task interface to include backend fields
- OR update backend to include `type`, `status`, `updated_at`

---

## 🔧 Recommended Fixes Priority

### Priority 1 (Critical - Blocks Functionality)
1. **Task Submission** - Fix URL and payload format
2. **User Profile Endpoints** - Create missing endpoints

### Priority 2 (High - Incomplete Data)
3. **Auth Session Response** - Add missing user fields
4. **OTP Verify Response** - Add missing user fields

### Priority 3 (Medium - Feature Enhancement)
5. **Tasks List Filters** - Align filter parameters
6. **Task Detail Response** - Align response shape

---

## 📝 Next Steps

1. Review this analysis with backend team
2. Decide on fix approach (frontend vs backend changes)
3. Implement fixes in priority order
4. Update API contract document after fixes
5. Test all endpoints end-to-end

---

## ✅ Fixed Issues (2025-12-03)

### Task Submission - FIXED ✅
- **Issue:** Frontend used JSON with `proof_url`, backend expects FormData with `proof` file
- **URL Mismatch:** Frontend called `/api/member/submit-task`, backend expects `/api/member/tasks/submit`
- **Fix Applied:** 
  - Updated `src/api/tasks.ts` to use FormData and correct URL `/api/member/tasks/submit`
  - Updated `app/(dashboard)/member/tasks/[id]/page.tsx` to use file input instead of URL input
  - Updated `src/api/axios.ts` to handle FormData correctly (skip Content-Type header)
- **Status:** ✅ Fixed and ready for testing

### Auth Endpoints - FIXED ✅
- **Issue:** Auth endpoints returned minimal user object (only id, phone, role)
- **Missing Fields:** `username`, `email`, `referral_code`, `upi_id`
- **Fix Applied:** 
  - Updated `app/api/auth/session/route.ts` to return full user object from Prisma
  - Updated `app/api/auth/otp/verify/route.ts` to return full user object and sync to Prisma
- **Status:** ✅ Fixed and ready for testing

### Profile Endpoints - FIXED ✅
- **Issue:** Profile endpoints did not exist (`/api/member/profile`)
- **Fix Applied:** 
  - Created `app/api/member/profile/route.ts` with GET and PUT handlers
  - GET returns full user profile
  - PUT updates username, email, upi_id with validation and duplicate checks
- **Status:** ✅ Fixed and ready for testing

### Task Filters - FIXED ✅
- **Issue:** Frontend used `type` and `min_points`, backend supports `category_id`, `difficulty`, `is_active`
- **Fix Applied:** 
  - Updated `src/api/tasks.ts` `getTasks()` function to use backend-supported filters
- **Status:** ✅ Fixed and ready for testing


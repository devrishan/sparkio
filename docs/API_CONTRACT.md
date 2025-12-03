# Earniq API Contract — Complete Reference

## 📋 Overview

This document defines the complete API contract for all endpoints used by the Earniq frontend. Each endpoint includes:
- URL and HTTP method
- Authentication requirements
- Request body/query parameters
- Response shape
- Status codes
- Error responses

**Base URL**: `/api` (relative to Next.js app)

**Authentication**: Cookie-based (httpOnly cookies: `earniq_access_token`, `earniq_refresh_token`)

---

## 🔐 Authentication Endpoints

### 1. Request OTP

**Endpoint**: `POST /api/auth/otp/request`

**Authentication**: Not required

**Request Body**:
```typescript
{
  phone: string; // 10-15 digits
}
```

**Success Response** (200):
```typescript
{
  ok: boolean; // true
  ttl: number; // OTP validity in seconds (300)
  message: string; // "OTP sent successfully" or "OTP sent (check server logs)"
}
```

**Error Responses**:
- `400` - Invalid phone number format
- `429` - Rate limit exceeded
  ```typescript
  {
    error: string;
    retryAfter?: number; // seconds until retry allowed
  }
  ```
- `503` - Service unavailable (maintenance/feature flag)

---

### 2. Verify OTP

**Endpoint**: `POST /api/auth/otp/verify`

**Authentication**: Not required

**Request Body**:
```typescript
{
  phone: string;
  otp: string; // 6 digits
  referralCode?: string; // Optional
}
```

**Success Response** (200):
```typescript
{
  success: boolean; // true
  user: {
    id: string;
    phone: string;
    role: "member" | "admin";
    // NOTE: Currently missing username, email, referral_code
    // Should be added in backend fix
  }
}
```

**Sets Cookies**:
- `earniq_access_token` (httpOnly, secure in production)
- `earniq_refresh_token` (httpOnly, secure in production)

**Error Responses**:
- `400` - Invalid or expired OTP
  ```typescript
  {
    error: string;
    attemptsRemaining?: number;
  }
  ```
- `429` - Account locked (too many failed attempts)
  ```typescript
  {
    error: string;
    locked: boolean;
    lockoutExpiresAt?: string; // ISO timestamp
  }
  ```
- `503` - Service unavailable

---

### 3. Get Session

**Endpoint**: `GET /api/auth/session`

**Authentication**: Required (cookie)

**Request**: No body

**Success Response** (200):
```typescript
{
  success: boolean; // true
  user: {
    id: string;
    phone: string;
    role: "member" | "admin";
    // NOTE: Currently missing username, email, referral_code, upi_id
    // Should be added in backend fix
  }
}
```

**Error Response** (200 - but success: false):
```typescript
{
  success: boolean; // false
  user: null;
}
```

---

### 4. Logout

**Endpoint**: `POST /api/auth/logout`

**Authentication**: Not required (but clears cookies)

**Request**: No body

**Success Response** (200):
```typescript
{
  success: boolean; // true
}
```

**Clears Cookies**: `earniq_access_token`, `earniq_refresh_token`, `earniq_user`

---

## 📋 Tasks Endpoints

### 5. List Tasks

**Endpoint**: `GET /api/tasks`

**Authentication**: Not required (but user context used if available)

**Query Parameters**:
```typescript
{
  category_id?: string;
  is_active?: "true" | "false" | "1" | "0";
  difficulty?: string;
  limit?: number; // default: 50
  offset?: number; // default: 0
  // NOTE: Frontend uses 'type' and 'min_points' - not supported yet
}
```

**Success Response** (200):
```typescript
{
  success: boolean; // true
  tasks: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    reward_amount: number;
    reward_coins: number;
    difficulty: string;
    is_active: boolean;
    max_submissions: number | null;
    expires_at: string | null; // ISO timestamp
    created_at: string; // ISO timestamp
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
```

**Error Response** (500):
```typescript
{
  success: boolean; // false
  error: string;
}
```

---

### 6. Get Task Detail

**Endpoint**: `GET /api/tasks/:id`

**Authentication**: Optional (user context used if available)

**Request**: No body

**Success Response** (200):
```typescript
{
  success: boolean; // true
  task: {
    id: string;
    title: string;
    slug: string;
    description: string;
    reward_amount: number;
    reward_coins: number;
    difficulty: string;
    is_active: boolean;
    max_submissions: number | null;
    expires_at: string | null;
    created_at: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    user_submission_count: number;
    can_submit: boolean;
    is_expired: boolean;
    // NOTE: Frontend expects 'type' and 'status' - not in response
  };
}
```

**Error Responses**:
- `404` - Task not found
  ```typescript
  {
    success: boolean; // false
    error: string;
  }
  ```
- `500` - Server error

---

### 7. Submit Task

**Endpoint**: `POST /api/member/tasks/submit` ⚠️ **URL MISMATCH**

**Authentication**: Required

**Request Body**: FormData
```typescript
{
  task_id: string;
  proof: File; // Required - image/video file
  notes?: string; // Optional
}
```

**Content-Type**: `multipart/form-data`

**Success Response** (200):
```typescript
{
  success: boolean; // true
  message: string; // "Task submitted successfully"
  submission: {
    id: string;
    task_id: string;
    status: string; // "SUBMITTED"
    submitted_at: string; // ISO timestamp
  };
}
```

**Error Responses**:
- `400` - Missing required fields, invalid file, task expired, max submissions reached, pending submission exists
  ```typescript
  {
    success: boolean; // false
    error: string;
  }
  ```
- `401` - Unauthenticated
- `404` - Task not found
- `500` - Server error

**NOTE**: Frontend currently sends JSON to `/api/member/submit-task` - needs to be fixed to use FormData and correct URL.

---

### 8. Get Task Submissions

**Endpoint**: `GET /api/member/tasks/submissions`

**Authentication**: Required

**Query Parameters**:
```typescript
{
  status?: "SUBMITTED" | "REVIEWING" | "APPROVED" | "REJECTED" | "DELETED";
  page?: number; // default: 1
  perPage?: number; // default: 10
}
```

**Success Response** (200):
```typescript
{
  success: boolean; // true
  data: Array<{
    id: string;
    task: {
      id: string;
      title: string;
      slug: string;
      reward_amount: number;
      reward_coins: number;
    };
    status: "SUBMITTED" | "REVIEWING" | "APPROVED" | "REJECTED" | "DELETED";
    proof_url: string | null;
    proof_type: string | null;
    notes: string | null;
    submitted_at: string; // ISO timestamp
    reviewed_at: string | null; // ISO timestamp
  }>;
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
```

**Error Responses**:
- `401` - Unauthenticated
- `400` - Invalid query parameters
- `500` - Server error

---

## 👥 Referrals Endpoints

### 9. Get Referrals

**Endpoint**: `GET /api/member/referrals`

**Authentication**: Required

**Query Parameters** (optional):
```typescript
{
  include_tree?: "true" | "false"; // default: false
}
```

**Success Response** (200):
```typescript
{
  success: boolean; // true
  referrals: Array<{
    id: string;
    referred_user: {
      id: string;
      username: string | null;
      email: string | null;
      phone: string;
      created_at: string; // ISO timestamp
    };
    level: number;
    status: "pending" | "verified" | "rejected";
    commission_amount: number;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
  }>;
  stats: {
    total: number;
    verified: number;
    pending: number;
    total_commission: number;
  };
  chain: {
    referrer: {
      id: string;
      referralCode: string;
      username: string | null;
    } | null;
    direct_referrals: Array<{
      id: string;
      referralCode: string;
      username: string | null;
    }>;
  };
  tree: any | null; // Referral tree structure (if include_tree=true)
}
```

**Error Responses**:
- `401` - Unauthenticated
- `500` - Server error

---

## 💰 Withdrawals Endpoints

### 10. Request Withdrawal

**Endpoint**: `POST /api/member/withdraw`

**Authentication**: Required

**Request Body**:
```typescript
{
  amount: number; // Minimum: 100
  upiId: string; // UPI ID format: username@provider
}
```

**Success Response** (200):
```typescript
{
  success: boolean; // true
  message: string; // "Withdrawal request submitted successfully"
  withdrawal: {
    id: string;
    amount: number;
    status: string; // "PENDING"
    upi_id: string;
    requested_at: string; // ISO timestamp
  };
}
```

**Error Responses**:
- `400` - Invalid input, insufficient balance, minimum amount not met
  ```typescript
  {
    success: boolean; // false
    error: string;
    details?: object; // Zod validation errors
  }
  ```
- `401` - Unauthenticated
- `404` - Wallet not found
- `500` - Server error

---

### 11. Get Withdrawal History

**Endpoint**: `GET /api/member/withdrawals`

**Authentication**: Required

**Query Parameters**:
```typescript
{
  status?: "PENDING" | "APPROVED" | "PAID" | "REJECTED";
  page?: number; // default: 1
  perPage?: number; // default: 20
}
```

**Success Response** (200):
```typescript
{
  success: boolean; // true
  withdrawals: Array<{
    id: string;
    amount: number;
    status: "PENDING" | "APPROVED" | "PAID" | "REJECTED";
    upi_id: string;
    requested_at: string; // ISO timestamp
    approved_at: string | null; // ISO timestamp
    paid_at: string | null; // ISO timestamp
    rejected_at: string | null; // ISO timestamp
    receipt_url: string | null; // URL to PDF receipt
  }>;
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
```

**Error Responses**:
- `401` - Unauthenticated
- `500` - Server error

---

### 12. Download Withdrawal Receipt

**Endpoint**: `GET /api/member/withdrawals/:id/receipt`

**Authentication**: Required

**Request**: No body

**Success Response** (200):
- Content-Type: `application/pdf`
- PDF file stream

**Error Responses**:
- `401` - Unauthenticated
- `404` - Withdrawal not found or receipt not available
- `500` - Server error

---

## 👤 User Profile Endpoints

### 13. Get User Profile

**Endpoint**: `GET /api/member/profile` ⚠️ **MISSING**

**Authentication**: Required

**Request**: No body

**Expected Success Response** (200):
```typescript
{
  success: boolean; // true
  user: {
    id: string;
    username: string;
    phone: string;
    email: string | null;
    upi_id: string | null;
    referral_code: string | null;
  };
}
```

**Error Responses**:
- `401` - Unauthenticated
- `500` - Server error

**Status**: ❌ **Endpoint does not exist - needs to be created**

---

### 14. Update User Profile

**Endpoint**: `PUT /api/member/profile` ⚠️ **MISSING**

**Authentication**: Required

**Request Body**:
```typescript
{
  username?: string;
  upi_id?: string;
}
```

**Expected Success Response** (200):
```typescript
{
  success: boolean; // true
  user: {
    id: string;
    username: string;
    phone: string;
    email: string | null;
    upi_id: string | null;
    referral_code: string | null;
  };
}
```

**Error Responses**:
- `400` - Invalid input
- `401` - Unauthenticated
- `500` - Server error

**Status**: ❌ **Endpoint does not exist - needs to be created**

---

## 📊 Dashboard Endpoints

### 15. Get Dashboard Data

**Endpoint**: `GET /api/member/dashboard`

**Authentication**: Required

**Request**: No body

**Success Response** (200):
```typescript
{
  success: boolean; // true
  wallet: {
    balance: number;
    total_earned: number;
  };
  referrals: {
    total: number;
    verified: number;
    pending: number;
    success_rate: number; // percentage
  };
  top_referrers: Array<{
    username: string;
    referral_code: string;
    verified_referrals: number;
    total_earned: number;
  }>;
}
```

**Error Responses**:
- `401` - Unauthenticated
- `500` - Server error

---

### 16. Get Wallet

**Endpoint**: `GET /api/member/wallet`

**Authentication**: Required

**Request**: No body

**Success Response** (200):
```typescript
{
  success: boolean; // true
  wallet: {
    balance: number;
    pending_amount: number;
    withdrawable: number;
    locked_amount: number;
    coins: number;
    total_earned: number;
    currency: string; // "INR"
  };
}
```

**Error Responses**:
- `401` - Unauthenticated
- `500` - Server error

---

## 🏆 Leaderboard Endpoints

### 17. Get Leaderboard

**Endpoint**: `GET /api/leaderboards`

**Authentication**: Not required

**Query Parameters**:
```typescript
{
  period?: "daily" | "weekly" | "monthly" | "alltime"; // default: "alltime"
  metric?: "xp" | "coins" | "earnings" | "referrals"; // default: "xp"
  limit?: number; // default: 100
}
```

**Success Response** (200):
```typescript
{
  success: boolean; // true
  period: string;
  metric: string;
  entries: Array<{
    rank: number;
    userId: string;
    username: string;
    score: number;
    // Additional fields based on metric
  }>;
}
```

**Error Responses**:
- `400` - Invalid query parameters
- `500` - Server error

---

### 18. Get User Leaderboard Stats

**Endpoint**: `POST /api/leaderboards`

**Authentication**: Not required

**Request Body**:
```typescript
{
  userId: string;
  period?: "daily" | "weekly" | "monthly" | "alltime"; // default: "alltime"
  metric?: "xp" | "coins" | "earnings" | "referrals"; // default: "xp"
}
```

**Success Response** (200):
```typescript
{
  success: boolean; // true
  userId: string;
  period: string;
  metric: string;
  rank: number | null;
  score: number;
}
```

**Error Responses**:
- `400` - userId required
- `500` - Server error

---

## 📝 Common Response Patterns

### Success Response
All successful responses follow this pattern:
```typescript
{
  success: boolean; // true
  // ... data fields
}
```

### Error Response
All error responses follow this pattern:
```typescript
{
  success: boolean; // false (if present)
  error: string; // Error message
  details?: object; // Additional error details (validation errors, etc.)
}
```

### Status Codes
- `200` - Success
- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthenticated (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable (maintenance mode)

---

## 🔒 Authentication

### Cookie-Based Authentication
- Access token: `earniq_access_token` (httpOnly, secure in production)
- Refresh token: `earniq_refresh_token` (httpOnly, secure in production)
- Cookies are automatically sent with `credentials: "include"` in fetch/axios

### Token Verification
- Tokens are JWT tokens verified server-side
- Invalid tokens return `401 Unauthenticated`
- Expired tokens return `401 Unauthenticated`

---

## 📌 Notes

1. **Missing Endpoints**: User profile endpoints (`/api/member/profile`) need to be created
2. **Response Incompleteness**: Auth endpoints return incomplete user objects (missing username, email, referral_code, upi_id)
3. **Task Submission**: Frontend needs to be updated to use FormData instead of JSON
4. **Filter Mismatch**: Tasks list filters need alignment (frontend uses `type`/`min_points`, backend uses `category_id`/`difficulty`)

---

**Last Updated**: Current session  
**Version**: API Contract v1.0  
**Status**: Includes known mismatches - see API_MISMATCH_ANALYSIS.md


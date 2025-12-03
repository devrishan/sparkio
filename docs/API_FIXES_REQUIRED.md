# API Fixes Required — Summary & Action Items

## 🎯 Executive Summary

**Total Mismatches Found**: 6  
**Critical (Blocks Functionality)**: 2  
**High Priority (Incomplete Data)**: 2  
**Medium Priority (Enhancement)**: 2

---

## 🚨 Critical Fixes (Priority 1)

### Fix #1: Task Submission Endpoint

**Issue**: Frontend and backend use different URLs and payload formats

**Frontend** (`src/api/tasks.ts`):
- URL: `/api/member/submit-task`
- Method: POST
- Content-Type: `application/json`
- Payload: `{ task_id, proof_url?, proof_type?, notes? }`

**Backend** (`app/api/member/tasks/submit/route.ts`):
- URL: `/api/member/tasks/submit`
- Method: POST
- Content-Type: `multipart/form-data`
- Payload: `{ task_id, proof (File), notes? }`

**Fix Required**: Update `src/api/tasks.ts` `submitTask()` function

**Code Change**:
```typescript
// BEFORE (current)
export async function submitTask(
  taskId: string,
  payload: Omit<SubmitTaskPayload, "task_id">
): Promise<SubmitTaskResponse> {
  try {
    const response = await apiClient.post<SubmitTaskResponse>("/api/member/submit-task", {
      task_id: taskId,
      ...payload,
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to submit task",
    };
  }
}

// AFTER (fixed)
export async function submitTask(
  taskId: string,
  payload: { proof_file: File; notes?: string }
): Promise<SubmitTaskResponse> {
  try {
    const formData = new FormData();
    formData.append("task_id", taskId);
    formData.append("proof", payload.proof_file);
    if (payload.notes) {
      formData.append("notes", payload.notes);
    }

    const response = await apiClient.post<SubmitTaskResponse>(
      "/api/member/tasks/submit",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to submit task",
    };
  }
}
```

**Files to Update**:
- `src/api/tasks.ts` - Update `submitTask()` function
- `app/(dashboard)/member/tasks/[id]/page.tsx` - Update to use File input instead of URL input

---

### Fix #2: User Profile Endpoints Missing

**Issue**: Frontend expects `/api/member/profile` endpoints but they don't exist

**Fix Required**: Create `app/api/member/profile/route.ts`

**Code to Create**:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  upi_id: z.string().regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/).optional(),
});

// GET /api/member/profile
export async function GET() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("earniq_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthenticated" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const payload = verifyAccessToken(accessToken);
      userId = payload.sub;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        referralCode: true,
        upiId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        referral_code: user.referralCode,
        upi_id: user.upiId,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT /api/member/profile
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("earniq_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthenticated" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const payload = verifyAccessToken(accessToken);
      userId = payload.sub;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateProfileSchema.parse(body);

    const updateData: any = {};
    if (validation.username) updateData.username = validation.username;
    if (validation.upi_id) updateData.upiId = validation.upi_id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        referralCode: true,
        upiId: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        referral_code: user.referralCode,
        upi_id: user.upiId,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
```

**Files to Create**:
- `app/api/member/profile/route.ts` - New file

---

## ⚠️ High Priority Fixes (Priority 2)

### Fix #3: Auth Session Response Incomplete

**Issue**: Backend returns incomplete user object (missing username, email, referral_code, upi_id)

**Current Backend** (`app/api/auth/session/route.ts`):
```typescript
return NextResponse.json({
  success: true,
  user: {
    id: user.id,
    phone: user.phone,
    role: user.role === "ADMIN" ? "admin" : "member",
  },
});
```

**Fix Required**: Update to fetch from database and return full user object

**Code Change**:
```typescript
// Replace in-memory store lookup with Prisma
const user = await prisma.user.findUnique({
  where: { id: payload.sub },
  select: {
    id: true,
    phone: true,
    username: true,
    email: true,
    role: true,
    referralCode: true,
    upiId: true,
  },
});

if (!user) {
  return NextResponse.json({ success: false, user: null });
}

return NextResponse.json({
  success: true,
  user: {
    id: user.id,
    phone: user.phone,
    username: user.username,
    email: user.email,
    role: user.role === "ADMIN" ? "admin" : "member",
    referral_code: user.referralCode,
    upi_id: user.upiId,
  },
});
```

**Files to Update**:
- `app/api/auth/session/route.ts` - Update GET handler

---

### Fix #4: OTP Verify Response Incomplete

**Issue**: Backend returns incomplete user object after OTP verification

**Current Backend** (`app/api/auth/otp/verify/route.ts`):
```typescript
return NextResponse.json({
  success: true,
  user: {
    id: user.id,
    phone: user.phone,
    role: user.role === 'ADMIN' ? 'admin' : 'member',
  },
});
```

**Fix Required**: Return full user object after creating/finding user

**Code Change**:
```typescript
// After createOrFindUser, fetch full user from database
const fullUser = await prisma.user.findUnique({
  where: { id: user.id },
  select: {
    id: true,
    phone: true,
    username: true,
    email: true,
    role: true,
    referralCode: true,
    upiId: true,
  },
});

return NextResponse.json({
  success: true,
  user: {
    id: fullUser.id,
    phone: fullUser.phone,
    username: fullUser.username,
    email: fullUser.email,
    role: fullUser.role === 'ADMIN' ? 'admin' : 'member',
    referral_code: fullUser.referralCode,
    upi_id: fullUser.upiId,
  },
});
```

**Files to Update**:
- `app/api/auth/otp/verify/route.ts` - Update POST handler

---

## 📝 Medium Priority Fixes (Priority 3)

### Fix #5: Tasks List Filters Mismatch

**Issue**: Frontend uses `type` and `min_points` filters, backend uses `category_id` and `difficulty`

**Options**:
1. **Update Frontend** (Recommended): Change frontend to use backend-supported filters
2. **Update Backend**: Add support for `type` and `min_points` filters

**Fix Option 1 - Update Frontend**:
```typescript
// Update src/api/tasks.ts getTasks() function
export async function getTasks(filters?: {
  category_id?: string;
  difficulty?: string;
  is_active?: boolean;
}): Promise<Task[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category_id) params.append("category_id", filters.category_id);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    if (filters?.is_active !== undefined) params.append("is_active", filters.is_active.toString());

    const response = await apiClient.get<{ tasks: Task[]; success: boolean }>(
      `/api/tasks?${params.toString()}`
    );
    return response.data.tasks || [];
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}
```

**Files to Update**:
- `src/api/tasks.ts` - Update `getTasks()` function
- Components using `getTasks()` - Update filter parameters

---

### Fix #6: Task Detail Response Shape

**Issue**: Frontend expects `type` and `status` fields, backend provides different fields

**Options**:
1. **Update Frontend** (Recommended): Update Task interface to match backend
2. **Update Backend**: Add `type` and `status` fields to response

**Fix Option 1 - Update Frontend**:
```typescript
// Update src/api/tasks.ts Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  reward_amount: number;
  reward_coins: number;
  difficulty: string;
  is_active: boolean;
  max_submissions: number | null;
  expires_at: string | null;
  created_at: string;
  // User-specific fields (if authenticated)
  user_submission_count?: number;
  can_submit?: boolean;
  is_expired?: boolean;
}
```

**Files to Update**:
- `src/api/tasks.ts` - Update `Task` interface
- Components using Task type - Update to use new fields

---

## 📋 Implementation Checklist

### Critical Fixes
- [ ] Fix task submission URL and payload format
- [ ] Create user profile endpoints (GET and PUT)

### High Priority Fixes
- [ ] Update auth session to return full user object
- [ ] Update OTP verify to return full user object

### Medium Priority Fixes
- [ ] Align tasks list filters (frontend or backend)
- [ ] Align task detail response shape (frontend or backend)

### Testing
- [ ] Test all fixed endpoints
- [ ] Verify no breaking changes
- [ ] Update API contract document
- [ ] Update frontend components if needed

---

## 🔗 Related Documents

- `docs/API_MISMATCH_ANALYSIS.md` - Detailed mismatch analysis
- `docs/API_CONTRACT.md` - Complete API contract
- `docs/API_QA_CHECKLIST.md` - End-to-end testing checklist

---

**Priority**: Fix Critical and High Priority items before deployment  
**Estimated Time**: 
- Critical fixes: 2-3 hours
- High priority fixes: 1-2 hours
- Medium priority fixes: 1-2 hours

**Total**: 4-7 hours


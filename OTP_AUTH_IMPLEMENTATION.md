# OTP-Based Phone Authentication Implementation

This document summarizes the OTP-based phone authentication implementation for Earniq.

## Overview

Implemented a complete OTP-based phone authentication system with:
- Server-side OTP generation and verification
- Cookie-based session management (httpOnly cookies)
- Client-side authentication provider
- Protected routes for `/member/*` and `/admin/*`
- Modern OTP login UI with phone input and verification flow

## Files Created/Modified

### Server Endpoints

1. **`app/api/auth/otp/request/route.ts`**
   - Handles OTP request
   - Validates phone number
   - Generates and stores OTP in-memory (5-minute expiry)
   - Supports dev/msg91/twilio providers
   - Returns `{ ok: true, ttl: 300 }`

2. **`app/api/auth/otp/verify/route.ts`**
   - Verifies OTP and creates/finds user
   - Generates JWT access and refresh tokens
   - Sets httpOnly cookies (`earniq_access_token`, `earniq_refresh_token`)
   - Returns user data

3. **`app/api/auth/session/route.ts`**
   - Validates access token from cookies
   - Returns current user session or 401

4. **`app/api/auth/logout/route.ts`**
   - Clears all authentication cookies
   - No database required

### Library Files

1. **`src/lib/auth/in-memory-store.ts`**
   - In-memory OTP store with expiry
   - In-memory user store
   - Functions: `storeOtp`, `verifyAndConsumeOtp`, `createOrFindUser`

2. **`src/lib/auth-otp.ts`**
   - Client-side OTP auth functions
   - `loginWithOtpRequest(phone)`
   - `verifyOtp(phone, otp, referralCode?)`
   - `logout()`
   - `getSession()`

3. **`src/lib/cookies.ts`**
   - Helper functions for setting/clearing secure cookies

4. **`src/lib/jwt.ts`** (already existed)
   - JWT signing and verification
   - Supports access and refresh tokens

### Client Components

1. **`src/context/AuthProvider.tsx`**
   - React context for authentication state
   - Initializes session from cookies on mount
   - Provides `{ user, isAuthenticated, isLoading, logout, refetch }`
   - Hook: `useAuth()`

2. **`src/components/auth/OtpLoginForm.tsx`**
   - Two-step OTP login form
   - Phone input → Request OTP → Verify OTP
   - Includes demo login button
   - Auto-redirects if already authenticated
   - Toast notifications for errors

3. **`src/components/auth/ProtectedRoute.tsx`** (updated)
   - Checks both OTP auth and legacy SessionProvider
   - Redirects to `/login?next=...` if not authenticated
   - Supports role-based protection

### Pages

1. **`app/(auth)/login/page.tsx`** (updated)
   - Uses `OtpLoginForm` component

2. **`app/(auth)/register/page.tsx`** (updated)
   - Uses `OtpLoginForm` component (same flow, server creates user on verify)

3. **`app/layout.tsx`** (updated)
   - Added `AuthProvider` wrapper

## Environment Variables

Required environment variables (add to `.env.local`):

```bash
# OTP Provider
OTP_PROVIDER=dev  # or 'msg91' or 'twilio'

# For MSG91
MSG91_API_KEY=your-msg91-api-key
MSG91_SENDER_ID=EARNIQ
MSG91_TEMPLATE_ID=your-template-id

# For Twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# JWT Secrets
JWT_ACCESS_TOKEN_SECRET=replace-with-32-char-secret
JWT_REFRESH_TOKEN_SECRET=replace-with-32-char-secret
JWT_ACCESS_TOKEN_TTL_SECONDS=900  # 15 minutes
JWT_REFRESH_TOKEN_TTL_SECONDS=2592000  # 30 days
```

## Authentication Flow

### 1. Request OTP
```
User enters phone → POST /api/auth/otp/request
→ Server generates 6-digit OTP
→ Stores in-memory with 5-minute expiry
→ Sends via provider (dev/msg91/twilio)
→ Returns { ok: true, ttl: 300 }
```

### 2. Verify OTP
```
User enters OTP → POST /api/auth/otp/verify
→ Server validates OTP
→ Creates/finds user in-memory store
→ Generates JWT tokens
→ Sets httpOnly cookies
→ Returns { success: true, user: {...} }
```

### 3. Session Management
```
On app load → AuthProvider initializes
→ GET /api/auth/session
→ Validates access token from cookie
→ Returns user data
→ Updates AuthProvider state
```

### 4. Protected Routes
```
User visits /member/* or /admin/*
→ ProtectedRoute checks AuthProvider
→ If not authenticated → redirect to /login?next=...
→ If authenticated → render page
```

## Cookie Configuration

- **earniq_access_token**: httpOnly, secure (production), 15-minute TTL
- **earniq_refresh_token**: httpOnly, secure (production), 30-day TTL
- **earniq_user**: non-httpOnly (for client access), 30-day TTL

## Development Mode

In development (`OTP_PROVIDER=dev` or `NODE_ENV !== 'production'`):
- OTPs are logged to server console
- Example: `[OTP][DEV] OTP for 919876543210: 123456`
- No external SMS service required

## Demo Login

The login form includes a "Demo Login" button that:
- Auto-fills demo phone number (9876543210)
- Requests OTP
- Shows toast message to check server logs for OTP

## Testing

### Test OTP Flow

1. Start dev server: `npm run dev`
2. Navigate to `/login`
3. Enter phone number: `9876543210`
4. Click "Send Verification Code"
5. Check server console for OTP (e.g., `[OTP][DEV] OTP for 919876543210: 123456`)
6. Enter OTP in form
7. Click "Verify & Sign In"
8. Should redirect to `/member/dashboard`

### Test Protected Routes

1. Visit `/member/dashboard` without logging in
2. Should redirect to `/login?next=/member/dashboard`
3. After login, should redirect back to `/member/dashboard`

### Test Session Persistence

1. Login with OTP
2. Refresh page
3. Should remain logged in (cookie-based)
4. Visit protected route → should work without re-login

## Production Considerations

1. **OTP Storage**: Replace in-memory store with Redis or database
2. **User Storage**: Replace in-memory user store with database
3. **Rate Limiting**: Implement per-phone rate limiting
4. **OTP Provider**: Set `OTP_PROVIDER=msg91` or `twilio` (never use `dev` in production)
5. **JWT Secrets**: Use strong, randomly generated secrets
6. **Cookie Security**: Ensure `secure` flag is true in production
7. **Session Management**: Consider implementing refresh token rotation

## Next Steps

1. Integrate with database (Prisma) for user and OTP storage
2. Add rate limiting for OTP requests
3. Implement OTP delivery status tracking
4. Add SMS delivery retry logic
5. Consider adding WhatsApp OTP option
6. Add admin role assignment logic

## Files Summary

**Created:**
- `src/lib/auth/in-memory-store.ts`
- `src/lib/auth-otp.ts`
- `src/lib/cookies.ts`
- `src/context/AuthProvider.tsx`
- `src/components/auth/OtpLoginForm.tsx`
- `OTP_PROVIDER_SETUP.md`
- `OTP_AUTH_IMPLEMENTATION.md`

**Modified:**
- `app/api/auth/otp/request/route.ts`
- `app/api/auth/otp/verify/route.ts`
- `app/api/auth/session/route.ts`
- `app/api/auth/logout/route.ts`
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- `app/layout.tsx`
- `src/components/auth/ProtectedRoute.tsx`

## Acceptance Criteria Status

✅ Developer can request OTP and see OTP in server logs (dev)
✅ Verify OTP logs user in, sets cookies, and redirects to /member/dashboard
✅ Visiting /member/* when not logged in redirects to /login
✅ Visiting /login when already authenticated redirects to /member/dashboard
✅ All routes protected with httpOnly cookie-based authentication
✅ OTP expires after 5 minutes
✅ Referral code support during registration
✅ Demo login button for development


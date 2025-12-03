# OTP Authentication - Production-Ready Fixes

## Patch Summary

This patch applies production-ready security fixes to the OTP phone authentication implementation:

1. **Rate limiting**: Per-phone (5/hr) and per-IP (10/hr) with in-memory fallback
2. **Brute-force protection**: Account lockout after 5 failed attempts (15 min)
3. **Phone validation**: Strict Indian phone format validation
4. **Cookie hardening**: Removed non-httpOnly user cookie, all cookies secure in production
5. **Feature flags**: Added `FEATURE_OTP_ENABLED` check and maintenance mode support
6. **Security logging**: Added security event logging for monitoring
7. **Unit tests**: Added comprehensive tests for in-memory store
8. **Integration tests**: Added shell/PowerShell scripts for manual QA

## Files Modified

### Core Files

1. **src/lib/auth/in-memory-store.ts**
   - Added `attempts` and `lockedUntil` fields to `OtpEntry`
   - Updated `verifyAndConsumeOtp` to return detailed result with lockout info
   - Added brute-force protection logic (5 attempts → 15min lockout)

2. **app/api/auth/otp/request/route.ts**
   - Added rate limiting (phone + IP based)
   - Added phone format validation
   - Added feature flag check
   - Added maintenance mode check
   - Added security event logging
   - Fallback to in-memory rate limiting if Redis unavailable

3. **app/api/auth/otp/verify/route.ts**
   - Added brute-force protection checks
   - Added phone format validation
   - Added referral code sanitization
   - Removed non-httpOnly `earniq_user` cookie
   - Added feature flag and maintenance mode checks
   - Enhanced error messages with lockout info

### New Files

4. **src/lib/rate-limit-memory.ts**
   - In-memory token bucket rate limiter
   - Fallback when Redis unavailable

5. **src/lib/security-logger.ts**
   - Security event logging utility
   - Logs rate limits, lockouts, brute-force attempts

6. **src/lib/auth/__tests__/in-memory-store.test.ts**
   - Comprehensive unit tests for OTP store
   - Tests brute-force protection
   - Tests lockout behavior

7. **scripts/test-otp-integration.sh** & **scripts/test-otp-integration.ps1**
   - Integration test scripts (bash/PowerShell)
   - Tests all endpoints and security features

## Security Improvements

### Before
- ❌ No rate limiting
- ❌ No brute-force protection
- ❌ Weak phone validation (length only)
- ❌ Non-httpOnly user cookie (XSS risk)
- ❌ No security event logging
- ❌ No feature flag/maintenance mode checks

### After
- ✅ Rate limiting: 5 requests/phone/hour, 10 requests/IP/hour
- ✅ Brute-force protection: 5 attempts → 15min lockout
- ✅ Strict phone format validation (Indian numbers)
- ✅ All cookies httpOnly + secure in production
- ✅ Security event logging for monitoring
- ✅ Feature flag and maintenance mode support

## Testing

### Run Unit Tests
```bash
npm test src/lib/auth/__tests__/in-memory-store.test.ts
```

### Run Integration Tests
```bash
# Linux/Mac
chmod +x scripts/test-otp-integration.sh
./scripts/test-otp-integration.sh http://localhost:3000

# Windows PowerShell
.\scripts\test-otp-integration.ps1 http://localhost:3000
```

## Environment Variables

Add to `.env.local`:

```bash
# Feature flag (default: enabled)
FEATURE_OTP_ENABLED=true

# Rate limiting (optional - uses defaults if not set)
OTP_RATE_LIMIT_PHONE=5          # requests per phone per hour
OTP_RATE_LIMIT_IP=10            # requests per IP per hour

# OTP provider
OTP_PROVIDER=dev  # or 'msg91' or 'twilio'
```

## Migration Notes

- **Cookie changes**: Removed `earniq_user` cookie. Client code should use `/api/auth/session` endpoint instead.
- **Error responses**: OTP verify now returns detailed error info including `attemptsRemaining` and `lockoutExpiresAt` when locked.
- **Rate limiting**: Uses Redis if available, falls back to in-memory (resets on server restart).

## Acceptance Criteria Status

- ✅ Rate limiting: 5 requests/phone/hour, 10 requests/IP/hour
- ✅ Brute-force protection: 5 attempts → 15min lockout
- ✅ Phone validation: Strict Indian format
- ✅ Cookie hardening: All cookies httpOnly + secure
- ✅ Feature flag support: `FEATURE_OTP_ENABLED`
- ✅ Security logging: All critical events logged
- ✅ Unit tests: Comprehensive coverage
- ✅ Integration tests: Manual QA scripts provided


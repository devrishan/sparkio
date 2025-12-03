# PR Metadata - Copy/Paste Ready

## Title

```
auth(otp): production fixes — rate limiting, brute-force lockout, phone validation, cookie hardening
```

## Description

```markdown
## Summary

This PR hardens OTP-based phone authentication for production deployment with comprehensive security improvements, rate limiting, and monitoring capabilities.

## Changes

### Security Enhancements

- ✅ **Rate Limiting**: Per-phone (5 requests/hour) and per-IP (10 requests/hour) with in-memory fallback when Redis unavailable
- ✅ **Brute-Force Protection**: Locks OTP verification for 15 minutes after 5 failed attempts
- ✅ **Phone Validation**: Strict normalization and Indian phone format validation (10 digits, starts with 6-9)
- ✅ **Cookie Hardening**: Removed non-httpOnly `earniq_user` cookie; session data now via server-only cookies + `/api/auth/session` endpoint
- ✅ **Feature Flags**: Added `FEATURE_OTP_ENABLED` check with maintenance-mode support
- ✅ **Security Logging**: Added `logSecurityEvent()` hooks for rate limits, lockouts, and suspicious activity

### Technical Details

**Rate Limiting:**
- Uses Redis-based rate limiter when available (sliding window)
- Falls back to in-memory token bucket algorithm for development/single-instance
- Returns `429 Too Many Requests` with `retryAfter` header

**Brute-Force Protection:**
- Tracks failed attempts per phone number
- After 5 failures: 15-minute lockout period
- Lockout persists in memory until expiry
- Clear error messages with lockout expiration time

**Phone Validation:**
- Normalizes to format: `91XXXXXXXXXX` (12 digits)
- Validates Indian phone format: must start with 6-9, exactly 10 digits
- Returns `400 Bad Request` for invalid formats

**Cookie Changes:**
- Removed: `earniq_user` (was non-httpOnly, XSS risk)
- Kept: `earniq_access_token` (httpOnly, secure)
- Kept: `earniq_refresh_token` (httpOnly, secure)
- Client should fetch user data via `GET /api/auth/session`

## Files Changed

### Core Implementation
- `src/lib/auth/in-memory-store.ts` - Added brute-force protection logic
- `app/api/auth/otp/request/route.ts` - Added rate limiting, validation, feature flags
- `app/api/auth/otp/verify/route.ts` - Added lockout checks, cookie hardening

### New Utilities
- `src/lib/rate-limit-memory.ts` - In-memory token bucket rate limiter
- `src/lib/security-logger.ts` - Security event logging utility

### Testing
- `src/lib/auth/__tests__/in-memory-store.test.ts` - Unit tests for OTP store
- `scripts/test-otp-integration.sh` - Integration test script (bash)
- `scripts/test-otp-integration.ps1` - Integration test script (PowerShell)

### Documentation
- `OTP_AUTH_PRODUCTION_FIXES.md` - Complete fix documentation

## Testing

### Unit Tests
```bash
npm test src/lib/auth/__tests__/in-memory-store.test.ts
```

### Integration Tests
```bash
# Linux/Mac
./scripts/test-otp-integration.sh http://localhost:3000

# Windows
.\scripts\test-otp-integration.ps1 http://localhost:3000
```

### Manual QA Checklist
1. ✅ Request OTP with valid phone → Should succeed
2. ✅ Request OTP with invalid phone → Should return 400
3. ✅ Request 6 OTPs rapidly → 6th should return 429
4. ✅ Enter wrong OTP 5 times → Should lock account
5. ✅ Verify OTP with valid code → Should set cookies and redirect
6. ✅ Check session endpoint → Should return user data
7. ✅ Cookies should be httpOnly and secure in production

## Environment Variables

```bash
# Feature flag (default: enabled)
FEATURE_OTP_ENABLED=true

# OTP provider
OTP_PROVIDER=dev  # or 'msg91' or 'twilio'
```

## Breaking Changes

- ❌ **Removed `earniq_user` cookie** - Client code should use `GET /api/auth/session` instead
- ⚠️ **Error response format changed** - OTP verify now returns `attemptsRemaining` and `lockoutExpiresAt` fields

## Migration Notes

- In-memory stores are fine for single-instance staging but recommend Redis for production to support horizontal scaling and persistence
- Rate limiting uses Redis when available, falls back to in-memory (resets on server restart)
- See `OTP_AUTH_PRODUCTION_FIXES.md` for detailed behavior and test instructions

## Related Issues

- Fixes security vulnerabilities identified in PR review
- Addresses rate limiting requirements for production deployment
- Implements brute-force protection as per security guidelines

## Screenshots / Notes

N/A - Backend API changes only

---

**Review Checklist:**
- [ ] Rate limiting tested (phone + IP limits)
- [ ] Brute-force protection tested (5 attempts → lockout)
- [ ] Phone validation tested (invalid formats rejected)
- [ ] Cookie security verified (httpOnly, secure flags)
- [ ] Feature flag behavior verified
- [ ] Security logging verified in console/logs
- [ ] Unit tests passing
- [ ] Integration tests passing
```

## Labels/Tags

```
security
authentication
production-ready
breaking-change
tests
```

## Reviewers

```
@security-team
@backend-team
```

## Assignees

```
@original-author
```

---

## Quick Copy (Description Only)

```markdown
This PR hardens OTP-based phone authentication for production:

- Adds per-phone (5/hr) and per-IP (10/hr) rate limiting with in-memory fallback
- Adds brute-force protection: locks OTP for 15 minutes after 5 failed attempts
- Adds strict phone normalization and Indian phone format validation
- Removes non-httpOnly earniq_user cookie; session data now via server-only cookie + /api/auth/session
- Adds feature flag (FEATURE_OTP_ENABLED) and maintenance-mode checks
- Adds security logging hooks and unit/integration tests

**Notes:**
- In-memory stores are fine for single-instance staging but recommend Redis for production to support horizontal scaling and persistence
- See OTP_AUTH_PRODUCTION_FIXES.md for detailed behavior and test instructions
```


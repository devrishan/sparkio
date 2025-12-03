# QA Smoke Test Report

**Date:** `[DATE]`  
**Environment:** `[STAGING/PRODUCTION]`  
**API Base URL:** `[URL]`  
**Tester:** `[NAME]`  
**Build/Commit:** `[COMMIT_HASH]`

---

## Test Summary

| Metric | Count |
|--------|-------|
| Total Tests | 13 |
| Passed | `[X]` |
| Failed | `[X]` |
| Skipped | `[X]` |
| Pass Rate | `[XX]%` |

---

## Test Results

### ✅ 1. Request OTP
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **Notes:** `[Any observations]`

### ✅ 2. Verify OTP
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **User Object Fields:** `[List fields present]`
- **Cookies Set:** `[Yes/No]`
- **Notes:** `[Any observations]`

### ✅ 3. Get Session
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **User Object Complete:** `[Yes/No]`
- **Fields Present:** `id, phone, username, email, referral_code, upi_id, role`
- **Notes:** `[Any observations]`

### ✅ 4. List Tasks
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **Filters Used:** `category_id, difficulty, is_active`
- **Tasks Returned:** `[X]`
- **Notes:** `[Any observations]`

### ✅ 5. Get Task Detail
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **Task ID Used:** `[ID]`
- **Fields Present:** `user_submission_count, can_submit, is_expired`
- **Notes:** `[Any observations]`

### ✅ 6. Submit Task (Multipart Upload)
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **File Upload:** `[File type/size]`
- **Content-Type:** `multipart/form-data`
- **Submission ID:** `[ID]`
- **Notes:** `[Any observations]`

### ✅ 7. Get Task Submissions
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **Submissions Returned:** `[X]`
- **Proof URL Present:** `[Yes/No]`
- **Status Values:** `[List statuses]`
- **Notes:** `[Any observations]`

### ✅ 8. Request Withdrawal
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **Amount:** `[X]`
- **UPI ID:** `[UPI]`
- **Withdrawal ID:** `[ID]`
- **Notes:** `[Any observations]`

### ✅ 9. Get Withdrawal History
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **Withdrawals Returned:** `[X]`
- **Timestamps Present:** `requested_at, approved_at, paid_at, rejected_at`
- **Receipt URL Present:** `[Yes/No]`
- **Notes:** `[Any observations]`

### ✅ 10. Download Receipt PDF
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **Content-Type:** `application/pdf`
- **File Size:** `[X] bytes`
- **PDF Valid:** `[Yes/No]`
- **Notes:** `[Any observations]`

### ✅ 11. Get Profile
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **User Object Complete:** `[Yes/No]`
- **Fields Present:** `id, phone, username, email, referral_code, upi_id, role, created_at, updated_at`
- **Notes:** `[Any observations]`

### ✅ 12. Update Profile
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **Fields Updated:** `[username, email, upi_id]`
- **Validation:** `[Passed/Failed]`
- **Duplicate Check:** `[Passed/Failed]`
- **Notes:** `[Any observations]`

### ✅ 13. Logout
- **Status:** `PASS/FAIL/SKIP`
- **Status Code:** `200`
- **Response Time:** `[XX]ms`
- **Cookies Cleared:** `[Yes/No]`
- **Notes:** `[Any observations]`

---

## Issues Found

### Critical Issues
- `[None / List critical issues]`

### High Priority Issues
- `[None / List high priority issues]`

### Medium Priority Issues
- `[None / List medium priority issues]`

### Low Priority / Observations
- `[None / List observations]`

---

## Detailed Issue Reports

### Issue #1: `[Title]`
- **Endpoint:** `[Endpoint]`
- **Severity:** `[Critical/High/Medium/Low]`
- **Steps to Reproduce:**
  1. `[Step 1]`
  2. `[Step 2]`
  3. `[Step 3]`
- **Expected Behavior:** `[What should happen]`
- **Actual Behavior:** `[What actually happened]`
- **Request:** `[Request details]`
- **Response:** `[Response details]`
- **Screenshots/Logs:** `[Attach if available]`

---

## Performance Notes

| Endpoint | Avg Response Time | Notes |
|----------|-------------------|-------|
| OTP Request | `[XX]ms` | |
| OTP Verify | `[XX]ms` | |
| Get Session | `[XX]ms` | |
| List Tasks | `[XX]ms` | |
| Submit Task | `[XX]ms` | |
| Get Profile | `[XX]ms` | |

---

## Browser/Client Testing

### Frontend Integration
- **Task Submission Form:** `[PASS/FAIL]`
- **File Upload UI:** `[PASS/FAIL]`
- **Profile Update Form:** `[PASS/FAIL]`
- **Error Handling:** `[PASS/FAIL]`
- **Loading States:** `[PASS/FAIL]`

### Browser Compatibility
- **Chrome:** `[PASS/FAIL]`
- **Firefox:** `[PASS/FAIL]`
- **Safari:** `[PASS/FAIL]`
- **Edge:** `[PASS/FAIL]`

---

## Recommendations

1. `[Recommendation 1]`
2. `[Recommendation 2]`
3. `[Recommendation 3]`

---

## Sign-off

**QA Status:** `[APPROVED / NEEDS FIXES / BLOCKED]`

**Tester Signature:** `[NAME]`  
**Date:** `[DATE]`

**Developer Review:** `[NAME]`  
**Date:** `[DATE]`

---

## Additional Notes

`[Any additional context, edge cases tested, or follow-up actions]`


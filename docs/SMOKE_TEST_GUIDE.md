# Smoke Test Guide - Complete Testing Resources

This guide provides all the resources needed to smoke test the Earniq API after implementing the FormData task submission and profile endpoints.

---

## 📦 Available Resources

### 1. Postman Collection
**File:** `docs/postman_collection.json`

**Usage:**
1. Open Postman
2. Click "Import" → Select `docs/postman_collection.json`
3. Set environment variables:
   - `api_base`: Your staging API URL (e.g., `https://staging.api.earniq.app`)
   - `phone`: Test phone number
   - `otp`: OTP code (enter after receiving)
   - `task_id`: Task ID (auto-populated after listing tasks)
   - `upi_id`: Test UPI ID
4. Run collection in sequence (1-13)

**Features:**
- Pre-configured requests with tests
- Automatic variable extraction (task_id, withdrawal_id)
- Response validation
- Cookie management

---

### 2. Automated Bash Script
**File:** `scripts/smoke-test.sh`

**Usage:**
```bash
# Basic usage
./scripts/smoke-test.sh

# With custom API base and phone
./scripts/smoke-test.sh https://staging.api.earniq.app 9123456789

# With OTP (skip prompt)
./scripts/smoke-test.sh https://staging.api.earniq.app 9123456789 123456
```

**Requirements:**
- `curl` (usually pre-installed)
- `jq` (for JSON formatting) - optional but recommended
  - macOS: `brew install jq`
  - Linux: `sudo apt-get install jq` or `sudo yum install jq`
  - Windows: Use WSL or Git Bash

**Features:**
- Color-coded output (pass/fail/warn)
- Automatic cookie management
- Test summary at end
- Exit code 0 on success, 1 on failure (CI/CD friendly)

**Windows Note:** Run via Git Bash or WSL. The script will work but may not have execute permissions set (Windows doesn't use chmod).

---

### 3. Manual curl Commands
**Reference:** See original smoke test plan in PR description

**Quick Reference:**
```bash
# Set base URL
API_BASE="https://staging.api.earniq.app"

# 1. Request OTP
curl -X POST "$API_BASE/api/auth/otp/request" \
  -H "Content-Type: application/json" \
  -d '{"phone":"9123456789"}'

# 2. Verify OTP (save cookies)
curl -X POST "$API_BASE/api/auth/otp/verify" \
  -c cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"phone":"9123456789","otp":"123456"}'

# 3. Get Session
curl -X GET "$API_BASE/api/auth/session" \
  -b cookies.txt

# 4. List Tasks
curl -X GET "$API_BASE/api/tasks?difficulty=easy&is_active=true" \
  -b cookies.txt

# 5. Get Task Detail
curl -X GET "$API_BASE/api/tasks/<TASK_ID>" \
  -b cookies.txt

# 6. Submit Task (multipart)
curl -X POST "$API_BASE/api/member/tasks/submit" \
  -b cookies.txt \
  -F "task_id=<TASK_ID>" \
  -F "proof=@/path/to/proof.jpg" \
  -F "notes=Test submission"

# 7. Get Submissions
curl -X GET "$API_BASE/api/member/tasks/submissions" \
  -b cookies.txt

# 8. Request Withdrawal
curl -X POST "$API_BASE/api/member/withdraw" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"upiId":"test@upi"}'

# 9. Get Withdrawal History
curl -X GET "$API_BASE/api/member/withdrawals" \
  -b cookies.txt

# 10. Download Receipt
curl -X GET "$API_BASE/api/member/withdrawals/<ID>/receipt" \
  -b cookies.txt \
  -o receipt.pdf

# 11. Get Profile
curl -X GET "$API_BASE/api/member/profile" \
  -b cookies.txt

# 12. Update Profile
curl -X PUT "$API_BASE/api/member/profile" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"username":"newname","upi_id":"new@upi"}'

# 13. Logout
curl -X POST "$API_BASE/api/auth/logout" \
  -b cookies.txt
```

---

### 4. QA Report Template
**File:** `docs/QA_REPORT_TEMPLATE.md`

**Usage:**
1. Copy the template
2. Fill in test results as you run tests
3. Document any issues found
4. Attach to PR or release notes

**Sections:**
- Test summary table
- Individual test results
- Issue reports
- Performance notes
- Browser/client testing
- Recommendations
- Sign-off

---

## 🎯 Test Execution Order

Run tests in this exact sequence:

1. ✅ Request OTP
2. ✅ Verify OTP (receives auth cookies)
3. ✅ Get Session (verify full user object)
4. ✅ List Tasks (test filters: `category_id`, `difficulty`, `is_active`)
5. ✅ Get Task Detail
6. ✅ Submit Task (multipart file upload) ⚠️ **Key test for FormData fix**
7. ✅ Get Task Submissions (verify submission record)
8. ✅ Request Withdrawal
9. ✅ Get Withdrawal History (verify timestamps, receipt_url)
10. ✅ Download Receipt PDF
11. ✅ Get Profile ⚠️ **New endpoint**
12. ✅ Update Profile ⚠️ **New endpoint**
13. ✅ Logout

---

## ✅ Expected Results Checklist

### Critical Validations

- [ ] **OTP Verify** returns full user object with: `id`, `phone`, `username`, `email`, `referral_code`, `upi_id`, `role`
- [ ] **Get Session** returns same full user object structure
- [ ] **Task Submit** uses `multipart/form-data` (check request headers)
- [ ] **Task Submit** endpoint is `/api/member/tasks/submit` (not `/api/member/submit-task`)
- [ ] **Task Submit** includes `proof` field as file (not `proof_url` as string)
- [ ] **Get Profile** returns full user object with all fields
- [ ] **Update Profile** accepts `username`, `email`, `upi_id` and validates duplicates
- [ ] **Update Profile** returns updated user object

---

## 🐛 Common Issues & Fixes

### Issue: 404 on `/api/member/tasks/submit`
**Fix:** Ensure frontend calls `/api/member/tasks/submit` (not `/api/member/submit-task`)

### Issue: 400 on task submit - missing proof field
**Fix:** Verify FormData key is `proof` (not `proof_file` or `proof_url`)

### Issue: 401 on authenticated endpoints
**Fix:** 
- Verify cookies are being sent (`-b cookies.txt` in curl)
- Re-run OTP verify to get fresh cookies
- Check cookie domain/path matches API base URL

### Issue: Missing user fields in session/OTP responses
**Fix:** 
- Verify backend changes deployed
- Check server logs for Prisma errors
- Ensure user exists in database

### Issue: Receipt PDF returns HTML or 500
**Fix:** 
- Check server logs
- Verify S3/local storage paths configured
- Ensure PDF generation library installed

---

## 📊 Success Criteria

**All tests must pass:**
- ✅ All 13 endpoints return expected status codes
- ✅ Response shapes match API contract
- ✅ File upload works (multipart/form-data)
- ✅ Full user objects returned from auth endpoints
- ✅ Profile endpoints functional
- ✅ No critical errors in server logs

**Ready for Production:**
- [ ] All smoke tests pass
- [ ] QA report completed
- [ ] No critical issues found
- [ ] Performance acceptable
- [ ] Documentation updated

---

## 🚀 Next Steps After Testing

1. **If all tests pass:**
   - Update `docs/API_CONTRACT.md` (mark endpoints as verified)
   - Update `docs/API_MISMATCH_ANALYSIS.md` (mark fixes as complete)
   - Merge PR
   - Deploy to production

2. **If tests fail:**
   - Document issues in QA report
   - Create GitHub issues for each failure
   - Fix issues and re-test
   - Update this guide with any new findings

---

## 📝 Notes

- **Staging Environment:** Always test on staging first
- **Test Data:** Use dedicated test accounts/phone numbers
- **Cleanup:** Remove test data after testing if possible
- **Logs:** Monitor server logs during testing for errors
- **Performance:** Note response times for performance baseline

---

**Last Updated:** `[DATE]`  
**Tested By:** `[NAME]`  
**Environment:** `[STAGING/PRODUCTION]`


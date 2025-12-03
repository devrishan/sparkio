# PR / Release Checklist

**PR Title:** `fix(api): task submission FormData + add profile endpoints + return full user in auth`

**Date:** `[DATE]`  
**Author:** `[NAME]`  
**Reviewers:** `[NAMES]`

---

## ✅ Code Changes

### Frontend Changes
- [x] `src/api/tasks.ts` - Updated `submitTask()` to use FormData and `/api/member/tasks/submit`
- [x] `app/(dashboard)/member/tasks/[id]/page.tsx` - Changed from URL input to file input
- [x] `src/api/axios.ts` - Added FormData handling (skip Content-Type header)
- [x] `src/api/tasks.ts` - Updated `getTasks()` filters to use `category_id`, `difficulty`, `is_active`

### Backend Changes
- [x] `app/api/member/profile/route.ts` - Created new file with GET and PUT handlers
- [x] `app/api/auth/session/route.ts` - Updated to return full user object
- [x] `app/api/auth/otp/verify/route.ts` - Updated to return full user object

---

## ✅ Quality Checks

- [ ] **Lint:** All files pass linting (`npm run lint`)
- [ ] **Build:** Project builds successfully (`npm run build`)
- [ ] **Type Check:** TypeScript compilation passes (`npm run type-check` or `tsc --noEmit`)
- [ ] **Tests:** All existing tests pass (`npm test`)
- [ ] **No Console Errors:** Check browser console for errors
- [ ] **No Type Errors:** IDE shows no TypeScript errors

---

## ✅ Testing

### Manual Smoke Tests
- [ ] **1. Request OTP** - Status 200, receives OTP
- [ ] **2. Verify OTP** - Status 200, receives full user object with all fields
- [ ] **3. Get Session** - Status 200, returns full user object
- [ ] **4. List Tasks** - Status 200, filters work (`category_id`, `difficulty`, `is_active`)
- [ ] **5. Get Task Detail** - Status 200, task object returned
- [ ] **6. Submit Task** - Status 200, multipart upload works, file stored correctly
- [ ] **7. Get Submissions** - Status 200, submission appears with `proof_url`
- [ ] **8. Request Withdrawal** - Status 200, withdrawal created
- [ ] **9. Get Withdrawal History** - Status 200, timestamps present
- [ ] **10. Download Receipt** - Status 200, PDF downloaded
- [ ] **11. Get Profile** - Status 200, full user object returned
- [ ] **12. Update Profile** - Status 200, profile updated, duplicates validated
- [ ] **13. Logout** - Status 200, cookies cleared

### Automated Tests
- [ ] Run `scripts/smoke-test.sh` - All tests pass
- [ ] Import Postman collection - All requests succeed
- [ ] CI/CD pipeline passes (if applicable)

### Edge Cases
- [ ] Submit task without file - Returns appropriate error
- [ ] Submit task with invalid file type - Returns appropriate error
- [ ] Update profile with duplicate username - Returns 409
- [ ] Update profile with duplicate email - Returns 409
- [ ] Get session without auth cookie - Returns 401
- [ ] Submit task without auth cookie - Returns 401

---

## ✅ Documentation

- [ ] **API Contract Updated:** `docs/API_CONTRACT.md` reflects changes
- [ ] **Mismatch Analysis Updated:** `docs/API_MISMATCH_ANALYSIS.md` marks fixes as complete
- [ ] **QA Report:** `docs/QA_REPORT_TEMPLATE.md` filled out (if manual testing done)
- [ ] **Code Comments:** Complex logic has inline comments
- [ ] **PR Description:** Includes summary of changes and testing notes

---

## ✅ Deployment

### Pre-Deployment
- [ ] **Staging Deployed:** Changes deployed to staging environment
- [ ] **Staging Smoke Tests:** All smoke tests pass on staging
- [ ] **Environment Variables:** All required env vars set (if any)
- [ ] **Database Migrations:** Any schema changes applied (if applicable)
- [ ] **Dependencies:** All new dependencies installed

### Post-Deployment
- [ ] **Production Deployed:** Changes deployed to production
- [ ] **Production Smoke Tests:** Critical paths tested on production
- [ ] **Monitoring:** Error logs checked, no critical errors
- [ ] **Rollback Plan:** Documented (if needed)

---

## ✅ Security & Performance

- [ ] **Authentication:** Auth cookies properly set and cleared
- [ ] **File Upload:** File size limits enforced
- [ ] **File Validation:** File type validation works
- [ ] **Rate Limiting:** OTP rate limiting still works
- [ ] **SQL Injection:** Prisma queries use parameterized queries (automatic)
- [ ] **XSS:** Input sanitization in place (if applicable)
- [ ] **CORS:** CORS headers correct (if applicable)
- [ ] **Performance:** Response times acceptable (< 500ms for most endpoints)

---

## ✅ User Experience

- [ ] **File Upload UI:** File input works, shows selected file name
- [ ] **Error Messages:** Clear error messages displayed to user
- [ ] **Loading States:** Loading indicators shown during API calls
- [ ] **Success Feedback:** Success messages shown after actions
- [ ] **Form Validation:** Client-side validation works
- [ ] **Mobile Responsive:** UI works on mobile devices

---

## ✅ Browser Compatibility

- [ ] **Chrome:** Tested and working
- [ ] **Firefox:** Tested and working
- [ ] **Safari:** Tested and working
- [ ] **Edge:** Tested and working
- [ ] **Mobile Safari:** Tested and working (if applicable)
- [ ] **Mobile Chrome:** Tested and working (if applicable)

---

## 📝 Notes

### Known Issues
- `[List any known issues or limitations]`

### Future Improvements
- `[List any follow-up work needed]`

### Dependencies
- `[List any new dependencies added]`

---

## ✅ Sign-off

**Developer:** `[NAME]` ✅  
**Date:** `[DATE]`

**QA:** `[NAME]` ✅  
**Date:** `[DATE]`

**Tech Lead/Reviewer:** `[NAME]` ✅  
**Date:** `[DATE]`

---

## 🚀 Ready to Merge?

- [ ] All checkboxes above are checked
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] No blocking issues

**Status:** `[READY / NEEDS WORK / BLOCKED]`


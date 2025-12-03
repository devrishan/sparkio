# Quick Setup: Enable Mock Data for Login

## Problem
The login was failing because it was trying to connect to the PHP backend that was removed.

## Solution
I've updated the login route to use mock data when mock mode is enabled.

## Steps to Enable Mock Mode

1. **Create or update `.env.local` file** in the root directory:
```bash
USE_MOCK_DATA=true
```

2. **Restart your Next.js dev server**:
```bash
npm run dev
```

3. **Try logging in** with any credentials:
   - Email: `demo@example.com` (or any email)
   - Password: `password123` (or any password)

## What Changed

- ✅ Updated `/app/api/auth/login/route.ts` to check for mock mode
- ✅ Uses mock authentication service when `USE_MOCK_DATA=true`
- ✅ Accepts any email/password for demo purposes
- ✅ Returns proper user data and sets authentication cookies

## Test Credentials

You can use any of these:
- `admin@earniq.app` / any password → **Admin user** (role: admin)
- `admin@example.com` / any password → **Admin user** (any email starting with "admin")
- `john@example.com` / any password → **Member user** (john_doe)
- `demo@example.com` / any password → **Member user** (default demo user)
- Any other email / any password → **Member user** (will create a demo user)

**Note:** Admin emails are detected by:
- Exact match: `admin@earniq.app`
- Contains: `admin@` (e.g., `admin@example.com`)
- Starts with: `admin` (e.g., `admin123@test.com`)

## Alternative: Enable via URL

You can also enable mock mode temporarily by adding `?mock=true` to your URL:
```
http://localhost:3000/login?mock=true
```

## Notes

- Mock mode only works in development
- In production, you'll need to set up proper authentication
- The mock system is fully functional and can be used for frontend development


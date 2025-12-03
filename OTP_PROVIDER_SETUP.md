# OTP Provider Setup Guide

This guide explains how to swap between different OTP providers (dev, MSG91, Twilio) for phone authentication in Earniq.

## Current Implementation

The OTP system currently uses an in-memory store for development and supports three provider modes:

1. **dev** (default) - Logs OTP to server console (development only)
2. **msg91** - Sends OTP via MSG91 SMS service
3. **twilio** - Sends OTP via Twilio SMS service

## Configuration

Set the `OTP_PROVIDER` environment variable in your `.env.local` file:

```bash
OTP_PROVIDER=dev  # or 'msg91' or 'twilio'
```

## Dev Provider (Default)

In development mode, OTPs are logged to the server console. No additional setup required.

**Example:**
```
[OTP][DEV] OTP for 919876543210: 123456
[OTP][DEV] Valid for 300 seconds
```

## MSG91 Provider

To use MSG91 for sending OTPs:

1. Sign up for MSG91 at https://msg91.com
2. Get your API key from the dashboard
3. Set up a sender ID (e.g., "EARNIQ")
4. Create a message template (optional, but recommended)

**Environment Variables:**
```bash
OTP_PROVIDER=msg91
MSG91_API_KEY=your-msg91-api-key
MSG91_SENDER_ID=EARNIQ
MSG91_TEMPLATE_ID=your-template-id  # Optional
```

**Implementation Location:**
- OTP sending logic: `src/lib/otp-provider.ts` (existing implementation)
- OTP request endpoint: `app/api/auth/otp/request/route.ts`

## Twilio Provider

To use Twilio for sending OTPs:

1. Sign up for Twilio at https://www.twilio.com
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number (or use a trial number)

**Environment Variables:**
```bash
OTP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
```

**Implementation Location:**
- OTP sending logic: `src/lib/otp-provider.ts` (existing implementation)
- OTP request endpoint: `app/api/auth/otp/request/route.ts`

## Switching Providers

### Step 1: Update Environment Variables

Update your `.env.local` file with the appropriate provider and credentials:

```bash
# For MSG91
OTP_PROVIDER=msg91
MSG91_API_KEY=your-key-here

# OR for Twilio
OTP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-sid-here
TWILIO_AUTH_TOKEN=your-token-here
```

### Step 2: Install Required Dependencies

If not already installed:

```bash
# For MSG91 (uses axios)
npm install axios

# For Twilio
npm install twilio
```

### Step 3: Restart Development Server

After updating environment variables, restart your Next.js dev server:

```bash
npm run dev
```

## Code Structure

### OTP Request Flow

1. **Client** calls `POST /api/auth/otp/request` with phone number
2. **Server** (`app/api/auth/otp/request/route.ts`):
   - Validates phone number
   - Generates 6-digit OTP
   - Stores OTP in-memory with 5-minute expiry
   - Calls provider-specific send function
   - Returns success response

### Provider Selection Logic

The provider is selected in `app/api/auth/otp/request/route.ts`:

```typescript
const provider = process.env.OTP_PROVIDER || 'dev';

if (provider === 'dev' || process.env.NODE_ENV !== 'production') {
  // Log to console
} else if (provider === 'msg91') {
  // Use MSG91 service
} else if (provider === 'twilio') {
  // Use Twilio service
}
```

## Production Considerations

1. **Security**: Never use `dev` provider in production
2. **Rate Limiting**: Consider implementing rate limiting per phone number
3. **OTP Storage**: In production, use Redis or database instead of in-memory store
4. **Error Handling**: Ensure proper error handling for SMS delivery failures
5. **Monitoring**: Set up logging/monitoring for OTP delivery success rates

## Testing

### Test Dev Provider
```bash
OTP_PROVIDER=dev npm run dev
# Check server logs for OTP
```

### Test MSG91 Provider
```bash
OTP_PROVIDER=msg91 MSG91_API_KEY=your-key npm run dev
# Send OTP request and check SMS
```

### Test Twilio Provider
```bash
OTP_PROVIDER=twilio TWILIO_ACCOUNT_SID=your-sid TWILIO_AUTH_TOKEN=your-token npm run dev
# Send OTP request and check SMS
```

## Troubleshooting

### OTP Not Received

1. Check server logs for errors
2. Verify API credentials are correct
3. Check phone number format (should be normalized)
4. Verify provider account has sufficient credits/balance

### Dev Mode Not Working

1. Ensure `OTP_PROVIDER=dev` is set
2. Check server console output
3. Verify you're in development mode (`NODE_ENV !== 'production'`)

## Future Enhancements

- Add support for WhatsApp OTP (Twilio/other providers)
- Implement OTP delivery status webhooks
- Add SMS delivery retry logic
- Implement OTP expiry notifications


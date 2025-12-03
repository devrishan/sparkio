#!/bin/bash
# Integration tests for OTP authentication endpoints
# Usage: ./scripts/test-otp-integration.sh [base_url]
# Example: ./scripts/test-otp-integration.sh http://localhost:3000

BASE_URL="${1:-http://localhost:3000}"
TEST_PHONE="9876543210"
INVALID_PHONE="123456"
INVALID_OTP="000000"

echo "=== OTP Authentication Integration Tests ==="
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Request OTP with valid phone
echo "Test 1: Request OTP with valid phone"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/otp/request" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$TEST_PHONE\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ PASS: OTP requested successfully"
  echo "Response: $BODY"
  # Extract OTP from server logs (manual step)
  echo "⚠️  Check server logs for OTP code"
else
  echo "❌ FAIL: Expected 200, got $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 2: Request OTP with invalid phone format
echo "Test 2: Request OTP with invalid phone format"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/otp/request" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$INVALID_PHONE\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "400" ]; then
  echo "✅ PASS: Invalid phone rejected"
else
  echo "❌ FAIL: Expected 400, got $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 3: Rate limiting - request 6 OTPs rapidly
echo "Test 3: Rate limiting (request 6 OTPs rapidly)"
echo "Making 6 requests..."
for i in {1..6}; do
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/otp/request" \
    -H "Content-Type: application/json" \
    -d "{\"phone\":\"$TEST_PHONE\"}")
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)
  
  if [ "$HTTP_CODE" = "429" ]; then
    echo "✅ PASS: Rate limit triggered on request $i"
    echo "Response: $BODY"
    break
  elif [ $i -eq 6 ]; then
    echo "⚠️  WARNING: Rate limit not triggered after 6 requests"
  fi
done
echo ""

# Test 4: Verify OTP with invalid code (test brute-force protection)
echo "Test 4: Brute-force protection (5 invalid attempts)"
echo "First, request a valid OTP..."
curl -s -X POST "$BASE_URL/api/auth/otp/request" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$TEST_PHONE\"}" > /dev/null

echo "Making 5 invalid verification attempts..."
for i in {1..5}; do
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/otp/verify" \
    -H "Content-Type: application/json" \
    -d "{\"phone\":\"$TEST_PHONE\",\"otp\":\"$INVALID_OTP\"}")
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)
  
  if [ "$HTTP_CODE" = "429" ]; then
    echo "✅ PASS: Account locked after 5 failed attempts (request $i)"
    echo "Response: $BODY"
    break
  fi
done
echo ""

# Test 5: Verify OTP with valid code (requires manual OTP input)
echo "Test 5: Verify OTP (requires manual OTP from server logs)"
echo "Enter OTP from server logs: "
read -r VALID_OTP

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/otp/verify" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$TEST_PHONE\",\"otp\":\"$VALID_OTP\"}" \
  -c /tmp/cookies.txt)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ PASS: OTP verified successfully"
  echo "Response: $BODY"
  echo "Cookies saved to /tmp/cookies.txt"
else
  echo "❌ FAIL: Expected 200, got $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 6: Session endpoint with cookies
echo "Test 6: Check session with cookies"
if [ -f /tmp/cookies.txt ]; then
  RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/auth/session" \
    -b /tmp/cookies.txt)
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ PASS: Session retrieved successfully"
    echo "Response: $BODY"
  else
    echo "❌ FAIL: Expected 200, got $HTTP_CODE"
    echo "Response: $BODY"
  fi
else
  echo "⚠️  SKIP: No cookies file found (run Test 5 first)"
fi
echo ""

# Test 7: Session endpoint without cookies
echo "Test 7: Check session without cookies"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/auth/session")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ PASS: Session endpoint returns 200 (unauthenticated)"
  echo "Response: $BODY"
else
  echo "❌ FAIL: Expected 200, got $HTTP_CODE"
  echo "Response: $BODY"
fi
echo ""

# Test 8: Logout
echo "Test 8: Logout"
if [ -f /tmp/cookies.txt ]; then
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/logout" \
    -b /tmp/cookies.txt -c /tmp/cookies_after_logout.txt)
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ PASS: Logout successful"
  else
    echo "❌ FAIL: Expected 200, got $HTTP_CODE"
    echo "Response: $BODY"
  fi
else
  echo "⚠️  SKIP: No cookies file found"
fi
echo ""

echo "=== Integration Tests Complete ==="
echo "Cleanup: rm -f /tmp/cookies.txt /tmp/cookies_after_logout.txt"


#!/usr/bin/env bash
# Full Smoke Test with Complete Output Capture
set -euo pipefail

API_BASE="${1:-https://staging.api.earniq.app}"
PHONE="${2:-9123456789}"
OTP="${3:-}"

COOKIE_FILE=$(mktemp)
RESULTS_FILE=$(mktemp)
trap "rm -f $COOKIE_FILE $RESULTS_FILE" EXIT

# Create a test image file for upload
TEST_IMAGE=$(mktemp).jpg
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > "$TEST_IMAGE" 2>/dev/null || echo "Test image content" > "$TEST_IMAGE"

RESULTS="[]"

add_result() {
    local step="$1"
    local method="$2"
    local url="$3"
    local status="$4"
    local req_headers="$5"
    local req_body_summary="$6"
    local resp_headers="$7"
    local resp_body="$8"
    local error="${9:-}"
    
    local result=$(cat <<EOF
{
  "step": "$step",
  "method": "$method",
  "url": "$url",
  "status": $status,
  "request_headers": $(echo "$req_headers" | jq -Rs . || echo '""'),
  "request_body_summary": "$req_body_summary",
  "response_headers": $(echo "$resp_headers" | jq -Rs . || echo '""'),
  "response_body": $(echo "$resp_body" | jq -Rs . || echo '""'),
  "error": $(echo "$error" | jq -Rs . || echo 'null')
}
EOF
)
    RESULTS=$(echo "$RESULTS" | jq ". += [$result]")
}

# Step 1: Request OTP
echo "Step 1: Request OTP" >&2
response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X POST "$API_BASE/api/auth/otp/request" \
    -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\"}" \
    -D /dev/stderr 2>&1 || echo -e "\n000\n{}")

status=$(echo "$response" | tail -n2 | head -n1)
headers=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d' | sed '$d')
req_headers="Content-Type: application/json"

add_result "Request OTP" "POST" "$API_BASE/api/auth/otp/request" "$status" \
    "$req_headers" "{\"phone\":\"$PHONE\"}" "$headers" "$body"

if [ -z "$OTP" ]; then
    echo "Enter OTP: " >&2
    read -r OTP
fi

# Step 2: Verify OTP
echo "Step 2: Verify OTP" >&2
response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X POST "$API_BASE/api/auth/otp/verify" \
    -c "$COOKIE_FILE" \
    -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\",\"otp\":\"$OTP\",\"referralCode\":null}" \
    -D /dev/stderr 2>&1 || echo -e "\n000\n{}")

status=$(echo "$response" | tail -n2 | head -n1)
headers=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d' | sed '$d')

add_result "Verify OTP" "POST" "$API_BASE/api/auth/otp/verify" "$status" \
    "$req_headers" "{\"phone\":\"$PHONE\",\"otp\":\"***\",\"referralCode\":null}" "$headers" "$body"

if [ "$status" != "200" ]; then
    echo "OTP verification failed. Cannot continue." >&2
    echo "$RESULTS" | jq .
    exit 1
fi

# Step 3: Get Session
echo "Step 3: Get Session" >&2
response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X GET "$API_BASE/api/auth/session" \
    -b "$COOKIE_FILE" \
    -H "Accept: application/json" \
    -D /dev/stderr 2>&1 || echo -e "\n000\n{}")

status=$(echo "$response" | tail -n2 | head -n1)
headers=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d' | sed '$d')

add_result "Get Session" "GET" "$API_BASE/api/auth/session" "$status" \
    "Accept: application/json" "" "$headers" "$body"

# Step 4: List Tasks
echo "Step 4: List Tasks" >&2
response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X GET "$API_BASE/api/tasks?difficulty=easy&is_active=true" \
    -H "Accept: application/json" \
    -D /dev/stderr 2>&1 || echo -e "\n000\n{}")

status=$(echo "$response" | tail -n2 | head -n1)
headers=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d' | sed '$d')

TASK_ID=$(echo "$body" | jq -r '.tasks[0].id // empty' 2>/dev/null || echo "")
CATEGORY_ID=$(echo "$body" | jq -r '.tasks[0].category.id // empty' 2>/dev/null || echo "")

add_result "List Tasks" "GET" "$API_BASE/api/tasks?difficulty=easy&is_active=true" "$status" \
    "Accept: application/json" "" "$headers" "$body"

# Step 5: Get Task Detail
if [ -n "$TASK_ID" ]; then
    echo "Step 5: Get Task Detail" >&2
    response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X GET "$API_BASE/api/tasks/$TASK_ID" \
        -b "$COOKIE_FILE" \
        -H "Accept: application/json" \
        -D /dev/stderr 2>&1 || echo -e "\n000\n{}")
    
    status=$(echo "$response" | tail -n2 | head -n1)
    headers=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d' | sed '$d')
    
    add_result "Get Task Detail" "GET" "$API_BASE/api/tasks/$TASK_ID" "$status" \
        "Accept: application/json" "" "$headers" "$body"
else
    add_result "Get Task Detail" "GET" "$API_BASE/api/tasks/<TASK_ID>" "000" \
        "" "" "" "No task ID available"
fi

# Step 6: Submit Task
if [ -n "$TASK_ID" ]; then
    echo "Step 6: Submit Task" >&2
    response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X POST "$API_BASE/api/member/tasks/submit" \
        -b "$COOKIE_FILE" \
        -F "task_id=$TASK_ID" \
        -F "proof=@$TEST_IMAGE" \
        -F "notes=smoke test" \
        -D /dev/stderr 2>&1 || echo -e "\n000\n{}")
    
    status=$(echo "$response" | tail -n2 | head -n1)
    headers=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d' | sed '$d')
    
    add_result "Submit Task" "POST" "$API_BASE/api/member/tasks/submit" "$status" \
        "Content-Type: multipart/form-data" "task_id=$TASK_ID, proof=<file>, notes=smoke test" "$headers" "$body"
else
    add_result "Submit Task" "POST" "$API_BASE/api/member/tasks/submit" "000" \
        "" "" "" "No task ID available"
fi

# Step 7: Get Submissions
echo "Step 7: Get Submissions" >&2
response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X GET "$API_BASE/api/member/tasks/submissions?page=1&perPage=10" \
    -b "$COOKIE_FILE" \
    -H "Accept: application/json" \
    -D /dev/stderr 2>&1 || echo -e "\n000\n{}")

status=$(echo "$response" | tail -n2 | head -n1)
headers=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d' | sed '$d')

add_result "Get Submissions" "GET" "$API_BASE/api/member/tasks/submissions?page=1&perPage=10" "$status" \
    "Accept: application/json" "" "$headers" "$body"

# Step 8: Request Withdrawal
echo "Step 8: Request Withdrawal" >&2
response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X POST "$API_BASE/api/member/withdraw" \
    -b "$COOKIE_FILE" \
    -H "Content-Type: application/json" \
    -d "{\"amount\":100,\"upiId\":\"test@upi\"}" \
    -D /dev/stderr 2>&1 || echo -e "\n000\n{}")

status=$(echo "$response" | tail -n2 | head -n1)
headers=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d' | sed '$d')

WITHDRAWAL_ID=$(echo "$body" | jq -r '.withdrawal.id // empty' 2>/dev/null || echo "")

add_result "Request Withdrawal" "POST" "$API_BASE/api/member/withdraw" "$status" \
    "Content-Type: application/json" "{\"amount\":100,\"upiId\":\"test@upi\"}" "$headers" "$body"

# Step 9: Get Withdrawal History
echo "Step 9: Get Withdrawal History" >&2
response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X GET "$API_BASE/api/member/withdrawals?status=PENDING&page=1&perPage=10" \
    -b "$COOKIE_FILE" \
    -H "Accept: application/json" \
    -D /dev/stderr 2>&1 || echo -e "\n000\n{}")

status=$(echo "$response" | tail -n2 | head -n1)
headers=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d' | sed '$d')

if [ -z "$WITHDRAWAL_ID" ]; then
    WITHDRAWAL_ID=$(echo "$body" | jq -r '.withdrawals[0].id // empty' 2>/dev/null || echo "")
fi

add_result "Get Withdrawal History" "GET" "$API_BASE/api/member/withdrawals?status=PENDING&page=1&perPage=10" "$status" \
    "Accept: application/json" "" "$headers" "$body"

# Step 10: Download Receipt
if [ -n "$WITHDRAWAL_ID" ] && [ "$WITHDRAWAL_ID" != "null" ]; then
    echo "Step 10: Download Receipt" >&2
    response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X GET "$API_BASE/api/member/withdrawals/$WITHDRAWAL_ID/receipt" \
        -b "$COOKIE_FILE" \
        -D /dev/stderr 2>&1 || echo -e "\n000\n{}")
    
    status=$(echo "$response" | tail -n2 | head -n1)
    headers=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d' | sed '$d')
    
    add_result "Download Receipt" "GET" "$API_BASE/api/member/withdrawals/$WITHDRAWAL_ID/receipt" "$status" \
        "" "" "$headers" "$(echo "$body" | head -c 200 | base64 2>/dev/null || echo "<binary>")"
else
    add_result "Download Receipt" "GET" "$API_BASE/api/member/withdrawals/<ID>/receipt" "000" \
        "" "" "" "No withdrawal ID available"
fi

# Step 11: Get Profile
echo "Step 11: Get Profile" >&2
response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X GET "$API_BASE/api/member/profile" \
    -b "$COOKIE_FILE" \
    -H "Accept: application/json" \
    -D /dev/stderr 2>&1 || echo -e "\n000\n{}")

status=$(echo "$response" | tail -n2 | head -n1)
headers=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d' | sed '$d')

add_result "Get Profile" "GET" "$API_BASE/api/member/profile" "$status" \
    "Accept: application/json" "" "$headers" "$body"

# Step 12: Update Profile
echo "Step 12: Update Profile" >&2
response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X PUT "$API_BASE/api/member/profile" \
    -b "$COOKIE_FILE" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"smoke-test\",\"upi_id\":\"smoke@upi\"}" \
    -D /dev/stderr 2>&1 || echo -e "\n000\n{}")

status=$(echo "$response" | tail -n2 | head -n1)
headers=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d' | sed '$d')

add_result "Update Profile" "PUT" "$API_BASE/api/member/profile" "$status" \
    "Content-Type: application/json" "{\"username\":\"smoke-test\",\"upi_id\":\"smoke@upi\"}" "$headers" "$body"

# Step 13: Logout
echo "Step 13: Logout" >&2
response=$(curl -sS -w "\n%{http_code}\n%{header_json}" -X POST "$API_BASE/api/auth/logout" \
    -b "$COOKIE_FILE" \
    -D /dev/stderr 2>&1 || echo -e "\n000\n{}")

status=$(echo "$response" | tail -n2 | head -n1)
headers=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d' | sed '$d')

add_result "Logout" "POST" "$API_BASE/api/auth/logout" "$status" \
    "" "" "$headers" "$body"

rm -f "$TEST_IMAGE"

echo "$RESULTS" | jq .


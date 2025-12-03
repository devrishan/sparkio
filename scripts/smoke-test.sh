#!/usr/bin/env bash
# Earniq API Smoke Test Script
# Run this script to test all API endpoints sequentially
# Usage: ./scripts/smoke-test.sh [API_BASE] [PHONE] [OTP]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE="${1:-https://staging.api.earniq.app}"
PHONE="${2:-9123456789}"
OTP="${3:-}"

# Cookie file for session management
COOKIE_FILE=$(mktemp)
trap "rm -f $COOKIE_FILE" EXIT

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_SKIPPED=0

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((TESTS_PASSED++))
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((TESTS_FAILED++))
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    ((TESTS_SKIPPED++))
}

test_endpoint() {
    local name="$1"
    local method="$2"
    local url="$3"
    local data="$4"
    local expected_status="${5:-200}"
    local check_field="${6:-}"
    
    log_info "Testing: $name"
    
    local response
    local status_code
    
    if [ "$method" = "GET" ]; then
        response=$(curl -sS -w "\n%{http_code}" -X GET "$url" \
            -b "$COOKIE_FILE" \
            -H "Accept: application/json" 2>&1) || true
    elif [ "$method" = "POST" ] && [ -n "$data" ]; then
        if [[ "$data" == *"@/"* ]]; then
            # File upload (multipart)
            response=$(curl -sS -w "\n%{http_code}" -X POST "$url" \
                -b "$COOKIE_FILE" \
                -F "$data" 2>&1) || true
        else
            # JSON POST
            response=$(curl -sS -w "\n%{http_code}" -X POST "$url" \
                -b "$COOKIE_FILE" \
                -H "Content-Type: application/json" \
                -d "$data" 2>&1) || true
        fi
    elif [ "$method" = "PUT" ]; then
        response=$(curl -sS -w "\n%{http_code}" -X PUT "$url" \
            -b "$COOKIE_FILE" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1) || true
    else
        log_error "Unsupported method: $method"
        return 1
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        if [ -n "$check_field" ]; then
            if echo "$body" | grep -q "$check_field"; then
                log_success "$name (Status: $status_code)"
                echo "$body" | jq '.' 2>/dev/null || echo "$body"
                return 0
            else
                log_error "$name - Missing expected field: $check_field"
                echo "$body"
                return 1
            fi
        else
            log_success "$name (Status: $status_code)"
            echo "$body" | jq '.' 2>/dev/null || echo "$body"
            return 0
        fi
    else
        log_error "$name - Expected $expected_status, got $status_code"
        echo "$body"
        return 1
    fi
}

# Check dependencies
if ! command -v curl &> /dev/null; then
    echo "Error: curl is required but not installed."
    exit 1
fi

if ! command -v jq &> /dev/null; then
    log_warn "jq is not installed. JSON output will not be formatted."
fi

echo "=========================================="
echo "Earniq API Smoke Test Suite"
echo "=========================================="
echo "API Base: $API_BASE"
echo "Phone: $PHONE"
echo "=========================================="
echo ""

# Test 1: Request OTP
log_info "Step 1/13: Request OTP"
test_endpoint "Request OTP" "POST" \
    "$API_BASE/api/auth/otp/request" \
    "{\"phone\":\"$PHONE\"}" \
    "200" "ok"

echo ""

# Test 2: Verify OTP
if [ -z "$OTP" ]; then
    echo -n "Enter OTP received: "
    read -r OTP
fi

log_info "Step 2/13: Verify OTP"
response=$(curl -sS -w "\n%{http_code}" -X POST "$API_BASE/api/auth/otp/verify" \
    -c "$COOKIE_FILE" \
    -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\",\"otp\":\"$OTP\",\"referralCode\":null}" 2>&1) || true

status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$status_code" = "200" ] && echo "$body" | grep -q '"success":true'; then
    log_success "Verify OTP (Status: $status_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    
    # Extract user ID for later use
    USER_ID=$(echo "$body" | jq -r '.user.id' 2>/dev/null || echo "")
else
    log_error "Verify OTP - Expected 200, got $status_code"
    echo "$body"
    echo ""
    log_error "Cannot continue without authentication. Exiting."
    exit 1
fi

echo ""

# Test 3: Get Session
log_info "Step 3/13: Get Session"
test_endpoint "Get Session" "GET" \
    "$API_BASE/api/auth/session" \
    "" \
    "200" "user"

echo ""

# Test 4: List Tasks
log_info "Step 4/13: List Tasks"
test_endpoint "List Tasks" "GET" \
    "$API_BASE/api/tasks?difficulty=easy&is_active=true&limit=10" \
    "" \
    "200" "tasks"

# Extract first task ID if available
TASK_ID=$(curl -sS "$API_BASE/api/tasks?limit=1" | jq -r '.tasks[0].id' 2>/dev/null || echo "")
if [ -z "$TASK_ID" ] || [ "$TASK_ID" = "null" ]; then
    log_warn "No tasks found. Skipping task-related tests."
    TASK_ID=""
fi

echo ""

# Test 5: Get Task Detail
if [ -n "$TASK_ID" ]; then
    log_info "Step 5/13: Get Task Detail"
    test_endpoint "Get Task Detail" "GET" \
        "$API_BASE/api/tasks/$TASK_ID" \
        "" \
        "200" "task"
else
    log_warn "Step 5/13: Get Task Detail (SKIPPED - no task ID)"
fi

echo ""

# Test 6: Submit Task
if [ -n "$TASK_ID" ]; then
    log_info "Step 6/13: Submit Task (Multipart Upload)"
    
    # Create a dummy proof file for testing
    PROOF_FILE=$(mktemp)
    echo "Test proof content" > "$PROOF_FILE"
    
    response=$(curl -sS -w "\n%{http_code}" -X POST "$API_BASE/api/member/tasks/submit" \
        -b "$COOKIE_FILE" \
        -F "task_id=$TASK_ID" \
        -F "proof=@$PROOF_FILE" \
        -F "notes=Test submission via smoke test script" 2>&1) || true
    
    rm -f "$PROOF_FILE"
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "200" ] && echo "$body" | grep -q '"success":true'; then
        log_success "Submit Task (Status: $status_code)"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        log_error "Submit Task - Expected 200, got $status_code"
        echo "$body"
    fi
else
    log_warn "Step 6/13: Submit Task (SKIPPED - no task ID)"
fi

echo ""

# Test 7: Get Task Submissions
log_info "Step 7/13: Get Task Submissions"
test_endpoint "Get Task Submissions" "GET" \
    "$API_BASE/api/member/tasks/submissions?page=1&perPage=10" \
    "" \
    "200" "data"

echo ""

# Test 8: Request Withdrawal
log_info "Step 8/13: Request Withdrawal"
test_endpoint "Request Withdrawal" "POST" \
    "$API_BASE/api/member/withdraw" \
    "{\"amount\":100,\"upiId\":\"test@upi\"}" \
    "200" "withdrawal"

# Extract withdrawal ID if available
WITHDRAWAL_ID=$(curl -sS -b "$COOKIE_FILE" "$API_BASE/api/member/withdrawals?limit=1" | jq -r '.withdrawals[0].id' 2>/dev/null || echo "")

echo ""

# Test 9: Get Withdrawal History
log_info "Step 9/13: Get Withdrawal History"
test_endpoint "Get Withdrawal History" "GET" \
    "$API_BASE/api/member/withdrawals?status=PENDING&page=1&perPage=20" \
    "" \
    "200" "withdrawals"

echo ""

# Test 10: Download Receipt PDF
if [ -n "$WITHDRAWAL_ID" ] && [ "$WITHDRAWAL_ID" != "null" ]; then
    log_info "Step 10/13: Download Receipt PDF"
    response=$(curl -sS -w "\n%{http_code}" -X GET "$API_BASE/api/member/withdrawals/$WITHDRAWAL_ID/receipt" \
        -b "$COOKIE_FILE" \
        -o /tmp/receipt.pdf 2>&1) || true
    
    status_code=$(echo "$response" | tail -n1)
    
    if [ "$status_code" = "200" ] && [ -f /tmp/receipt.pdf ]; then
        file_size=$(stat -f%z /tmp/receipt.pdf 2>/dev/null || stat -c%s /tmp/receipt.pdf 2>/dev/null || echo "0")
        if [ "$file_size" -gt 0 ]; then
            log_success "Download Receipt PDF (Status: $status_code, Size: ${file_size} bytes)"
            rm -f /tmp/receipt.pdf
        else
            log_error "Download Receipt PDF - File is empty"
        fi
    else
        log_error "Download Receipt PDF - Expected 200, got $status_code"
    fi
else
    log_warn "Step 10/13: Download Receipt PDF (SKIPPED - no withdrawal ID)"
fi

echo ""

# Test 11: Get Profile
log_info "Step 11/13: Get Profile"
test_endpoint "Get Profile" "GET" \
    "$API_BASE/api/member/profile" \
    "" \
    "200" "user"

echo ""

# Test 12: Update Profile
log_info "Step 12/13: Update Profile"
test_endpoint "Update Profile" "PUT" \
    "$API_BASE/api/member/profile" \
    "{\"username\":\"smoketest_$(date +%s)\",\"upi_id\":\"smoketest@upi\"}" \
    "200" "user"

echo ""

# Test 13: Logout
log_info "Step 13/13: Logout"
test_endpoint "Logout" "POST" \
    "$API_BASE/api/auth/logout" \
    "" \
    "200" "success"

echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo -e "${YELLOW}Skipped: $TESTS_SKIPPED${NC}"
echo "=========================================="

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review the output above.${NC}"
    exit 1
fi


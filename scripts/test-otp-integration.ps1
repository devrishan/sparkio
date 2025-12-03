# Integration tests for OTP authentication endpoints (PowerShell)
# Usage: .\scripts\test-otp-integration.ps1 [base_url]
# Example: .\scripts\test-otp-integration.ps1 http://localhost:3000

param(
    [string]$BaseUrl = "http://localhost:3000"
)

$TestPhone = "9876543210"
$InvalidPhone = "123456"
$InvalidOtp = "000000"
$CookieFile = "$env:TEMP\otp_cookies.txt"

Write-Host "=== OTP Authentication Integration Tests ===" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl"
Write-Host ""

# Test 1: Request OTP with valid phone
Write-Host "Test 1: Request OTP with valid phone" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/otp/request" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body (@{phone=$TestPhone} | ConvertTo-Json) `
        -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ PASS: OTP requested successfully" -ForegroundColor Green
        Write-Host "Response: $($response.Content)"
        Write-Host "⚠️  Check server logs for OTP code" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Request OTP with invalid phone format
Write-Host "Test 2: Request OTP with invalid phone format" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/otp/request" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body (@{phone=$InvalidPhone} | ConvertTo-Json) `
        -ErrorAction Stop
    Write-Host "❌ FAIL: Expected 400, got $($response.StatusCode)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ PASS: Invalid phone rejected" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Rate limiting
Write-Host "Test 3: Rate limiting (request 6 OTPs rapidly)" -ForegroundColor Yellow
$rateLimitHit = $false
for ($i = 1; $i -le 6; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/otp/request" `
            -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body (@{phone=$TestPhone} | ConvertTo-Json) `
            -ErrorAction Stop
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 429) {
            Write-Host "✅ PASS: Rate limit triggered on request $i" -ForegroundColor Green
            $rateLimitHit = $true
            break
        }
    }
}
if (-not $rateLimitHit) {
    Write-Host "⚠️  WARNING: Rate limit not triggered after 6 requests" -ForegroundColor Yellow
}
Write-Host ""

# Test 4: Brute-force protection
Write-Host "Test 4: Brute-force protection (5 invalid attempts)" -ForegroundColor Yellow
Write-Host "First, request a valid OTP..."
try {
    Invoke-WebRequest -Uri "$BaseUrl/api/auth/otp/request" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body (@{phone=$TestPhone} | ConvertTo-Json) | Out-Null
} catch {}

Write-Host "Making 5 invalid verification attempts..."
$lockoutHit = $false
for ($i = 1; $i -le 5; $i++) {
    try {
        Invoke-WebRequest -Uri "$BaseUrl/api/auth/otp/verify" `
            -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body (@{phone=$TestPhone; otp=$InvalidOtp} | ConvertTo-Json) `
            -ErrorAction Stop | Out-Null
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 429) {
            Write-Host "✅ PASS: Account locked after failed attempts (request $i)" -ForegroundColor Green
            $lockoutHit = $true
            break
        }
    }
}
if (-not $lockoutHit) {
    Write-Host "⚠️  WARNING: Lockout not triggered after 5 failed attempts" -ForegroundColor Yellow
}
Write-Host ""

# Test 5: Verify OTP (requires manual input)
Write-Host "Test 5: Verify OTP (requires manual OTP from server logs)" -ForegroundColor Yellow
$validOtp = Read-Host "Enter OTP from server logs"

try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/otp/verify" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body (@{phone=$TestPhone; otp=$validOtp} | ConvertTo-Json) `
        -SessionVariable session `
        -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ PASS: OTP verified successfully" -ForegroundColor Green
        Write-Host "Response: $($response.Content)"
        
        # Save session for next test
        $session.Save($CookieFile)
    }
} catch {
    Write-Host "❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Session endpoint
Write-Host "Test 6: Check session with cookies" -ForegroundColor Yellow
if (Test-Path $CookieFile) {
    try {
        $session = Import-Clixml $CookieFile
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/session" `
            -WebSession $session `
            -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ PASS: Session retrieved successfully" -ForegroundColor Green
            Write-Host "Response: $($response.Content)"
        }
    } catch {
        Write-Host "❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  SKIP: No cookies file found (run Test 5 first)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== Integration Tests Complete ===" -ForegroundColor Cyan
if (Test-Path $CookieFile) {
    Remove-Item $CookieFile -ErrorAction SilentlyContinue
}


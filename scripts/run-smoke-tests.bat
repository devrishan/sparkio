@echo off
setlocal enabledelayedexpansion

set API_BASE=https://staging.api.earniq.app
set PHONE=9123456789
set COOKIE_FILE=%TEMP%\earniq_cookies.txt
set RESULTS_FILE=%TEMP%\smoke_test_results.json

echo [] > %RESULTS_FILE%

REM Step 1: Request OTP
echo Step 1: Request OTP
curl -s -w "\nHTTPSTATUS:%{http_code}\n" -X POST "%API_BASE%/api/auth/otp/request" ^
    -H "Content-Type: application/json" ^
    -d "{\"phone\":\"%PHONE%\"}" > %TEMP%\step1.txt 2>&1

REM Step 2: Verify OTP (will need manual OTP entry)
echo.
echo Step 2: Verify OTP
echo Please enter the OTP you received:
set /p OTP=

curl -s -w "\nHTTPSTATUS:%{http_code}\n" -X POST "%API_BASE%/api/auth/otp/verify" ^
    -c "%COOKIE_FILE%" ^
    -H "Content-Type: application/json" ^
    -d "{\"phone\":\"%PHONE%\",\"otp\":\"%OTP%\",\"referralCode\":null}" > %TEMP%\step2.txt 2>&1

REM Continue with remaining steps...
echo.
echo All test outputs saved to %TEMP%\step*.txt
echo Results JSON will be in %RESULTS_FILE%


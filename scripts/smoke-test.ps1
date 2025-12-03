# Full Smoke Test with Complete Output Capture (PowerShell)
param(
    [string]$ApiBase = "https://staging.api.earniq.app",
    [string]$Phone = "9123456789",
    [string]$Otp = ""
)

$ErrorActionPreference = "Stop"
$results = @()
$cookieFile = "$env:TEMP\earniq_cookies.txt"
$testImage = "$env:TEMP\test_image.jpg"

# Create test image
[System.Convert]::FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==") | Set-Content -Path $testImage -Encoding Byte

function Add-Result {
    param(
        [string]$Step,
        [string]$Method,
        [string]$Url,
        [int]$Status,
        [string]$ReqHeaders,
        [string]$ReqBodySummary,
        [string]$RespHeaders,
        [string]$RespBody,
        [string]$Error = $null
    )
    
    $result = @{
        step = $Step
        method = $Method
        url = $Url
        status = $Status
        request_headers = $ReqHeaders
        request_body_summary = $ReqBodySummary
        response_headers = $RespHeaders
        response_body = $RespBody
        error = $Error
    }
    
    $script:results += $result
}

function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [string]$FormData = $null,
        [switch]$UseCookies
    )
    
    $headersString = ($Headers.GetEnumerator() | ForEach-Object { "$($_.Key): $($_.Value)" }) -join "`n"
    
    try {
        $request = [System.Net.WebRequest]::Create($Url)
        $request.Method = $Method
        
        foreach ($header in $Headers.GetEnumerator()) {
            if ($header.Key -eq "Content-Type") {
                $request.ContentType = $header.Value
            } else {
                $request.Headers.Add($header.Key, $header.Value)
            }
        }
        
        if ($UseCookies -and (Test-Path $cookieFile)) {
            $cookies = Get-Content $cookieFile -Raw
            $request.Headers.Add("Cookie", $cookies.Trim())
        }
        
        if ($Body) {
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($Body)
            $request.ContentLength = $bytes.Length
            $stream = $request.GetRequestStream()
            $stream.Write($bytes, 0, $bytes.Length)
            $stream.Close()
        } elseif ($FormData) {
            # For multipart, use curl
            $curlArgs = @(
                "-s", "-w", "`n%{http_code}`n",
                "-X", $Method,
                $Url
            )
            
            if ($UseCookies -and (Test-Path $cookieFile)) {
                $curlArgs += "-b", $cookieFile
            }
            
            $curlArgs += "-F", $FormData
            
            $response = & curl @curlArgs 2>&1
            $statusCode = ($response | Select-Object -Last 1) -as [int]
            $body = ($response | Select-Object -SkipLast 1) -join "`n"
            
            return @{
                Status = $statusCode
                Headers = @{}
                Body = $body
            }
        }
        
        $response = $request.GetResponse()
        $statusCode = [int]$response.StatusCode
        $responseHeaders = $response.Headers | ConvertTo-Json -Compress
        
        $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
        $body = $reader.ReadToEnd()
        $reader.Close()
        $response.Close()
        
        # Save cookies
        if ($response.Headers["Set-Cookie"]) {
            $response.Headers["Set-Cookie"] | Out-File $cookieFile
        }
        
        return @{
            Status = $statusCode
            Headers = $responseHeaders
            Body = $body
        }
    } catch {
        $statusCode = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
        $body = $_.Exception.Message
        
        return @{
            Status = $statusCode
            Headers = "{}"
            Body = $body
            Error = $_.Exception.Message
        }
    }
}

# Step 1: Request OTP
Write-Host "Step 1: Request OTP" -ForegroundColor Cyan
$step1 = Invoke-ApiRequest -Method "POST" -Url "$ApiBase/api/auth/otp/request" `
    -Headers @{ "Content-Type" = "application/json" } `
    -Body (ConvertTo-Json @{ phone = $Phone })
Add-Result -Step "Request OTP" -Method "POST" -Url "$ApiBase/api/auth/otp/request" `
    -Status $step1.Status -ReqHeaders "Content-Type: application/json" `
    -ReqBodySummary (ConvertTo-Json @{ phone = $Phone }) `
    -RespHeaders $step1.Headers -RespBody $step1.Body -Error $step1.Error

# Step 2: Verify OTP
if (-not $Otp) {
    $Otp = Read-Host "Enter OTP"
}

Write-Host "Step 2: Verify OTP" -ForegroundColor Cyan
$step2Body = ConvertTo-Json @{ phone = $Phone; otp = $Otp; referralCode = $null }
$step2 = Invoke-ApiRequest -Method "POST" -Url "$ApiBase/api/auth/otp/verify" `
    -Headers @{ "Content-Type" = "application/json" } `
    -Body $step2Body -UseCookies
Add-Result -Step "Verify OTP" -Method "POST" -Url "$ApiBase/api/auth/otp/verify" `
    -Status $step2.Status -ReqHeaders "Content-Type: application/json" `
    -ReqBodySummary (ConvertTo-Json @{ phone = $Phone; otp = "***"; referralCode = $null }) `
    -RespHeaders $step2.Headers -RespBody $step2.Body -Error $step2.Error

if ($step2.Status -ne 200) {
    Write-Host "OTP verification failed. Cannot continue." -ForegroundColor Red
    $results | ConvertTo-Json -Depth 10
    exit 1
}

# Step 3: Get Session
Write-Host "Step 3: Get Session" -ForegroundColor Cyan
$step3 = Invoke-ApiRequest -Method "GET" -Url "$ApiBase/api/auth/session" `
    -Headers @{ "Accept" = "application/json" } -UseCookies
Add-Result -Step "Get Session" -Method "GET" -Url "$ApiBase/api/auth/session" `
    -Status $step3.Status -ReqHeaders "Accept: application/json" `
    -ReqBodySummary "" -RespHeaders $step3.Headers -RespBody $step3.Body -Error $step3.Error

# Step 4: List Tasks
Write-Host "Step 4: List Tasks" -ForegroundColor Cyan
$step4 = Invoke-ApiRequest -Method "GET" -Url "$ApiBase/api/tasks?difficulty=easy&is_active=true" `
    -Headers @{ "Accept" = "application/json" }
$taskData = $step4.Body | ConvertFrom-Json
$taskId = if ($taskData.tasks -and $taskData.tasks.Count -gt 0) { $taskData.tasks[0].id } else { "" }
Add-Result -Step "List Tasks" -Method "GET" -Url "$ApiBase/api/tasks?difficulty=easy&is_active=true" `
    -Status $step4.Status -ReqHeaders "Accept: application/json" `
    -ReqBodySummary "" -RespHeaders $step4.Headers -RespBody $step4.Body -Error $step4.Error

# Step 5: Get Task Detail
if ($taskId) {
    Write-Host "Step 5: Get Task Detail" -ForegroundColor Cyan
    $step5 = Invoke-ApiRequest -Method "GET" -Url "$ApiBase/api/tasks/$taskId" `
        -Headers @{ "Accept" = "application/json" } -UseCookies
    Add-Result -Step "Get Task Detail" -Method "GET" -Url "$ApiBase/api/tasks/$taskId" `
        -Status $step5.Status -ReqHeaders "Accept: application/json" `
        -ReqBodySummary "" -RespHeaders $step5.Headers -RespBody $step5.Body -Error $step5.Error
} else {
    Add-Result -Step "Get Task Detail" -Method "GET" -Url "$ApiBase/api/tasks/<TASK_ID>" `
        -Status 0 -ReqHeaders "" -ReqBodySummary "" -RespHeaders "" -RespBody "" -Error "No task ID available"
}

# Step 6: Submit Task
if ($taskId) {
    Write-Host "Step 6: Submit Task" -ForegroundColor Cyan
    $step6 = Invoke-ApiRequest -Method "POST" -Url "$ApiBase/api/member/tasks/submit" `
        -FormData "task_id=$taskId;proof=@$testImage;notes=smoke test" -UseCookies
    Add-Result -Step "Submit Task" -Method "POST" -Url "$ApiBase/api/member/tasks/submit" `
        -Status $step6.Status -ReqHeaders "Content-Type: multipart/form-data" `
        -ReqBodySummary "task_id=$taskId, proof=<file>, notes=smoke test" `
        -RespHeaders $step6.Headers -RespBody $step6.Body -Error $step6.Error
} else {
    Add-Result -Step "Submit Task" -Method "POST" -Url "$ApiBase/api/member/tasks/submit" `
        -Status 0 -ReqHeaders "" -ReqBodySummary "" -RespHeaders "" -RespBody "" -Error "No task ID available"
}

# Step 7: Get Submissions
Write-Host "Step 7: Get Submissions" -ForegroundColor Cyan
$step7 = Invoke-ApiRequest -Method "GET" -Url "$ApiBase/api/member/tasks/submissions?page=1&perPage=10" `
    -Headers @{ "Accept" = "application/json" } -UseCookies
Add-Result -Step "Get Submissions" -Method "GET" -Url "$ApiBase/api/member/tasks/submissions?page=1&perPage=10" `
    -Status $step7.Status -ReqHeaders "Accept: application/json" `
    -ReqBodySummary "" -RespHeaders $step7.Headers -RespBody $step7.Body -Error $step7.Error

# Step 8: Request Withdrawal
Write-Host "Step 8: Request Withdrawal" -ForegroundColor Cyan
$step8Body = ConvertTo-Json @{ amount = 100; upiId = "test@upi" }
$step8 = Invoke-ApiRequest -Method "POST" -Url "$ApiBase/api/member/withdraw" `
    -Headers @{ "Content-Type" = "application/json" } -Body $step8Body -UseCookies
$withdrawalData = $step8.Body | ConvertFrom-Json
$withdrawalId = if ($withdrawalData.withdrawal) { $withdrawalData.withdrawal.id } else { "" }
Add-Result -Step "Request Withdrawal" -Method "POST" -Url "$ApiBase/api/member/withdraw" `
    -Status $step8.Status -ReqHeaders "Content-Type: application/json" `
    -ReqBodySummary $step8Body -RespHeaders $step8.Headers -RespBody $step8.Body -Error $step8.Error

# Step 9: Get Withdrawal History
Write-Host "Step 9: Get Withdrawal History" -ForegroundColor Cyan
$step9 = Invoke-ApiRequest -Method "GET" -Url "$ApiBase/api/member/withdrawals?status=PENDING&page=1&perPage=10" `
    -Headers @{ "Accept" = "application/json" } -UseCookies
if (-not $withdrawalId) {
    $historyData = $step9.Body | ConvertFrom-Json
    $withdrawalId = if ($historyData.withdrawals -and $historyData.withdrawals.Count -gt 0) { $historyData.withdrawals[0].id } else { "" }
}
Add-Result -Step "Get Withdrawal History" -Method "GET" -Url "$ApiBase/api/member/withdrawals?status=PENDING&page=1&perPage=10" `
    -Status $step9.Status -ReqHeaders "Accept: application/json" `
    -ReqBodySummary "" -RespHeaders $step9.Headers -RespBody $step9.Body -Error $step9.Error

# Step 10: Download Receipt
if ($withdrawalId) {
    Write-Host "Step 10: Download Receipt" -ForegroundColor Cyan
    $step10 = Invoke-ApiRequest -Method "GET" -Url "$ApiBase/api/member/withdrawals/$withdrawalId/receipt" -UseCookies
    $bodyPreview = if ($step10.Body.Length -gt 200) { $step10.Body.Substring(0, 200) + "...<binary>" } else { $step10.Body }
    Add-Result -Step "Download Receipt" -Method "GET" -Url "$ApiBase/api/member/withdrawals/$withdrawalId/receipt" `
        -Status $step10.Status -ReqHeaders "" -ReqBodySummary "" `
        -RespHeaders $step10.Headers -RespBody $bodyPreview -Error $step10.Error
} else {
    Add-Result -Step "Download Receipt" -Method "GET" -Url "$ApiBase/api/member/withdrawals/<ID>/receipt" `
        -Status 0 -ReqHeaders "" -ReqBodySummary "" -RespHeaders "" -RespBody "" -Error "No withdrawal ID available"
}

# Step 11: Get Profile
Write-Host "Step 11: Get Profile" -ForegroundColor Cyan
$step11 = Invoke-ApiRequest -Method "GET" -Url "$ApiBase/api/member/profile" `
    -Headers @{ "Accept" = "application/json" } -UseCookies
Add-Result -Step "Get Profile" -Method "GET" -Url "$ApiBase/api/member/profile" `
    -Status $step11.Status -ReqHeaders "Accept: application/json" `
    -ReqBodySummary "" -RespHeaders $step11.Headers -RespBody $step11.Body -Error $step11.Error

# Step 12: Update Profile
Write-Host "Step 12: Update Profile" -ForegroundColor Cyan
$step12Body = ConvertTo-Json @{ username = "smoke-test"; upi_id = "smoke@upi" }
$step12 = Invoke-ApiRequest -Method "PUT" -Url "$ApiBase/api/member/profile" `
    -Headers @{ "Content-Type" = "application/json" } -Body $step12Body -UseCookies
Add-Result -Step "Update Profile" -Method "PUT" -Url "$ApiBase/api/member/profile" `
    -Status $step12.Status -ReqHeaders "Content-Type: application/json" `
    -ReqBodySummary $step12Body -RespHeaders $step12.Headers -RespBody $step12.Body -Error $step12.Error

# Step 13: Logout
Write-Host "Step 13: Logout" -ForegroundColor Cyan
$step13 = Invoke-ApiRequest -Method "POST" -Url "$ApiBase/api/auth/logout" -UseCookies
Add-Result -Step "Logout" -Method "POST" -Url "$ApiBase/api/auth/logout" `
    -Status $step13.Status -ReqHeaders "" -ReqBodySummary "" `
    -RespHeaders $step13.Headers -RespBody $step13.Body -Error $step13.Error

# Cleanup
Remove-Item $testImage -ErrorAction SilentlyContinue
Remove-Item $cookieFile -ErrorAction SilentlyContinue

# Output results
$results | ConvertTo-Json -Depth 10


// Complete Smoke Test Script - Captures all request/response details
const https = require('https');
const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');

const API_BASE = process.env.API_BASE || process.argv[2] || 'https://staging.api.earniq.app';
const PHONE = process.env.PHONE || process.argv[3] || '9123456789';
const OTP = process.env.OTP || process.argv[4] || '';

const results = [];
let cookies = '';

function makeRequest(method, url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        ...options.headers,
      },
    };

    if (cookies) {
      reqOptions.headers['Cookie'] = cookies;
    }

    const req = protocol.request(reqOptions, (res) => {
      let data = '';
      const headers = res.headers;
      
      // Extract cookies
      if (res.headers['set-cookie']) {
        const cookieStrings = Array.isArray(res.headers['set-cookie']) 
          ? res.headers['set-cookie'] 
          : [res.headers['set-cookie']];
        cookies = cookieStrings.map(c => c.split(';')[0]).join('; ');
      }
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: JSON.stringify(headers),
          body: data,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 0,
        headers: '{}',
        body: err.message,
        error: err.message,
      });
    });

    if (options.body) {
      if (Buffer.isBuffer(options.body)) {
        req.write(options.body);
      } else {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
    }
    
    req.end();
  });
}

function addResult(step, method, url, status, reqHeaders, reqBodySummary, respHeaders, respBody, error = null) {
  results.push({
    step,
    method,
    url,
    status,
    request_headers: reqHeaders,
    request_body_summary: reqBodySummary,
    response_headers: respHeaders,
    response_body: respBody,
    error: error || null,
  });
}

async function runTests() {
  console.error('Starting smoke tests against:', API_BASE);
  
  // Step 1: Request OTP
  console.error('Step 1: Request OTP');
  const step1 = await makeRequest('POST', `${API_BASE}/api/auth/otp/request`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: PHONE }),
  });
  addResult('Request OTP', 'POST', `${API_BASE}/api/auth/otp/request`, step1.status,
    'Content-Type: application/json', JSON.stringify({ phone: PHONE }),
    step1.headers, step1.body, step1.error);

  // Step 2: Verify OTP
  const otpToUse = OTP || process.env.OTP_INPUT || '';
  if (!otpToUse) {
    console.error('OTP required. Set OTP environment variable or pass as 4th argument.');
    console.error('Skipping remaining tests.');
  } else {
    console.error('Step 2: Verify OTP');
    const step2 = await makeRequest('POST', `${API_BASE}/api/auth/otp/verify`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: PHONE, otp: otpToUse, referralCode: null }),
    });
    addResult('Verify OTP', 'POST', `${API_BASE}/api/auth/otp/verify`, step2.status,
      'Content-Type: application/json', JSON.stringify({ phone: PHONE, otp: '***', referralCode: null }),
      step2.headers, step2.body, step2.error);

    if (step2.status === 200) {
      // Step 3: Get Session
      console.error('Step 3: Get Session');
      const step3 = await makeRequest('GET', `${API_BASE}/api/auth/session`, {
        headers: { 'Accept': 'application/json' },
      });
      addResult('Get Session', 'GET', `${API_BASE}/api/auth/session`, step3.status,
        'Accept: application/json', '', step3.headers, step3.body, step3.error);

      // Step 4: List Tasks
      console.error('Step 4: List Tasks');
      const step4 = await makeRequest('GET', `${API_BASE}/api/tasks?difficulty=easy&is_active=true`, {
        headers: { 'Accept': 'application/json' },
      });
      let taskId = '';
      try {
        const taskData = JSON.parse(step4.body);
        taskId = taskData.tasks?.[0]?.id || '';
      } catch (e) {}
      addResult('List Tasks', 'GET', `${API_BASE}/api/tasks?difficulty=easy&is_active=true`, step4.status,
        'Accept: application/json', '', step4.headers, step4.body, step4.error);

      // Step 5: Get Task Detail
      if (taskId) {
        console.error('Step 5: Get Task Detail');
        const step5 = await makeRequest('GET', `${API_BASE}/api/tasks/${taskId}`, {
          headers: { 'Accept': 'application/json' },
        });
        addResult('Get Task Detail', 'GET', `${API_BASE}/api/tasks/${taskId}`, step5.status,
          'Accept: application/json', '', step5.headers, step5.body, step5.error);
      } else {
        addResult('Get Task Detail', 'GET', `${API_BASE}/api/tasks/<TASK_ID>`, 0,
          '', '', '', '', 'No task ID available');
      }

      // Step 6: Submit Task (simplified - would need form-data library)
      if (taskId) {
        console.error('Step 6: Submit Task (skipped - requires form-data)');
        addResult('Submit Task', 'POST', `${API_BASE}/api/member/tasks/submit`, 0,
          'Content-Type: multipart/form-data', 'task_id=<ID>, proof=<file>, notes=smoke test',
          '', '', 'Requires form-data library for multipart upload');
      } else {
        addResult('Submit Task', 'POST', `${API_BASE}/api/member/tasks/submit`, 0,
          '', '', '', '', 'No task ID available');
      }

      // Step 7: Get Submissions
      console.error('Step 7: Get Submissions');
      const step7 = await makeRequest('GET', `${API_BASE}/api/member/tasks/submissions?page=1&perPage=10`, {
        headers: { 'Accept': 'application/json' },
      });
      addResult('Get Submissions', 'GET', `${API_BASE}/api/member/tasks/submissions?page=1&perPage=10`, step7.status,
        'Accept: application/json', '', step7.headers, step7.body, step7.error);

      // Step 8: Request Withdrawal
      console.error('Step 8: Request Withdrawal');
      const step8 = await makeRequest('POST', `${API_BASE}/api/member/withdraw`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100, upiId: 'test@upi' }),
      });
      let withdrawalId = '';
      try {
        const withdrawalData = JSON.parse(step8.body);
        withdrawalId = withdrawalData.withdrawal?.id || '';
      } catch (e) {}
      addResult('Request Withdrawal', 'POST', `${API_BASE}/api/member/withdraw`, step8.status,
        'Content-Type: application/json', JSON.stringify({ amount: 100, upiId: 'test@upi' }),
        step8.headers, step8.body, step8.error);

      // Step 9: Get Withdrawal History
      console.error('Step 9: Get Withdrawal History');
      const step9 = await makeRequest('GET', `${API_BASE}/api/member/withdrawals?status=PENDING&page=1&perPage=10`, {
        headers: { 'Accept': 'application/json' },
      });
      if (!withdrawalId) {
        try {
          const historyData = JSON.parse(step9.body);
          withdrawalId = historyData.withdrawals?.[0]?.id || '';
        } catch (e) {}
      }
      addResult('Get Withdrawal History', 'GET', `${API_BASE}/api/member/withdrawals?status=PENDING&page=1&perPage=10`, step9.status,
        'Accept: application/json', '', step9.headers, step9.body, step9.error);

      // Step 10: Download Receipt
      if (withdrawalId) {
        console.error('Step 10: Download Receipt');
        const step10 = await makeRequest('GET', `${API_BASE}/api/member/withdrawals/${withdrawalId}/receipt`, {});
        const bodyPreview = step10.body.length > 200 ? step10.body.substring(0, 200) + '...<binary>' : step10.body;
        addResult('Download Receipt', 'GET', `${API_BASE}/api/member/withdrawals/${withdrawalId}/receipt`, step10.status,
          '', '', step10.headers, bodyPreview, step10.error);
      } else {
        addResult('Download Receipt', 'GET', `${API_BASE}/api/member/withdrawals/<ID>/receipt`, 0,
          '', '', '', '', 'No withdrawal ID available');
      }

      // Step 11: Get Profile
      console.error('Step 11: Get Profile');
      const step11 = await makeRequest('GET', `${API_BASE}/api/member/profile`, {
        headers: { 'Accept': 'application/json' },
      });
      addResult('Get Profile', 'GET', `${API_BASE}/api/member/profile`, step11.status,
        'Accept: application/json', '', step11.headers, step11.body, step11.error);

      // Step 12: Update Profile
      console.error('Step 12: Update Profile');
      const step12 = await makeRequest('PUT', `${API_BASE}/api/member/profile`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'smoke-test', upi_id: 'smoke@upi' }),
      });
      addResult('Update Profile', 'PUT', `${API_BASE}/api/member/profile`, step12.status,
        'Content-Type: application/json', JSON.stringify({ username: 'smoke-test', upi_id: 'smoke@upi' }),
        step12.headers, step12.body, step12.error);

      // Step 13: Logout
      console.error('Step 13: Logout');
      const step13 = await makeRequest('POST', `${API_BASE}/api/auth/logout`, {});
      addResult('Logout', 'POST', `${API_BASE}/api/auth/logout`, step13.status,
        '', '', step13.headers, step13.body, step13.error);
    }
  }

  // Output results as JSON
  console.log(JSON.stringify(results, null, 2));
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});


#!/usr/bin/env node
// Full Smoke Test with Complete Output Capture (Node.js version)
const https = require('https');
const http = require('http');
const fs = require('fs');
const { FormData } = require('formdata-node');
const { FormDataEncoder } = require('form-data-encoder');

const API_BASE = process.argv[2] || 'https://staging.api.earniq.app';
const PHONE = process.argv[3] || '9123456789';
const OTP = process.argv[4] || '';

const results = [];
let cookies = '';

// Create test image
const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.url);
    const protocol = url.protocol === 'https:' ? https : http;
    
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        ...options.headers,
        ...(cookies ? { 'Cookie': cookies } : {}),
      },
    };

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
          headers: headers,
          body: data,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      if (body instanceof FormData) {
        const encoder = new FormDataEncoder(body);
        req.setHeader('Content-Type', encoder.contentType);
        encoder.encode().pipe(req);
      } else {
        req.write(typeof body === 'string' ? body : JSON.stringify(body));
        req.end();
      }
    } else {
      req.end();
    }
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
    error: error,
  });
}

async function runTests() {
  try {
    // Step 1: Request OTP
    console.error('Step 1: Request OTP');
    const step1 = await makeRequest({
      url: `${API_BASE}/api/auth/otp/request`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, JSON.stringify({ phone: PHONE }));
    
    addResult('Request OTP', 'POST', `${API_BASE}/api/auth/otp/request`, step1.status,
      'Content-Type: application/json', JSON.stringify({ phone: PHONE }),
      JSON.stringify(step1.headers), step1.body);

    // Step 2: Verify OTP
    const otpToUse = OTP || await new Promise((resolve) => {
      const readline = require('readline');
      const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
      rl.question('Enter OTP: ', (answer) => { rl.close(); resolve(answer); });
    });

    console.error('Step 2: Verify OTP');
    const step2 = await makeRequest({
      url: `${API_BASE}/api/auth/otp/verify`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, JSON.stringify({ phone: PHONE, otp: otpToUse, referralCode: null }));
    
    addResult('Verify OTP', 'POST', `${API_BASE}/api/auth/otp/verify`, step2.status,
      'Content-Type: application/json', JSON.stringify({ phone: PHONE, otp: '***', referralCode: null }),
      JSON.stringify(step2.headers), step2.body);

    if (step2.status !== 200) {
      throw new Error('OTP verification failed');
    }

    // Step 3: Get Session
    console.error('Step 3: Get Session');
    const step3 = await makeRequest({
      url: `${API_BASE}/api/auth/session`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    addResult('Get Session', 'GET', `${API_BASE}/api/auth/session`, step3.status,
      'Accept: application/json', '', JSON.stringify(step3.headers), step3.body);

    // Step 4: List Tasks
    console.error('Step 4: List Tasks');
    const step4 = await makeRequest({
      url: `${API_BASE}/api/tasks?difficulty=easy&is_active=true`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    const taskData = JSON.parse(step4.body);
    const taskId = taskData.tasks?.[0]?.id || '';
    
    addResult('List Tasks', 'GET', `${API_BASE}/api/tasks?difficulty=easy&is_active=true`, step4.status,
      'Accept: application/json', '', JSON.stringify(step4.headers), step4.body);

    // Step 5: Get Task Detail
    if (taskId) {
      console.error('Step 5: Get Task Detail');
      const step5 = await makeRequest({
        url: `${API_BASE}/api/tasks/${taskId}`,
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      addResult('Get Task Detail', 'GET', `${API_BASE}/api/tasks/${taskId}`, step5.status,
        'Accept: application/json', '', JSON.stringify(step5.headers), step5.body);
    } else {
      addResult('Get Task Detail', 'GET', `${API_BASE}/api/tasks/<TASK_ID>`, 0,
        '', '', '', '', 'No task ID available');
    }

    // Step 6: Submit Task
    if (taskId) {
      console.error('Step 6: Submit Task');
      const formData = new FormData();
      formData.set('task_id', taskId);
      formData.set('proof', new Blob([testImage], { type: 'image/jpeg' }), 'test.jpg');
      formData.set('notes', 'smoke test');
      
      const step6 = await makeRequest({
        url: `${API_BASE}/api/member/tasks/submit`,
        method: 'POST',
      }, formData);
      
      addResult('Submit Task', 'POST', `${API_BASE}/api/member/tasks/submit`, step6.status,
        'Content-Type: multipart/form-data', `task_id=${taskId}, proof=<file>, notes=smoke test`,
        JSON.stringify(step6.headers), step6.body);
    } else {
      addResult('Submit Task', 'POST', `${API_BASE}/api/member/tasks/submit`, 0,
        '', '', '', '', 'No task ID available');
    }

    // Step 7: Get Submissions
    console.error('Step 7: Get Submissions');
    const step7 = await makeRequest({
      url: `${API_BASE}/api/member/tasks/submissions?page=1&perPage=10`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    addResult('Get Submissions', 'GET', `${API_BASE}/api/member/tasks/submissions?page=1&perPage=10`, step7.status,
      'Accept: application/json', '', JSON.stringify(step7.headers), step7.body);

    // Step 8: Request Withdrawal
    console.error('Step 8: Request Withdrawal');
    const step8 = await makeRequest({
      url: `${API_BASE}/api/member/withdraw`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, JSON.stringify({ amount: 100, upiId: 'test@upi' }));
    
    const withdrawalData = JSON.parse(step8.body);
    const withdrawalId = withdrawalData.withdrawal?.id || '';
    
    addResult('Request Withdrawal', 'POST', `${API_BASE}/api/member/withdraw`, step8.status,
      'Content-Type: application/json', JSON.stringify({ amount: 100, upiId: 'test@upi' }),
      JSON.stringify(step8.headers), step8.body);

    // Step 9: Get Withdrawal History
    console.error('Step 9: Get Withdrawal History');
    const step9 = await makeRequest({
      url: `${API_BASE}/api/member/withdrawals?status=PENDING&page=1&perPage=10`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    if (!withdrawalId) {
      const historyData = JSON.parse(step9.body);
      withdrawalId = historyData.withdrawals?.[0]?.id || '';
    }
    
    addResult('Get Withdrawal History', 'GET', `${API_BASE}/api/member/withdrawals?status=PENDING&page=1&perPage=10`, step9.status,
      'Accept: application/json', '', JSON.stringify(step9.headers), step9.body);

    // Step 10: Download Receipt
    if (withdrawalId) {
      console.error('Step 10: Download Receipt');
      const step10 = await makeRequest({
        url: `${API_BASE}/api/member/withdrawals/${withdrawalId}/receipt`,
        method: 'GET',
      });
      
      addResult('Download Receipt', 'GET', `${API_BASE}/api/member/withdrawals/${withdrawalId}/receipt`, step10.status,
        '', '', JSON.stringify(step10.headers), step10.body.substring(0, 200) + '...<binary>');
    } else {
      addResult('Download Receipt', 'GET', `${API_BASE}/api/member/withdrawals/<ID>/receipt`, 0,
        '', '', '', '', 'No withdrawal ID available');
    }

    // Step 11: Get Profile
    console.error('Step 11: Get Profile');
    const step11 = await makeRequest({
      url: `${API_BASE}/api/member/profile`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    
    addResult('Get Profile', 'GET', `${API_BASE}/api/member/profile`, step11.status,
      'Accept: application/json', '', JSON.stringify(step11.headers), step11.body);

    // Step 12: Update Profile
    console.error('Step 12: Update Profile');
    const step12 = await makeRequest({
      url: `${API_BASE}/api/member/profile`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }, JSON.stringify({ username: 'smoke-test', upi_id: 'smoke@upi' }));
    
    addResult('Update Profile', 'PUT', `${API_BASE}/api/member/profile`, step12.status,
      'Content-Type: application/json', JSON.stringify({ username: 'smoke-test', upi_id: 'smoke@upi' }),
      JSON.stringify(step12.headers), step12.body);

    // Step 13: Logout
    console.error('Step 13: Logout');
    const step13 = await makeRequest({
      url: `${API_BASE}/api/auth/logout`,
      method: 'POST',
    });
    
    addResult('Logout', 'POST', `${API_BASE}/api/auth/logout`, step13.status,
      '', '', JSON.stringify(step13.headers), step13.body);

  } catch (error) {
    console.error('Error during tests:', error.message);
  }

  console.log(JSON.stringify(results, null, 2));
}

runTests();


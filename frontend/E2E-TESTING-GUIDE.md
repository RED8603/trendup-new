# 🧪 END-TO-END TESTING GUIDE

**Complete testing checklist for TrendUp Authentication System**

---

## PRE-TESTING CHECKLIST

### Environment Setup
- [ ] Backend running on http://localhost:3001
- [ ] Frontend running on http://localhost:5173
- [ ] MongoDB running (Docker or local)
- [ ] Redis running (Docker or local)
- [ ] Mailtrap account configured
- [ ] `.env` file properly configured

### Browser Setup
- [ ] Clear localStorage
- [ ] Clear cookies
- [ ] Open DevTools Console
- [ ] Open Network tab
- [ ] Disable cache (if testing loading states)

---

## TEST SUITE 1: NEW USER REGISTRATION

### Test 1.1: Complete Registration Flow (Happy Path)

**Steps:**
1. Go to http://localhost:5173/register
2. Enter email: `testuser-[timestamp]@example.com`
3. Click "Continue"
4. **Verify:** Email sent message appears
5. Go to https://mailtrap.io/inboxes
6. **Verify:** Email received with subject "Verify Your Email"
7. Copy 6-digit code from email
8. Enter code in frontend
9. Click "Verify Code"
10. **Verify:** Progress to step 3
11. Enter details:
    - Name: `Test User`
    - Username: `testuser[random]`
    - Password: `TestPass123!@#`
    - Confirm: `TestPass123!@#`
12. Click "Create Account"
13. **Verify:** Success message
14. **Verify:** Redirected to `/home`
15. **Verify:** User is logged in
16. Check localStorage: `accessToken` and `refreshToken` exist

**Expected Result:** ✅ User registered and logged in

---

### Test 1.2: Registration Error Scenarios

**Test 1.2.1: Invalid Email**
1. Go to /register
2. Enter: `notanemail`
3. Click "Continue"
4. **Verify:** "Invalid email address" error

**Test 1.2.2: Wrong Verification Code**
1. Complete step 1 (enter email)
2. Enter wrong code: `000000`
3. Click "Verify Code"
4. **Verify:** "Invalid verification code" error
5. **Verify:** Can try again

**Test 1.2.3: Weak Password**
1. Complete steps 1-2
2. Enter password: `weak`
3. **Verify:** Validation error shows requirements

**Test 1.2.4: Password Mismatch**
1. Complete steps 1-2
2. Password: `TestPass123!@#`
3. Confirm: `Different123!@#`
4. **Verify:** "Passwords do not match" error

**Test 1.2.5: Duplicate Email**
1. Use already registered email
2. **Verify:** "Email already exists" or similar error

---

## TEST SUITE 2: USER LOGIN

### Test 2.1: Email/Password Login (Happy Path)

**Prerequisites:** Use user from Test 1.1 or existing user

**Steps:**
1. Go to http://localhost:5173/login
2. Enter email: `finaltest@example.com`
3. Enter password: `NewPassword123!@#`
4. Click "Login"
5. **Verify:** Success (no errors)
6. **Verify:** Redirected to `/home`
7. **Verify:** User data appears in UI
8. Check localStorage: tokens exist

**Expected Result:** ✅ User logged in successfully

---

### Test 2.2: Wallet Login (Happy Path)

**Prerequisites:** Wallet installed (MetaMask, etc.)

**Steps:**
1. Go to http://localhost:5173/login
2. Click "Connect Wallet" or wallet icon
3. Select wallet
4. Approve connection
5. **Verify:** Wallet connected
6. Click "Login with Wallet"
7. **Verify:** Signature request appears
8. Sign message
9. **Verify:** Success
10. **Verify:** Redirected to `/home`

**Expected Result:** ✅ User logged in with wallet

---

### Test 2.3: Login Error Scenarios

**Test 2.3.1: Wrong Password**
1. Go to /login
2. Enter correct email
3. Enter wrong password
4. **Verify:** "Invalid credentials" error
5. **Verify:** Can try again

**Test 2.3.2: Non-Existent Email**
1. Go to /login
2. Enter: `nonexistent@example.com`
3. Enter any password
4. **Verify:** "Invalid credentials" error

**Test 2.3.3: Account Lockout**
1. Enter wrong password 5 times
2. **Verify:** "Account locked" message
3. **Verify:** Cannot login even with correct password
4. Wait 15 minutes or clear database

---

## TEST SUITE 3: AUTO-LOGIN & SESSION

### Test 3.1: Page Refresh Maintains Session

**Steps:**
1. Login successfully
2. Press F5 to refresh page
3. **Verify:** User still logged in
4. **Verify:** No redirect to login
5. **Verify:** User data intact

**Expected Result:** ✅ Session persists

---

### Test 3.2: New Tab/Window

**Steps:**
1. Login in tab 1
2. Open new tab
3. Go to http://localhost:5173
4. **Verify:** Auto-login occurs
5. **Verify:** Redirected to /home
6. **Verify:** User logged in both tabs

**Expected Result:** ✅ Session shared across tabs

---

### Test 3.3: Direct Protected Route Access

**Steps:**
1. Ensure logged in
2. Go to http://localhost:5173/vote
3. **Verify:** Page loads (not redirected)
4. **Verify:** User can access content

**Expected Result:** ✅ Protected route accessible

---

### Test 3.4: Token Expiry Handling

**Steps:**
1. Login successfully
2. Wait 15+ minutes (access token expires)
3. Navigate to protected route or make API call
4. **Verify:** Token automatically refreshed
5. **Verify:** No error or logout
6. **Verify:** Operation completes

**Expected Result:** ✅ Auto token refresh works

---

## TEST SUITE 4: PASSWORD RESET

### Test 4.1: Complete Password Reset (Happy Path)

**Steps:**
1. Go to http://localhost:5173/forgot-password
2. Enter email: `finaltest@example.com`
3. Click "Send Reset Link"
4. **Verify:** Success message
5. Go to https://mailtrap.io/inboxes
6. **Verify:** Email received "Reset Your Password"
7. Click reset link in email
8. **Verify:** Opens /reset-password?token=xxx
9. **Verify:** Token validated (no error)
10. Enter new password: `UpdatedPass123!@#`
11. Confirm password: `UpdatedPass123!@#`
12. Click "Reset Password"
13. **Verify:** Success message
14. **Verify:** Redirected to /login (after 3 seconds)
15. Login with NEW password
16. **Verify:** Login successful
17. Try to login with OLD password
18. **Verify:** Login fails

**Expected Result:** ✅ Password reset successful

---

### Test 4.2: Password Reset Error Scenarios

**Test 4.2.1: Invalid Email**
1. Go to /forgot-password
2. Enter: `nonexistent@example.com`
3. **Verify:** Generic message (security: don't reveal if email exists)

**Test 4.2.2: Invalid Token**
1. Go to /reset-password?token=invalid123
2. **Verify:** "Invalid or expired reset link" error
3. **Verify:** "Request New Link" button shown

**Test 4.2.3: Expired Token**
1. Get reset token
2. Wait 1+ hour
3. Try to use token
4. **Verify:** "Expired" error

**Test 4.2.4: Token Reuse**
1. Complete password reset
2. Try to use same token again
3. **Verify:** "Already used" error

---

## TEST SUITE 5: LOGOUT

### Test 5.1: Normal Logout

**Steps:**
1. Login successfully
2. Click logout button
3. **Verify:** Redirected to /login
4. Check localStorage: tokens cleared
5. Try to access protected route
6. **Verify:** Redirected to /login

**Expected Result:** ✅ Logout successful

---

### Test 5.2: Logout from Multiple Tabs

**Steps:**
1. Login in 2 tabs
2. Logout from tab 1
3. Switch to tab 2
4. Try to navigate
5. **Verify:** Session invalid in tab 2

**Expected Result:** ✅ Logout affects all tabs

---

## TEST SUITE 6: EDGE CASES

### Test 6.1: Concurrent Login Sessions

**Steps:**
1. Login on Chrome
2. Login on Firefox (same user)
3. **Verify:** Both sessions work
4. Logout from Chrome
5. **Verify:** Firefox session continues

---

### Test 6.2: Back/Forward Navigation

**Steps:**
1. Login → go to /home
2. Click browser back button
3. **Verify:** Redirected to /home (not back to login)

---

### Test 6.3: Direct URL Access (Not Logged In)

**Steps:**
1. Ensure logged out
2. Go to http://localhost:5173/vote
3. **Verify:** Redirected to /login
4. Go to http://localhost:5173/register
5. **Verify:** Page loads (allowed)

---

### Test 6.4: Already Logged In Accessing Auth Pages

**Steps:**
1. Ensure logged in
2. Go to http://localhost:5173/login
3. **Verify:** Redirected to /home
4. Go to http://localhost:5173/register
5. **Verify:** Redirected to /home

---

## TEST SUITE 7: VALIDATION & SECURITY

### Test 7.1: XSS Prevention

**Steps:**
1. Try to register with name: `<script>alert('xss')</script>`
2. **Verify:** Sanitized or rejected
3. **Verify:** No alert popup

---

### Test 7.2: SQL Injection Prevention

**Steps:**
1. Login with email: `admin' OR '1'='1`
2. **Verify:** Treated as literal string
3. **Verify:** Login fails (invalid credentials)

---

### Test 7.3: Rate Limiting

**Steps:**
1. Make 10+ login requests rapidly
2. **Verify:** Rate limit error after threshold
3. **Verify:** "Too many requests" message

---

## TEST SUITE 8: MOBILE RESPONSIVENESS

### Test 8.1: Mobile Viewport

**Steps:**
1. Open DevTools
2. Toggle device toolbar
3. Select iPhone or Android
4. Test all pages:
   - /login
   - /register
   - /forgot-password
   - /reset-password
5. **Verify:** Responsive layout
6. **Verify:** Touch-friendly buttons
7. **Verify:** No horizontal scroll

---

## TEST SUITE 9: NETWORK CONDITIONS

### Test 9.1: Slow Network

**Steps:**
1. Open DevTools Network tab
2. Throttle to "Slow 3G"
3. Try to login
4. **Verify:** Loading state shown
5. **Verify:** Eventually completes or times out gracefully

---

### Test 9.2: Offline Mode

**Steps:**
1. Enable offline mode
2. Try to login
3. **Verify:** Network error message
4. **Verify:** Can retry when back online

---

## TEST SUITE 10: ERROR RECOVERY

### Test 10.1: Server Error

**Steps:**
1. Stop backend server
2. Try to login
3. **Verify:** "Server error" or "Connection failed" message
4. **Verify:** Can retry after server restart

---

## BROWSER COMPATIBILITY

Test ALL flows on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

---

## PERFORMANCE BENCHMARKS

### Metrics to Track:
- [ ] Login time: < 1 second
- [ ] Registration time: < 2 seconds
- [ ] Page load time: < 2 seconds
- [ ] Token refresh time: < 500ms
- [ ] Password reset time: < 1 second

---

## ACCESSIBILITY

- [ ] All forms navigable with keyboard (Tab)
- [ ] Enter key submits forms
- [ ] Focus indicators visible
- [ ] Screen reader compatible (ARIA labels)
- [ ] Color contrast sufficient

---

## FINAL CHECKLIST

### Before Production:
- [ ] All tests passed
- [ ] No console errors
- [ ] No console warnings (critical)
- [ ] All API calls successful
- [ ] Error messages user-friendly
- [ ] Loading states present
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Secure (HTTPS in production)
- [ ] Environment variables set
- [ ] Email service configured
- [ ] Monitoring enabled
- [ ] Documentation complete

---

## REGRESSION TESTING

After ANY code change, re-run:
- [ ] Test Suite 1 (Registration)
- [ ] Test Suite 2 (Login)
- [ ] Test Suite 3 (Auto-Login)
- [ ] Test Suite 4 (Password Reset)

---

## BUG REPORTING TEMPLATE

```
Title: [Component] - Brief description

Environment:
- Browser: 
- OS: 
- Screen size: 

Steps to Reproduce:
1. 
2. 
3. 

Expected Result:


Actual Result:


Screenshots/Console Errors:


Severity: Critical / High / Medium / Low
```

---

**Testing Status:** Ready to Execute
**Last Updated:** October 10, 2025
**Tested By:** [Your Name]
**Test Coverage:** 100%



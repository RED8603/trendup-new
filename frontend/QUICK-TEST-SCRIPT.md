# ⚡ QUICK TEST SCRIPT - 10 MINUTE AUTH SYSTEM TEST

**Fast verification that all auth features are working**

---

## BEFORE STARTING

1. **Backend running:** http://localhost:3001
2. **Frontend running:** http://localhost:5173
3. **Mailtrap open:** https://mailtrap.io/inboxes
4. **Clear localStorage:** Open DevTools → Application → Local Storage → Clear All

---

## TEST 1: REGISTRATION (3 minutes)

### Steps:
```
1. Go to: http://localhost:5173/register
2. Email: test[timestamp]@example.com (use unique email)
3. Click "Continue"
4. Check Mailtrap → copy 6-digit code
5. Enter code → "Verify Code"
6. Fill form:
   Name: Quick Test
   Username: quicktest
   Password: QuickTest123!@#
   Confirm: QuickTest123!@#
7. "Create Account"
```

### Expected Result:
✅ Redirected to /home
✅ User logged in
✅ Check localStorage: accessToken exists

**Result:** PASS ☐ | FAIL ☐

---

## TEST 2: LOGOUT & LOGIN (2 minutes)

### Steps:
```
1. Find logout button → Click logout
2. Verify redirected to /login
3. Enter email: (your email from Test 1)
4. Enter password: QuickTest123!@#
5. Click "Login"
```

### Expected Result:
✅ Redirected to /home
✅ User logged in

**Result:** PASS ☐ | FAIL ☐

---

## TEST 3: AUTO-LOGIN (1 minute)

### Steps:
```
1. While logged in, press F5 (refresh page)
2. Observe what happens
```

### Expected Result:
✅ User stays logged in (no redirect to login)
✅ Page loads with user data

**Result:** PASS ☐ | FAIL ☐

---

## TEST 4: PASSWORD RESET (4 minutes)

### Steps:
```
1. Logout
2. Go to: http://localhost:5173/forgot-password
3. Enter email: finaltest@example.com (or your test email)
4. Click "Send Reset Link"
5. Check Mailtrap → open email
6. Click reset link
7. Enter new password: ResetTest123!@#
8. Confirm: ResetTest123!@#
9. Click "Reset Password"
10. After redirect, login with NEW password
```

### Expected Result:
✅ Reset link opens /reset-password?token=xxx
✅ Password reset successful
✅ Can login with NEW password
✅ OLD password fails

**Result:** PASS ☐ | FAIL ☐

---

## QUICK ERROR CHECKS (Optional - 2 minutes)

### Test Wrong Password:
```
1. Go to /login
2. Enter correct email
3. Enter wrong password: WrongPassword123!@#
4. Click "Login"
```

**Expected:** ✅ Error message shown

---

### Test Invalid Reset Token:
```
1. Go to: http://localhost:5173/reset-password?token=invalid123
2. Observe what happens
```

**Expected:** ✅ "Invalid or expired reset link" error

---

## FINAL VERIFICATION

**All Tests Passed?**
- [ ] Test 1: Registration ✓
- [ ] Test 2: Logout & Login ✓
- [ ] Test 3: Auto-Login ✓
- [ ] Test 4: Password Reset ✓

**If ALL passed:** 🎉 **AUTH SYSTEM WORKING!**

**If ANY failed:** 
1. Check console errors
2. Check backend logs
3. Verify environment variables
4. See E2E-TESTING-GUIDE.md for detailed debugging

---

## BROWSER COMPATIBILITY QUICK CHECK

**Repeat Test 2 (Login) on:**
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if Mac)

---

## MOBILE QUICK CHECK

**Steps:**
```
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Repeat Test 2 (Login)
```

**Expected:** ✅ Responsive UI, login works

---

## CHECKLIST BEFORE MOVING TO PRODUCTION

- [ ] All 4 tests passed
- [ ] No console errors
- [ ] Emails sending correctly
- [ ] Environment variables set
- [ ] Backend CORS configured
- [ ] HTTPS enabled (production)
- [ ] Production SMTP configured

---

**Test Duration:** ~10 minutes
**Last Tested:** ______________
**Tested By:** ______________
**Status:** PASS ☐ | FAIL ☐

---

## TROUBLESHOOTING

### "Email not sending"
- Check SMTP credentials in backend/.env
- Verify Mailtrap connection
- Check backend console for errors

### "Token expired"
- Generate new token (redo Test 4 step 4-6)
- Tokens expire after 1 hour

### "Redirect not working"
- Clear localStorage
- Hard refresh (Ctrl+Shift+R)
- Check console for errors

### "Can't login after password reset"
- Make sure using NEW password
- Wait a few seconds for database update
- Check backend logs

---

**Quick Test Complete!** ✅

Next: Run full E2E-TESTING-GUIDE.md for production readiness


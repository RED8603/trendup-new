# LOGIN PAGE TESTING GUIDE

## SERVERS RUNNING

Backend: http://localhost:3001
Frontend: http://localhost:5173

---

## TEST 1: EMAIL/PASSWORD LOGIN

### Steps:
1. Open http://localhost:5173/login
2. Click "Login with Email" button
3. Enter credentials:
   - **Email:** `finaltest@example.com`
   - **Password:** `NewPassword123!@#`
   (Or `Test123!@#` if you didn't test password reset)
4. Click "Login"

### Expected Result:
- Loading spinner appears
- After ~1 second, redirects to /home
- You're logged in
- Check browser console → should see tokens in localStorage

### Verify:
Open browser console (F12) and run:
```javascript
localStorage.getItem('accessToken')
localStorage.getItem('refreshToken')
```
Both should have values.

---

## TEST 2: WALLET LOGIN

### Steps:
1. Open http://localhost:5173/login
2. Click "Connect Wallet" button
3. Connect any wallet (MetaMask, WalletConnect, etc.)
4. After connecting, click "Login with Wallet"
5. Sign the message in your wallet

### Expected Result:
- Wallet modal opens
- After connecting, button changes to "Login with Wallet"
- Signature request appears
- After signing, redirects to /home
- You're logged in

### Verify:
Check localStorage for tokens (same as Test 1)

---

## TEST 3: ERROR HANDLING

### Test Invalid Credentials:
1. Click "Login with Email"
2. Enter:
   - Email: wrong@email.com
   - Password: wrongpassword
3. Click Login

### Expected Result:
- Red error box appears
- Message: "Invalid email or password"
- Stays on login page
- Can try again

---

## TEST 4: PROTECTED ROUTES

### After Logging In:
1. Navigate to /home, /vote, /chat, /profile
2. All should work (you're authenticated)

### After Logging Out:
1. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```
2. Try to go to /home
3. Should redirect back to /login

---

## TEST 5: AUTO-LOGIN

### Steps:
1. Login successfully (Test 1 or 2)
2. Close the browser tab completely
3. Reopen http://localhost:5173
4. Wait 2 seconds

### Expected Result:
- Brief loading screen
- Auto-fetches your profile
- Redirects to /home automatically
- No login required

---

## TROUBLESHOOTING

### "Invalid email or password"
- Check backend is running: http://localhost:3001/health
- Check you're using correct credentials
- Try creating a new account in Phase 9

### "Network Error"
- Check backend is running
- Check VITE_API_URL in frontend/.env
- Should be: http://localhost:3001/api/v1

### Wallet signature fails
- Make sure wallet is connected
- Try refreshing the page
- Check backend logs for errors

### Auto-login doesn't work
- Check tokens exist: `localStorage.getItem('accessToken')`
- Check token isn't expired
- Check backend /auth/me endpoint works

---

## WHAT TO TEST

- [ ] Email/password login works
- [ ] Wallet login works  
- [ ] Tokens stored in localStorage
- [ ] Redirect to /home works
- [ ] Error messages display
- [ ] Auto-login works on page refresh
- [ ] Can access protected routes when logged in
- [ ] Redirects to login when not authenticated

---

## NEXT STEPS

After testing login:
1. Report any issues
2. Move to Phase 9 (3-step registration)
3. Then Phase 10 (password reset)
4. Complete end-to-end auth testing

---

**Ready to test? Go to http://localhost:5173/login and try logging in!**


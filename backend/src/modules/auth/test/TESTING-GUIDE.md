# PHASE 3 TESTING GUIDE

## Server Status

Server is running on: http://localhost:5000
Health check: http://localhost:5000/health

---

## COMPLETE REGISTRATION FLOW TEST

### Step 1: Request Verification Code

```bash
curl -X POST http://localhost:5000/api/v1/auth/request-verification -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Verification code sent successfully",
  "data": {
    "message": "Verification code sent to your email",
    "email": "test@example.com",
    "expiresIn": "15 minutes"
  }
}
```

**IMPORTANT:** Since email isn't configured yet, check your backend console/logs for:
```
Verification code for test@example.com: 123456
```

---

### Step 2: Verify Email with Code

Replace `123456` with the actual code from logs:

```bash
curl -X POST http://localhost:5000/api/v1/auth/verify-email -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"code\":\"123456\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "message": "Email verified successfully",
    "verified": true
  }
}
```

---

### Step 3: Complete Registration

```bash
curl -X POST http://localhost:5000/api/v1/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"name\":\"Test User\",\"username\":\"testuser\",\"password\":\"Test123!@#\",\"passwordConfirm\":\"Test123!@#\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "email": "test@example.com",
      "name": "Test User",
      "username": "testuser",
      "isEmailVerified": true,
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**SAVE THE ACCESS TOKEN** - you'll need it for the next steps!

---

### Step 4: Get Current User (Protected Route)

Replace `YOUR_ACCESS_TOKEN` with the token from Step 3:

```bash
curl -X GET http://localhost:5000/api/v1/auth/me -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "...",
    "email": "test@example.com",
    "name": "Test User",
    ...
  }
}
```

---

### Step 5: Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Test123!@#\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

### Step 6: Refresh Token

Replace `YOUR_REFRESH_TOKEN` with the refresh token from Step 3 or 5:

```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh -H "Content-Type: application/json" -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## ERROR SCENARIOS TO TEST

### 1. Duplicate Email Registration
Try to register with same email again - should fail with:
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 2. Invalid Verification Code
Try wrong code - should increment attempts and fail

### 3. Expired Code
Wait 15+ minutes - code should expire

### 4: Wrong Password on Login
Should increment failed attempts

### 5. Invalid Token
Try to access /me with invalid token - should return 401

---

## USING POSTMAN/THUNDER CLIENT

1. Create a new collection: "TrendUpCoin Auth"
2. Add these requests:
   - POST /request-verification
   - POST /verify-email
   - POST /register
   - POST /login
   - GET /me (with Authorization header)
   - POST /refresh

---

## PHASE 3 CHECKLIST

- [x] Server starts without errors
- [ ] Request verification sends code (check logs)
- [ ] Verify email accepts correct code
- [ ] Registration creates user and returns tokens
- [ ] Login works with correct credentials
- [ ] /me endpoint returns user with valid token
- [ ] Refresh token generates new access token
- [ ] Rate limiting works (try 6 requests quickly)
- [ ] Validation errors return proper messages
- [ ] Duplicate email is rejected

---

**Server Status:** RUNNING on port 5000
**Next:** Test all endpoints above!


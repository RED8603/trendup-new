# TRENDUP AUTH API DOCUMENTATION

## BASE URL
```
http://localhost:3001/api/v1/auth
```

---

## AUTHENTICATION ENDPOINTS

### 1. Request Email Verification

**POST** `/request-verification`

Send verification code to email address.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Verification code sent successfully",
  "data": {
    "message": "Verification code sent to your email",
    "email": "user@example.com",
    "expiresIn": "15 minutes"
  }
}
```

**Rate Limit:** 20 requests per 10 seconds

---

### 2. Verify Email Code

**POST** `/verify-email`

Verify email with 6-digit code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (200):**
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

**Errors:**
- 400: Invalid or expired code
- 409: Maximum attempts exceeded

**Rate Limit:** 20 requests per 10 seconds

---

### 3. Register User

**POST** `/register`

Complete user registration (email must be verified first).

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "username": "johndoe",
  "password": "Test123!@#",
  "passwordConfirm": "Test123!@#"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "name": "John Doe",
      "username": "johndoe",
      "isEmailVerified": true,
      "role": "user",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- 400: Validation errors
- 409: Email not verified, email exists, username taken

**Rate Limit:** 5 requests per minute

---

### 4. Login

**POST** `/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Test123!@#"
}
```

**Response (200):**
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

**Errors:**
- 401: Invalid credentials
- 401: Account locked (5 failed attempts)

**Rate Limit:** 5 requests per minute

---

### 5. Get Current User

**GET** `/me`

Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe",
    "avatar": null,
    "bio": "",
    "walletAddress": null,
    "walletVerified": false,
    "isEmailVerified": true,
    "isActive": true,
    "role": "user",
    "followersCount": 0,
    "followingCount": 0,
    "postsCount": 0,
    "lastLogin": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:**
- 401: No token provided, invalid token, expired token

---

### 6. Refresh Access Token

**POST** `/refresh`

Refresh expired access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- 401: Invalid or expired refresh token

**Rate Limit:** 20 requests per 10 seconds

---

## PASSWORD RESET ENDPOINTS

### 7. Forgot Password

**POST** `/forgot-password`

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent",
  "data": {
    "message": "If an account exists with this email, a password reset link has been sent"
  }
}
```

**Rate Limit:** 1 request per minute

---

### 8. Validate Reset Token

**GET** `/validate-reset-token/:token`

Check if password reset token is valid.

**Response (200):**
```json
{
  "success": true,
  "message": "Token validation completed",
  "data": {
    "valid": true
  }
}
```

**Rate Limit:** 20 requests per 10 seconds

---

### 9. Reset Password

**POST** `/reset-password`

Reset password with valid token.

**Request Body:**
```json
{
  "token": "bf097d6d0edba8e4dfb8f065771e3a8815a2a01f...",
  "password": "NewPassword123!@#",
  "passwordConfirm": "NewPassword123!@#"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password",
  "data": {
    "message": "Password reset successfully. You can now login with your new password"
  }
}
```

**Errors:**
- 400: Validation errors, weak password
- 404: Token not found
- 409: Token expired or already used

**Rate Limit:** 1 request per minute

---

## WALLET AUTHENTICATION ENDPOINTS

### 10. Request Wallet Nonce

**POST** `/wallet/request-nonce`

Get nonce for wallet signature.

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Nonce generated successfully",
  "data": {
    "message": "Sign this message to authenticate with TrendUpCoin\n\nNonce: eaca42ebe1af6f0d708a...",
    "nonce": "eaca42ebe1af6f0d708a...",
    "expiresIn": "5 minutes"
  }
}
```

**Rate Limit:** 10 requests per minute

---

### 11. Verify Wallet Signature

**POST** `/wallet/verify`

Verify wallet signature and authenticate.

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0x72d47431516497e2e3e1848b28e374e5a0894a...",
  "nonce": "eaca42ebe1af6f0d708a...",
  "linkToEmail": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Wallet verified successfully",
  "data": {
    "user": {
      "_id": "...",
      "email": "...",
      "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
      "walletVerified": true,
      ...
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

**Errors:**
- 400: Invalid wallet address, invalid signature
- 401: Invalid nonce, expired nonce, signature mismatch
- 409: Wallet already linked to another account

**Rate Limit:** 10 requests per minute

---

## AUTHENTICATION FLOW

### Email/Password Flow
1. POST `/request-verification` - Get code
2. POST `/verify-email` - Verify code
3. POST `/register` - Create account + get tokens
4. POST `/login` - Login later
5. GET `/me` - Access protected routes
6. POST `/refresh` - Refresh expired token

### Wallet Authentication Flow
1. POST `/wallet/request-nonce` - Get nonce + message
2. Sign message with wallet (frontend)
3. POST `/wallet/verify` - Verify signature + get tokens
4. GET `/me` - Access protected routes

### Password Reset Flow
1. POST `/forgot-password` - Request reset
2. GET `/validate-reset-token/:token` - Validate token
3. POST `/reset-password` - Reset password
4. POST `/login` - Login with new password

---

## TOKEN INFORMATION

**Access Token:**
- Expiry: 30 minutes
- Use: All protected routes
- Header: `Authorization: Bearer <token>`

**Refresh Token:**
- Expiry: 14 days
- Use: Get new access token
- Endpoint: POST `/refresh`

---

## ERROR RESPONSE FORMAT

```json
{
  "success": false,
  "message": "Error message here",
  "error": {
    "code": "ERROR_CODE",
    "details": null,
    "timestamp": "2025-10-09T16:00:00.000Z"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTH_ERROR` - Authentication failed
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Duplicate resource
- `RATE_LIMIT` - Too many requests

---

## TESTING WITH CURL

See `test/TESTING-GUIDE.md` for complete curl examples.

## TESTING WITH JAVASCRIPT

See `test/test-wallet-auth.js` for wallet authentication example.

---

*API Version: 1.0.0*
*Last Updated: 2025-10-09*


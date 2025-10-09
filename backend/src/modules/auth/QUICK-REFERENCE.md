# AUTH API QUICK REFERENCE

## Server
```
URL: http://localhost:3001
Base: /api/v1/auth
```

## Endpoints

### Registration Flow
```bash
# 1. Request verification
POST /request-verification
Body: { email }

# 2. Verify email  
POST /verify-email
Body: { email, code }

# 3. Register
POST /register
Body: { email, name, username?, password, passwordConfirm }
Returns: { user, accessToken, refreshToken }
```

### Login
```bash
POST /login
Body: { email, password }
Returns: { user, accessToken, refreshToken }
```

### Protected Routes
```bash
GET /me
Header: Authorization: Bearer <token>
Returns: { user }
```

### Token Management
```bash
POST /refresh
Body: { refreshToken }
Returns: { accessToken }
```

### Password Reset
```bash
# 1. Request reset
POST /forgot-password
Body: { email }

# 2. Validate token (optional)
GET /validate-reset-token/:token
Returns: { valid }

# 3. Reset password
POST /reset-password
Body: { token, password, passwordConfirm }
```

### Wallet Authentication
```bash
# 1. Get nonce
POST /wallet/request-nonce
Body: { walletAddress }
Returns: { message, nonce }

# 2. Verify signature
POST /wallet/verify
Body: { walletAddress, signature, nonce, linkToEmail? }
Returns: { user, accessToken, refreshToken }
```

## Token Format
```
Access Token: 30 minutes expiry
Refresh Token: 14 days expiry
Header: Authorization: Bearer <token>
```

## Common Errors
```
400 - Validation Error
401 - Authentication Failed
409 - Conflict (duplicate email/username)
429 - Rate Limit Exceeded
```

## Testing
```bash
# Check server
curl http://localhost:3001/health

# Test endpoint
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'
```


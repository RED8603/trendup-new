# TrendUpCoin Frontend

React + Vite application for TrendUpCoin social platform.

## Environment Variables

**IMPORTANT:** In production, all required environment variables must be set. The application will fail to start if required variables are missing.

Create a `.env` file in the frontend directory with the following variables:

### Required Variables (Production)

```env
# Backend API URL
VITE_API_URL=https://api.trenduplive.com/api/v1

# Backend Base URL
VITE_BACKEND_URL=https://api.trenduplive.com

# WalletConnect Project ID (get from https://cloud.reown.com/)
VITE_WALLET_CONNECT_PROJECT_ID=your-project-id-here
```

### Optional Variables

```env
# Socket.io URL (falls back to VITE_BACKEND_URL if not set)
VITE_SOCKET_URL=https://api.trenduplive.com

# Environment mode: 'development' or 'production'
VITE_ENV=production
```

### Development Setup

For local development, you can use these defaults (automatically used if variables are not set):

```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_BACKEND_URL=http://localhost:3001
VITE_WALLET_CONNECT_PROJECT_ID=your-project-id-here
VITE_ENV=development
```

## Security Notes

- **Never commit `.env` files to version control**
- **Never hardcode secrets in source code**
- **Rotate WalletConnect Project ID if exposed**
- **Use different project IDs for development and production**

## Building for Production

1. Set all required environment variables
2. Run `npm run build`
3. The build will fail if required variables are missing in production mode
4. Deploy the `dist` folder to your hosting service

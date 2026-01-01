/**
 * Frontend Environment Configuration
 * 
 * Access environment variables consistently across the app
 * 
 * IMPORTANT: All environment variables must be set in production.
 * Do not use fallback values for production builds.
 */

// Check if we're in production mode
// Vite sets import.meta.env.PROD to true only in production builds (vite build)
// import.meta.env.DEV is true in development (vite dev)
const isProductionBuild = import.meta.env.PROD === true;
const isDevelopment = import.meta.env.DEV === true;
const isProduction = isProductionBuild || import.meta.env.VITE_ENV === 'production';

// Helper to get env var with fallback (development) or throw error (production build only)
const getEnvVar = (key, fallback = null, requiredInProduction = true) => {
  const value = import.meta.env[key];

  // If value exists, use it
  if (value) {
    return value;
  }

  // Only validate in actual production builds (not dev server)
  // This ensures the app works in development even without env vars
  if (isProductionBuild && requiredInProduction && import.meta.env.MODE === 'production') {
    console.error(`[ENV ERROR] Missing required environment variable: ${key}`);
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please set this variable in your production environment.`
    );
  }

  // Always use fallback if provided (works in both dev and prod if not set)
  if (fallback !== null) {
    if (isDevelopment) {
      console.warn(`[ENV] Using fallback for ${key}: ${fallback}`);
    }
    return fallback;
  }

  // Return null if no fallback
  return null;
};

export const env = {
  // API Configuration - REQUIRED in production
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3001/api/v1', true),
  backendUrl: getEnvVar('VITE_BACKEND_URL', 'http://localhost:3001', true),

  // WalletConnect - Optional (can be null if Web3 is disabled)
  walletConnectProjectId: getEnvVar('VITE_WALLET_CONNECT_PROJECT_ID', null, false),

  // Google Auth
  googleClientId: getEnvVar('VITE_GOOGLE_CLIENT_ID', 'YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER', false),

  // Environment flags
  isDevelopment: isDevelopment,
  isProduction: isProduction,
};

/**
 * Helper function to get full image URL
 */
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path; // Already full URL
  return `${env.backendUrl}${path}`;
};

export default env;


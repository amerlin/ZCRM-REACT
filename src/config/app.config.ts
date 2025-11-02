/**
 * Application configuration
 * Reads environment variables and provides typed configuration
 */

interface AppConfig {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate configuration
if (!config.apiBaseUrl) {
  console.error('VITE_API_BASE_URL is not defined in environment variables');
}

// Log configuration in development
if (config.isDevelopment) {
  console.log('App Configuration:', {
    apiBaseUrl: config.apiBaseUrl,
    environment: config.isDevelopment ? 'development' : 'production',
  });
}

export default config;

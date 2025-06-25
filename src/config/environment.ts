// Environment Configuration
// This file manages environment variables and configuration settings

export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  apiBaseUrl: string;
  enableLogging: boolean;
  enableAnalytics: boolean;
  debugMode: boolean;
  version: string;
}

// Default configuration
const defaultConfig: EnvironmentConfig = {
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
  apiBaseUrl: __DEV__ ? 'http://localhost:3000/api' : 'https://api.realitycheck.app',
  enableLogging: __DEV__,
  enableAnalytics: !__DEV__,
  debugMode: __DEV__,
  version: '1.0.0',
};

// Environment-specific overrides
const getEnvironmentConfig = (): EnvironmentConfig => {
  // You can add environment-specific logic here
  // For example, reading from expo-constants or other sources
  
  return {
    ...defaultConfig,
    // Add any runtime overrides here
  };
};

export const Environment = getEnvironmentConfig();

// Helper functions
export const isDev = () => Environment.isDevelopment;
export const isProd = () => Environment.isProduction;
export const shouldLog = () => Environment.enableLogging;
export const shouldTrack = () => Environment.enableAnalytics;
export const isDebugMode = () => Environment.debugMode;

// API Configuration
export const API_CONFIG = {
  baseUrl: Environment.apiBaseUrl,
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  enableAdvancedAnalytics: Environment.isProduction,
  enableBetaFeatures: Environment.isDevelopment,
  enableCrashReporting: Environment.isProduction,
  enablePerformanceMonitoring: true,
} as const;

// Logging Configuration
export const LOGGING_CONFIG = {
  level: Environment.isDevelopment ? 'debug' : 'error',
  enableConsole: Environment.isDevelopment,
  enableRemote: Environment.isProduction,
  maxLogSize: 1000,
} as const;
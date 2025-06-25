import Constants from 'expo-constants';

// API Keys and Configuration
export const GoogleVisionApiKey = Constants.expoConfig?.extra?.googleVisionApiKey || '';

// Supabase Configuration
export const SupabaseConfig = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ''
};

// App Configuration
export const AppConfig = {
  name: 'RealityCheck',
  version: '2.0.0',
  buildNumber: '1',
  environment: process.env.NODE_ENV || 'development',
  apiTimeout: 30000, // 30 seconds
  maxRetries: 3,
  enableAnalytics: true,
  enableCrashlytics: true
};

// Screen Time Configuration
export const ScreenTimeConfig = {
  maxDailyGoal: 8 * 60 * 60, // 8 hours in seconds
  minDailyGoal: 30 * 60, // 30 minutes in seconds
  defaultDailyGoal: 4 * 60 * 60, // 4 hours in seconds
  dataRetentionDays: 90,
  syncIntervalMinutes: 15
};

// Notification Configuration
export const NotificationConfig = {
  dailyReminderHour: 20, // 8 PM
  weeklyReportDay: 0, // Sunday
  goalAchievementEnabled: true,
  overusageWarningEnabled: true,
  overusageThresholdPercent: 90
};

// UI Configuration
export const UIConfig = {
  animationDuration: 300,
  hapticFeedback: true,
  darkModeSupport: true,
  defaultTheme: 'system' as 'light' | 'dark' | 'system',
  chartColors: {
    primary: '#007AFF',
    secondary: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    info: '#5AC8FA',
    success: '#30D158'
  }
};

// Analytics Events
export const AnalyticsEvents = {
  // User Actions
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_SIGNUP: 'user_signup',
  
  // Screen Time
  SCREEN_TIME_VIEWED: 'screen_time_viewed',
  GOAL_SET: 'goal_set',
  GOAL_ACHIEVED: 'goal_achieved',
  GOAL_MISSED: 'goal_missed',
  
  // App Usage
  APP_OPENED: 'app_opened',
  APP_BACKGROUNDED: 'app_backgrounded',
  FEATURE_USED: 'feature_used',
  
  // Vision Analysis
  IMAGE_ANALYZED: 'image_analyzed',
  DISTRACTING_CONTENT_DETECTED: 'distracting_content_detected',
  
  // Settings
  SETTINGS_CHANGED: 'settings_changed',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  NOTIFICATIONS_DISABLED: 'notifications_disabled'
};

// Error Messages
export const ErrorMessages = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  PERMISSION_DENIED: 'Permission denied. Please grant the required permissions.',
  SCREEN_TIME_UNAVAILABLE: 'Screen time data is not available on this device.',
  DATABASE_ERROR: 'Database service error. Please try again later.',
  VISION_API_ERROR: 'Image analysis failed. Please try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
};

// Storage Keys
export const StorageKeys = {
  USER_PREFERENCES: 'user_preferences',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LAST_SYNC_TIME: 'last_sync_time',
  CACHED_SCREEN_TIME: 'cached_screen_time',
  APP_USAGE_CACHE: 'app_usage_cache',
  GOALS_CACHE: 'goals_cache'
};

// API Endpoints (if using custom backend)
export const APIEndpoints = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.realitycheck.app',
  AUTH: '/auth',
  USER: '/user',
  SCREEN_TIME: '/screen-time',
  GOALS: '/goals',
  ANALYTICS: '/analytics'
};

// Development Configuration
export const DevConfig = {
  enableDebugMode: __DEV__,
  enableMockData: __DEV__ && process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true',
  logLevel: __DEV__ ? 'debug' : 'error',
  enableReduxDevTools: __DEV__
};

// Feature Flags
export const FeatureFlags = {
  enableVisionAnalysis: true,
  enablePushNotifications: true,
  enableBackgroundSync: true,
  enableAdvancedAnalytics: true,
  enableSocialFeatures: false, // Future feature
  enablePremiumFeatures: false // Future feature
};

// Validation Rules
export const ValidationRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  },
  goalDuration: {
    min: 30 * 60, // 30 minutes
    max: 12 * 60 * 60 // 12 hours
  }
};

// Export all configurations
export default {
  GoogleVisionApiKey,
  SupabaseConfig,
  AppConfig,
  ScreenTimeConfig,
  NotificationConfig,
  UIConfig,
  AnalyticsEvents,
  ErrorMessages,
  StorageKeys,
  APIEndpoints,
  DevConfig,
  FeatureFlags,
  ValidationRules
};
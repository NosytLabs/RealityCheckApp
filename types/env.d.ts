declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      EXPO_PUBLIC_API_URL?: string;
      EXPO_PUBLIC_API_KEY?: string;
      GOOGLE_VISION_API_KEY?: string;
      EAS_PROJECT_ID?: string;
      FIREBASE_API_KEY?: string;
      FIREBASE_AUTH_DOMAIN?: string;
      FIREBASE_PROJECT_ID?: string;
      FIREBASE_STORAGE_BUCKET?: string;
      FIREBASE_MESSAGING_SENDER_ID?: string;
      FIREBASE_APP_ID?: string;
      NODE_ENV: 'development' | 'staging' | 'production';
      APP_VERSION?: string;
      APP_BUILD_NUMBER?: string;
      SENTRY_DSN?: string;
      AMPLITUDE_API_KEY?: string;
      ENABLE_ANALYTICS?: string;
      ENABLE_CRASH_REPORTING?: string;
      ENABLE_PERFORMANCE_MONITORING?: string;
      ENABLE_SOCIAL_FEATURES?: string;
      ENABLE_PREMIUM_FEATURES?: string;
    }
  }
}

// Ensure this file is treated as a module
export {};
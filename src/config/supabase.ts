import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/database';
import { MockSupabaseService } from './supabase-mock';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

// Create Supabase client with fallback configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Check if Supabase is available and initialize mock service if needed
let isSupabaseAvailable = false;

export const initializeSupabase = async (): Promise<boolean> => {
  try {
    isSupabaseAvailable = await MockSupabaseService.checkConnection();
    if (!isSupabaseAvailable) {
      console.warn('⚠️ Supabase not available, using mock data for development');
    } else {
      console.log('✅ Supabase connection established');
    }
    return isSupabaseAvailable;
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error);
    isSupabaseAvailable = false;
    return false;
  }
};

export const getSupabaseStatus = () => isSupabaseAvailable;
export { MockSupabaseService };

// Database table names (Updated for 2025 schema)
export const TABLES = {
  PROFILES: 'profiles',
  REALITY_CHECKS: 'reality_checks',
  USER_STATS: 'user_stats',
  ACHIEVEMENTS: 'achievements',
  USER_ACHIEVEMENTS: 'user_achievements',
  GOALS: 'goals',
  NOTIFICATIONS: 'notifications',
  // Legacy tables (for backward compatibility)
  USERS: 'users',
  USER_PROFILES: 'user_profiles',
  APP_USAGE_SESSIONS: 'app_usage_sessions',
  SCROLL_SESSIONS: 'scroll_sessions',
  AFFIRMATIONS: 'affirmations',
  CHALLENGES: 'challenges',
  ANALYTICS_EVENTS: 'analytics_events',
  USER_SETTINGS: 'user_settings',
  BLOCKED_APPS: 'blocked_apps',
  INTERVENTION_LOGS: 'intervention_logs',
  CONSENT_RECORDS: 'consent_records',
  DATA_EXPORT_REQUESTS: 'data_export_requests',
  DATA_DELETION_REQUESTS: 'data_deletion_requests',
  AUDIT_LOGS: 'audit_logs',
} as const;

// RLS (Row Level Security) policies helper
export const RLS_POLICIES = {
  USER_DATA: 'Users can only access their own data',
  PUBLIC_READ: 'Public read access for reference data',
  ADMIN_ONLY: 'Admin only access for system data',
} as const;

// Supabase configuration validation
export const validateSupabaseConfig = (): boolean => {
  return (
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key' &&
    supabaseUrl.includes('supabase.co')
  );
};

// Test Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};

// Get current user session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
};

// Get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
};

export default supabase;
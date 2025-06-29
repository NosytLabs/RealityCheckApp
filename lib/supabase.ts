import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Helper function to check if Supabase is available
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1)
    return !error
  } catch (error) {
    console.warn('Supabase connection failed, using mock data:', error)
    return false
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type RealityCheck = Database['public']['Tables']['reality_checks']['Row']
export type Goal = Database['public']['Tables']['goals']['Row']
export type UserStats = Database['public']['Tables']['user_stats']['Row']
export type OfflineSession = Database['public']['Tables']['offline_sessions']['Row']
export type BlockedApp = Database['public']['Tables']['blocked_apps']['Row']
export type OfflineChallenge = Database['public']['Tables']['offline_challenges']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type GoalInsert = Database['public']['Tables']['goals']['Insert']
export type OfflineSessionInsert = Database['public']['Tables']['offline_sessions']['Insert']
export type BlockedAppInsert = Database['public']['Tables']['blocked_apps']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type GoalUpdate = Database['public']['Tables']['goals']['Update']
export type OfflineSessionUpdate = Database['public']['Tables']['offline_sessions']['Update']
export type BlockedAppUpdate = Database['public']['Tables']['blocked_apps']['Update']
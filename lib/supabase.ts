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

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type RealityCheck = Database['public']['Tables']['reality_checks']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Like = Database['public']['Tables']['likes']['Row']
export type Follow = Database['public']['Tables']['follows']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row']
export type UserStats = Database['public']['Tables']['user_stats']['Row']
export type Goal = Database['public']['Tables']['goals']['Row']
export type Report = Database['public']['Tables']['reports']['Row']
export type UserDashboardStats = Database['public']['Views']['user_dashboard_stats']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type RealityCheckInsert = Database['public']['Tables']['reality_checks']['Insert']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type LikeInsert = Database['public']['Tables']['likes']['Insert']
export type FollowInsert = Database['public']['Tables']['follows']['Insert']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type UserAchievementInsert = Database['public']['Tables']['user_achievements']['Insert']
export type GoalInsert = Database['public']['Tables']['goals']['Insert']
export type ReportInsert = Database['public']['Tables']['reports']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type RealityCheckUpdate = Database['public']['Tables']['reality_checks']['Update']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']
export type GoalUpdate = Database['public']['Tables']['goals']['Update']

// Enum types
export type UserStatus = Database['public']['Enums']['user_status']
export type SubscriptionStatus = Database['public']['Enums']['subscription_status']
export type AchievementType = Database['public']['Enums']['achievement_type']
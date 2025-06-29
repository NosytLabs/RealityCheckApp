export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          criteria: Json
          description: string
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          points: number | null
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Insert: {
          created_at?: string | null
          criteria: Json
          description: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points?: number | null
          type: Database["public"]["Enums"]["achievement_type"]
        }
        Update: {
          created_at?: string | null
          criteria?: Json
          description?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points?: number | null
          type?: Database["public"]["Enums"]["achievement_type"]
        }
        Relationships: []
      }
      blocked_apps: {
        Row: {
          app_identifier: string
          app_name: string
          block_during_focus: boolean | null
          block_during_offline: boolean | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          app_identifier: string
          app_name: string
          block_during_focus?: boolean | null
          block_during_offline?: boolean | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          app_identifier?: string
          app_name?: string
          block_during_focus?: boolean | null
          block_during_offline?: boolean | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_apps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_apps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          reality_check_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          reality_check_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          reality_check_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_reality_check_id_fkey"
            columns: ["reality_check_id"]
            isOneToOne: false
            referencedRelation: "reality_checks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          is_completed: boolean | null
          target_date: string | null
          target_value: number
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          target_value: number
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          target_value?: number
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          reality_check_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reality_check_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reality_check_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_reality_check_id_fkey"
            columns: ["reality_check_id"]
            isOneToOne: false
            referencedRelation: "reality_checks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      offline_challenges: {
        Row: {
          challenge_type: string | null
          created_at: string | null
          description: string
          difficulty: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          points_reward: number | null
          requirements: Json | null
          title: string
        }
        Insert: {
          challenge_type?: string | null
          created_at?: string | null
          description: string
          difficulty?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean | null
          points_reward?: number | null
          requirements?: Json | null
          title: string
        }
        Update: {
          challenge_type?: string | null
          created_at?: string | null
          description?: string
          difficulty?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          points_reward?: number | null
          requirements?: Json | null
          title?: string
        }
        Relationships: []
      }
      offline_sessions: {
        Row: {
          apps_blocked: string[] | null
          created_at: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          notes: string | null
          session_type: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          apps_blocked?: string[] | null
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          session_type?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          apps_blocked?: string[] | null
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          session_type?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offline_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offline_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          notification_settings: Json | null
          privacy_settings: Json | null
          status: Database["public"]["Enums"]["user_status"] | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id: string
          notification_settings?: Json | null
          privacy_settings?: Json | null
          status?: Database["public"]["Enums"]["user_status"] | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          notification_settings?: Json | null
          privacy_settings?: Json | null
          status?: Database["public"]["Enums"]["user_status"] | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reality_checks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_analysis: Json | null
          image_url: string | null
          is_public: boolean | null
          location: Json | null
          mood_after: number | null
          mood_before: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_analysis?: Json | null
          image_url?: string | null
          is_public?: boolean | null
          location?: Json | null
          mood_after?: number | null
          mood_before?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_analysis?: Json | null
          image_url?: string | null
          is_public?: boolean | null
          location?: Json | null
          mood_after?: number | null
          mood_before?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reality_checks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reality_checks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          comment_id: string | null
          created_at: string | null
          description: string | null
          id: string
          reality_check_id: string | null
          reason: string
          reported_user_id: string | null
          reporter_id: string
          status: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          reality_check_id?: string | null
          reason: string
          reported_user_id?: string | null
          reporter_id: string
          status?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          reality_check_id?: string | null
          reason?: string
          reported_user_id?: string | null
          reporter_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reality_check_id_fkey"
            columns: ["reality_check_id"]
            isOneToOne: false
            referencedRelation: "reality_checks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      user_offline_challenges: {
        Row: {
          challenge_id: string
          completed_at: string | null
          id: string
          is_completed: boolean | null
          progress: Json | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: Json | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: Json | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_offline_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "offline_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_offline_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_offline_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          created_at: string | null
          current_offline_streak: number | null
          current_streak: number | null
          followers_count: number | null
          following_count: number | null
          id: string
          last_offline_session_date: string | null
          last_reality_check_date: string | null
          longest_offline_streak: number | null
          longest_streak: number | null
          offline_session_count: number | null
          total_comments_received: number | null
          total_likes_received: number | null
          total_offline_minutes: number | null
          total_reality_checks: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_offline_streak?: number | null
          current_streak?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          last_offline_session_date?: string | null
          last_reality_check_date?: string | null
          longest_offline_streak?: number | null
          longest_streak?: number | null
          offline_session_count?: number | null
          total_comments_received?: number | null
          total_likes_received?: number | null
          total_offline_minutes?: number | null
          total_reality_checks?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_offline_streak?: number | null
          current_streak?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          last_offline_session_date?: string | null
          last_reality_check_date?: string | null
          longest_offline_streak?: number | null
          longest_streak?: number | null
          offline_session_count?: number | null
          total_comments_received?: number | null
          total_likes_received?: number | null
          total_offline_minutes?: number | null
          total_reality_checks?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_dashboard_stats"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_dashboard_stats: {
        Row: {
          achievements_count: number | null
          avatar_url: string | null
          current_streak: number | null
          display_name: string | null
          followers_count: number | null
          following_count: number | null
          id: string | null
          longest_streak: number | null
          total_points: number | null
          total_reality_checks: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      setup_default_blocked_apps: {
        Args: {
          target_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      achievement_type: "streak" | "milestone" | "social" | "special"
      subscription_status: "free" | "premium" | "enterprise"
      user_status: "active" | "inactive" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
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
      user_stats: {
        Row: {
          created_at: string | null
          current_streak: number | null
          followers_count: number | null
          following_count: number | null
          id: string
          last_reality_check_date: string | null
          longest_streak: number | null
          total_comments_received: number | null
          total_likes_received: number | null
          total_reality_checks: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          last_reality_check_date?: string | null
          longest_streak?: number | null
          total_comments_received?: number | null
          total_likes_received?: number | null
          total_reality_checks?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          last_reality_check_date?: string | null
          longest_streak?: number | null
          total_comments_received?: number | null
          total_likes_received?: number | null
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
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          current_streak: number | null
          display_name: string | null
          email: string | null
          followers_count: number | null
          following_count: number | null
          id: string | null
          last_reality_check_date: string | null
          longest_streak: number | null
          notification_settings: Json | null
          privacy_settings: Json | null
          status: Database["public"]["Enums"]["user_status"] | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          total_comments_received: number | null
          total_likes_received: number | null
          total_reality_checks: number | null
          updated_at: string | null
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
      get_user_feed: {
        Args: {
          p_user_id: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          title: string
          description: string | null
          created_at: string | null
          updated_at: string | null
          user_id: string
          image_url: string | null
          is_public: boolean | null
          mood_before: number | null
          mood_after: number | null
          location: Json | null
          tags: string[] | null
          image_analysis: Json | null
          user_display_name: string | null
          user_avatar_url: string | null
          likes_count: number | null
          comments_count: number | null
          has_liked: boolean | null
        }[]
      }
      get_user_profile: {
        Args: {
          p_user_id: string
          p_viewer_id?: string
        }
        Returns: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          updated_at: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          notification_settings: Json | null
          privacy_settings: Json | null
          total_reality_checks: number | null
          total_likes_received: number | null
          total_comments_received: number | null
          current_streak: number | null
          longest_streak: number | null
          last_reality_check_date: string | null
          followers_count: number | null
          following_count: number | null
          is_following: boolean | null
          is_followed_by: boolean | null
        }
      }
      get_user_reality_checks: {
        Args: {
          p_user_id: string
          p_viewer_id?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          title: string
          description: string | null
          created_at: string | null
          updated_at: string | null
          user_id: string
          image_url: string | null
          is_public: boolean | null
          mood_before: number | null
          mood_after: number | null
          location: Json | null
          tags: string[] | null
          image_analysis: Json | null
          user_display_name: string | null
          user_avatar_url: string | null
          likes_count: number | null
          comments_count: number | null
          has_liked: boolean | null
        }[]
      }
      search_reality_checks: {
        Args: {
          p_search_term: string
          p_user_id?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          title: string
          description: string | null
          created_at: string | null
          updated_at: string | null
          user_id: string
          image_url: string | null
          is_public: boolean | null
          mood_before: number | null
          mood_after: number | null
          location: Json | null
          tags: string[] | null
          image_analysis: Json | null
          user_display_name: string | null
          user_avatar_url: string | null
          likes_count: number | null
          comments_count: number | null
          has_liked: boolean | null
        }[]
      }
      search_users: {
        Args: {
          p_search_term: string
          p_current_user_id?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          total_reality_checks: number | null
          followers_count: number | null
          is_following: boolean | null
        }[]
      }
    }
    Enums: {
      achievement_type: "daily" | "streak" | "milestone" | "special"
      subscription_status: "free" | "premium" | "trial"
      user_status: "active" | "inactive" | "suspended"
    }
    CompositeTypes: {}
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
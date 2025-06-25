export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          last_login: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      app_usage_sessions: {
        Row: {
          id: string
          user_id: string
          app_name: string
          start_time: string
          end_time: string | null
          duration_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          app_name: string
          start_time: string
          end_time?: string | null
          duration_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          app_name?: string
          start_time?: string
          end_time?: string | null
          duration_ms?: number | null
          created_at?: string
        }
      }
      scroll_sessions: {
        Row: {
          id: string
          user_id: string
          app_name: string
          start_time: string
          end_time: string | null
          scroll_distance: number | null
          intervention_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          app_name: string
          start_time: string
          end_time?: string | null
          scroll_distance?: number | null
          intervention_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          app_name?: string
          start_time?: string
          end_time?: string | null
          scroll_distance?: number | null
          intervention_count?: number
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          event_name: string
          properties: Json
          user_id: string | null
          session_id: string | null
          timestamp: string
          platform: string
          app_version: string
          device_info: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          event_name: string
          properties?: Json
          user_id?: string | null
          session_id?: string | null
          timestamp: string
          platform: string
          app_version: string
          device_info?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          event_name?: string
          properties?: Json
          user_id?: string | null
          session_id?: string | null
          timestamp?: string
          platform?: string
          app_version?: string
          device_info?: Json | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          key: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          key: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
      }
      consent_records: {
        Row: {
          id: string
          user_id: string
          consent_type: string
          granted: boolean
          timestamp: string
          version: string
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          consent_type: string
          granted: boolean
          timestamp: string
          version: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          consent_type?: string
          granted?: boolean
          timestamp?: string
          version?: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      data_export_requests: {
        Row: {
          id: string
          user_id: string
          request_type: string
          data_types: Json | null
          status: string
          created_at: string
          completed_at: string | null
          download_url: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          request_type: string
          data_types?: Json | null
          status: string
          created_at: string
          completed_at?: string | null
          download_url?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          request_type?: string
          data_types?: Json | null
          status?: string
          created_at?: string
          completed_at?: string | null
          download_url?: string | null
          expires_at?: string | null
        }
      }
      data_deletion_requests: {
        Row: {
          id: string
          user_id: string
          deletion_type: string
          data_types: Json | null
          status: string
          created_at: string
          completed_at: string | null
          retention_period: number | null
        }
        Insert: {
          id?: string
          user_id: string
          deletion_type: string
          data_types?: Json | null
          status: string
          created_at: string
          completed_at?: string | null
          retention_period?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          deletion_type?: string
          data_types?: Json | null
          status?: string
          created_at?: string
          completed_at?: string | null
          retention_period?: number | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          data_type: string
          access_type: string
          timestamp: string
          details: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          data_type: string
          access_type: string
          timestamp: string
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          data_type?: string
          access_type?: string
          timestamp?: string
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
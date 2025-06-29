/*
  # User Settings and Preferences

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `app_usage_limits` (jsonb)
      - `intervention_settings` (jsonb)
      - `downtime_schedules` (jsonb)
      - `notification_preferences` (jsonb)
      - `privacy_preferences` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_settings` table
    - Add policy for users to manage their own settings
*/

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  app_usage_limits jsonb DEFAULT '[]'::jsonb,
  intervention_settings jsonb DEFAULT '{
    "reality_check": {"enabled": true, "frequency": "medium"},
    "mindful_breathing": {"enabled": true, "frequency": "low"},
    "usage_alerts": {"enabled": false, "frequency": "high"},
    "focus_reminders": {"enabled": true, "frequency": "medium"},
    "digital_detox": {"enabled": false, "frequency": "low"}
  }'::jsonb,
  downtime_schedules jsonb DEFAULT '[]'::jsonb,
  notification_preferences jsonb DEFAULT '{
    "push_enabled": true,
    "email_enabled": true,
    "reality_check_reminders": true,
    "goal_progress_updates": true,
    "achievement_notifications": true
  }'::jsonb,
  privacy_preferences jsonb DEFAULT '{
    "profile_visible": true,
    "stats_visible": true,
    "activity_visible": false
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS user_settings_user_id_key 
  ON user_settings(user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_settings_updated_at();

-- Function to initialize user settings
CREATE OR REPLACE FUNCTION initialize_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create settings when profile is created
CREATE TRIGGER on_profile_created_initialize_settings
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_settings();
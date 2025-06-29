/*
  # App Usage Tracking and Touch Grass Sessions

  1. New Tables
    - `app_usage_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `duration_minutes` (integer)
      - `screen_name` (text)
      - `source` (text) - 'in_app' or 'external'
      - `app_name` (text) - for external apps
    - `touch_grass_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `duration_minutes` (integer)
      - `rewards_earned` (integer)
      - `plant_state_snapshot` (jsonb)
      - `is_completed` (boolean)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS app_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration_minutes integer,
  screen_name text,
  source text NOT NULL DEFAULT 'in_app' CHECK (source IN ('in_app', 'external')),
  app_name text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS touch_grass_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration_minutes integer,
  rewards_earned integer DEFAULT 0,
  plant_state_snapshot jsonb DEFAULT '{"level": 1, "growth": 0, "unlocked_plants": ["sprout"]}',
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE touch_grass_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for app_usage_logs
CREATE POLICY "Users can manage own usage logs"
  ON app_usage_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for touch_grass_sessions
CREATE POLICY "Users can manage own touch grass sessions"
  ON touch_grass_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_app_usage_logs_user_id ON app_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_app_usage_logs_start_time ON app_usage_logs(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_touch_grass_sessions_user_id ON touch_grass_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_touch_grass_sessions_start_time ON touch_grass_sessions(start_time DESC);

-- Update trigger for touch_grass_sessions
CREATE OR REPLACE FUNCTION update_touch_grass_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_touch_grass_sessions_updated_at
  BEFORE UPDATE ON touch_grass_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_touch_grass_sessions_updated_at();
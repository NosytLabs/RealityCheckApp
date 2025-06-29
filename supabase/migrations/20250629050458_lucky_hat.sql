/*
  # Time Off Tracking Feature

  1. New Columns for user_stats table
    - `total_offline_minutes` (integer, default 0): Cumulative minutes logged offline
    - `last_offline_session_date` (date, nullable): Date of last offline session
    - `offline_session_count` (integer, default 0): Total number of offline sessions
    - `current_offline_streak` (integer, default 0): Current consecutive days with offline sessions
    - `longest_offline_streak` (integer, default 0): Longest streak of consecutive offline days

  2. New table: offline_sessions
    - Track individual offline sessions with start/end times
    - Store session duration and notes

  3. New table: blocked_apps
    - Store user's blocked app configurations
    - Track which apps to block during offline sessions

  4. Security
    - Enable RLS on new tables
    - Add policies for user access control
*/

-- Add new columns to user_stats table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_stats' AND column_name = 'total_offline_minutes'
  ) THEN
    ALTER TABLE user_stats ADD COLUMN total_offline_minutes integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_stats' AND column_name = 'last_offline_session_date'
  ) THEN
    ALTER TABLE user_stats ADD COLUMN last_offline_session_date date;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_stats' AND column_name = 'offline_session_count'
  ) THEN
    ALTER TABLE user_stats ADD COLUMN offline_session_count integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_stats' AND column_name = 'current_offline_streak'
  ) THEN
    ALTER TABLE user_stats ADD COLUMN current_offline_streak integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_stats' AND column_name = 'longest_offline_streak'
  ) THEN
    ALTER TABLE user_stats ADD COLUMN longest_offline_streak integer DEFAULT 0;
  END IF;
END $$;

-- Create offline_sessions table
CREATE TABLE IF NOT EXISTS offline_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration_minutes integer,
  session_type text DEFAULT 'manual' CHECK (session_type IN ('manual', 'scheduled', 'challenge')),
  notes text,
  apps_blocked text[],
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blocked_apps table
CREATE TABLE IF NOT EXISTS blocked_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  app_name text NOT NULL,
  app_identifier text NOT NULL,
  is_enabled boolean DEFAULT true,
  block_during_offline boolean DEFAULT true,
  block_during_focus boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, app_identifier)
);

-- Create offline_challenges table
CREATE TABLE IF NOT EXISTS offline_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  duration_minutes integer NOT NULL,
  points_reward integer DEFAULT 0,
  difficulty text DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  challenge_type text DEFAULT 'duration' CHECK (challenge_type IN ('duration', 'frequency', 'streak')),
  requirements jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user_offline_challenges table (for tracking user progress)
CREATE TABLE IF NOT EXISTS user_offline_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id uuid REFERENCES offline_challenges(id) ON DELETE CASCADE NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress jsonb DEFAULT '{}',
  is_completed boolean DEFAULT false,
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS on new tables
ALTER TABLE offline_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_offline_challenges ENABLE ROW LEVEL SECURITY;

-- Create policies for offline_sessions
CREATE POLICY "Users can manage own offline sessions"
  ON offline_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for blocked_apps
CREATE POLICY "Users can manage own blocked apps"
  ON blocked_apps FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for offline_challenges
CREATE POLICY "Anyone can view active challenges"
  ON offline_challenges FOR SELECT
  USING (is_active = true);

-- Create policies for user_offline_challenges
CREATE POLICY "Users can manage own challenge progress"
  ON user_offline_challenges FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_offline_sessions_user_id ON offline_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_sessions_start_time ON offline_sessions(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_blocked_apps_user_id ON blocked_apps(user_id);
CREATE INDEX IF NOT EXISTS idx_user_offline_challenges_user_id ON user_offline_challenges(user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_offline_sessions_updated_at 
  BEFORE UPDATE ON offline_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blocked_apps_updated_at 
  BEFORE UPDATE ON blocked_apps 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user stats after offline session
CREATE OR REPLACE FUNCTION update_user_stats_after_offline_session()
RETURNS TRIGGER AS $$
DECLARE
  session_date date;
  consecutive_days integer;
BEGIN
  -- Only process completed sessions
  IF NEW.is_completed = true AND (OLD.is_completed IS NULL OR OLD.is_completed = false) THEN
    session_date := NEW.start_time::date;
    
    -- Calculate consecutive days
    SELECT COALESCE(
      CASE 
        WHEN last_offline_session_date = session_date - INTERVAL '1 day' THEN current_offline_streak + 1
        WHEN last_offline_session_date = session_date THEN current_offline_streak
        ELSE 1
      END, 1
    ) INTO consecutive_days
    FROM user_stats 
    WHERE user_id = NEW.user_id;
    
    -- Update user stats
    INSERT INTO user_stats (
      user_id, 
      total_offline_minutes, 
      offline_session_count,
      last_offline_session_date,
      current_offline_streak,
      longest_offline_streak
    )
    VALUES (
      NEW.user_id, 
      COALESCE(NEW.duration_minutes, 0), 
      1,
      session_date,
      consecutive_days,
      consecutive_days
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      total_offline_minutes = user_stats.total_offline_minutes + COALESCE(NEW.duration_minutes, 0),
      offline_session_count = user_stats.offline_session_count + 1,
      last_offline_session_date = session_date,
      current_offline_streak = consecutive_days,
      longest_offline_streak = GREATEST(user_stats.longest_offline_streak, consecutive_days),
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Create trigger for offline session stats
DROP TRIGGER IF EXISTS on_offline_session_completed ON offline_sessions;
CREATE TRIGGER on_offline_session_completed
  AFTER UPDATE ON offline_sessions
  FOR EACH ROW EXECUTE FUNCTION update_user_stats_after_offline_session();

-- Insert default offline challenges
INSERT INTO offline_challenges (title, description, duration_minutes, points_reward, difficulty, challenge_type, requirements) VALUES
  ('Digital Detox Starter', 'Stay offline for 30 minutes', 30, 25, 'easy', 'duration', '{"min_duration": 30}'),
  ('Focus Hour', 'Complete a 1-hour offline session', 60, 50, 'medium', 'duration', '{"min_duration": 60}'),
  ('Deep Work Session', 'Stay offline for 2 hours straight', 120, 100, 'hard', 'duration', '{"min_duration": 120}'),
  ('Daily Disconnect', 'Complete 3 offline sessions in one day', 30, 75, 'medium', 'frequency', '{"sessions_per_day": 3}'),
  ('Offline Warrior', 'Maintain a 7-day offline streak', 30, 200, 'hard', 'streak', '{"consecutive_days": 7}'),
  ('Mindful Morning', 'Start your day with a 45-minute offline session', 45, 60, 'medium', 'duration', '{"min_duration": 45, "time_window": "morning"}'),
  ('Evening Wind-down', 'End your day with a 30-minute offline session', 30, 40, 'easy', 'duration', '{"min_duration": 30, "time_window": "evening"}}')
ON CONFLICT DO NOTHING;

-- Insert default blocked apps (common social media and entertainment apps)
-- Note: In a real implementation, these would be populated based on user's installed apps
-- For now, we'll create a function that users can call to populate their blocked apps
CREATE OR REPLACE FUNCTION setup_default_blocked_apps(target_user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO blocked_apps (user_id, app_name, app_identifier, block_during_offline, block_during_focus) VALUES
    (target_user_id, 'Instagram', 'com.instagram.android', true, true),
    (target_user_id, 'TikTok', 'com.zhiliaoapp.musically', true, true),
    (target_user_id, 'Facebook', 'com.facebook.katana', true, false),
    (target_user_id, 'Twitter', 'com.twitter.android', true, true),
    (target_user_id, 'YouTube', 'com.google.android.youtube', true, false),
    (target_user_id, 'Snapchat', 'com.snapchat.android', true, true),
    (target_user_id, 'Reddit', 'com.reddit.frontpage', true, false),
    (target_user_id, 'Discord', 'com.discord', false, true)
  ON CONFLICT (user_id, app_identifier) DO NOTHING;
END;
$$ language 'plpgsql' security definer;
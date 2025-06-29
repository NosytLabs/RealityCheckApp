/*
  # Complete RealityCheck Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `goals` - User goals and targets
    - `user_stats` - User statistics and metrics
    - `reality_checks` - User reality check entries
    - `achievements` - Available achievements
    - `user_achievements` - User earned achievements
    - `notifications` - User notifications
    - `comments` - Comments on reality checks
    - `likes` - Likes on reality checks
    - `follows` - User follow relationships
    - `reports` - Content and user reports

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
    - Create secure functions for user management

  3. Performance
    - Add indexes for common queries
    - Create triggers for automatic updates
    - Optimize for dashboard queries
*/

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('free', 'premium', 'enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE achievement_type AS ENUM ('streak', 'milestone', 'social', 'special');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  status user_status DEFAULT 'active',
  subscription_status subscription_status DEFAULT 'free',
  privacy_settings jsonb DEFAULT '{"stats_visible": true, "profile_visible": true}',
  notification_settings jsonb DEFAULT '{"push_enabled": true, "email_enabled": true}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  total_reality_checks integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_likes_received integer DEFAULT 0,
  total_comments_received integer DEFAULT 0,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  last_reality_check_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Reality checks table
CREATE TABLE IF NOT EXISTS reality_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  image_analysis jsonb,
  is_public boolean DEFAULT true,
  location jsonb,
  tags text[],
  mood_before integer CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after integer CHECK (mood_after >= 1 AND mood_after <= 10),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reality_check_id uuid REFERENCES reality_checks(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(reality_check_id, user_id)
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reported_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reality_check_id uuid REFERENCES reality_checks(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CHECK (
    (reported_user_id IS NOT NULL AND reality_check_id IS NULL AND comment_id IS NULL) OR
    (reported_user_id IS NULL AND reality_check_id IS NOT NULL AND comment_id IS NULL) OR
    (reported_user_id IS NULL AND reality_check_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  target_value integer NOT NULL,
  current_value integer DEFAULT 0,
  target_date date,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reality_check_id uuid REFERENCES reality_checks(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text,
  type achievement_type NOT NULL,
  criteria jsonb NOT NULL,
  points integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security (only if not already enabled)
DO $$ BEGIN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE reality_checks ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

-- Create policies (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view public profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Profiles policies
CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  USING (((privacy_settings ->> 'profile_visible')::text = 'true') OR (auth.uid() = id));

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User stats policies
DROP POLICY IF EXISTS "Users can view own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON user_stats;

CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON user_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Reality checks policies
DROP POLICY IF EXISTS "Users can view public reality checks" ON reality_checks;
DROP POLICY IF EXISTS "Users can insert own reality checks" ON reality_checks;
DROP POLICY IF EXISTS "Users can update own reality checks" ON reality_checks;
DROP POLICY IF EXISTS "Users can delete own reality checks" ON reality_checks;

CREATE POLICY "Users can view public reality checks"
  ON reality_checks FOR SELECT
  USING ((is_public = true) OR (auth.uid() = user_id));

CREATE POLICY "Users can insert own reality checks"
  ON reality_checks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reality checks"
  ON reality_checks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reality checks"
  ON reality_checks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Likes policies
DROP POLICY IF EXISTS "Users can view likes on public reality checks" ON likes;
DROP POLICY IF EXISTS "Users can manage own likes" ON likes;

CREATE POLICY "Users can view likes on public reality checks"
  ON likes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reality_checks 
      WHERE reality_checks.id = likes.reality_check_id 
      AND ((reality_checks.is_public = true) OR (reality_checks.user_id = auth.uid()))
    )
  );

CREATE POLICY "Users can manage own likes"
  ON likes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Follows policies
DROP POLICY IF EXISTS "Users can view follows" ON follows;
DROP POLICY IF EXISTS "Users can manage own follows" ON follows;

CREATE POLICY "Users can view follows"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own follows"
  ON follows FOR ALL
  TO authenticated
  USING (auth.uid() = follower_id);

-- Reports policies
DROP POLICY IF EXISTS "Users can insert reports" ON reports;
DROP POLICY IF EXISTS "Users can view own reports" ON reports;

CREATE POLICY "Users can insert reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- Goals policies
DROP POLICY IF EXISTS "Users can manage own goals" ON goals;
CREATE POLICY "Users can manage own goals"
  ON goals FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments policies
DROP POLICY IF EXISTS "Users can view comments on public reality checks" ON comments;
DROP POLICY IF EXISTS "Users can insert comments on public reality checks" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

CREATE POLICY "Users can view comments on public reality checks"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reality_checks 
      WHERE reality_checks.id = comments.reality_check_id 
      AND ((reality_checks.is_public = true) OR (reality_checks.user_id = auth.uid()))
    )
  );

CREATE POLICY "Users can insert comments on public reality checks"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() = user_id) AND 
    EXISTS (
      SELECT 1 FROM reality_checks 
      WHERE reality_checks.id = comments.reality_check_id 
      AND reality_checks.is_public = true
    )
  );

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Achievements policies
DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  USING (is_active = true);

-- User achievements policies
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON user_achievements;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_reality_checks_user_id ON reality_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_reality_checks_created_at ON reality_checks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reality_checks_public ON reality_checks(is_public) WHERE (is_public = true);
CREATE INDEX IF NOT EXISTS idx_comments_reality_check_id ON comments(reality_check_id);
CREATE INDEX IF NOT EXISTS idx_likes_reality_check_id ON likes(reality_check_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE (is_read = false);

-- Create updated_at trigger function (replace if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Handle new user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ language 'plpgsql' security definer;

-- Function to update user stats after reality check
CREATE OR REPLACE FUNCTION update_user_stats_after_reality_check()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert user stats
  INSERT INTO user_stats (user_id, total_reality_checks, last_reality_check_date)
  VALUES (NEW.user_id, 1, CURRENT_DATE)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_reality_checks = user_stats.total_reality_checks + 1,
    last_reality_check_date = CURRENT_DATE,
    updated_at = now();
  
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Drop existing triggers before creating new ones
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_user_stats_updated_at ON user_stats;
DROP TRIGGER IF EXISTS update_reality_checks_updated_at ON reality_checks;
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_reality_check_created ON reality_checks;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reality_checks_updated_at BEFORE UPDATE ON reality_checks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create trigger for reality check stats
CREATE TRIGGER on_reality_check_created
  AFTER INSERT ON reality_checks
  FOR EACH ROW EXECUTE FUNCTION update_user_stats_after_reality_check();

-- Create a view for user dashboard stats (replace if exists)
DROP VIEW IF EXISTS user_dashboard_stats;
CREATE VIEW user_dashboard_stats AS
SELECT 
  p.id,
  p.display_name,
  p.avatar_url,
  COALESCE(us.total_reality_checks, 0) as total_reality_checks,
  COALESCE(us.current_streak, 0) as current_streak,
  COALESCE(us.longest_streak, 0) as longest_streak,
  COALESCE(us.followers_count, 0) as followers_count,
  COALESCE(us.following_count, 0) as following_count,
  COALESCE(
    (SELECT COUNT(*) FROM user_achievements ua 
     JOIN achievements a ON ua.achievement_id = a.id 
     WHERE ua.user_id = p.id), 0
  ) as achievements_count,
  COALESCE(
    (SELECT SUM(a.points) FROM user_achievements ua 
     JOIN achievements a ON ua.achievement_id = a.id 
     WHERE ua.user_id = p.id), 0
  ) as total_points
FROM profiles p
LEFT JOIN user_stats us ON p.id = us.user_id;

-- Insert some default achievements (only if they don't exist)
INSERT INTO achievements (name, description, icon, type, criteria, points) VALUES
  ('First Reality Check', 'Complete your first reality check', '🎯', 'milestone', '{"reality_checks": 1}', 10),
  ('Week Warrior', 'Complete reality checks for 7 consecutive days', '🔥', 'streak', '{"consecutive_days": 7}', 50),
  ('Mindful Master', 'Complete 100 reality checks', '🧘', 'milestone', '{"reality_checks": 100}', 200),
  ('Social Butterfly', 'Receive 50 likes on your reality checks', '🦋', 'social', '{"likes_received": 50}', 75),
  ('Reality Pioneer', 'One of the first users to join', '🌟', 'special', '{"early_adopter": true}', 100)
ON CONFLICT (name) DO NOTHING;
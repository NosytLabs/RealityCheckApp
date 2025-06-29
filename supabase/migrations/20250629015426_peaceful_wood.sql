/*
  # Initial RealityCheck Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `goals` - User digital wellness goals
    - `user_stats` - User statistics and metrics
    - `reality_checks` - User reality check entries
    - `achievements` - Available achievements
    - `user_achievements` - User earned achievements
    - `notifications` - User notifications
    - `comments` - Comments on reality checks
    - `likes` - Likes on reality checks
    - `follows` - User follow relationships
    - `reports` - Content reports

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public content viewing where appropriate

  3. Functions
    - User profile management functions
    - Feed generation functions
    - Search functions
*/

-- Create custom types
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE subscription_status AS ENUM ('free', 'premium', 'trial');
CREATE TYPE achievement_type AS ENUM ('daily', 'streak', 'milestone', 'special');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  status user_status DEFAULT 'active',
  subscription_status subscription_status DEFAULT 'free',
  notification_settings jsonb DEFAULT '{}',
  privacy_settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  target_value numeric NOT NULL,
  current_value numeric DEFAULT 0,
  target_date date,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_reality_checks integer DEFAULT 0,
  total_likes_received integer DEFAULT 0,
  total_comments_received integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_reality_check_date date,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reality checks table
CREATE TABLE IF NOT EXISTS reality_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  image_analysis jsonb,
  mood_before integer CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after integer CHECK (mood_after >= 1 AND mood_after <= 10),
  location jsonb,
  tags text[],
  is_public boolean DEFAULT true,
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

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
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
  reported_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reality_check_id uuid REFERENCES reality_checks(id) ON DELETE SET NULL,
  comment_id uuid REFERENCES comments(id) ON DELETE SET NULL,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE reality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Goals policies
CREATE POLICY "Users can manage own goals"
  ON goals FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- User stats policies
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
CREATE POLICY "Users can view public reality checks"
  ON reality_checks FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own reality checks"
  ON reality_checks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Anyone can view active achievements"
  ON achievements FOR SELECT
  USING (is_active = true);

-- User achievements policies
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can manage own notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view comments on public reality checks"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reality_checks 
      WHERE reality_checks.id = comments.reality_check_id 
      AND (reality_checks.is_public = true OR reality_checks.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage own comments"
  ON comments FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can view likes on public reality checks"
  ON likes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reality_checks 
      WHERE reality_checks.id = likes.reality_check_id 
      AND (reality_checks.is_public = true OR reality_checks.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage own likes"
  ON likes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Users can view follows"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own follows"
  ON follows FOR ALL
  TO authenticated
  USING (auth.uid() = follower_id);

-- Reports policies
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_created_at ON goals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reality_checks_user_id ON reality_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_reality_checks_created_at ON reality_checks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reality_checks_public ON reality_checks(is_public, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_reality_check_id ON comments(reality_check_id);
CREATE INDEX IF NOT EXISTS idx_likes_reality_check_id ON likes(reality_check_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reality_checks_updated_at BEFORE UPDATE ON reality_checks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for user dashboard stats
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
  p.*,
  COALESCE(us.total_reality_checks, 0) as total_reality_checks,
  COALESCE(us.total_likes_received, 0) as total_likes_received,
  COALESCE(us.total_comments_received, 0) as total_comments_received,
  COALESCE(us.current_streak, 0) as current_streak,
  COALESCE(us.longest_streak, 0) as longest_streak,
  us.last_reality_check_date,
  COALESCE(us.followers_count, 0) as followers_count,
  COALESCE(us.following_count, 0) as following_count
FROM profiles p
LEFT JOIN user_stats us ON p.id = us.user_id;

-- Insert some default achievements
INSERT INTO achievements (name, description, icon, type, criteria, points) VALUES
  ('First Reality Check', 'Complete your first reality check', '🎯', 'milestone', '{"reality_checks": 1}', 10),
  ('Week Warrior', 'Complete reality checks for 7 consecutive days', '🔥', 'streak', '{"consecutive_days": 7}', 50),
  ('Mindful Master', 'Complete 100 reality checks', '🧘', 'milestone', '{"reality_checks": 100}', 200),
  ('Social Butterfly', 'Receive 50 likes on your reality checks', '🦋', 'milestone', '{"likes_received": 50}', 75),
  ('Daily Dedication', 'Complete a reality check today', '📅', 'daily', '{"daily_check": true}', 5)
ON CONFLICT (name) DO NOTHING;
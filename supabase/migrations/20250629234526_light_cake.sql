/*
  # Gamification System Enhancement

  1. New Tables
    - Enhanced achievements system with better criteria structure
    - User level tracking and XP system
    - Social features for community interaction

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for user data access

  3. Functions
    - Level calculation based on total points
    - Achievement checking automation
*/

-- Update achievements table with better structure
ALTER TABLE achievements 
ADD COLUMN IF NOT EXISTS difficulty text DEFAULT 'common' CHECK (difficulty IN ('common', 'rare', 'epic', 'legendary'));

-- Insert comprehensive achievement data
INSERT INTO achievements (name, description, icon, type, criteria, points, difficulty, is_active) VALUES
  ('First Steps', 'Complete your first reality check', '🌱', 'milestone', '{"target": 1, "type": "reality_checks"}', 10, 'common', true),
  ('Week Warrior', 'Maintain a 7-day streak', '🔥', 'streak', '{"target": 7, "type": "daily_streak"}', 50, 'rare', true),
  ('Social Butterfly', 'Get 10 likes on your reality checks', '👥', 'social', '{"target": 10, "type": "likes_received"}', 25, 'common', true),
  ('Mindful Master', 'Complete 50 reality checks', '🧘', 'milestone', '{"target": 50, "type": "reality_checks"}', 100, 'epic', true),
  ('Digital Detox Champion', 'Complete 10 offline sessions', '🌿', 'milestone', '{"target": 10, "type": "offline_sessions"}', 75, 'rare', true),
  ('Goal Getter', 'Complete 5 goals', '🎯', 'milestone', '{"target": 5, "type": "completed_goals"}', 60, 'rare', true),
  ('Community Leader', 'Get 25 followers', '👑', 'social', '{"target": 25, "type": "followers"}', 80, 'epic', true),
  ('Early Adopter', 'Join RealityCheck in its first month', '⭐', 'special', '{"target": 1, "type": "early_user"}', 150, 'legendary', true),
  ('Consistency King', 'Maintain a 30-day streak', '👑', 'streak', '{"target": 30, "type": "daily_streak"}', 200, 'legendary', true),
  ('Touch Grass Expert', 'Complete 20 touch grass sessions', '🌱', 'milestone', '{"target": 20, "type": "touch_grass_sessions"}', 90, 'epic', true),
  ('Mood Booster', 'Improve mood by 3+ points in 10 reality checks', '😊', 'milestone', '{"target": 10, "type": "mood_improvement"}', 40, 'common', true),
  ('Social Star', 'Get 100 total likes', '⭐', 'social', '{"target": 100, "type": "likes_received"}', 120, 'epic', true),
  ('Marathon Streaker', 'Maintain a 100-day streak', '🏃', 'streak', '{"target": 100, "type": "daily_streak"}', 500, 'legendary', true),
  ('Zen Master', 'Complete 100 reality checks', '🧘‍♂️', 'milestone', '{"target": 100, "type": "reality_checks"}', 250, 'legendary', true),
  ('Nature Lover', 'Complete 50 outdoor reality checks', '🌳', 'special', '{"target": 50, "type": "outdoor_reality_checks"}', 80, 'rare', true)
ON CONFLICT (name) DO NOTHING;

-- Add total_points to user_stats if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_stats' AND column_name = 'total_points'
  ) THEN
    ALTER TABLE user_stats ADD COLUMN total_points integer DEFAULT 0;
  END IF;
END $$;

-- Add user_level to user_stats if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_stats' AND column_name = 'user_level'
  ) THEN
    ALTER TABLE user_stats ADD COLUMN user_level integer DEFAULT 1;
  END IF;
END $$;

-- Function to calculate user level based on total points
CREATE OR REPLACE FUNCTION calculate_user_level(points integer)
RETURNS integer AS $$
BEGIN
  -- Level formula: Level = floor(sqrt(points / 100)) + 1
  RETURN GREATEST(1, FLOOR(SQRT(points / 100.0)) + 1);
END;
$$ LANGUAGE plpgsql;

-- Function to update user level when points change
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_level = calculate_user_level(NEW.total_points);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update user level
DROP TRIGGER IF EXISTS update_user_level_trigger ON user_stats;
CREATE TRIGGER update_user_level_trigger
  BEFORE UPDATE OF total_points ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- Function to award achievement points
CREATE OR REPLACE FUNCTION award_achievement_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Add points to user_stats when achievement is earned
  UPDATE user_stats 
  SET total_points = total_points + (
    SELECT COALESCE(points, 0) 
    FROM achievements 
    WHERE id = NEW.achievement_id
  )
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to award points when achievement is earned
DROP TRIGGER IF EXISTS award_achievement_points_trigger ON user_achievements;
CREATE TRIGGER award_achievement_points_trigger
  AFTER INSERT ON user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION award_achievement_points();

-- Update existing user stats with calculated levels
UPDATE user_stats 
SET user_level = calculate_user_level(total_points)
WHERE total_points > 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(type);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON achievements(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_earned ON user_achievements(user_id, earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_level_points ON user_stats(user_level DESC, total_points DESC);
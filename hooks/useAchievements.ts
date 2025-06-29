import { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../lib/supabase';
import { useApp } from '../providers/AppProvider';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  type: 'streak' | 'milestone' | 'social' | 'special';
  criteria: any;
  points: number;
  is_active: boolean;
  created_at: string;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievements?: Achievement;
}

interface UseAchievementsReturn {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  userLevel: number;
  totalPoints: number;
  nextLevelPoints: number;
  loading: boolean;
  error: string | null;
  refreshAchievements: () => Promise<void>;
  checkForNewAchievements: () => Promise<void>;
}

export const useAchievements = (): UseAchievementsReturn => {
  const { user } = useApp();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [userLevel, setUserLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);

  // Mock achievements data
  const mockAchievements: Achievement[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first reality check',
      icon: '🌱',
      type: 'milestone',
      criteria: { target: 1, type: 'reality_checks' },
      points: 10,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      type: 'streak',
      criteria: { target: 7, type: 'daily_streak' },
      points: 50,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Social Butterfly',
      description: 'Get 10 likes on your reality checks',
      icon: '👥',
      type: 'social',
      criteria: { target: 10, type: 'likes_received' },
      points: 25,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Mindful Master',
      description: 'Complete 50 reality checks',
      icon: '🧘',
      type: 'milestone',
      criteria: { target: 50, type: 'reality_checks' },
      points: 100,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Digital Detox Champion',
      description: 'Complete 10 offline sessions',
      icon: '🌿',
      type: 'milestone',
      criteria: { target: 10, type: 'offline_sessions' },
      points: 75,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'Goal Getter',
      description: 'Complete 5 goals',
      icon: '🎯',
      type: 'milestone',
      criteria: { target: 5, type: 'completed_goals' },
      points: 60,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '7',
      name: 'Community Leader',
      description: 'Get 25 followers',
      icon: '👑',
      type: 'social',
      criteria: { target: 25, type: 'followers' },
      points: 80,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '8',
      name: 'Early Adopter',
      description: 'Join RealityCheck in its first month',
      icon: '⭐',
      type: 'special',
      criteria: { target: 1, type: 'early_user' },
      points: 150,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '9',
      name: 'Consistency King',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      type: 'streak',
      criteria: { target: 30, type: 'daily_streak' },
      points: 200,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '10',
      name: 'Touch Grass Expert',
      description: 'Complete 20 touch grass sessions',
      icon: '🌱',
      type: 'milestone',
      criteria: { target: 20, type: 'touch_grass_sessions' },
      points: 90,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ];

  const mockUserAchievements: UserAchievement[] = [
    {
      id: '1',
      user_id: user?.id || '1',
      achievement_id: '1',
      earned_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: user?.id || '1',
      achievement_id: '3',
      earned_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const supabaseConnected = await checkSupabaseConnection();
      setIsSupabaseAvailable(supabaseConnected);

      if (supabaseConnected) {
        // Load achievements from Supabase
        const [achievementsResult, userAchievementsResult] = await Promise.all([
          supabase
            .from('achievements')
            .select('*')
            .eq('is_active', true)
            .order('points', { ascending: true }),
          supabase
            .from('user_achievements')
            .select('*, achievements(*)')
            .eq('user_id', user.id)
            .order('earned_at', { ascending: false }),
        ]);

        if (achievementsResult.error) throw achievementsResult.error;
        if (userAchievementsResult.error) throw userAchievementsResult.error;

        setAchievements(achievementsResult.data || mockAchievements);
        setUserAchievements(userAchievementsResult.data || mockUserAchievements);

        // Calculate total points and level
        const points = (userAchievementsResult.data || mockUserAchievements)
          .reduce((sum, ua) => sum + (ua.achievements?.points || 0), 0);
        setTotalPoints(points);
        setUserLevel(calculateLevel(points));
      } else {
        // Use mock data
        setAchievements(mockAchievements);
        setUserAchievements(mockUserAchievements);
        
        const points = mockUserAchievements
          .map(ua => mockAchievements.find(a => a.id === ua.achievement_id))
          .reduce((sum, achievement) => sum + (achievement?.points || 0), 0);
        setTotalPoints(points);
        setUserLevel(calculateLevel(points));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load achievements');
      // Fallback to mock data
      setAchievements(mockAchievements);
      setUserAchievements(mockUserAchievements);
      const points = mockUserAchievements
        .map(ua => mockAchievements.find(a => a.id === ua.achievement_id))
        .reduce((sum, achievement) => sum + (achievement?.points || 0), 0);
      setTotalPoints(points);
      setUserLevel(calculateLevel(points));
    } finally {
      setLoading(false);
    }
  };

  const calculateLevel = (points: number): number => {
    // Level formula: Level = floor(sqrt(points / 100)) + 1
    return Math.floor(Math.sqrt(points / 100)) + 1;
  };

  const getNextLevelPoints = (level: number): number => {
    // Points needed for next level
    return Math.pow(level, 2) * 100;
  };

  const checkForNewAchievements = async () => {
    if (!user || !isSupabaseAvailable) return;

    try {
      // Get user stats to check against achievement criteria
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!userStats) return;

      // Check each achievement against user stats
      for (const achievement of achievements) {
        const alreadyEarned = userAchievements.some(ua => ua.achievement_id === achievement.id);
        if (alreadyEarned) continue;

        let earned = false;

        switch (achievement.criteria.type) {
          case 'reality_checks':
            earned = (userStats.total_reality_checks || 0) >= achievement.criteria.target;
            break;
          case 'daily_streak':
            earned = (userStats.current_streak || 0) >= achievement.criteria.target;
            break;
          case 'likes_received':
            earned = (userStats.total_likes_received || 0) >= achievement.criteria.target;
            break;
          case 'offline_sessions':
            earned = (userStats.offline_session_count || 0) >= achievement.criteria.target;
            break;
          case 'followers':
            earned = (userStats.followers_count || 0) >= achievement.criteria.target;
            break;
          // Add more criteria types as needed
        }

        if (earned) {
          // Award the achievement
          await supabase.from('user_achievements').insert({
            user_id: user.id,
            achievement_id: achievement.id,
          });

          // Refresh achievements to show the new one
          await loadAchievements();
        }
      }
    } catch (error) {
      console.error('Error checking for new achievements:', error);
    }
  };

  const refreshAchievements = async () => {
    await loadAchievements();
  };

  const nextLevelPoints = getNextLevelPoints(userLevel);

  return {
    achievements,
    userAchievements,
    userLevel,
    totalPoints,
    nextLevelPoints,
    loading,
    error,
    refreshAchievements,
    checkForNewAchievements,
  };
};
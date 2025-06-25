import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useUser } from './useUser';

export interface UserStats {
  id: string;
  user_id: string;
  date: string;
  reality_checks_count: number;
  total_screen_time_minutes: number;
  app_usage_data: any;
  mood_average: number | null;
  goals_completed: number;
  streak_days: number;
  achievements_earned: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly' | 'monthly' | 'milestone' | 'special';
  criteria: any;
  points: number;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  progress: any;
  achievement?: Achievement;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_value: number;
  current_value: number;
  unit: string;
  target_date: string | null;
  is_completed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  data: any;
  is_read: boolean;
  scheduled_for: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface DashboardData {
  stats: UserStats | null;
  achievements: UserAchievement[];
  goals: Goal[];
  notifications: Notification[];
  totalAchievements: number;
  unreadNotifications: number;
  activeGoals: number;
  completedGoals: number;
}

export interface UseRealTimeDataReturn {
  dashboardData: DashboardData;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<boolean>;
  updateGoalProgress: (goalId: string, newValue: number) => Promise<boolean>;
  completeGoal: (goalId: string) => Promise<boolean>;
  createGoal: (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>) => Promise<Goal | null>;
}

export const useRealTimeData = (): UseRealTimeDataReturn => {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: null,
    achievements: [],
    goals: [],
    notifications: [],
    totalAchievements: 0,
    unreadNotifications: 0,
    activeGoals: 0,
    completedGoals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const subscriptionsRef = useRef<any[]>([]);

  // Calculate derived data
  const calculateDerivedData = useCallback((data: Partial<DashboardData>) => {
    const achievements = data.achievements || dashboardData.achievements;
    const goals = data.goals || dashboardData.goals;
    const notifications = data.notifications || dashboardData.notifications;

    return {
      totalAchievements: achievements.length,
      unreadNotifications: notifications.filter(n => !n.is_read).length,
      activeGoals: goals.filter(g => g.is_active && !g.is_completed).length,
      completedGoals: goals.filter(g => g.is_completed).length,
    };
  }, [dashboardData]);

  // Fetch user stats
  const fetchUserStats = useCallback(async (): Promise<UserStats | null> => {
    if (!user) return null;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      return data || null;
    } catch (err) {
      console.error('Error fetching user stats:', err);
      return null;
    }
  }, [user]);

  // Fetch user achievements
  const fetchUserAchievements = useCallback(async (): Promise<UserAchievement[]> => {
    if (!user) return [];

    try {
      const { data, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (achievementsError) {
        throw achievementsError;
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching user achievements:', err);
      return [];
    }
  }, [user]);

  // Fetch user goals
  const fetchUserGoals = useCallback(async (): Promise<Goal[]> => {
    if (!user) return [];

    try {
      const { data, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (goalsError) {
        throw goalsError;
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching user goals:', err);
      return [];
    }
  }, [user]);

  // Fetch user notifications
  const fetchUserNotifications = useCallback(async (): Promise<Notification[]> => {
    if (!user) return [];

    try {
      const { data, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (notificationsError) {
        throw notificationsError;
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching user notifications:', err);
      return [];
    }
  }, [user]);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setDashboardData({
        stats: null,
        achievements: [],
        goals: [],
        notifications: [],
        totalAchievements: 0,
        unreadNotifications: 0,
        activeGoals: 0,
        completedGoals: 0,
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [stats, achievements, goals, notifications] = await Promise.all([
        fetchUserStats(),
        fetchUserAchievements(),
        fetchUserGoals(),
        fetchUserNotifications(),
      ]);

      const newData = {
        stats,
        achievements,
        goals,
        notifications,
      };

      const derivedData = calculateDerivedData(newData);

      setDashboardData({
        ...newData,
        ...derivedData,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user, fetchUserStats, fetchUserAchievements, fetchUserGoals, fetchUserNotifications, calculateDerivedData]);

  // Refresh data manually
  const refreshData = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setDashboardData(prev => {
        const updatedNotifications = prev.notifications.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        );
        const derivedData = calculateDerivedData({ notifications: updatedNotifications });
        return {
          ...prev,
          notifications: updatedNotifications,
          ...derivedData,
        };
      });

      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
      return false;
    }
  }, [user, calculateDerivedData]);

  // Update goal progress
  const updateGoalProgress = useCallback(async (goalId: string, newValue: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error: updateError } = await supabase
        .from('goals')
        .update({ current_value: newValue })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setDashboardData(prev => {
        const updatedGoals = prev.goals.map(g => 
          g.id === goalId ? { ...g, current_value: newValue } : g
        );
        const derivedData = calculateDerivedData({ goals: updatedGoals });
        return {
          ...prev,
          goals: updatedGoals,
          ...derivedData,
        };
      });

      return true;
    } catch (err) {
      console.error('Error updating goal progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to update goal progress');
      return false;
    }
  }, [user, calculateDerivedData]);

  // Complete goal
  const completeGoal = useCallback(async (goalId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error: updateError } = await supabase
        .from('goals')
        .update({ 
          is_completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setDashboardData(prev => {
        const updatedGoals = prev.goals.map(g => 
          g.id === goalId ? { 
            ...g, 
            is_completed: true, 
            completed_at: new Date().toISOString() 
          } : g
        );
        const derivedData = calculateDerivedData({ goals: updatedGoals });
        return {
          ...prev,
          goals: updatedGoals,
          ...derivedData,
        };
      });

      return true;
    } catch (err) {
      console.error('Error completing goal:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete goal');
      return false;
    }
  }, [user, calculateDerivedData]);

  // Create new goal
  const createGoal = useCallback(async (
    goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>
  ): Promise<Goal | null> => {
    if (!user) return null;

    try {
      const { data, error: insertError } = await supabase
        .from('goals')
        .insert([
          {
            ...goalData,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      const newGoal = data as Goal;
      
      // Update local state
      setDashboardData(prev => {
        const updatedGoals = [newGoal, ...prev.goals];
        const derivedData = calculateDerivedData({ goals: updatedGoals });
        return {
          ...prev,
          goals: updatedGoals,
          ...derivedData,
        };
      });

      return newGoal;
    } catch (err) {
      console.error('Error creating goal:', err);
      setError(err instanceof Error ? err.message : 'Failed to create goal');
      return null;
    }
  }, [user, calculateDerivedData]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchDashboardData();

    // Clean up existing subscriptions
    subscriptionsRef.current.forEach(sub => sub.unsubscribe());
    subscriptionsRef.current = [];

    // Set up real-time subscriptions for each table
    const tables = ['user_stats', 'user_achievements', 'goals', 'notifications'];
    
    tables.forEach(table => {
      const subscription = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log(`Real-time update for ${table}:`, payload);
            // Refresh data when changes occur
            fetchDashboardData();
          }
        )
        .subscribe();

      subscriptionsRef.current.push(subscription);
    });

    // Cleanup subscriptions
    return () => {
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
      subscriptionsRef.current = [];
    };
  }, [user, fetchDashboardData]);

  return {
    dashboardData,
    loading,
    error,
    refreshData,
    markNotificationAsRead,
    updateGoalProgress,
    completeGoal,
    createGoal,
  };
};

export default useRealTimeData;
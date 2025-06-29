import { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection, Goal, GoalInsert, GoalUpdate } from '../lib/supabase';
import { useApp } from '../providers/AppProvider';

interface UseGoalsReturn {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  createGoal: (goal: Omit<GoalInsert, 'user_id'>) => Promise<void>;
  updateGoal: (id: string, updates: GoalUpdate) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  refreshGoals: () => Promise<void>;
}

export const useGoals = (): UseGoalsReturn => {
  const { user } = useApp();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);

  // Mock data for fallback
  const mockGoals: Goal[] = [
    {
      id: '1',
      user_id: user?.id || '1',
      title: 'Reduce Daily Screen Time',
      description: 'Limit daily screen time to 4 hours or less',
      target_value: 240,
      current_value: 180,
      target_date: '2025-02-15',
      is_completed: false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      user_id: user?.id || '1',
      title: 'Daily Meditation',
      description: 'Practice mindfulness meditation for 20 minutes daily',
      target_value: 20,
      current_value: 15,
      target_date: '2025-01-31',
      is_completed: false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      id: '3',
      user_id: user?.id || '1',
      title: 'Focus Sessions',
      description: 'Complete 5 focused work sessions per day',
      target_value: 5,
      current_value: 5,
      target_date: '2025-01-30',
      is_completed: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  ];

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const supabaseConnected = await checkSupabaseConnection();
      setIsSupabaseAvailable(supabaseConnected);

      if (supabaseConnected) {
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setGoals(data || []);
      } else {
        // Use mock data
        setGoals(mockGoals);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load goals');
      setGoals(mockGoals); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<GoalInsert, 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase
          .from('goals')
          .insert({
            ...goalData,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        setGoals(prev => [data, ...prev]);
      } else {
        // Mock creation
        const newGoal: Goal = {
          id: Date.now().toString(),
          user_id: user.id,
          ...goalData,
          current_value: 0,
          is_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setGoals(prev => [newGoal, ...prev]);
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create goal');
    }
  };

  const updateGoal = async (id: string, updates: GoalUpdate) => {
    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase
          .from('goals')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      } else {
        // Mock update
        setGoals(prev => prev.map(goal => 
          goal.id === id 
            ? { ...goal, ...updates, updated_at: new Date().toISOString() }
            : goal
        ));
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update goal');
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      if (isSupabaseAvailable) {
        const { error } = await supabase
          .from('goals')
          .delete()
          .eq('id', id);

        if (error) throw error;
      }

      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete goal');
    }
  };

  const refreshGoals = async () => {
    await loadGoals();
  };

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals,
  };
};
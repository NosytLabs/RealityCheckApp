import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useUser } from './useUser';

export interface RealityCheck {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  image_url?: string;
  image_analysis?: Record<string, any>;
  location?: Record<string, any>;
  tags?: string[];
  category?: 'food' | 'travel' | 'lifestyle' | 'work' | 'entertainment' | 'other';
  reality_score?: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UseRealTimeChecksReturn {
  realityChecks: RealityCheck[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  refreshChecks: () => Promise<void>;
  addRealityCheck: (check: Omit<RealityCheck, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<RealityCheck | null>;
  updateRealityCheck: (id: string, updates: Partial<RealityCheck>) => Promise<boolean>;
  deleteRealityCheck: (id: string) => Promise<boolean>;
}

export const useRealTimeChecks = (): UseRealTimeChecksReturn => {
  const { user } = useUser();
  const [realityChecks, setRealityChecks] = useState<RealityCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);

  // Calculate counts from reality checks
  const calculateCounts = useCallback((checks: RealityCheck[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayChecks = checks.filter(check => 
      new Date(check.created_at) >= today
    ).length;

    const weekChecks = checks.filter(check => 
      new Date(check.created_at) >= weekAgo
    ).length;

    const monthChecks = checks.filter(check => 
      new Date(check.created_at) >= monthAgo
    ).length;

    setTotalCount(checks.length);
    setTodayCount(todayChecks);
    setWeekCount(weekChecks);
    setMonthCount(monthChecks);
  }, []);

  // Fetch reality checks from database
  const fetchRealityChecks = useCallback(async () => {
    if (!user) {
      setRealityChecks([]);
      setTotalCount(0);
      setTodayCount(0);
      setWeekCount(0);
      setMonthCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('reality_checks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const checks = data || [];
      setRealityChecks(checks);
      calculateCounts(checks);
    } catch (err) {
      console.error('Error fetching reality checks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reality checks');
    } finally {
      setLoading(false);
    }
  }, [user, calculateCounts]);

  // Refresh checks manually
  const refreshChecks = useCallback(async () => {
    await fetchRealityChecks();
  }, [fetchRealityChecks]);

  // Add new reality check
  const addRealityCheck = useCallback(async (
    checkData: Omit<RealityCheck, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<RealityCheck | null> => {
    if (!user) {
      setError('User must be authenticated to add reality checks');
      return null;
    }

    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('reality_checks')
        .insert([
          {
            ...checkData,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Update local state
      const newCheck = data as RealityCheck;
      setRealityChecks(prev => [newCheck, ...prev]);
      calculateCounts([newCheck, ...realityChecks]);

      return newCheck;
    } catch (err) {
      console.error('Error adding reality check:', err);
      setError(err instanceof Error ? err.message : 'Failed to add reality check');
      return null;
    }
  }, [user, realityChecks, calculateCounts]);

  // Update existing reality check
  const updateRealityCheck = useCallback(async (
    id: string,
    updates: Partial<RealityCheck>
  ): Promise<boolean> => {
    if (!user) {
      setError('User must be authenticated to update reality checks');
      return false;
    }

    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('reality_checks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setRealityChecks(prev => 
        prev.map(check => 
          check.id === id ? { ...check, ...updates } : check
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating reality check:', err);
      setError(err instanceof Error ? err.message : 'Failed to update reality check');
      return false;
    }
  }, [user]);

  // Delete reality check
  const deleteRealityCheck = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      setError('User must be authenticated to delete reality checks');
      return false;
    }

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('reality_checks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      const updatedChecks = realityChecks.filter(check => check.id !== id);
      setRealityChecks(updatedChecks);
      calculateCounts(updatedChecks);

      return true;
    } catch (err) {
      console.error('Error deleting reality check:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete reality check');
      return false;
    }
  }, [user, realityChecks, calculateCounts]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchRealityChecks();

    // Set up real-time subscription
    const subscription = supabase
      .channel('reality_checks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reality_checks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              const newCheck = payload.new as RealityCheck;
              setRealityChecks(prev => {
                // Avoid duplicates
                if (prev.some(check => check.id === newCheck.id)) {
                  return prev;
                }
                const updated = [newCheck, ...prev];
                calculateCounts(updated);
                return updated;
              });
              break;

            case 'UPDATE':
              const updatedCheck = payload.new as RealityCheck;
              setRealityChecks(prev => {
                const updated = prev.map(check => 
                  check.id === updatedCheck.id ? updatedCheck : check
                );
                calculateCounts(updated);
                return updated;
              });
              break;

            case 'DELETE':
              const deletedCheck = payload.old as RealityCheck;
              setRealityChecks(prev => {
                const updated = prev.filter(check => check.id !== deletedCheck.id);
                calculateCounts(updated);
                return updated;
              });
              break;
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchRealityChecks, calculateCounts]);

  return {
    realityChecks,
    loading,
    error,
    totalCount,
    todayCount,
    weekCount,
    monthCount,
    refreshChecks,
    addRealityCheck,
    updateRealityCheck,
    deleteRealityCheck,
  };
};

export default useRealTimeChecks;
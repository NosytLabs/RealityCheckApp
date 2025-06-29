import { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../lib/supabase';
import { useApp } from '../providers/AppProvider';

interface OfflineStats {
  total_offline_minutes: number;
  offline_session_count: number;
  current_offline_streak: number;
  longest_offline_streak: number;
  last_offline_session_date: string | null;
}

interface OfflineSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  session_type: string;
  notes: string | null;
  apps_blocked: string[] | null;
  is_completed: boolean;
}

interface OfflineChallenge {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  points_reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  challenge_type: 'duration' | 'frequency' | 'streak';
  requirements: any;
  is_active: boolean;
}

interface BlockedApp {
  id: string;
  user_id: string;
  app_name: string;
  app_identifier: string;
  is_enabled: boolean;
  block_during_offline: boolean;
  block_during_focus: boolean;
}

interface UseOfflineTrackingReturn {
  stats: OfflineStats | null;
  activeSession: OfflineSession | null;
  challenges: OfflineChallenge[];
  blockedApps: BlockedApp[];
  loading: boolean;
  error: string | null;
  startSession: (duration?: number) => Promise<void>;
  endSession: () => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  refreshData: () => Promise<void>;
  updateBlockedApp: (id: string, updates: Partial<BlockedApp>) => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<void>;
}

export const useOfflineTracking = (): UseOfflineTrackingReturn => {
  const { user } = useApp();
  const [stats, setStats] = useState<OfflineStats | null>(null);
  const [activeSession, setActiveSession] = useState<OfflineSession | null>(null);
  const [challenges, setChallenges] = useState<OfflineChallenge[]>([]);
  const [blockedApps, setBlockedApps] = useState<BlockedApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);

  // Mock data for fallback
  const mockStats: OfflineStats = {
    total_offline_minutes: 420, // 7 hours
    offline_session_count: 12,
    current_offline_streak: 3,
    longest_offline_streak: 7,
    last_offline_session_date: new Date().toISOString().split('T')[0],
  };

  const mockChallenges: OfflineChallenge[] = [
    {
      id: '1',
      title: 'Digital Detox Starter',
      description: 'Stay offline for 30 minutes',
      duration_minutes: 30,
      points_reward: 25,
      difficulty: 'easy',
      challenge_type: 'duration',
      requirements: { min_duration: 30 },
      is_active: true,
    },
    {
      id: '2',
      title: 'Focus Hour',
      description: 'Complete a 1-hour offline session',
      duration_minutes: 60,
      points_reward: 50,
      difficulty: 'medium',
      challenge_type: 'duration',
      requirements: { min_duration: 60 },
      is_active: true,
    },
    {
      id: '3',
      title: 'Deep Work Session',
      description: 'Stay offline for 2 hours straight',
      duration_minutes: 120,
      points_reward: 100,
      difficulty: 'hard',
      challenge_type: 'duration',
      requirements: { min_duration: 120 },
      is_active: true,
    },
    {
      id: '4',
      title: 'Offline Warrior',
      description: 'Maintain a 7-day offline streak',
      duration_minutes: 30,
      points_reward: 200,
      difficulty: 'hard',
      challenge_type: 'streak',
      requirements: { consecutive_days: 7 },
      is_active: true,
    },
  ];

  const mockBlockedApps: BlockedApp[] = [
    {
      id: '1',
      user_id: user?.id || '1',
      app_name: 'Instagram',
      app_identifier: 'com.instagram.android',
      is_enabled: true,
      block_during_offline: true,
      block_during_focus: true,
    },
    {
      id: '2',
      user_id: user?.id || '1',
      app_name: 'TikTok',
      app_identifier: 'com.zhiliaoapp.musically',
      is_enabled: true,
      block_during_offline: true,
      block_during_focus: true,
    },
    {
      id: '3',
      user_id: user?.id || '1',
      app_name: 'Twitter',
      app_identifier: 'com.twitter.android',
      is_enabled: true,
      block_during_offline: true,
      block_during_focus: false,
    },
    {
      id: '4',
      user_id: user?.id || '1',
      app_name: 'YouTube',
      app_identifier: 'com.google.android.youtube',
      is_enabled: false,
      block_during_offline: false,
      block_during_focus: false,
    },
  ];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const supabaseConnected = await checkSupabaseConnection();
      setIsSupabaseAvailable(supabaseConnected);

      if (supabaseConnected) {
        await Promise.all([
          loadStats(),
          loadActiveSession(),
          loadChallenges(),
          loadBlockedApps(),
        ]);
      } else {
        // Use mock data
        setStats(mockStats);
        setChallenges(mockChallenges);
        setBlockedApps(mockBlockedApps);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load offline tracking data');
      // Fallback to mock data
      setStats(mockStats);
      setChallenges(mockChallenges);
      setBlockedApps(mockBlockedApps);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!isSupabaseAvailable || !user) return;

    const { data, error } = await supabase
      .from('user_stats')
      .select('total_offline_minutes, offline_session_count, current_offline_streak, longest_offline_streak, last_offline_session_date')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data) {
      setStats(data);
    } else {
      setStats(mockStats);
    }
  };

  const loadActiveSession = async () => {
    if (!isSupabaseAvailable || !user) return;

    const { data, error } = await supabase
      .from('offline_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_completed', false)
      .order('start_time', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn('No active session found');
      return;
    }

    if (data) {
      setActiveSession(data);
    }
  };

  const loadChallenges = async () => {
    if (!isSupabaseAvailable) return;

    const { data, error } = await supabase
      .from('offline_challenges')
      .select('*')
      .eq('is_active', true)
      .order('difficulty', { ascending: true });

    if (error) {
      throw error;
    }

    setChallenges(data || mockChallenges);
  };

  const loadBlockedApps = async () => {
    if (!isSupabaseAvailable || !user) return;

    const { data, error } = await supabase
      .from('blocked_apps')
      .select('*')
      .eq('user_id', user.id)
      .order('app_name', { ascending: true });

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      setBlockedApps(data);
    } else {
      // Setup default blocked apps if none exist
      await setupDefaultBlockedApps();
    }
  };

  const setupDefaultBlockedApps = async () => {
    if (!isSupabaseAvailable || !user) {
      setBlockedApps(mockBlockedApps);
      return;
    }

    try {
      await supabase.rpc('setup_default_blocked_apps', {
        target_user_id: user.id,
      });
      
      // Reload blocked apps
      await loadBlockedApps();
    } catch (error) {
      console.warn('Failed to setup default blocked apps:', error);
      setBlockedApps(mockBlockedApps);
    }
  };

  const startSession = async (duration?: number) => {
    if (!user) throw new Error('User not authenticated');

    const sessionData = {
      user_id: user.id,
      start_time: new Date().toISOString(),
      session_type: 'manual',
      apps_blocked: blockedApps
        .filter(app => app.is_enabled && app.block_during_offline)
        .map(app => app.app_name),
    };

    if (isSupabaseAvailable) {
      const { data, error } = await supabase
        .from('offline_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;
      setActiveSession(data);
    } else {
      // Mock session creation
      const mockSession: OfflineSession = {
        id: Date.now().toString(),
        ...sessionData,
        end_time: null,
        duration_minutes: null,
        notes: null,
        is_completed: false,
      };
      setActiveSession(mockSession);
    }

    // In a real app, this would trigger native app blocking
    console.log('🚫 Apps blocked:', sessionData.apps_blocked);
  };

  const endSession = async () => {
    if (!activeSession) return;

    const endTime = new Date().toISOString();
    const startTime = new Date(activeSession.start_time);
    const durationMinutes = Math.floor((new Date(endTime).getTime() - startTime.getTime()) / (1000 * 60));

    const updates = {
      end_time: endTime,
      duration_minutes: durationMinutes,
      is_completed: true,
    };

    if (isSupabaseAvailable) {
      const { error } = await supabase
        .from('offline_sessions')
        .update(updates)
        .eq('id', activeSession.id);

      if (error) throw error;
    }

    setActiveSession(null);
    await loadStats(); // Refresh stats

    // In a real app, this would unblock apps
    console.log('✅ Apps unblocked');
  };

  const pauseSession = async () => {
    if (!activeSession || activeSession.end_time) return;

    const endTime = new Date().toISOString();
    
    if (isSupabaseAvailable) {
      const { error } = await supabase
        .from('offline_sessions')
        .update({ end_time: endTime })
        .eq('id', activeSession.id);

      if (error) throw error;
    }

    setActiveSession(prev => prev ? { ...prev, end_time: endTime } : null);
    
    // In a real app, this would unblock apps temporarily
    console.log('⏸️ Session paused, apps unblocked');
  };

  const resumeSession = async () => {
    if (!activeSession || !activeSession.end_time) return;

    if (isSupabaseAvailable) {
      const { error } = await supabase
        .from('offline_sessions')
        .update({ end_time: null })
        .eq('id', activeSession.id);

      if (error) throw error;
    }

    setActiveSession(prev => prev ? { ...prev, end_time: null } : null);
    
    // In a real app, this would re-block apps
    console.log('▶️ Session resumed, apps blocked again');
  };

  const updateBlockedApp = async (id: string, updates: Partial<BlockedApp>) => {
    if (isSupabaseAvailable) {
      const { error } = await supabase
        .from('blocked_apps')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    }

    setBlockedApps(prev => 
      prev.map(app => 
        app.id === id ? { ...app, ...updates } : app
      )
    );
  };

  const joinChallenge = async (challengeId: string) => {
    if (!user) throw new Error('User not authenticated');

    if (isSupabaseAvailable) {
      const { error } = await supabase
        .from('user_offline_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }
    }

    // In a real app, this would start the challenge
    console.log('🏆 Challenge joined:', challengeId);
  };

  const refreshData = async () => {
    await loadData();
  };

  return {
    stats,
    activeSession,
    challenges,
    blockedApps,
    loading,
    error,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    refreshData,
    updateBlockedApp,
    joinChallenge,
  };
};
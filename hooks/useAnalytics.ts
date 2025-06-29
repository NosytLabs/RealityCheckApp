import { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../lib/supabase';
import { useApp } from '../providers/AppProvider';

interface AnalyticsData {
  screenTime: {
    today: number;
    yesterday: number;
    weekAverage: number;
    monthAverage: number;
  };
  appUsage: {
    name: string;
    time: number;
    percentage: number;
    color: string;
    source: 'in_app' | 'external';
  }[];
  weeklyData: {
    labels: string[];
    datasets: {
      data: number[];
      color: (opacity?: number) => string;
      strokeWidth: number;
    }[];
  };
  goals: {
    dailyLimit: number;
    currentUsage: number;
    achieved: boolean;
  };
  inAppUsage: {
    totalMinutes: number;
    screenBreakdown: { [key: string]: number };
  };
}

interface UseAnalyticsReturn {
  analyticsData: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refreshAnalytics: () => Promise<void>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const { user } = useApp();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user]);

  const loadAnalyticsData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const supabaseConnected = await checkSupabaseConnection();

      if (supabaseConnected) {
        // Load real data from Supabase
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Get today's usage
        const { data: todayUsage } = await supabase
          .from('app_usage_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', today.toISOString().split('T')[0])
          .lt('start_time', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

        // Get yesterday's usage
        const { data: yesterdayUsage } = await supabase
          .from('app_usage_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', yesterday.toISOString().split('T')[0])
          .lt('start_time', today.toISOString().split('T')[0]);

        // Get week's usage
        const { data: weekUsage } = await supabase
          .from('app_usage_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_time', weekAgo.toISOString());

        // Calculate totals
        const todayTotal = todayUsage?.reduce((sum, log) => sum + (log.duration_minutes || 0), 0) || 0;
        const yesterdayTotal = yesterdayUsage?.reduce((sum, log) => sum + (log.duration_minutes || 0), 0) || 0;
        const weekTotal = weekUsage?.reduce((sum, log) => sum + (log.duration_minutes || 0), 0) || 0;
        const weekAverage = weekTotal / 7;

        // Process app usage breakdown
        const appUsageMap = new Map<string, { time: number; source: 'in_app' | 'external' }>();
        
        todayUsage?.forEach(log => {
          const key = log.source === 'in_app' ? 'RealityCheck' : (log.app_name || 'Unknown');
          const existing = appUsageMap.get(key) || { time: 0, source: log.source as 'in_app' | 'external' };
          appUsageMap.set(key, {
            time: existing.time + (log.duration_minutes || 0),
            source: existing.source,
          });
        });

        const appUsageArray = Array.from(appUsageMap.entries()).map(([name, data], index) => ({
          name,
          time: data.time / 60, // Convert to hours
          percentage: todayTotal > 0 ? Math.round((data.time / todayTotal) * 100) : 0,
          color: getAppColor(index),
          source: data.source,
        })).sort((a, b) => b.time - a.time);

        // Generate weekly chart data
        const weeklyLabels = [];
        const weeklyData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
          weeklyLabels.push(date.toLocaleDateString('en', { weekday: 'short' }));
          
          const dayUsage = weekUsage?.filter(log => {
            const logDate = new Date(log.start_time);
            return logDate.toDateString() === date.toDateString();
          }).reduce((sum, log) => sum + (log.duration_minutes || 0), 0) || 0;
          
          weeklyData.push(dayUsage / 60); // Convert to hours
        }

        // Calculate in-app usage breakdown
        const inAppLogs = todayUsage?.filter(log => log.source === 'in_app') || [];
        const screenBreakdown: { [key: string]: number } = {};
        inAppLogs.forEach(log => {
          if (log.screen_name) {
            screenBreakdown[log.screen_name] = (screenBreakdown[log.screen_name] || 0) + (log.duration_minutes || 0);
          }
        });

        setAnalyticsData({
          screenTime: {
            today: todayTotal / 60, // Convert to hours
            yesterday: yesterdayTotal / 60,
            weekAverage: weekAverage / 60,
            monthAverage: weekAverage / 60, // Simplified for now
          },
          appUsage: appUsageArray,
          weeklyData: {
            labels: weeklyLabels,
            datasets: [{
              data: weeklyData,
              color: (opacity = 1) => `rgba(69, 183, 209, ${opacity})`,
              strokeWidth: 3,
            }],
          },
          goals: {
            dailyLimit: 4.0, // 4 hours default
            currentUsage: todayTotal / 60,
            achieved: (todayTotal / 60) <= 4.0,
          },
          inAppUsage: {
            totalMinutes: inAppLogs.reduce((sum, log) => sum + (log.duration_minutes || 0), 0),
            screenBreakdown,
          },
        });
      } else {
        // Use enhanced mock data
        setAnalyticsData(getMockAnalyticsData());
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data');
      setAnalyticsData(getMockAnalyticsData()); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    await loadAnalyticsData();
  };

  return {
    analyticsData,
    loading,
    error,
    refreshAnalytics,
  };
};

const getAppColor = (index: number): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[index % colors.length];
};

const getMockAnalyticsData = (): AnalyticsData => ({
  screenTime: {
    today: 4.2,
    yesterday: 5.1,
    weekAverage: 4.8,
    monthAverage: 5.2,
  },
  appUsage: [
    { name: 'RealityCheck', time: 0.5, percentage: 12, color: '#4ECDC4', source: 'in_app' },
    { name: 'Instagram', time: 1.8, percentage: 43, color: '#FF6B6B', source: 'external' },
    { name: 'YouTube', time: 1.2, percentage: 29, color: '#45B7D1', source: 'external' },
    { name: 'Twitter', time: 0.7, percentage: 16, color: '#96CEB4', source: 'external' },
  ],
  weeklyData: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [3.2, 4.1, 5.2, 4.8, 6.1, 5.5, 3.8],
      color: (opacity = 1) => `rgba(69, 183, 209, ${opacity})`,
      strokeWidth: 3,
    }],
  },
  goals: {
    dailyLimit: 4.0,
    currentUsage: 4.2,
    achieved: false,
  },
  inAppUsage: {
    totalMinutes: 30,
    screenBreakdown: {
      'Dashboard': 15,
      'Analytics': 8,
      'Goals': 5,
      'Settings': 2,
    },
  },
});
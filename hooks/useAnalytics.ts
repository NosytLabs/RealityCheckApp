import { useState, useEffect } from 'react';
import { checkSupabaseConnection } from '../lib/supabase';
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

  // Mock data for demonstration
  const mockAnalyticsData: AnalyticsData = {
    screenTime: {
      today: 4.2,
      yesterday: 5.1,
      weekAverage: 4.8,
      monthAverage: 5.2,
    },
    appUsage: [
      { name: 'Social Media', time: 2.1, percentage: 35, color: '#FF6B6B' },
      { name: 'Entertainment', time: 1.5, percentage: 25, color: '#4ECDC4' },
      { name: 'Productivity', time: 0.8, percentage: 20, color: '#45B7D1' },
      { name: 'Games', time: 0.6, percentage: 15, color: '#96CEB4' },
      { name: 'Other', time: 0.3, percentage: 5, color: '#FFEAA7' },
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
  };

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
        // In a real implementation, you would fetch analytics data from Supabase
        // For now, we'll use mock data since screen time tracking requires native APIs
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setAnalyticsData(mockAnalyticsData);
      } else {
        // Use mock data
        setAnalyticsData(mockAnalyticsData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data');
      setAnalyticsData(mockAnalyticsData); // Fallback to mock data
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
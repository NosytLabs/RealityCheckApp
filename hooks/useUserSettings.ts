import { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../lib/supabase';
import { useApp } from '../providers/AppProvider';

interface UserSettings {
  app_usage_limits: AppUsageLimit[];
  intervention_settings: InterventionSettings;
  downtime_schedules: DowntimeSchedule[];
  notification_preferences: NotificationPreferences;
  privacy_preferences: PrivacyPreferences;
}

interface AppUsageLimit {
  id: string;
  appName: string;
  icon: string;
  dailyLimit: number;
  currentUsage: number;
  enabled: boolean;
  category: string;
}

interface InterventionSettings {
  reality_check: { enabled: boolean; frequency: 'low' | 'medium' | 'high' };
  mindful_breathing: { enabled: boolean; frequency: 'low' | 'medium' | 'high' };
  usage_alerts: { enabled: boolean; frequency: 'low' | 'medium' | 'high' };
  focus_reminders: { enabled: boolean; frequency: 'low' | 'medium' | 'high' };
  digital_detox: { enabled: boolean; frequency: 'low' | 'medium' | 'high' };
}

interface DowntimeSchedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
  enabled: boolean;
  allowedApps: string[];
}

interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  goal_progress_updates: boolean;
  reality_check_reminders: boolean;
  achievement_notifications: boolean;
}

interface PrivacyPreferences {
  stats_visible: boolean;
  profile_visible: boolean;
  activity_visible: boolean;
}

interface UseUserSettingsReturn {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  updateAppUsageLimits: (limits: AppUsageLimit[]) => Promise<void>;
  updateInterventionSettings: (interventions: InterventionSettings) => Promise<void>;
  updateDowntimeSchedules: (schedules: DowntimeSchedule[]) => Promise<void>;
  updateNotificationPreferences: (preferences: NotificationPreferences) => Promise<void>;
  updatePrivacyPreferences: (preferences: PrivacyPreferences) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

export const useUserSettings = (): UseUserSettingsReturn => {
  const { user } = useApp();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);

  // Mock data for fallback
  const mockSettings: UserSettings = {
    app_usage_limits: [
      {
        id: '1',
        appName: 'Instagram',
        icon: '📷',
        dailyLimit: 60,
        currentUsage: 45,
        enabled: true,
        category: 'Social Media',
      },
      {
        id: '2',
        appName: 'TikTok',
        icon: '🎵',
        dailyLimit: 30,
        currentUsage: 35,
        enabled: true,
        category: 'Entertainment',
      },
      {
        id: '3',
        appName: 'YouTube',
        icon: '📺',
        dailyLimit: 90,
        currentUsage: 25,
        enabled: false,
        category: 'Entertainment',
      },
    ],
    intervention_settings: {
      reality_check: { enabled: true, frequency: 'medium' },
      mindful_breathing: { enabled: true, frequency: 'low' },
      usage_alerts: { enabled: false, frequency: 'high' },
      focus_reminders: { enabled: true, frequency: 'medium' },
      digital_detox: { enabled: false, frequency: 'low' },
    },
    downtime_schedules: [
      {
        id: '1',
        name: 'Sleep Time',
        startTime: '22:00',
        endTime: '07:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        enabled: true,
        allowedApps: ['Phone', 'Messages', 'Clock'],
      },
      {
        id: '2',
        name: 'Work Focus',
        startTime: '09:00',
        endTime: '17:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        enabled: false,
        allowedApps: ['Email', 'Calendar', 'Notes', 'Slack'],
      },
    ],
    notification_preferences: {
      push_enabled: true,
      email_enabled: true,
      goal_progress_updates: true,
      reality_check_reminders: true,
      achievement_notifications: true,
    },
    privacy_preferences: {
      stats_visible: true,
      profile_visible: true,
      activity_visible: false,
    },
  };

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const supabaseConnected = await checkSupabaseConnection();
      setIsSupabaseAvailable(supabaseConnected);

      if (supabaseConnected) {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setSettings({
            app_usage_limits: data.app_usage_limits || mockSettings.app_usage_limits,
            intervention_settings: data.intervention_settings || mockSettings.intervention_settings,
            downtime_schedules: data.downtime_schedules || mockSettings.downtime_schedules,
            notification_preferences: data.notification_preferences || mockSettings.notification_preferences,
            privacy_preferences: data.privacy_preferences || mockSettings.privacy_preferences,
          });
        } else {
          // Create initial settings record
          await createInitialSettings();
        }
      } else {
        setSettings(mockSettings);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
      setSettings(mockSettings); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const createInitialSettings = async () => {
    if (!isSupabaseAvailable || !user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          app_usage_limits: mockSettings.app_usage_limits,
          intervention_settings: mockSettings.intervention_settings,
          downtime_schedules: mockSettings.downtime_schedules,
          notification_preferences: mockSettings.notification_preferences,
          privacy_preferences: mockSettings.privacy_preferences,
        })
        .select()
        .single();

      if (error) throw error;
      setSettings(mockSettings);
    } catch (error) {
      console.error('Error creating initial settings:', error);
      setSettings(mockSettings);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) throw new Error('User not authenticated');

    if (isSupabaseAvailable) {
      const { error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
    }

    setSettings(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateAppUsageLimits = async (limits: AppUsageLimit[]) => {
    await updateSettings({ app_usage_limits: limits });
  };

  const updateInterventionSettings = async (interventions: InterventionSettings) => {
    await updateSettings({ intervention_settings: interventions });
  };

  const updateDowntimeSchedules = async (schedules: DowntimeSchedule[]) => {
    await updateSettings({ downtime_schedules: schedules });
  };

  const updateNotificationPreferences = async (preferences: NotificationPreferences) => {
    await updateSettings({ notification_preferences: preferences });
  };

  const updatePrivacyPreferences = async (preferences: PrivacyPreferences) => {
    await updateSettings({ privacy_preferences: preferences });
  };

  const refreshSettings = async () => {
    await loadSettings();
  };

  return {
    settings,
    loading,
    error,
    updateAppUsageLimits,
    updateInterventionSettings,
    updateDowntimeSchedules,
    updateNotificationPreferences,
    updatePrivacyPreferences,
    refreshSettings,
  };
};
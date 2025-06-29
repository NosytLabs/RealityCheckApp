import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { supabase, checkSupabaseConnection } from '../lib/supabase';
import { useApp } from '../providers/AppProvider';

interface InAppSession {
  startTime: Date;
  screenName: string;
}

interface UseInAppTrackingReturn {
  currentSession: InAppSession | null;
  totalSessionTime: number;
  startTracking: (screenName: string) => void;
  stopTracking: () => void;
  logExternalUsage: (appName: string, durationMinutes: number) => Promise<void>;
}

export const useInAppTracking = (): UseInAppTrackingReturn => {
  const { user } = useApp();
  const [currentSession, setCurrentSession] = useState<InAppSession | null>(null);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);
  const appStateRef = useRef<AppStateStatus>(Platform.OS === 'web' ? 'active' : AppState.currentState);

  useEffect(() => {
    checkSupabaseConnection().then(setIsSupabaseAvailable);
  }, []);

  useEffect(() => {
    let subscription: any;
    let webFocusHandler: (() => void) | null = null;
    let webBlurHandler: (() => void) | null = null;

    if (Platform.OS === 'web') {
      // Web platform - use window focus/blur events
      webFocusHandler = () => handleAppStateChange('active');
      webBlurHandler = () => handleAppStateChange('background');
      
      window.addEventListener('focus', webFocusHandler);
      window.addEventListener('blur', webBlurHandler);
      window.addEventListener('beforeunload', webBlurHandler);
    } else {
      // Native platforms - use AppState
      subscription = AppState.addEventListener('change', handleAppStateChange);
    }

    return () => {
      if (Platform.OS === 'web') {
        if (webFocusHandler) window.removeEventListener('focus', webFocusHandler);
        if (webBlurHandler) {
          window.removeEventListener('blur', webBlurHandler);
          window.removeEventListener('beforeunload', webBlurHandler);
        }
      } else {
        subscription?.remove();
      }
    };
  }, [currentSession]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const currentState = appStateRef.current;
    
    if (currentState === 'active' && nextAppState.match(/inactive|background/)) {
      // App going to background - stop tracking
      await stopTracking();
    } else if (currentState.match(/inactive|background/) && nextAppState === 'active') {
      // App coming to foreground - resume tracking if we had a session
      if (currentSession) {
        startTracking(currentSession.screenName);
      }
    }
    appStateRef.current = nextAppState;
  };

  const startTracking = (screenName: string) => {
    if (currentSession) {
      stopTracking(); // Stop previous session
    }
    
    const newSession: InAppSession = {
      startTime: new Date(),
      screenName,
    };
    setCurrentSession(newSession);
  };

  const stopTracking = async () => {
    if (!currentSession || !user) return;

    const endTime = new Date();
    const durationMinutes = Math.floor(
      (endTime.getTime() - currentSession.startTime.getTime()) / (1000 * 60)
    );

    // Only log sessions longer than 1 minute
    if (durationMinutes >= 1) {
      try {
        if (isSupabaseAvailable) {
          await supabase.from('app_usage_logs').insert({
            user_id: user.id,
            start_time: currentSession.startTime.toISOString(),
            end_time: endTime.toISOString(),
            duration_minutes: durationMinutes,
            screen_name: currentSession.screenName,
            source: 'in_app',
          });
        }
        
        setTotalSessionTime(prev => prev + durationMinutes);
      } catch (error) {
        console.error('Error logging in-app usage:', error);
      }
    }

    setCurrentSession(null);
  };

  const logExternalUsage = async (appName: string, durationMinutes: number) => {
    if (!user || durationMinutes <= 0) return;

    try {
      if (isSupabaseAvailable) {
        const now = new Date();
        const startTime = new Date(now.getTime() - durationMinutes * 60 * 1000);

        await supabase.from('app_usage_logs').insert({
          user_id: user.id,
          start_time: startTime.toISOString(),
          end_time: now.toISOString(),
          duration_minutes: durationMinutes,
          source: 'external',
          app_name: appName,
        });
      }
    } catch (error) {
      console.error('Error logging external usage:', error);
      throw new Error('Failed to log external app usage');
    }
  };

  return {
    currentSession,
    totalSessionTime,
    startTracking,
    stopTracking,
    logExternalUsage,
  };
};
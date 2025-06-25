import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { AppService } from '../services/AppService';
import { SupabaseAuthService } from '../services/SupabaseAuthService';
import { AuthState } from '../services/AuthService';

const authService = new SupabaseAuthService();
import { User } from '@supabase/supabase-js';
import { initializeSupabase, MockSupabaseService } from '../config/supabase';

interface AppContextType {
  isInitialized: boolean;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  });

  const isAuthenticated = !!authState.user;
  const isLoading = authState.loading;
  const user = authState.user;

  useEffect(() => {
    initializeApp();
    setupAppStateListener();
    
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChange(setAuthState);
    return unsubscribe;
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize Supabase connection
      const supabaseAvailable = await initializeSupabase();
      
      // Initialize app services
      await AppService.initialize();
      
      // Auth service initializes automatically
      // Get current auth state or use mock data
      if (supabaseAvailable) {
        const currentAuthState = authService.getAuthState();
        setAuthState(currentAuthState);
      } else {
        // Use mock data for development
        const mockData = MockSupabaseService.getMockData();
        setAuthState({
          user: mockData.user as any,
          session: mockData.session as any,
          loading: false
        });
        console.log('🔧 Using mock authentication data for development');
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setAuthState({
        user: null,
        session: null,
        loading: false
      });
    }
  };

  const setupAppStateListener = () => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App became active, refresh user session
        refreshUser();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await authService.signIn({ email, password });
    if (error) {
      throw error;
    }
    // Auth state will be updated automatically via subscription
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await authService.signUp({ 
      email, 
      password, 
      username: email.split('@')[0] // Default username from email
    });
    if (error) {
      throw error;
    }
    // Auth state will be updated automatically via subscription
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) {
      throw error;
    }
    // Auth state will be updated automatically via subscription
  };

  const refreshUser = async () => {
    // Auth service handles this automatically
    const currentAuthState = authService.getAuthState();
    setAuthState(currentAuthState);
  };

  const contextValue: AppContextType = {
    isInitialized,
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
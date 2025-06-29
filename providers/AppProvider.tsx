import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { supabase, checkSupabaseConnection, Profile } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AppContextType {
  isInitialized: boolean;
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);

  const isAuthenticated = !!session && !!user;

  useEffect(() => {
    initializeApp();
    setupAppStateListener();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Check if Supabase is available
      const supabaseConnected = await checkSupabaseConnection();
      setIsSupabaseAvailable(supabaseConnected);
      
      if (supabaseConnected) {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await loadUserProfile(initialSession.user.id);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              await loadUserProfile(session.user.id);
            } else {
              setProfile(null);
            }
          }
        );

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
      } else {
        // Fallback to mock data if Supabase is not available
        console.warn('Supabase not available, using mock authentication');
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setIsSupabaseAvailable(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const setupAppStateListener = () => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        refreshUser();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseAvailable) {
      // Mock sign in for development
      const mockUser = {
        id: '1',
        email: email,
        user_metadata: {
          display_name: email.split('@')[0],
        },
      } as User;
      
      setUser(mockUser);
      setProfile({
        id: '1',
        email: email,
        display_name: email.split('@')[0],
        avatar_url: null,
        bio: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active',
        subscription_status: 'free',
        notification_settings: null,
        privacy_settings: null,
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      // Session and user will be set by the auth state change listener
    } catch (error: any) {
      throw new Error(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseAvailable) {
      // Mock sign up for development
      const mockUser = {
        id: Date.now().toString(),
        email: email,
        user_metadata: {
          display_name: email.split('@')[0],
        },
      } as User;
      
      setUser(mockUser);
      setProfile({
        id: Date.now().toString(),
        email: email,
        display_name: email.split('@')[0],
        avatar_url: null,
        bio: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active',
        subscription_status: 'free',
        notification_settings: null,
        privacy_settings: null,
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      // Create profile after successful signup
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            display_name: email.split('@')[0],
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!isSupabaseAvailable) {
      setUser(null);
      setProfile(null);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!isSupabaseAvailable || !user) return;

    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      if (data.session) {
        await loadUserProfile(data.session.user.id);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!isSupabaseAvailable || !user) {
      // Update mock profile
      if (profile) {
        setProfile({ ...profile, ...updates });
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  const contextValue: AppContextType = {
    isInitialized,
    user,
    profile,
    session,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUser,
    updateProfile,
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
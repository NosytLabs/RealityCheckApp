import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';

// Mock user type for development
interface MockUser {
  id: string;
  email: string;
  user_metadata?: {
    display_name?: string;
    avatar_url?: string;
    bio?: string;
    phone?: string;
    location?: string;
  };
}

interface AppContextType {
  isInitialized: boolean;
  user: MockUser | null;
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
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    initializeApp();
    setupAppStateListener();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Simulate app initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for existing session (mock)
      const existingUser = await checkExistingSession();
      if (existingUser) {
        setUser(existingUser);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingSession = async (): Promise<MockUser | null> => {
    // Mock session check - in real app this would check AsyncStorage or Supabase
    return null;
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
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful sign in
      const mockUser: MockUser = {
        id: '1',
        email: email,
        user_metadata: {
          display_name: email.split('@')[0],
          avatar_url: null,
          bio: '',
          phone: '',
          location: '',
        },
      };
      
      setUser(mockUser);
    } catch (error) {
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful sign up
      const mockUser: MockUser = {
        id: Date.now().toString(),
        email: email,
        user_metadata: {
          display_name: email.split('@')[0],
          avatar_url: null,
          bio: '',
          phone: '',
          location: '',
        },
      };
      
      setUser(mockUser);
    } catch (error) {
      throw new Error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    } catch (error) {
      throw new Error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    // In a real app, this would refresh the user session
    // For now, we'll just keep the current user
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
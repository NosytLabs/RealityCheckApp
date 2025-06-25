import { supabase } from '../config/supabase';
import { IService } from './ServiceManager';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { EventEmitter } from 'events';

export interface IAuthService extends IService {
  signUp(email: string, password: string, metadata?: Record<string, any>): Promise<{ user: User | null; error: AuthError | null }>;
  signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }>;
  signOut(): Promise<{ error: AuthError | null }>;
  getCurrentUser(): Promise<User | null>;
  getCurrentSession(): Promise<Session | null>;
  resetPassword(email: string): Promise<{ error: AuthError | null }>;
  updatePassword(password: string): Promise<{ error: AuthError | null }>;
  onAuthStateChange(callback: (event: string, session: Session | null) => void): () => void;
}

export class SupabaseAuthService implements IAuthService {
  readonly name = 'SupabaseAuthService';
  readonly version = '1.0.0';
  private eventEmitter = new EventEmitter();
  private authStateListener: (() => void) | null = null;

  async initialize(): Promise<void> {
    try {
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          this.eventEmitter.emit('auth:stateChange', { event, session });
        }
      );
      
      this.authStateListener = () => subscription.unsubscribe();
      
      console.log('SupabaseAuthService initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to initialize SupabaseAuthService:', errorMessage);
      throw error;
    }
  }

  async dispose(): Promise<void> {
    if (this.authStateListener) {
      this.authStateListener();
      this.authStateListener = null;
    }
    this.eventEmitter.removeAllListeners();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return !error;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('SupabaseAuthService health check failed:', errorMessage);
      return false;
    }
  }

  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      });
      
      return { user: data.user, error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to sign up user:', errorMessage);
      return { user: null, error: error as AuthError };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return { user: data.user, error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to sign in user:', errorMessage);
      return { user: null, error: error as AuthError };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to sign out user:', errorMessage);
      return { error: error as AuthError };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to get current user:', errorMessage);
      return null;
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to get current session:', errorMessage);
      return null;
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to reset password:', errorMessage);
      return { error: error as AuthError };
    }
  }

  async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to update password:', errorMessage);
      return { error: error as AuthError };
    }
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void): () => void {
    this.eventEmitter.on('auth:stateChange', ({ event, session }) => {
      callback(event, session);
    });
    
    return () => {
      this.eventEmitter.removeListener('auth:stateChange', callback);
    };
  }
}
import { supabase } from '../config/supabase';
import { IService, ServiceManager } from './ServiceManager';

export type UserRole = 'user' | 'parent' | 'child';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  timezone?: string;
  language?: string;
  avatarUrl?: string;
  bio?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  parentId?: string | null;
  children?: UserProfile[];
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  timezone?: string;
  language?: string;
  avatarUrl?: string;
  bio?: string;
  isPublic?: boolean;
  role?: UserRole;
  parentId?: string | null;
}

class UserService implements IService {
  private serviceManager?: ServiceManager;
  private isInitialized = false;

  async initialize(serviceManager: ServiceManager): Promise<void> {
    this.serviceManager = serviceManager;
    this.isInitialized = true;
    console.log('[UserService] Initialized');
  }

  async dispose(): Promise<void> {
    this.isInitialized = false;
    console.log('[UserService] Disposed');
  }

  async healthCheck(): Promise<boolean> {
    return this.isInitialized;
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Error getting current user:', authError);
        return null;
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      return {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone,
        dateOfBirth: profile.date_of_birth,
        timezone: profile.timezone,
        language: profile.language,
        avatarUrl: profile.avatar_url,
        bio: profile.bio,
        isPublic: profile.is_public || false,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      };
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: UpdateProfileData): Promise<UserProfile | null> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Map camelCase to snake_case for database
      if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
      if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.dateOfBirth !== undefined) updateData.date_of_birth = updates.dateOfBirth;
      if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
      if (updates.language !== undefined) updateData.language = updates.language;
      if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
      if (updates.bio !== undefined) updateData.bio = updates.bio;
      if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        phone: data.phone,
        dateOfBirth: data.date_of_birth,
        timezone: data.timezone,
        language: data.language,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        isPublic: data.is_public || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  async uploadAvatar(userId: string, imageUri: string): Promise<string | null> {
    try {
      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data, error } = await supabase.storage
        .from('user-content')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (error) {
        console.error('Error uploading avatar:', error);
        throw new Error(`Failed to upload avatar: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-content')
        .getPublicUrl(filePath);

      // Update user profile with new avatar URL
      await this.updateProfile(userId, { avatarUrl: publicUrl });

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      throw error;
    }
  }

  async deleteAvatar(userId: string): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      if (!user?.avatarUrl) {
        return;
      }

      // Extract file path from URL
      const url = new URL(user.avatarUrl);
      const filePath = url.pathname.split('/').slice(-2).join('/');

      // Delete from storage
      const { error } = await supabase.storage
        .from('user-content')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting avatar from storage:', error);
      }

      // Update user profile to remove avatar URL
      await this.updateProfile(userId, { avatarUrl: null });
    } catch (error) {
      console.error('Error in deleteAvatar:', error);
      throw error;
    }
  }

  async searchUsers(query: string, limit: number = 20): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, avatar_url, bio, is_public, created_at, updated_at')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .eq('is_public', true)
        .limit(limit);

      if (error) {
        console.error('Error searching users:', error);
        return [];
      }

      return data.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        avatarUrl: user.avatar_url,
        bio: user.bio,
        isPublic: user.is_public || false,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }));
    } catch (error) {
      console.error('Error in searchUsers:', error);
      return [];
    }
  }

  async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user by ID:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        phone: data.phone,
        dateOfBirth: data.date_of_birth,
        timezone: data.timezone,
        language: data.language,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        isPublic: data.is_public || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error in getUserById:', error);
      return null;
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    try {
      // This should be handled carefully in production
      // You might want to soft delete or anonymize data instead
      
      // Delete user's avatar if exists
      await this.deleteAvatar(userId);
      
      // Delete user record (this will cascade to related tables if properly configured)
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user account:', error);
        throw new Error(`Failed to delete account: ${error.message}`);
      }

      // Sign out the user
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error in deleteAccount:', error);
      throw error;
    }
  }
}

export default new UserService();
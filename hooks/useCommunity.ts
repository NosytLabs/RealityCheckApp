import { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../lib/supabase';
import { useApp } from '../providers/AppProvider';

interface PublicRealityCheck {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  location: any;
  tags: string[] | null;
  mood_before: number | null;
  mood_after: number | null;
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

interface UseCommunityReturn {
  publicRealityChecks: PublicRealityCheck[];
  loading: boolean;
  error: string | null;
  refreshFeed: () => Promise<void>;
  likeRealityCheck: (id: string) => Promise<void>;
  unlikeRealityCheck: (id: string) => Promise<void>;
}

export const useCommunity = (): UseCommunityReturn => {
  const { user } = useApp();
  const [publicRealityChecks, setPublicRealityChecks] = useState<PublicRealityCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);

  // Mock data for fallback
  const mockRealityChecks: PublicRealityCheck[] = [
    {
      id: '1',
      user_id: '1',
      title: 'Morning Mindfulness',
      description: 'Started my day with 10 minutes of meditation. Feeling centered and ready to tackle the day!',
      image_url: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
      location: { city: 'San Francisco', country: 'USA' },
      tags: ['meditation', 'morning', 'mindfulness'],
      mood_before: 6,
      mood_after: 9,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      profiles: {
        display_name: 'Sarah Chen',
        avatar_url: null,
      },
      likesCount: 12,
      commentsCount: 3,
      isLiked: false,
    },
    {
      id: '2',
      user_id: '2',
      title: 'Digital Detox Success',
      description: 'Completed my first 2-hour phone-free session! Spent time reading and felt so much more present.',
      image_url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
      location: { city: 'New York', country: 'USA' },
      tags: ['detox', 'reading', 'present'],
      mood_before: 4,
      mood_after: 8,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      profiles: {
        display_name: 'Alex Rivera',
        avatar_url: null,
      },
      likesCount: 8,
      commentsCount: 1,
      isLiked: true,
    },
    {
      id: '3',
      user_id: '3',
      title: 'Nature Walk Reflection',
      description: 'Took a walk in the park without my phone. Amazing how much more I noticed - the birds, the trees, the fresh air.',
      image_url: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
      location: { city: 'Portland', country: 'USA' },
      tags: ['nature', 'walk', 'mindful'],
      mood_before: 5,
      mood_after: 9,
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      profiles: {
        display_name: 'Jordan Kim',
        avatar_url: null,
      },
      likesCount: 15,
      commentsCount: 5,
      isLiked: false,
    },
    {
      id: '4',
      user_id: '4',
      title: 'Evening Gratitude',
      description: 'Ending the day by writing down three things I\'m grateful for. Such a simple practice but so powerful.',
      image_url: null,
      location: null,
      tags: ['gratitude', 'evening', 'reflection'],
      mood_before: 7,
      mood_after: 9,
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      profiles: {
        display_name: 'Maya Patel',
        avatar_url: null,
      },
      likesCount: 6,
      commentsCount: 2,
      isLiked: false,
    },
  ];

  useEffect(() => {
    loadPublicRealityChecks();
  }, []);

  const loadPublicRealityChecks = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabaseConnected = await checkSupabaseConnection();
      setIsSupabaseAvailable(supabaseConnected);

      if (supabaseConnected) {
        // Load real data from Supabase
        const { data, error } = await supabase
          .from('reality_checks')
          .select(`
            *,
            profiles:user_id (
              display_name,
              avatar_url
            )
          `)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        // Get likes and comments count for each reality check
        const realityChecksWithCounts = await Promise.all(
          (data || []).map(async (rc) => {
            const [likesResult, commentsResult, userLikeResult] = await Promise.all([
              supabase
                .from('likes')
                .select('id')
                .eq('reality_check_id', rc.id),
              supabase
                .from('comments')
                .select('id')
                .eq('reality_check_id', rc.id),
              user ? supabase
                .from('likes')
                .select('id')
                .eq('reality_check_id', rc.id)
                .eq('user_id', user.id)
                .single() : Promise.resolve({ data: null }),
            ]);

            return {
              ...rc,
              likesCount: likesResult.data?.length || 0,
              commentsCount: commentsResult.data?.length || 0,
              isLiked: !!userLikeResult.data,
            };
          })
        );

        setPublicRealityChecks(realityChecksWithCounts);
      } else {
        // Use mock data
        setPublicRealityChecks(mockRealityChecks);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load community feed');
      setPublicRealityChecks(mockRealityChecks); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const likeRealityCheck = async (id: string) => {
    if (!user || !isSupabaseAvailable) {
      // Update mock data
      setPublicRealityChecks(prev => 
        prev.map(rc => 
          rc.id === id 
            ? { ...rc, isLiked: true, likesCount: (rc.likesCount || 0) + 1 }
            : rc
        )
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('likes')
        .insert({
          reality_check_id: id,
          user_id: user.id,
        });

      if (error) throw error;

      // Update local state
      setPublicRealityChecks(prev => 
        prev.map(rc => 
          rc.id === id 
            ? { ...rc, isLiked: true, likesCount: (rc.likesCount || 0) + 1 }
            : rc
        )
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to like reality check');
    }
  };

  const unlikeRealityCheck = async (id: string) => {
    if (!user || !isSupabaseAvailable) {
      // Update mock data
      setPublicRealityChecks(prev => 
        prev.map(rc => 
          rc.id === id 
            ? { ...rc, isLiked: false, likesCount: Math.max((rc.likesCount || 0) - 1, 0) }
            : rc
        )
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('reality_check_id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setPublicRealityChecks(prev => 
        prev.map(rc => 
          rc.id === id 
            ? { ...rc, isLiked: false, likesCount: Math.max((rc.likesCount || 0) - 1, 0) }
            : rc
        )
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to unlike reality check');
    }
  };

  const refreshFeed = async () => {
    await loadPublicRealityChecks();
  };

  return {
    publicRealityChecks,
    loading,
    error,
    refreshFeed,
    likeRealityCheck,
    unlikeRealityCheck,
  };
};
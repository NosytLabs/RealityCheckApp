import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../theme';
import { useApp } from '../../../providers/AppProvider';
import { useToast } from '../../../components/common/Toast';
import { useInAppTracking } from '@/hooks/useInAppTracking';
import { supabase, checkSupabaseConnection } from '../../../lib/supabase';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { 
  ArrowLeft, 
  Users, 
  Award, 
  Calendar, 
  Zap, 
  Settings, 
  Heart, 
  MessageCircle, 
  Share,
  UserPlus,
  UserMinus,
  Lock,
} from 'lucide-react-native';

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  privacy_settings: any;
  created_at: string;
}

interface UserStats {
  total_reality_checks: number;
  current_streak: number;
  longest_streak: number;
  followers_count: number;
  following_count: number;
  total_points: number;
  user_level: number;
}

interface RealityCheck {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

export default function UserProfileScreen() {
  const { colors, typography, spacing } = useTheme();
  const { user } = useApp();
  const { showToast } = useToast();
  const { startTracking } = useInAppTracking();
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.id as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [realityChecks, setRealityChecks] = useState<RealityCheck[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'achievements'>('posts');

  const isOwnProfile = user?.id === userId;

  // Start tracking this screen
  useEffect(() => {
    startTracking('UserProfile');
  }, []);

  useEffect(() => {
    if (userId) {
      loadUserData();
    } else {
      router.back();
    }
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabaseConnected = await checkSupabaseConnection();
      setIsSupabaseAvailable(supabaseConnected);

      if (supabaseConnected) {
        // Load user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Load user stats
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (statsError && statsError.code !== 'PGRST116') throw statsError;
        setStats(statsData || null);

        // Check if current user is following this user
        if (user && user.id !== userId) {
          const { data: followData, error: followError } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', userId)
            .single();

          if (!followError) {
            setIsFollowing(!!followData);
          }
        }

        // Load user's public reality checks
        const { data: rcData, error: rcError } = await supabase
          .from('reality_checks')
          .select('*')
          .eq('user_id', userId)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (rcError) throw rcError;

        // Get likes and comments count for each reality check
        const realityChecksWithCounts = await Promise.all(
          (rcData || []).map(async (rc) => {
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

        setRealityChecks(realityChecksWithCounts);
      } else {
        // Use mock data
        setProfile({
          id: userId,
          display_name: 'Sarah Chen',
          avatar_url: null,
          bio: 'Digital wellness enthusiast. Trying to find balance in a connected world.',
          privacy_settings: { stats_visible: true, profile_visible: true },
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

        setStats({
          total_reality_checks: 42,
          current_streak: 7,
          longest_streak: 15,
          followers_count: 23,
          following_count: 18,
          total_points: 350,
          user_level: 3,
        });

        setRealityChecks([
          {
            id: '1',
            title: 'Morning Mindfulness',
            description: 'Started my day with 10 minutes of meditation. Feeling centered and ready to tackle the day!',
            image_url: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likesCount: 12,
            commentsCount: 3,
            isLiked: false,
          },
          {
            id: '2',
            title: 'Digital Detox Success',
            description: 'Completed my first 2-hour phone-free session! Spent time reading and felt so much more present.',
            image_url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            likesCount: 8,
            commentsCount: 1,
            isLiked: true,
          },
        ]);

        setIsFollowing(Math.random() > 0.5);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load user profile');
      // Use mock data as fallback
      setProfile({
        id: userId,
        display_name: 'User',
        avatar_url: null,
        bio: 'Digital wellness enthusiast',
        privacy_settings: { stats_visible: true, profile_visible: true },
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      setStats({
        total_reality_checks: 42,
        current_streak: 7,
        longest_streak: 15,
        followers_count: 23,
        following_count: 18,
        total_points: 350,
        user_level: 3,
      });

      setRealityChecks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user || user.id === userId) return;

    try {
      if (isSupabaseAvailable) {
        if (isFollowing) {
          // Unfollow
          await supabase
            .from('follows')
            .delete()
            .eq('follower_id', user.id)
            .eq('following_id', userId);
        } else {
          // Follow
          await supabase
            .from('follows')
            .insert({
              follower_id: user.id,
              following_id: userId,
            });
        }
      }

      setIsFollowing(!isFollowing);
      
      // Update follower count
      if (stats) {
        setStats({
          ...stats,
          followers_count: isFollowing 
            ? Math.max(0, stats.followers_count - 1) 
            : stats.followers_count + 1,
        });
      }

      showToast({
        type: 'success',
        title: isFollowing ? 'Unfollowed' : 'Following!',
        message: isFollowing 
          ? `You've unfollowed ${profile?.display_name || 'this user'}`
          : `You're now following ${profile?.display_name || 'this user'}!`,
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || `Failed to ${isFollowing ? 'unfollow' : 'follow'} user`,
      });
    }
  };

  const handleEditProfile = () => {
    router.push('/settings/edit-profile');
  };

  const handleLike = (realityCheckId: string, isLiked: boolean) => {
    setRealityChecks(prev => 
      prev.map(rc => 
        rc.id === realityCheckId 
          ? { 
              ...rc, 
              isLiked: !isLiked, 
              likesCount: isLiked 
                ? Math.max((rc.likesCount || 0) - 1, 0) 
                : (rc.likesCount || 0) + 1 
            }
          : rc
      )
    );
  };

  const handleComment = (realityCheckId: string) => {
    router.push(`/community/comments?id=${realityCheckId}`);
  };

  const handleShare = (realityCheck: RealityCheck) => {
    showToast({
      type: 'info',
      title: '🔗 Share Feature',
      message: 'Sharing functionality coming soon!',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
      backgroundColor: colors.surface.primary,
    },
    backButton: {
      padding: spacing.sm,
    },
    headerTitle: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      marginLeft: spacing.md,
      fontWeight: '700',
      flex: 1,
    },
    headerAction: {
      padding: spacing.sm,
    },
    content: {
      flex: 1,
    },
    profileHeader: {
      padding: spacing.lg,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    avatarContainer: {
      marginBottom: spacing.md,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.gray[200],
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      ...typography.textStyles.heading.xl,
      color: colors.text.secondary,
      fontWeight: '700',
    },
    displayName: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    bio: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: spacing.md,
    },
    joinDate: {
      ...typography.textStyles.caption.lg,
      color: colors.text.tertiary,
      marginBottom: spacing.lg,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: spacing.lg,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      fontWeight: '800',
      marginBottom: spacing.xs,
    },
    statLabel: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: spacing.lg,
      backgroundColor: colors.primary[500],
    },
    actionButtonOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary[500],
    },
    actionButtonText: {
      ...typography.textStyles.button.md,
      color: colors.white,
      marginLeft: spacing.sm,
      fontWeight: '700',
    },
    actionButtonTextOutline: {
      color: colors.primary[500],
    },
    tabsContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary[500],
    },
    tabText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    activeTabText: {
      color: colors.primary[500],
      fontWeight: '700',
    },
    postsContainer: {
      padding: spacing.lg,
    },
    realityCheckCard: {
      marginBottom: spacing.lg,
      borderRadius: spacing.lg,
      overflow: 'hidden',
    },
    realityCheckTitle: {
      ...typography.textStyles.heading.sm,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    realityCheckDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 22,
      marginBottom: spacing.md,
    },
    realityCheckImage: {
      width: '100%',
      height: 200,
      borderRadius: spacing.md,
      marginBottom: spacing.md,
    },
    realityCheckMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.lg,
    },
    metaText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
      fontWeight: '600',
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: spacing.lg,
      backgroundColor: colors.gray[50],
    },
    actionButtonActive: {
      backgroundColor: colors.error[100],
    },
    actionButtonText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
      fontWeight: '600',
    },
    actionButtonTextActive: {
      color: colors.error[600],
    },
    achievementsContainer: {
      padding: spacing.lg,
    },
    achievementCard: {
      marginBottom: spacing.lg,
      borderRadius: spacing.lg,
      overflow: 'hidden',
    },
    achievementHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    achievementIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.warning[100],
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    achievementInfo: {
      flex: 1,
    },
    achievementName: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    achievementDate: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      fontWeight: '500',
    },
    achievementDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 22,
    },
    emptyStateContainer: {
      padding: spacing.xl,
      alignItems: 'center',
    },
    emptyStateIcon: {
      marginBottom: spacing.lg,
    },
    emptyStateTitle: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
      fontWeight: '700',
    },
    emptyStateText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    privateProfileContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    privateProfileIcon: {
      marginBottom: spacing.lg,
    },
    privateProfileTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.md,
      fontWeight: '700',
    },
    privateProfileText: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      marginTop: spacing.md,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color={colors.text.primary} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color={colors.text.primary} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.privateProfileContainer}>
          <Lock color={colors.text.secondary} size={48} style={styles.privateProfileIcon} />
          <Text style={styles.privateProfileTitle}>User Not Found</Text>
          <Text style={styles.privateProfileText}>
            This user profile doesn't exist or has been removed.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isProfilePrivate = profile.privacy_settings && 
    !profile.privacy_settings.profile_visible && 
    !isOwnProfile;

  const areStatsPrivate = profile.privacy_settings && 
    !profile.privacy_settings.stats_visible && 
    !isOwnProfile;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isOwnProfile ? 'My Profile' : 'Profile'}
        </Text>
        {isOwnProfile && (
          <TouchableOpacity style={styles.headerAction} onPress={() => router.push('/settings')}>
            <Settings color={colors.text.primary} size={24} />
          </TouchableOpacity>
        )}
      </View>

      {isProfilePrivate ? (
        <View style={styles.privateProfileContainer}>
          <Lock color={colors.text.secondary} size={48} style={styles.privateProfileIcon} />
          <Text style={styles.privateProfileTitle}>Private Profile</Text>
          <Text style={styles.privateProfileText}>
            This user has set their profile to private.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {profile.avatar_url ? (
                <Image 
                  source={{ uri: profile.avatar_url }} 
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {profile.display_name?.charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={styles.displayName}>
              {profile.display_name || 'Anonymous User'}
            </Text>
            
            {profile.bio && (
              <Text style={styles.bio}>{profile.bio}</Text>
            )}
            
            <Text style={styles.joinDate}>
              <Calendar size={14} color={colors.text.tertiary} /> Joined {formatJoinDate(profile.created_at)}
            </Text>

            {!areStatsPrivate && stats && (
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.total_reality_checks}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.followers_count}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.following_count}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.user_level}</Text>
                  <Text style={styles.statLabel}>Level</Text>
                </View>
              </View>
            )}

            {isOwnProfile ? (
              <Button
                title="Edit Profile"
                onPress={handleEditProfile}
                variant="outline"
              />
            ) : (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isFollowing && styles.actionButtonOutline
                ]}
                onPress={handleFollow}
              >
                {isFollowing ? (
                  <>
                    <UserMinus color={colors.primary[500]} size={20} />
                    <Text style={[styles.actionButtonText, styles.actionButtonTextOutline]}>
                      Unfollow
                    </Text>
                  </>
                ) : (
                  <>
                    <UserPlus color={colors.white} size={20} />
                    <Text style={styles.actionButtonText}>
                      Follow
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
              onPress={() => setActiveTab('posts')}
            >
              <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                Posts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
              onPress={() => setActiveTab('achievements')}
            >
              <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
                Achievements
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'posts' ? (
            <View style={styles.postsContainer}>
              {realityChecks.length > 0 ? (
                realityChecks.map((realityCheck) => (
                  <Card key={realityCheck.id} style={styles.realityCheckCard} padding="large">
                    <Text style={styles.realityCheckTitle}>{realityCheck.title}</Text>
                    {realityCheck.description && (
                      <Text style={styles.realityCheckDescription}>
                        {realityCheck.description}
                      </Text>
                    )}
                    
                    {realityCheck.image_url && (
                      <Image 
                        source={{ uri: realityCheck.image_url }}
                        style={styles.realityCheckImage}
                        resizeMode="cover"
                      />
                    )}

                    <View style={styles.realityCheckMeta}>
                      <View style={styles.metaItem}>
                        <Heart 
                          color={colors.text.secondary} 
                          size={14}
                          fill={realityCheck.isLiked ? colors.error[500] : 'none'}
                        />
                        <Text style={styles.metaText}>
                          {realityCheck.likesCount || 0} likes
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MessageCircle color={colors.text.secondary} size={14} />
                        <Text style={styles.metaText}>
                          {realityCheck.commentsCount || 0} comments
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Calendar color={colors.text.secondary} size={14} />
                        <Text style={styles.metaText}>
                          {formatTimeAgo(realityCheck.created_at)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.actionsContainer}>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          realityCheck.isLiked && styles.actionButtonActive
                        ]}
                        onPress={() => handleLike(realityCheck.id, realityCheck.isLiked || false)}
                      >
                        <Heart 
                          color={realityCheck.isLiked ? colors.error[500] : colors.text.secondary} 
                          size={16}
                          fill={realityCheck.isLiked ? colors.error[500] : 'none'}
                        />
                        <Text style={[
                          styles.actionButtonText,
                          realityCheck.isLiked && styles.actionButtonTextActive
                        ]}>
                          Like
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleComment(realityCheck.id)}
                      >
                        <MessageCircle color={colors.text.secondary} size={16} />
                        <Text style={styles.actionButtonText}>
                          Comment
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleShare(realityCheck)}
                      >
                        <Share color={colors.text.secondary} size={16} />
                        <Text style={styles.actionButtonText}>Share</Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                ))
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Zap color={colors.text.secondary} size={48} style={styles.emptyStateIcon} />
                  <Text style={styles.emptyStateTitle}>No Posts Yet</Text>
                  <Text style={styles.emptyStateText}>
                    {isOwnProfile 
                      ? "You haven't shared any reality checks yet. Start your digital wellness journey today!"
                      : "This user hasn't shared any public reality checks yet."}
                  </Text>
                  {isOwnProfile && (
                    <Button
                      title="Create Reality Check"
                      onPress={() => showToast({
                        type: 'info',
                        title: 'Coming Soon',
                        message: 'Reality check creation will be available soon!',
                      })}
                    />
                  )}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.achievementsContainer}>
              {!areStatsPrivate ? (
                <>
                  <Card style={styles.achievementCard} padding="large">
                    <View style={styles.achievementHeader}>
                      <View style={styles.achievementIcon}>
                        <Award color={colors.warning[500]} size={24} />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementName}>First Steps</Text>
                        <Text style={styles.achievementDate}>Earned 2 weeks ago</Text>
                      </View>
                    </View>
                    <Text style={styles.achievementDescription}>
                      Complete your first reality check
                    </Text>
                  </Card>
                  
                  <Card style={styles.achievementCard} padding="large">
                    <View style={styles.achievementHeader}>
                      <View style={styles.achievementIcon}>
                        <Zap color={colors.error[500]} size={24} />
                      </View>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementName}>Week Warrior</Text>
                        <Text style={styles.achievementDate}>Earned 3 days ago</Text>
                      </View>
                    </View>
                    <Text style={styles.achievementDescription}>
                      Maintain a 7-day streak
                    </Text>
                  </Card>
                </>
              ) : (
                <View style={styles.privateProfileContainer}>
                  <Lock color={colors.text.secondary} size={48} style={styles.privateProfileIcon} />
                  <Text style={styles.privateProfileTitle}>Private Achievements</Text>
                  <Text style={styles.privateProfileText}>
                    This user has set their achievements to private.
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
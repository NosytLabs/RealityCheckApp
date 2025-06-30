import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../theme';
import { useCommunity } from '@/hooks/useCommunity';
import { useInAppTracking } from '@/hooks/useInAppTracking';
import { useToast } from '../../../components/common/Toast';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Users, 
  TrendingUp, 
  Sparkles,
  MapPin,
  Clock,
  Award
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function CommunityScreen() {
  const { colors, typography, spacing } = useTheme();
  const { 
    publicRealityChecks, 
    loading, 
    error, 
    refreshFeed,
    likeRealityCheck,
    unlikeRealityCheck 
  } = useCommunity();
  const { startTracking } = useInAppTracking();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'recent' | 'trending' | 'following'>('recent');

  // Start tracking this screen
  useEffect(() => {
    startTracking('Community');
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFeed();
    setRefreshing(false);
  };

  const handleLike = async (realityCheckId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikeRealityCheck(realityCheckId);
      } else {
        await likeRealityCheck(realityCheckId);
        showToast({
          type: 'success',
          title: '❤️ Liked!',
          message: 'Spreading positive vibes in the community',
        });
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update like',
      });
    }
  };

  const handleComment = (realityCheckId: string) => {
    router.push(`/community/comments?id=${realityCheckId}`);
  };

  const handleUserProfile = (userId: string) => {
    router.push(`/community/user-profile?id=${userId}`);
  };

  const handleShare = (realityCheck: any) => {
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

  const filters = [
    { key: 'recent', label: 'Recent', icon: Clock },
    { key: 'trending', label: 'Trending', icon: TrendingUp },
    { key: 'following', label: 'Following', icon: Users },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    headerContainer: {
      paddingBottom: spacing.md,
    },
    headerContent: {
      padding: spacing.lg,
    },
    title: {
      ...typography.textStyles.heading['2xl'],
      color: colors.text.primary,
      marginBottom: spacing.sm,
      fontWeight: '800',
    },
    subtitle: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
    },
    heroCard: {
      marginHorizontal: spacing.lg,
      marginTop: -spacing.xl,
      marginBottom: spacing.lg,
      backgroundColor: colors.white,
      borderRadius: spacing.lg,
      padding: spacing.xl,
      shadowColor: colors.blue[500],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    communityStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: spacing.lg,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      ...typography.textStyles.heading.lg,
      color: colors.primary[500],
      fontWeight: '800',
      marginBottom: spacing.xs,
    },
    statLabel: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    inspirationalImage: {
      width: '100%',
      height: 120,
      borderRadius: spacing.md,
      marginTop: spacing.lg,
    },
    filtersContainer: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    filtersScroll: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    filterChip: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: spacing.lg,
      marginHorizontal: spacing.xs,
      borderWidth: 2,
      borderColor: colors.border.primary,
      backgroundColor: colors.white,
    },
    filterChipActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    filterChipText: {
      ...typography.textStyles.body.medium,
      fontWeight: '700',
      marginLeft: spacing.xs,
    },
    filterChipTextActive: {
      color: colors.white,
    },
    filterChipTextInactive: {
      color: colors.text.secondary,
    },
    feedContainer: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    realityCheckCard: {
      marginBottom: spacing.lg,
      borderRadius: spacing.lg,
      overflow: 'hidden',
    },
    realityCheckHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    userAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.gray[200],
      marginRight: spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      fontWeight: '700',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    postTime: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      fontWeight: '500',
    },
    realityCheckContent: {
      marginBottom: spacing.md,
    },
    realityCheckTitle: {
      ...typography.textStyles.heading.md,
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
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.md,
    },
    tag: {
      backgroundColor: colors.primary[100],
      borderRadius: spacing.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      marginRight: spacing.sm,
      marginBottom: spacing.xs,
    },
    tagText: {
      ...typography.textStyles.caption.lg,
      color: colors.primary[600],
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
    emptyState: {
      alignItems: 'center',
      padding: spacing.xl,
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
    errorText: {
      ...typography.textStyles.body.medium,
      color: colors.error[500],
      textAlign: 'center',
      marginBottom: spacing.md,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.emptyState, { flex: 1, justifyContent: 'center' }]}>
          <Text style={[styles.emptyStateTitle, { color: colors.text.secondary }]}>
            Loading community feed...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.blue[500], colors.primary[500]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Community</Text>
          <Text style={styles.subtitle}>
            Connect with others on their digital wellness journey
          </Text>
        </View>
      </LinearGradient>

      {/* Community Stats Card */}
      <Card style={styles.heroCard} padding="none">
        <View style={styles.communityStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2.4K</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Today's Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>89%</Text>
            <Text style={styles.statLabel}>Positive Vibes</Text>
          </View>
        </View>

        <Image 
          source={{ uri: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg' }}
          style={styles.inspirationalImage}
          resizeMode="cover"
        />
      </Card>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersScroll}>
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.key && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(filter.key as any)}
              >
                <IconComponent 
                  color={selectedFilter === filter.key ? colors.white : colors.text.secondary} 
                  size={16} 
                />
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === filter.key 
                    ? styles.filterChipTextActive 
                    : styles.filterChipTextInactive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Feed */}
      <ScrollView
        style={styles.feedContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        {publicRealityChecks.length > 0 ? (
          publicRealityChecks.map((realityCheck) => (
            <Card key={realityCheck.id} style={styles.realityCheckCard} padding="large">
              {/* Header */}
              <View style={styles.realityCheckHeader}>
                <TouchableOpacity 
                  style={styles.userAvatar}
                  onPress={() => handleUserProfile(realityCheck.user_id)}
                >
                  {realityCheck.profiles?.avatar_url ? (
                    <Image 
                      source={{ uri: realityCheck.profiles.avatar_url }} 
                      style={styles.userAvatar}
                    />
                  ) : (
                    <Text style={styles.avatarText}>
                      {realityCheck.profiles?.display_name?.charAt(0).toUpperCase() || '?'}
                    </Text>
                  )}
                </TouchableOpacity>
                
                <View style={styles.userInfo}>
                  <TouchableOpacity onPress={() => handleUserProfile(realityCheck.user_id)}>
                    <Text style={styles.userName}>
                      {realityCheck.profiles?.display_name || 'Anonymous User'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.postTime}>
                    {formatTimeAgo(realityCheck.created_at)}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <View style={styles.realityCheckContent}>
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

                {/* Meta info */}
                <View style={styles.realityCheckMeta}>
                  {realityCheck.location && (
                    <View style={styles.metaItem}>
                      <MapPin color={colors.text.secondary} size={14} />
                      <Text style={styles.metaText}>
                        {realityCheck.location.city || 'Unknown location'}
                      </Text>
                    </View>
                  )}
                  
                  {realityCheck.mood_before && realityCheck.mood_after && (
                    <View style={styles.metaItem}>
                      <Sparkles color={colors.text.secondary} size={14} />
                      <Text style={styles.metaText}>
                        Mood: {realityCheck.mood_before} → {realityCheck.mood_after}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Tags */}
                {realityCheck.tags && realityCheck.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {realityCheck.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Actions */}
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
                    {realityCheck.likesCount || 0}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleComment(realityCheck.id)}
                >
                  <MessageCircle color={colors.text.secondary} size={16} />
                  <Text style={styles.actionButtonText}>
                    {realityCheck.commentsCount || 0}
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
          <View style={styles.emptyState}>
            <Users color={colors.text.secondary} size={48} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>No Posts Yet</Text>
            <Text style={styles.emptyStateText}>
              Be the first to share your digital wellness journey with the community!
            </Text>
            <Button
              title="Share Your First Reality Check"
              onPress={() => showToast({
                type: 'info',
                title: 'Coming Soon',
                message: 'Reality check creation will be available soon!',
              })}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
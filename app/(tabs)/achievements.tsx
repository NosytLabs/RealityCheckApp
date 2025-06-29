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
import { useTheme } from '../../theme';
import { useAchievements } from '../../hooks/useAchievements';
import { useInAppTracking } from '../../hooks/useInAppTracking';
import { Card } from '../../components/common/Card';
import { 
  Award, 
  Trophy, 
  Target, 
  Zap, 
  Users, 
  Star, 
  Crown,
  Lock,
  TrendingUp,
  Calendar,
  Sparkles
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function AchievementsScreen() {
  const { colors, typography, spacing } = useTheme();
  const { 
    achievements, 
    userAchievements, 
    userLevel, 
    totalPoints, 
    nextLevelPoints,
    loading, 
    error, 
    refreshAchievements 
  } = useAchievements();
  const { startTracking } = useInAppTracking();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');

  // Start tracking this screen
  useEffect(() => {
    startTracking('Achievements');
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAchievements();
    setRefreshing(false);
  };

  const categories = [
    { key: 'all', label: 'All', icon: '🏆', color: colors.primary[500] },
    { key: 'streak', label: 'Streaks', icon: '🔥', color: colors.error[500] },
    { key: 'milestone', label: 'Milestones', icon: '🎯', color: colors.success[500] },
    { key: 'social', label: 'Social', icon: '👥', color: colors.blue[500] },
    { key: 'special', label: 'Special', icon: '✨', color: colors.purple[500] },
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.type === selectedCategory);

  const getProgressPercentage = (achievement: any) => {
    if (!achievement.criteria?.target) return 0;
    
    // This would be calculated based on user's current progress
    // For now, we'll use mock data
    const mockProgress = Math.random() * achievement.criteria.target;
    return Math.min((mockProgress / achievement.criteria.target) * 100, 100);
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  const getDifficultyColor = (points: number) => {
    if (points >= 100) return colors.purple[500]; // Legendary
    if (points >= 50) return colors.warning[500]; // Epic
    if (points >= 25) return colors.blue[500]; // Rare
    return colors.success[500]; // Common
  };

  const getDifficultyLabel = (points: number) => {
    if (points >= 100) return 'Legendary';
    if (points >= 50) return 'Epic';
    if (points >= 25) return 'Rare';
    return 'Common';
  };

  const levelProgress = totalPoints > 0 ? ((totalPoints % nextLevelPoints) / nextLevelPoints) * 100 : 0;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      padding: spacing.lg,
      paddingBottom: spacing.md,
      background: `linear-gradient(135deg, ${colors.warning[500]}, ${colors.primary[500]})`,
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
      shadowColor: colors.warning[500],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    levelContainer: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    levelBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.warning[500],
      borderRadius: spacing.xl,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      marginBottom: spacing.lg,
      shadowColor: colors.warning[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    levelText: {
      ...typography.textStyles.heading.lg,
      color: colors.white,
      fontWeight: '800',
      marginLeft: spacing.sm,
    },
    pointsText: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    progressBarContainer: {
      width: '100%',
      height: 12,
      backgroundColor: colors.gray[200],
      borderRadius: spacing.md,
      overflow: 'hidden',
      marginBottom: spacing.sm,
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.warning[500],
      borderRadius: spacing.md,
    },
    progressText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      textAlign: 'center',
      fontWeight: '600',
    },
    inspirationalImage: {
      width: '100%',
      height: 120,
      borderRadius: spacing.md,
      marginTop: spacing.lg,
    },
    categoriesContainer: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    categoriesScroll: {
      paddingVertical: spacing.sm,
    },
    categoryChip: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: spacing.lg,
      marginRight: spacing.md,
      borderWidth: 2,
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    categoryChipActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    categoryChipInactive: {
      backgroundColor: colors.white,
      borderColor: colors.border.primary,
    },
    categoryChipText: {
      ...typography.textStyles.body.medium,
      fontWeight: '700',
    },
    categoryChipTextActive: {
      color: colors.white,
    },
    categoryChipTextInactive: {
      color: colors.text.secondary,
    },
    achievementsContainer: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    achievementCard: {
      marginBottom: spacing.lg,
      borderRadius: spacing.lg,
      overflow: 'hidden',
      position: 'relative',
    },
    achievementCardUnlocked: {
      borderWidth: 2,
      borderColor: colors.warning[300],
      backgroundColor: colors.warning[50],
    },
    achievementCardLocked: {
      opacity: 0.7,
      backgroundColor: colors.gray[50],
    },
    achievementHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    achievementIcon: {
      marginRight: spacing.lg,
      backgroundColor: colors.white,
      borderRadius: spacing.lg,
      padding: spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    achievementDetails: {
      flex: 1,
    },
    achievementName: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    achievementDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 20,
      marginBottom: spacing.sm,
    },
    achievementMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    difficultyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: spacing.lg,
    },
    difficultyText: {
      ...typography.textStyles.caption.lg,
      color: colors.white,
      fontWeight: '700',
      marginLeft: spacing.xs,
    },
    pointsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gray[100],
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: spacing.lg,
    },
    pointsValue: {
      ...typography.textStyles.caption.lg,
      color: colors.text.primary,
      fontWeight: '700',
      marginLeft: spacing.xs,
    },
    progressSection: {
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
    },
    progressLabel: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
      fontWeight: '600',
    },
    progressBarSmall: {
      height: 8,
      backgroundColor: colors.gray[200],
      borderRadius: spacing.xs,
      overflow: 'hidden',
      marginBottom: spacing.xs,
    },
    progressFillSmall: {
      height: '100%',
      borderRadius: spacing.xs,
    },
    progressPercentage: {
      ...typography.textStyles.caption.md,
      color: colors.text.tertiary,
      textAlign: 'right',
      fontWeight: '600',
    },
    unlockedBadge: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      backgroundColor: colors.warning[500],
      borderRadius: spacing.lg,
      padding: spacing.sm,
      shadowColor: colors.warning[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    lockedOverlay: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      backgroundColor: colors.gray[400],
      borderRadius: spacing.lg,
      padding: spacing.sm,
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
            Loading achievements...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>
          Unlock rewards and level up your digital wellness journey
        </Text>
      </View>

      {/* Level Progress Card */}
      <Card style={styles.heroCard} padding="none">
        <View style={styles.levelContainer}>
          <View style={styles.levelBadge}>
            <Crown color={colors.white} size={24} />
            <Text style={styles.levelText}>Level {userLevel}</Text>
          </View>
          
          <Text style={styles.pointsText}>
            {totalPoints.toLocaleString()} XP
          </Text>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${levelProgress}%` }
              ]} 
            />
          </View>
          
          <Text style={styles.progressText}>
            {Math.round(levelProgress)}% to Level {userLevel + 1}
          </Text>
        </View>

        <Image 
          source={{ uri: 'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg' }}
          style={styles.inspirationalImage}
          resizeMode="cover"
        />
      </Card>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryChip,
                selectedCategory === category.key 
                  ? styles.categoryChipActive 
                  : styles.categoryChipInactive
              ]}
              onPress={() => setSelectedCategory(category.key as any)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.key 
                  ? styles.categoryChipTextActive 
                  : styles.categoryChipTextInactive
              ]}>
                {category.icon} {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Achievements List */}
      <ScrollView
        style={styles.achievementsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            const progress = getProgressPercentage(achievement);
            const difficultyColor = getDifficultyColor(achievement.points || 0);
            
            return (
              <Card 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  unlocked ? styles.achievementCardUnlocked : styles.achievementCardLocked
                ]} 
                padding="large"
              >
                <View style={styles.achievementHeader}>
                  <View style={styles.achievementIcon}>
                    {achievement.type === 'streak' && <Zap color={colors.error[500]} size={28} />}
                    {achievement.type === 'milestone' && <Target color={colors.success[500]} size={28} />}
                    {achievement.type === 'social' && <Users color={colors.blue[500]} size={28} />}
                    {achievement.type === 'special' && <Sparkles color={colors.purple[500]} size={28} />}
                  </View>
                  
                  <View style={styles.achievementDetails}>
                    <Text style={styles.achievementName}>{achievement.name}</Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                    
                    <View style={styles.achievementMeta}>
                      <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
                        <Star color={colors.white} size={14} />
                        <Text style={styles.difficultyText}>
                          {getDifficultyLabel(achievement.points || 0)}
                        </Text>
                      </View>
                      
                      <View style={styles.pointsBadge}>
                        <Trophy color={colors.warning[500]} size={14} />
                        <Text style={styles.pointsValue}>
                          +{achievement.points || 0} XP
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Progress Bar for locked achievements */}
                {!unlocked && progress > 0 && (
                  <View style={styles.progressSection}>
                    <Text style={styles.progressLabel}>
                      Progress: {Math.round(progress)}%
                    </Text>
                    <View style={styles.progressBarSmall}>
                      <View 
                        style={[
                          styles.progressFillSmall,
                          { 
                            backgroundColor: difficultyColor,
                            width: `${progress}%`
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressPercentage}>
                      {Math.round(progress)}% complete
                    </Text>
                  </View>
                )}

                {/* Unlocked/Locked Badge */}
                {unlocked ? (
                  <View style={styles.unlockedBadge}>
                    <Award color={colors.white} size={20} />
                  </View>
                ) : (
                  <View style={styles.lockedOverlay}>
                    <Lock color={colors.white} size={20} />
                  </View>
                )}
              </Card>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Trophy color={colors.text.secondary} size={48} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>No Achievements Found</Text>
            <Text style={styles.emptyStateText}>
              Start using RealityCheck to unlock your first achievements!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
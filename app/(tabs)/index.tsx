import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useApp } from '../../providers/AppProvider';
import { useInAppTracking } from '../../hooks/useInAppTracking';
import { useToast } from '../../components/common/Toast';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { MindfulBreakModal } from '../../components/modals/MindfulBreakModal';
import { Plus, Zap, Moon, Target, TrendingUp, Award, Clock, Users, Sparkles, Leaf } from 'lucide-react-native';
import { supabase, checkSupabaseConnection } from '../../lib/supabase';

interface DashboardStats {
  screenTime: {
    today: number;
    yesterday: number;
    weekAverage: number;
  };
  realityChecks: {
    total: number;
    thisWeek: number;
  };
  streak: {
    current: number;
    longest: number;
  };
  goals: {
    completed: number;
    total: number;
    progress: number;
  };
  achievements: {
    total: number;
    recent: string[];
  };
  social: {
    followers: number;
    following: number;
  };
}

export default function DashboardScreen() {
  const { colors, typography, spacing } = useTheme();
  const { profile, user } = useApp();
  const { showToast } = useToast();
  const { startTracking } = useInAppTracking();
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMindfulBreak, setShowMindfulBreak] = useState(false);
  const [mindfulBreakType, setMindfulBreakType] = useState<'breathing' | 'reflection' | 'gratitude'>('breathing');

  // Start tracking this screen
  useEffect(() => {
    startTracking('Dashboard');
  }, []);

  const quickActions = [
    {
      id: 'reality-check',
      title: 'Reality Check',
      description: 'Take a mindful moment',
      icon: <Zap color={colors.primary[500]} size={24} />,
      gradient: [colors.primary[500], colors.primary[600]],
      onPress: () => {
        setMindfulBreakType('reflection');
        setShowMindfulBreak(true);
      },
    },
    {
      id: 'focus-mode',
      title: 'Focus Mode',
      description: 'Start a focused session',
      icon: <Target color={colors.success[500]} size={24} />,
      gradient: [colors.success[500], colors.success[600]],
      onPress: () => router.push('/focus-mode'),
    },
    {
      id: 'touch-grass',
      title: 'Touch Grass Stroll',
      description: 'Grow your digital garden',
      icon: <Leaf color={colors.green[500]} size={24} />,
      gradient: [colors.green[500], colors.green[600]],
      onPress: () => router.push('/touch-grass-stroll'),
    },
    {
      id: 'downtime',
      title: 'Time Off',
      description: 'Schedule a digital break',
      icon: <Moon color={colors.warning[500]} size={24} />,
      gradient: [colors.warning[500], colors.warning[600]],
      onPress: () => router.push('/(tabs)/offline'),
    },
  ];

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const supabaseConnected = await checkSupabaseConnection();
      
      if (supabaseConnected) {
        // Fetch real data from Supabase
        const [userStatsResult, goalsResult, achievementsResult] = await Promise.all([
          supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('goals')
            .select('*')
            .eq('user_id', user.id),
          supabase
            .from('user_achievements')
            .select('*, achievements(*)')
            .eq('user_id', user.id)
            .order('earned_at', { ascending: false })
            .limit(3),
        ]);

        const userStats = userStatsResult.data;
        const goals = goalsResult.data || [];
        const achievements = achievementsResult.data || [];

        const completedGoals = goals.filter(goal => goal.is_completed).length;
        const totalGoalProgress = goals.length > 0 
          ? goals.reduce((sum, goal) => sum + (goal.current_value / goal.target_value), 0) / goals.length * 100
          : 0;

        setStats({
          screenTime: {
            today: 4.2,
            yesterday: 5.1,
            weekAverage: 4.8,
          },
          realityChecks: {
            total: userStats?.total_reality_checks || 0,
            thisWeek: 8,
          },
          streak: {
            current: userStats?.current_streak || 0,
            longest: userStats?.longest_streak || 0,
          },
          goals: {
            completed: completedGoals,
            total: goals.length,
            progress: Math.round(totalGoalProgress),
          },
          achievements: {
            total: achievements.length,
            recent: achievements.slice(0, 3).map(a => a.achievements?.name || 'Achievement'),
          },
          social: {
            followers: userStats?.followers_count || 0,
            following: userStats?.following_count || 0,
          },
        });
      } else {
        // Use mock data
        setStats({
          screenTime: {
            today: 4.2,
            yesterday: 5.1,
            weekAverage: 4.8,
          },
          realityChecks: {
            total: 42,
            thisWeek: 8,
          },
          streak: {
            current: 7,
            longest: 15,
          },
          goals: {
            completed: 3,
            total: 5,
            progress: 85,
          },
          achievements: {
            total: 12,
            recent: ['First Week', 'Mindful Moment', 'Focus Master'],
          },
          social: {
            followers: 23,
            following: 18,
          },
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showToast({
        type: 'error',
        title: 'Error Loading Data',
        message: 'Unable to load your dashboard. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const handleMindfulBreakComplete = () => {
    showToast({
      type: 'success',
      title: '🌟 Mindful Moment Complete!',
      message: 'You\'ve taken a meaningful pause. How do you feel?',
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollContainer: {
      padding: spacing.lg,
    },
    header: {
      padding: spacing.lg,
      paddingBottom: spacing.md,
      background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
    },
    greeting: {
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
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    welcomeMessage: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.lg,
      fontWeight: '600',
    },
    inspirationalImage: {
      width: '100%',
      height: 120,
      borderRadius: spacing.md,
      marginBottom: spacing.lg,
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: spacing.xl,
    },
    statCard: {
      width: '48%',
      marginBottom: spacing.md,
      alignItems: 'center',
      backgroundColor: colors.gray[50],
      borderRadius: spacing.lg,
      padding: spacing.lg,
    },
    statIcon: {
      marginBottom: spacing.sm,
    },
    statValue: {
      ...typography.textStyles.heading.xl,
      color: colors.primary[500],
      marginBottom: spacing.xs,
      textAlign: 'center',
      fontWeight: '800',
    },
    statLabel: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      textAlign: 'center',
      fontWeight: '600',
    },
    statSubtext: {
      ...typography.textStyles.caption.lg,
      color: colors.text.tertiary,
      textAlign: 'center',
      marginTop: spacing.xs,
      fontWeight: '500',
    },
    sectionTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.lg,
      fontWeight: '700',
    },
    quickActionsContainer: {
      marginBottom: spacing.xl,
    },
    actionCard: {
      marginBottom: spacing.md,
      borderRadius: spacing.lg,
      overflow: 'hidden',
    },
    actionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
    },
    actionIcon: {
      marginRight: spacing.lg,
      backgroundColor: colors.white,
      borderRadius: spacing.lg,
      padding: spacing.md,
    },
    actionText: {
      flex: 1,
    },
    actionTitle: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    actionDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      fontWeight: '500',
    },
    recentActivity: {
      marginBottom: spacing.xl,
    },
    achievementsList: {
      gap: spacing.md,
    },
    achievementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.warning[50],
      borderRadius: spacing.lg,
      padding: spacing.lg,
    },
    achievementIcon: {
      marginRight: spacing.lg,
      backgroundColor: colors.warning[100],
      borderRadius: spacing.lg,
      padding: spacing.sm,
    },
    achievementText: {
      ...typography.textStyles.body.medium,
      color: colors.warning[700],
      flex: 1,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      marginTop: spacing.md,
    },
    progressIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    progressBar: {
      flex: 1,
      height: 8,
      backgroundColor: colors.gray[200],
      borderRadius: spacing.xs,
      marginRight: spacing.sm,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: spacing.xs,
    },
    progressText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    mindfulPrompt: {
      backgroundColor: colors.blue[50],
      borderRadius: spacing.lg,
      padding: spacing.lg,
      marginTop: spacing.lg,
      alignItems: 'center',
    },
    mindfulPromptTitle: {
      ...typography.textStyles.body.large,
      color: colors.blue[700],
      fontWeight: '700',
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    mindfulPromptText: {
      ...typography.textStyles.body.medium,
      color: colors.blue[600],
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    mindfulPromptButtons: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    mindfulPromptButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: spacing.lg,
      backgroundColor: colors.blue[500],
    },
    mindfulPromptButtonText: {
      ...typography.textStyles.button.sm,
      color: colors.white,
      fontWeight: '700',
    },
  });

  const userName = profile?.display_name || profile?.email?.split('@')[0] || 'there';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey {userName}! 👋</Text>
        <Text style={styles.subtitle}>
          Ready to level up your digital wellness game?
        </Text>
      </View>

      {/* Hero Card */}
      <Card style={styles.heroCard} padding="none">
        <Text style={styles.welcomeMessage}>
          Your journey to digital balance starts here
        </Text>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg' }}
          style={styles.inspirationalImage}
          resizeMode="cover"
        />

        {/* Mindful Break Prompt */}
        <View style={styles.mindfulPrompt}>
          <Text style={styles.mindfulPromptTitle}>✨ Take a Mindful Moment</Text>
          <Text style={styles.mindfulPromptText}>
            You've been using your device for a while. How about a quick mindful break?
          </Text>
          <View style={styles.mindfulPromptButtons}>
            <TouchableOpacity 
              style={styles.mindfulPromptButton}
              onPress={() => {
                setMindfulBreakType('breathing');
                setShowMindfulBreak(true);
              }}
            >
              <Text style={styles.mindfulPromptButtonText}>Breathing</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mindfulPromptButton}
              onPress={() => {
                setMindfulBreakType('gratitude');
                setShowMindfulBreak(true);
              }}
            >
              <Text style={styles.mindfulPromptButtonText}>Gratitude</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Overview */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Clock color={colors.primary[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>{formatTime(stats.screenTime.today)}</Text>
              <Text style={styles.statLabel}>Screen Time Today</Text>
              <Text style={styles.statSubtext}>
                {stats.screenTime.today < stats.screenTime.yesterday ? '↓ Improving!' : '↑ vs yesterday'}
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <Zap color={colors.success[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>{stats.realityChecks.total}</Text>
              <Text style={styles.statLabel}>Reality Checks</Text>
              <Text style={styles.statSubtext}>
                {stats.realityChecks.thisWeek} this week
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <TrendingUp color={colors.warning[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>{stats.streak.current}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
              <Text style={styles.statSubtext}>
                Best: {stats.streak.longest} days
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <Target color={colors.purple[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>{stats.goals.progress}%</Text>
              <Text style={styles.statLabel}>Goal Progress</Text>
              <View style={styles.progressIndicator}>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill,
                    { 
                      backgroundColor: colors.purple[500],
                      width: `${stats.goals.progress}%`
                    }
                  ]} />
                </View>
                <Text style={styles.progressText}>
                  {stats.goals.completed}/{stats.goals.total}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <Card style={styles.actionCard} padding="none">
                <View style={[
                  styles.actionContent,
                  { backgroundColor: action.gradient[0] + '20' }
                ]}>
                  <View style={styles.actionIcon}>
                    {action.icon}
                  </View>
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Achievements */}
        {stats && stats.achievements.recent.length > 0 && (
          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Recent Achievements 🏆</Text>
            <Card padding="large">
              <View style={styles.achievementsList}>
                {stats.achievements.recent.map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <View style={styles.achievementIcon}>
                      <Award color={colors.warning[600]} size={20} />
                    </View>
                    <Text style={styles.achievementText}>{achievement}</Text>
                    <Sparkles color={colors.warning[500]} size={16} />
                  </View>
                ))}
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Mindful Break Modal */}
      <MindfulBreakModal
        visible={showMindfulBreak}
        onClose={() => setShowMindfulBreak(false)}
        onComplete={handleMindfulBreakComplete}
        type={mindfulBreakType}
      />
    </SafeAreaView>
  );
}
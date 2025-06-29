import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useApp } from '../../providers/AppProvider';
import { useToast } from '../../components/common/Toast';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Plus, Zap, Moon, Target, TrendingUp, Award, Clock, Users } from 'lucide-react-native';
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
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const quickActions = [
    {
      id: 'reality-check',
      title: 'Reality Check',
      description: 'Take a moment to reflect',
      icon: <Zap color={colors.primary[500]} size={24} />,
      onPress: () => {
        if (Platform.OS === 'web') {
          showToast({
            type: 'info',
            title: 'Reality Check',
            message: 'This feature works best on mobile devices with camera access.',
          });
        } else {
          // Navigate to reality check creation
          showToast({
            type: 'success',
            title: 'Reality Check Started',
            message: 'Take a moment to be present and mindful.',
          });
        }
      },
    },
    {
      id: 'focus-mode',
      title: 'Focus Mode',
      description: 'Start a focused session',
      icon: <Target color={colors.success[500]} size={24} />,
      onPress: () => router.push('/focus-mode'),
    },
    {
      id: 'downtime',
      title: 'Time Off',
      description: 'Schedule a break',
      icon: <Moon color={colors.warning[500]} size={24} />,
      onPress: () => router.push('/(tabs)/offline'),
    },
  ];

  useEffect(() => {
    loadDashboardData();
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollContainer: {
      padding: spacing.lg,
    },
    header: {
      marginBottom: spacing.xl,
    },
    greeting: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
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
    },
    statIcon: {
      marginBottom: spacing.sm,
    },
    statValue: {
      ...typography.textStyles.heading['2xl'],
      color: colors.primary[500],
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    statLabel: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    statSubtext: {
      ...typography.textStyles.caption.lg,
      color: colors.text.tertiary,
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    sectionTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    quickActionsContainer: {
      marginBottom: spacing.xl,
    },
    actionCard: {
      marginBottom: spacing.md,
    },
    actionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionIcon: {
      marginRight: spacing.md,
    },
    actionText: {
      flex: 1,
    },
    actionTitle: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    actionDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
    },
    recentActivity: {
      marginBottom: spacing.xl,
    },
    achievementsList: {
      gap: spacing.sm,
    },
    achievementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    achievementIcon: {
      marginRight: spacing.md,
    },
    achievementText: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      flex: 1,
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
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.subtitle}>
            Welcome back to your digital wellness journey
          </Text>
        </View>

        {/* Stats Overview */}
        {stats && (
          <View style={styles.statsContainer}>
            <Card style={styles.statCard} padding="medium">
              <Clock color={colors.primary[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>{formatTime(stats.screenTime.today)}</Text>
              <Text style={styles.statLabel}>Screen Time Today</Text>
              <Text style={styles.statSubtext}>
                {stats.screenTime.today < stats.screenTime.yesterday ? '↓' : '↑'} vs yesterday
              </Text>
            </Card>
            
            <Card style={styles.statCard} padding="medium">
              <Zap color={colors.success[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>{stats.realityChecks.total}</Text>
              <Text style={styles.statLabel}>Reality Checks</Text>
              <Text style={styles.statSubtext}>
                {stats.realityChecks.thisWeek} this week
              </Text>
            </Card>
            
            <Card style={styles.statCard} padding="medium">
              <TrendingUp color={colors.warning[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>{stats.streak.current}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
              <Text style={styles.statSubtext}>
                Best: {stats.streak.longest} days
              </Text>
            </Card>
            
            <Card style={styles.statCard} padding="medium">
              <Target color={colors.purple[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>{stats.goals.progress}%</Text>
              <Text style={styles.statLabel}>Goal Progress</Text>
              <Text style={styles.statSubtext}>
                {stats.goals.completed}/{stats.goals.total} completed
              </Text>
            </Card>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <Card style={styles.actionCard} padding="large">
                <View style={styles.actionContent}>
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
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            <Card padding="large">
              <View style={styles.achievementsList}>
                {stats.achievements.recent.map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <Award color={colors.warning[500]} size={20} style={styles.achievementIcon} />
                    <Text style={styles.achievementText}>{achievement}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
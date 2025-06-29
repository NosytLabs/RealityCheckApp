import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { useApp } from '../../providers/AppProvider';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Plus, Zap, Moon, Target } from 'lucide-react-native';

export default function DashboardScreen() {
  const { colors, typography, spacing } = useTheme();
  const { user } = useApp();
  const router = useRouter();

  const quickActions = [
    {
      id: 'reality-check',
      title: 'Reality Check',
      description: 'Take a moment to reflect',
      icon: <Zap color={colors.primary[500]} size={24} />,
      onPress: () => console.log('Reality check'),
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
      title: 'Downtime',
      description: 'Schedule a break',
      icon: <Moon color={colors.warning[500]} size={24} />,
      onPress: () => console.log('Downtime'),
    },
  ];

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
    },
    statValue: {
      ...typography.textStyles.heading['2xl'],
      color: colors.primary[500],
      marginBottom: spacing.xs,
    },
    statLabel: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
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
    placeholderText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      textAlign: 'center',
      padding: spacing.lg,
    },
  });

  const userName = user?.email?.split('@')[0] || 'there';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.subtitle}>
            Welcome back to your digital wellness journey
          </Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard} padding="medium">
            <Text style={styles.statValue}>4.2h</Text>
            <Text style={styles.statLabel}>Screen Time Today</Text>
          </Card>
          
          <Card style={styles.statCard} padding="medium">
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Reality Checks</Text>
          </Card>
          
          <Card style={styles.statCard} padding="medium">
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </Card>
          
          <Card style={styles.statCard} padding="medium">
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Goal Progress</Text>
          </Card>
        </View>

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

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card padding="large">
            <Text style={styles.placeholderText}>
              Your recent activity will appear here
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
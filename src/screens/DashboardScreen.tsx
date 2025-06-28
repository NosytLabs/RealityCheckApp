import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { Card } from '../components/common/Card';

export const DashboardScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();

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
    title: {
      ...typography.textStyles.display.small,
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
      marginBottom: spacing.lg,
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
    placeholderText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      textAlign: 'center',
      padding: spacing.lg,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            Welcome back! Here's your digital wellness overview.
          </Text>
        </View>

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

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card padding="large">
          <Text style={styles.placeholderText}>
            Your recent activity will appear here
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
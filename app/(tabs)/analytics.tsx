import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../theme';
import { useApp } from '../../providers/AppProvider';
import { Card } from '../../components/common/Card';

const { width: screenWidth } = Dimensions.get('window');

interface AnalyticsData {
  screenTime: {
    today: number;
    yesterday: number;
    weekAverage: number;
    monthAverage: number;
  };
  appUsage: {
    name: string;
    time: number;
    percentage: number;
    color: string;
  }[];
  weeklyData: {
    labels: string[];
    datasets: {
      data: number[];
      color: (opacity?: number) => string;
      strokeWidth: number;
    }[];
  };
  goals: {
    dailyLimit: number;
    currentUsage: number;
    achieved: boolean;
  };
}

export default function AnalyticsScreen() {
  const { colors, typography, spacing } = useTheme();
  const { user } = useApp();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        screenTime: {
          today: 4.2,
          yesterday: 5.1,
          weekAverage: 4.8,
          monthAverage: 5.2,
        },
        appUsage: [
          { name: 'Social Media', time: 2.1, percentage: 35, color: '#FF6B6B' },
          { name: 'Entertainment', time: 1.5, percentage: 25, color: '#4ECDC4' },
          { name: 'Productivity', time: 0.8, percentage: 20, color: '#45B7D1' },
          { name: 'Games', time: 0.6, percentage: 15, color: '#96CEB4' },
          { name: 'Other', time: 0.3, percentage: 5, color: '#FFEAA7' },
        ],
        weeklyData: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [3.2, 4.1, 5.2, 4.8, 6.1, 5.5, 3.8],
            color: (opacity = 1) => `rgba(69, 183, 209, ${opacity})`,
            strokeWidth: 3,
          }],
        },
        goals: {
          dailyLimit: 4.0,
          currentUsage: 4.2,
          achieved: false,
        },
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const formatTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const chartConfig = {
    backgroundColor: colors.background.primary,
    backgroundGradientFrom: colors.background.primary,
    backgroundGradientTo: colors.background.primary,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(69, 183, 209, ${opacity})`,
    labelColor: (opacity = 1) => colors.text.secondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary[500],
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
    },
    header: {
      padding: spacing.lg,
      paddingBottom: spacing.md,
    },
    title: {
      ...typography.textStyles.heading['2xl'],
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
    },
    timeRangeContainer: {
      flexDirection: 'row',
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      backgroundColor: colors.surface.primary,
      borderRadius: 12,
      padding: 4,
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: 8,
    },
    timeRangeText: {
      ...typography.textStyles.body.medium,
      fontWeight: '500',
    },
    card: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    cardTitle: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    screenTimeContainer: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    screenTimeValue: {
      ...typography.textStyles.display.sm,
      color: colors.primary[500],
      marginBottom: spacing.sm,
    },
    comparisonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    comparisonText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
    },
    goalContainer: {
      marginTop: spacing.md,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    goalText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
    },
    goalStatus: {
      ...typography.textStyles.body.medium,
      fontWeight: '600',
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: colors.gray[200],
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    chart: {
      borderRadius: 16,
      marginVertical: spacing.sm,
    },
    appUsageContainer: {
      gap: spacing.md,
    },
    appUsageItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    appUsageInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    appColorIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: spacing.md,
    },
    appName: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '500',
    },
    appUsageStats: {
      alignItems: 'flex-end',
    },
    appTime: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '600',
    },
    appPercentage: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
    },
  });

  if (loading && !analyticsData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Screen Time Analytics</Text>
          <Text style={styles.subtitle}>Your digital wellness insights</Text>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {(['week', 'month', 'year'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                selectedTimeRange === range && {
                  backgroundColor: colors.primary[500],
                },
              ]}
              onPress={() => setSelectedTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  {
                    color: selectedTimeRange === range
                      ? colors.white
                      : colors.text.secondary,
                  },
                ]}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {analyticsData && (
          <>
            {/* Screen Time Overview */}
            <Card style={styles.card} padding="large">
              <Text style={styles.cardTitle}>Today's Screen Time</Text>
              <View style={styles.screenTimeContainer}>
                <Text style={styles.screenTimeValue}>
                  {formatTime(analyticsData.screenTime.today)}
                </Text>
                <View style={styles.comparisonContainer}>
                  <Text style={styles.comparisonText}>
                    Yesterday: {formatTime(analyticsData.screenTime.yesterday)}
                  </Text>
                  <Text style={styles.comparisonText}>
                    Week avg: {formatTime(analyticsData.screenTime.weekAverage)}
                  </Text>
                </View>
              </View>
              
              {/* Goal Progress */}
              <View style={styles.goalContainer}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalText}>
                    Daily Goal: {formatTime(analyticsData.goals.dailyLimit)}
                  </Text>
                  <Text style={[
                    styles.goalStatus,
                    { color: analyticsData.goals.achieved ? colors.success[500] : colors.warning[500] }
                  ]}>
                    {analyticsData.goals.achieved ? 'Achieved' : 'Over limit'}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: analyticsData.goals.achieved
                          ? colors.success[500]
                          : colors.warning[500],
                        width: `${Math.min((analyticsData.goals.currentUsage / analyticsData.goals.dailyLimit) * 100, 100)}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </Card>

            {/* Weekly Chart */}
            <Card style={styles.card} padding="large">
              <Text style={styles.cardTitle}>Weekly Trend</Text>
              <LineChart
                data={analyticsData.weeklyData}
                width={screenWidth - 60}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </Card>

            {/* App Usage Breakdown */}
            <Card style={styles.card} padding="large">
              <Text style={styles.cardTitle}>App Categories</Text>
              <View style={styles.appUsageContainer}>
                {analyticsData.appUsage.map((app, index) => (
                  <View key={index} style={styles.appUsageItem}>
                    <View style={styles.appUsageInfo}>
                      <View style={[styles.appColorIndicator, { backgroundColor: app.color }]} />
                      <Text style={styles.appName}>{app.name}</Text>
                    </View>
                    <View style={styles.appUsageStats}>
                      <Text style={styles.appTime}>{formatTime(app.time)}</Text>
                      <Text style={styles.appPercentage}>{app.percentage}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
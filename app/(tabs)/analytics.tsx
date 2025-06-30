import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useInAppTracking } from '@/hooks/useInAppTracking';
import { Card } from '../../components/common/Card';
import { ExternalUsageModal } from '../../components/modals/ExternalUsageModal';
import { TrendingUp, TrendingDown, Target, Zap, Award, Plus, Clock } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { colors, typography, spacing } = useTheme();
  const { analyticsData, loading, error, refreshAnalytics } = useAnalytics();
  const { startTracking } = useInAppTracking();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [showExternalModal, setShowExternalModal] = useState(false);

  // Start tracking this screen
  React.useEffect(() => {
    startTracking('Analytics');
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAnalytics();
    setRefreshing(false);
  };

  const formatTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const chartConfig = {
    backgroundColor: colors.background.primary,
    backgroundGradientFrom: colors.primary[500],
    backgroundGradientTo: colors.primary[600],
    backgroundGradientFromOpacity: 0.1,
    backgroundGradientToOpacity: 0.2,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(69, 183, 209, ${opacity})`,
    labelColor: (opacity = 1) => colors.text.secondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '8',
      strokeWidth: '3',
      stroke: colors.primary[500],
      fill: colors.white,
    },
    strokeWidth: 4,
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
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    heroStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    heroStatItem: {
      alignItems: 'center',
      flex: 1,
    },
    heroStatValue: {
      ...typography.textStyles.heading.xl,
      color: colors.primary[500],
      fontWeight: '800',
      marginBottom: spacing.xs,
    },
    heroStatLabel: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      textAlign: 'center',
      fontWeight: '600',
    },
    heroStatTrend: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    trendText: {
      ...typography.textStyles.caption.md,
      marginLeft: spacing.xs,
      fontWeight: '600',
    },
    timeRangeContainer: {
      flexDirection: 'row',
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      backgroundColor: colors.gray[100],
      borderRadius: spacing.lg,
      padding: spacing.xs,
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderRadius: spacing.md,
    },
    timeRangeButtonActive: {
      backgroundColor: colors.primary[500],
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    timeRangeText: {
      ...typography.textStyles.body.medium,
      fontWeight: '600',
    },
    timeRangeTextActive: {
      color: colors.white,
    },
    timeRangeTextInactive: {
      color: colors.text.secondary,
    },
    card: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      borderRadius: spacing.lg,
      overflow: 'hidden',
    },
    cardTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.lg,
      fontWeight: '700',
    },
    screenTimeContainer: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    screenTimeValue: {
      ...typography.textStyles.display.sm,
      color: colors.primary[500],
      marginBottom: spacing.sm,
      fontWeight: '800',
    },
    comparisonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: colors.gray[50],
      borderRadius: spacing.md,
      padding: spacing.md,
    },
    comparisonItem: {
      alignItems: 'center',
      flex: 1,
    },
    comparisonLabel: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
      fontWeight: '600',
    },
    comparisonValue: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      fontWeight: '700',
    },
    goalContainer: {
      marginTop: spacing.lg,
      backgroundColor: colors.gray[50],
      borderRadius: spacing.md,
      padding: spacing.lg,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    goalText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    goalStatus: {
      ...typography.textStyles.body.medium,
      fontWeight: '700',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: spacing.md,
    },
    goalStatusAchieved: {
      backgroundColor: colors.success[100],
      color: colors.success[700],
    },
    goalStatusOverLimit: {
      backgroundColor: colors.error[100],
      color: colors.error[700],
    },
    progressBar: {
      height: 12,
      borderRadius: spacing.md,
      overflow: 'hidden',
      backgroundColor: colors.gray[200],
    },
    progressFill: {
      height: '100%',
      borderRadius: spacing.md,
    },
    chart: {
      borderRadius: spacing.lg,
      marginVertical: spacing.md,
    },
    appUsageContainer: {
      gap: spacing.lg,
    },
    appUsageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    logUsageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.lg,
    },
    logUsageText: {
      ...typography.textStyles.caption.lg,
      color: colors.white,
      fontWeight: '700',
      marginLeft: spacing.xs,
    },
    appUsageItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.gray[50],
      borderRadius: spacing.md,
      padding: spacing.lg,
    },
    appUsageInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    appColorIndicator: {
      width: 16,
      height: 16,
      borderRadius: spacing.md,
      marginRight: spacing.lg,
    },
    appDetails: {
      flex: 1,
    },
    appName: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    appSource: {
      ...typography.textStyles.caption.md,
      color: colors.text.tertiary,
      fontWeight: '500',
    },
    appUsageStats: {
      alignItems: 'flex-end',
    },
    appTime: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    appPercentage: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    appProgressBar: {
      width: 60,
      height: 6,
      backgroundColor: colors.gray[200],
      borderRadius: spacing.xs,
      marginTop: spacing.xs,
      overflow: 'hidden',
    },
    appProgressFill: {
      height: '100%',
      borderRadius: spacing.xs,
    },
    errorText: {
      ...typography.textStyles.body.medium,
      color: colors.error[500],
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    inspirationalImage: {
      width: '100%',
      height: 120,
      borderRadius: spacing.md,
      marginBottom: spacing.lg,
    },
    achievementBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.warning[100],
      borderRadius: spacing.lg,
      padding: spacing.md,
      marginTop: spacing.md,
    },
    achievementText: {
      ...typography.textStyles.body.medium,
      color: colors.warning[700],
      fontWeight: '600',
      marginLeft: spacing.sm,
    },
    inAppUsageContainer: {
      backgroundColor: colors.blue[50],
      borderRadius: spacing.md,
      padding: spacing.lg,
      marginTop: spacing.lg,
    },
    inAppUsageTitle: {
      ...typography.textStyles.body.large,
      color: colors.blue[700],
      fontWeight: '700',
      marginBottom: spacing.md,
    },
    inAppUsageItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    inAppUsageScreen: {
      ...typography.textStyles.body.medium,
      color: colors.blue[600],
      fontWeight: '600',
    },
    inAppUsageTime: {
      ...typography.textStyles.body.medium,
      color: colors.blue[700],
      fontWeight: '700',
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
        <LinearGradient
          colors={[colors.primary[500], colors.primary[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerContainer}
        >
          <View style={styles.headerContent}>
            <Text style={styles.title}>Your Digital Journey</Text>
            <Text style={styles.subtitle}>Insights that empower your wellness</Text>
          </View>
        </LinearGradient>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {analyticsData && (
          <>
            {/* Hero Stats Card */}
            <Card style={styles.heroCard} padding="none">
              <View style={styles.heroStats}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>{formatTime(analyticsData.screenTime.today)}</Text>
                  <Text style={styles.heroStatLabel}>Today</Text>
                  <View style={styles.heroStatTrend}>
                    {analyticsData.screenTime.today < analyticsData.screenTime.yesterday ? (
                      <TrendingDown color={colors.success[500]} size={16} />
                    ) : (
                      <TrendingUp color={colors.error[500]} size={16} />
                    )}
                    <Text style={[
                      styles.trendText,
                      { color: analyticsData.screenTime.today < analyticsData.screenTime.yesterday ? colors.success[500] : colors.error[500] }
                    ]}>
                      vs yesterday
                    </Text>
                  </View>
                </View>
                
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>{formatTime(analyticsData.screenTime.weekAverage)}</Text>
                  <Text style={styles.heroStatLabel}>Week Avg</Text>
                </View>
                
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>{analyticsData.goals.achieved ? '✅' : '⚠️'}</Text>
                  <Text style={styles.heroStatLabel}>Goal Status</Text>
                </View>
              </View>

              {analyticsData.goals.achieved && (
                <View style={styles.achievementBadge}>
                  <Award color={colors.warning[600]} size={20} />
                  <Text style={styles.achievementText}>Daily goal achieved! 🎉</Text>
                </View>
              )}
            </Card>

            {/* Time Range Selector */}
            <View style={styles.timeRangeContainer}>
              {(['week', 'month', 'year'] as const).map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.timeRangeButton,
                    selectedTimeRange === range && styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setSelectedTimeRange(range)}
                >
                  <Text
                    style={[
                      styles.timeRangeText,
                      selectedTimeRange === range ? styles.timeRangeTextActive : styles.timeRangeTextInactive,
                    ]}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Weekly Chart */}
            <Card style={styles.card} padding="large">
              <Text style={styles.cardTitle}>Weekly Trend</Text>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg' }}
                style={styles.inspirationalImage}
                resizeMode="cover"
              />
              <LineChart
                data={analyticsData.weeklyData}
                width={screenWidth - 60}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </Card>

            {/* Screen Time Details */}
            <Card style={styles.card} padding="large">
              <Text style={styles.cardTitle}>Today's Breakdown</Text>
              <View style={styles.screenTimeContainer}>
                <Text style={styles.screenTimeValue}>
                  {formatTime(analyticsData.screenTime.today)}
                </Text>
                <View style={styles.comparisonContainer}>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>Yesterday</Text>
                    <Text style={styles.comparisonValue}>{formatTime(analyticsData.screenTime.yesterday)}</Text>
                  </View>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>Week Avg</Text>
                    <Text style={styles.comparisonValue}>{formatTime(analyticsData.screenTime.weekAverage)}</Text>
                  </View>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>Goal</Text>
                    <Text style={styles.comparisonValue}>{formatTime(analyticsData.goals.dailyLimit)}</Text>
                  </View>
                </View>
              </View>
              
              {/* Enhanced Goal Progress */}
              <View style={styles.goalContainer}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalText}>
                    Daily Goal Progress
                  </Text>
                  <Text style={[
                    styles.goalStatus,
                    analyticsData.goals.achieved ? styles.goalStatusAchieved : styles.goalStatusOverLimit
                  ]}>
                    {analyticsData.goals.achieved ? '🎯 Achieved' : '⚠️ Over Limit'}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: analyticsData.goals.achieved
                          ? colors.success[500]
                          : colors.error[500],
                        width: `${Math.min((analyticsData.goals.currentUsage / analyticsData.goals.dailyLimit) * 100, 100)}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* In-App Usage Breakdown */}
              {analyticsData.inAppUsage.totalMinutes > 0 && (
                <View style={styles.inAppUsageContainer}>
                  <Text style={styles.inAppUsageTitle}>
                    📱 RealityCheck Usage: {Math.floor(analyticsData.inAppUsage.totalMinutes / 60)}h {analyticsData.inAppUsage.totalMinutes % 60}m
                  </Text>
                  {Object.entries(analyticsData.inAppUsage.screenBreakdown).map(([screen, minutes]) => (
                    <View key={screen} style={styles.inAppUsageItem}>
                      <Text style={styles.inAppUsageScreen}>{screen}</Text>
                      <Text style={styles.inAppUsageTime}>{minutes}m</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>

            {/* Enhanced App Usage Breakdown */}
            <Card style={styles.card} padding="large">
              <View style={styles.appUsageHeader}>
                <Text style={styles.cardTitle}>App Usage Today</Text>
                <TouchableOpacity 
                  style={styles.logUsageButton}
                  onPress={() => setShowExternalModal(true)}
                >
                  <Plus color={colors.white} size={16} />
                  <Text style={styles.logUsageText}>Log Usage</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.appUsageContainer}>
                {analyticsData.appUsage.map((app, index) => (
                  <View key={index} style={styles.appUsageItem}>
                    <View style={styles.appUsageInfo}>
                      <View style={[styles.appColorIndicator, { backgroundColor: app.color }]} />
                      <View style={styles.appDetails}>
                        <Text style={styles.appName}>{app.name}</Text>
                        <Text style={styles.appSource}>
                          {app.source === 'in_app' ? '📱 In-app tracking' : '✏️ Manually logged'}
                        </Text>
                        <View style={styles.appProgressBar}>
                          <View style={[
                            styles.appProgressFill,
                            { backgroundColor: app.color, width: `${app.percentage}%` }
                          ]} />
                        </View>
                      </View>
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

      {/* External Usage Modal */}
      <ExternalUsageModal
        visible={showExternalModal}
        onClose={() => setShowExternalModal(false)}
        onSuccess={() => {
          refreshAnalytics();
        }}
      />
    </SafeAreaView>
  );
}
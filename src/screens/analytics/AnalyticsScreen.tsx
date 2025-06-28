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
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../../theme';
import { useApp } from '../../providers/AppProvider';

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
  insights: {
    title: string;
    description: string;
    type: 'positive' | 'warning' | 'neutral';
  }[];
}

const AnalyticsScreen: React.FC = () => {
  const { theme, colors } = useTheme();
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
        insights: [
          {
            title: 'Screen Time Increased',
            description: 'Your screen time is 15% higher than last week',
            type: 'warning',
          },
          {
            title: 'Productive Morning',
            description: 'You spent 2 hours on productivity apps this morning',
            type: 'positive',
          },
          {
            title: 'Weekend Pattern',
            description: 'Your weekend usage is typically 20% lower',
            type: 'neutral',
          },
        ],
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

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return colors.success[500];
      case 'warning': return colors.warning[500];
      default: return colors.text.secondary;
    }
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

  if (loading && !analyticsData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>
            Loading analytics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Screen Time Analytics
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Your digital wellness insights
          </Text>
        </View>

        {/* Time Range Selector */}
        <View style={[styles.timeRangeContainer, { backgroundColor: colors.surface.primary }]}>
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
            <View style={[styles.card, { backgroundColor: colors.surface.primary }]}>
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                Today's Screen Time
              </Text>
              <View style={styles.screenTimeContainer}>
                <Text style={[styles.screenTimeValue, { color: colors.primary[500] }]}>
                  {formatTime(analyticsData.screenTime.today)}
                </Text>
                <View style={styles.comparisonContainer}>
                  <Text style={[styles.comparisonText, { color: colors.text.secondary }]}>
                    Yesterday: {formatTime(analyticsData.screenTime.yesterday)}
                  </Text>
                  <Text style={[styles.comparisonText, { color: colors.text.secondary }]}>
                    Week avg: {formatTime(analyticsData.screenTime.weekAverage)}
                  </Text>
                </View>
              </View>
              
              {/* Goal Progress */}
              <View style={styles.goalContainer}>
                <View style={styles.goalHeader}>
                  <Text style={[styles.goalText, { color: colors.text.secondary }]}>
                    Daily Goal: {formatTime(analyticsData.goals.dailyLimit)}
                  </Text>
                  <Text style={[
                    styles.goalStatus,
                    { color: analyticsData.goals.achieved ? colors.success[500] : colors.warning[500] }
                  ]}>
                    {analyticsData.goals.achieved ? 'Achieved' : 'Over limit'}
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.gray[200] }]}>
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
            </View>

            {/* Weekly Chart */}
            <View style={[styles.card, { backgroundColor: colors.surface.primary }]}>
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                Weekly Trend
              </Text>
              <LineChart
                data={analyticsData.weeklyData}
                width={screenWidth - 60}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>

            {/* App Usage Breakdown */}
            <View style={[styles.card, { backgroundColor: colors.surface.primary }]}>
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                App Categories
              </Text>
              <View style={styles.appUsageContainer}>
                {analyticsData.appUsage.map((app, index) => (
                  <View key={index} style={styles.appUsageItem}>
                    <View style={styles.appUsageInfo}>
                      <View style={[styles.appColorIndicator, { backgroundColor: app.color }]} />
                      <Text style={[styles.appName, { color: colors.text.primary }]}>
                        {app.name}
                      </Text>
                    </View>
                    <View style={styles.appUsageStats}>
                      <Text style={[styles.appTime, { color: colors.text.primary }]}>
                        {formatTime(app.time)}
                      </Text>
                      <Text style={[styles.appPercentage, { color: colors.text.secondary }]}>
                        {app.percentage}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Insights */}
            <View style={[styles.card, { backgroundColor: colors.surface.primary }]}>
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                Insights
              </Text>
              <View style={styles.insightsContainer}>
                {analyticsData.insights.map((insight, index) => (
                  <View key={index} style={styles.insightItem}>
                    <View style={[
                      styles.insightIndicator,
                      { backgroundColor: getInsightColor(insight.type) }
                    ]} />
                    <View style={styles.insightContent}>
                      <Text style={[styles.insightTitle, { color: colors.text.primary }]}>
                        {insight.title}
                      </Text>
                      <Text style={[styles.insightDescription, { color: colors.text.secondary }]}>
                        {insight.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  screenTimeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  screenTimeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  comparisonText: {
    fontSize: 14,
  },
  goalContainer: {
    marginTop: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 14,
  },
  goalStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  appUsageContainer: {
    gap: 12,
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
    marginRight: 12,
  },
  appName: {
    fontSize: 16,
    fontWeight: '500',
  },
  appUsageStats: {
    alignItems: 'flex-end',
  },
  appTime: {
    fontSize: 16,
    fontWeight: '600',
  },
  appPercentage: {
    fontSize: 12,
  },
  insightsContainer: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AnalyticsScreen;
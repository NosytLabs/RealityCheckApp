import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import AIPersonalizationEngine from '../services/AIPersonalizationEngine';
import SmartNotificationEngine from '../services/SmartNotificationEngine';

interface GrowthMetrics {
  mindfulnessScore: number;
  consistencyStreak: number;
  weeklyProgress: number;
  monthlyProgress: number;
  totalRealityChecks: number;
  averageMoodImprovement: number;
  focusTimeToday: number;
  distractionReduction: number;
}

interface InsightCard {
  id: string;
  type: 'achievement' | 'pattern' | 'recommendation' | 'milestone';
  title: string;
  description: string;
  icon: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  action?: () => void;
}

interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: 'mindfulness' | 'focus' | 'mood' | 'habits';
  deadline: Date;
}

interface PersonalGrowthCenterProps {
  onNavigateToAnalytics: () => void;
  onNavigateToGoals: () => void;
  onNavigateToSettings: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const PersonalGrowthCenter: React.FC<PersonalGrowthCenterProps> = ({
  onNavigateToAnalytics,
  onNavigateToGoals,
  onNavigateToSettings,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<GrowthMetrics | null>(null);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [chartData, setChartData] = useState<any>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  const aiEngine = AIPersonalizationEngine.getInstance();
  const notificationEngine = SmartNotificationEngine.getInstance();

  useEffect(() => {
    if (user) {
      loadDashboardData();
      startAnimations();
    }
  }, [user, selectedTimeRange]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        loadGrowthMetrics(),
        loadPersonalizedInsights(),
        loadWeeklyGoals(),
        loadChartData(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGrowthMetrics = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      if (selectedTimeRange === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (selectedTimeRange === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }

      // Fetch reality checks data
      const { data: realityChecks, error: rcError } = await supabase
        .from('reality_checks')
        .select('*')
        .eq('user_id', user!.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (rcError) throw rcError;

      // Fetch routine check-ins data
      const { data: routineCheckins, error: routineError } = await supabase
        .from('routine_checkins')
        .select('*')
        .eq('user_id', user!.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (routineError) throw routineError;

      // Calculate metrics
      const totalRealityChecks = realityChecks?.length || 0;
      const totalRoutineCheckins = routineCheckins?.length || 0;
      
      // Calculate mood improvement
      const moodImprovements = realityChecks?.filter(rc => 
        rc.mood_after && rc.mood_before && rc.mood_after > rc.mood_before
      ) || [];
      const averageMoodImprovement = moodImprovements.length > 0 
        ? moodImprovements.reduce((sum, rc) => sum + (rc.mood_after - rc.mood_before), 0) / moodImprovements.length
        : 0;

      // Calculate consistency streak
      const consistencyStreak = calculateConsistencyStreak(realityChecks || [], routineCheckins || []);
      
      // Calculate mindfulness score (0-100)
      const mindfulnessScore = calculateMindfulnessScore(realityChecks || [], routineCheckins || []);
      
      // Calculate progress percentages
      const weeklyProgress = calculateProgress(realityChecks || [], 'week');
      const monthlyProgress = calculateProgress(realityChecks || [], 'month');
      
      // Mock data for focus time and distraction reduction
      const focusTimeToday = Math.floor(Math.random() * 180) + 60; // 60-240 minutes
      const distractionReduction = Math.floor(Math.random() * 30) + 10; // 10-40%

      setMetrics({
        mindfulnessScore,
        consistencyStreak,
        weeklyProgress,
        monthlyProgress,
        totalRealityChecks,
        averageMoodImprovement,
        focusTimeToday,
        distractionReduction,
      });

    } catch (error) {
      console.error('Error loading growth metrics:', error);
    }
  };

  // Helper functions for calculations
  const calculateConsistencyStreak = (realityChecks: any[], routineCheckins: any[]): number => {
    // Implementation for calculating consistency streak
    return Math.floor(Math.random() * 15) + 1; // Mock for now
  };

  const calculateMindfulnessScore = (realityChecks: any[], routineCheckins: any[]): number => {
    // Implementation for calculating mindfulness score
    return Math.floor(Math.random() * 40) + 60; // Mock score 60-100
  };

  const calculateProgress = (realityChecks: any[], period: string): number => {
    // Implementation for calculating progress percentage
    return Math.floor(Math.random() * 30) + 70; // Mock progress 70-100%
  };

  const loadPersonalizedInsights = async () => {
    // Implementation for loading AI-generated insights
    const mockInsights: InsightCard[] = [
      {
        id: '1',
        type: 'achievement',
        title: 'Consistency Champion',
        description: 'You\'ve maintained a 7-day reality check streak!',
        icon: 'trophy',
        priority: 'high',
        actionable: false,
      },
      {
        id: '2',
        type: 'pattern',
        title: 'Evening Reflection Pattern',
        description: 'You tend to do reality checks most often between 7-9 PM',
        icon: 'time',
        priority: 'medium',
        actionable: true,
        action: () => console.log('Navigate to schedule settings'),
      },
    ];
    setInsights(mockInsights);
  };

  const loadWeeklyGoals = async () => {
    // Implementation for loading weekly goals
    const mockGoals: WeeklyGoal[] = [
      {
        id: '1',
        title: 'Daily Reality Checks',
        description: 'Complete at least one reality check per day',
        target: 7,
        current: 5,
        unit: 'checks',
        category: 'mindfulness',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    ];
    setWeeklyGoals(mockGoals);
  };

  const loadChartData = async () => {
    // Implementation for loading chart data
    const mockChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [3, 5, 2, 4, 6, 3, 4],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      }],
    };
    setChartData(mockChartData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading your growth insights...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Personal Growth Center</Text>
          <Text style={styles.subtitle}>Your mindfulness journey insights</Text>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeSelector}>
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
                  selectedTimeRange === range && styles.timeRangeTextActive,
                ]}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metrics Cards */}
        {metrics && (
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{metrics.mindfulnessScore}</Text>
              <Text style={styles.metricLabel}>Mindfulness Score</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{metrics.consistencyStreak}</Text>
              <Text style={styles.metricLabel}>Day Streak</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{metrics.totalRealityChecks}</Text>
              <Text style={styles.metricLabel}>Reality Checks</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{metrics.focusTimeToday}m</Text>
              <Text style={styles.metricLabel}>Focus Time</Text>
            </View>
          </View>
        )}

        {/* Chart */}
        {chartData && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Weekly Progress</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        {/* Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>Personal Insights</Text>
          {insights.map((insight) => (
            <TouchableOpacity
              key={insight.id}
              style={styles.insightCard}
              onPress={insight.action}
              disabled={!insight.actionable}
            >
              <View style={styles.insightHeader}>
                <Ionicons name={insight.icon as any} size={24} color="#8641F4" />
                <Text style={styles.insightTitle}>{insight.title}</Text>
              </View>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Goals */}
        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>Weekly Goals</Text>
          {weeklyGoals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalDescription}>{goal.description}</Text>
              <View style={styles.goalProgress}>
                <View style={styles.goalProgressBar}>
                  <View
                    style={[
                      styles.goalProgressFill,
                      { width: `${(goal.current / goal.target) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.goalProgressText}>
                  {goal.current}/{goal.target} {goal.unit}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: '#8641F4',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: '#fff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8641F4',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  insightsContainer: {
    marginBottom: 20,
  },
  insightCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  goalsContainer: {
    marginBottom: 20,
  },
  goalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 12,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#8641F4',
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default PersonalGrowthCenter;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  AppState,
  AppStateStatus,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import { useApp } from '../providers/AppProvider';
import { useToast } from '../components/common/Toast';
import { supabase, checkSupabaseConnection } from '../lib/supabase';
import { X, Play, Pause, Square, Leaf, Sparkles, Award } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PlantState {
  level: number;
  growth: number;
  unlocked_plants: string[];
  current_plant: string;
}

interface TouchGrassSession {
  id?: string;
  start_time: string;
  duration_minutes: number;
  rewards_earned: number;
  plant_state_snapshot: PlantState;
  is_completed: boolean;
}

const plantTypes = [
  { id: 'sprout', name: 'Sprout', emoji: '🌱', unlockAt: 0 },
  { id: 'flower', name: 'Flower', emoji: '🌸', unlockAt: 30 },
  { id: 'tree', name: 'Tree', emoji: '🌳', unlockAt: 120 },
  { id: 'garden', name: 'Garden', emoji: '🌺', unlockAt: 300 },
  { id: 'forest', name: 'Forest', emoji: '🌲', unlockAt: 600 },
];

export default function TouchGrassStrollScreen() {
  const { colors, typography, spacing } = useTheme();
  const { user } = useApp();
  const { showToast } = useToast();
  const router = useRouter();

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTime, setSessionTime] = useState(0); // in seconds
  const [plantState, setPlantState] = useState<PlantState>({
    level: 1,
    growth: 0,
    unlocked_plants: ['sprout'],
    current_plant: 'sprout',
  });
  const [currentSession, setCurrentSession] = useState<TouchGrassSession | null>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);

  // Animations
  const plantScale = useSharedValue(1);
  const sparkleOpacity = useSharedValue(0);
  const backgroundShift = useSharedValue(0);
  const rewardPulse = useSharedValue(1);

  useEffect(() => {
    checkSupabaseConnection().then(setIsSupabaseAvailable);
    loadPlantState();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSessionTime(prev => {
          const newTime = prev + 1;
          
          // Trigger growth animation every 30 seconds
          if (newTime % 30 === 0) {
            triggerGrowthAnimation();
          }
          
          // Check for level ups every minute
          if (newTime % 60 === 0) {
            checkForLevelUp(Math.floor(newTime / 60));
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isActive]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (isActive && nextAppState === 'background') {
      // App going to background during session - this is good!
      triggerBackgroundBonus();
    }
  };

  const loadPlantState = async () => {
    if (!user || !isSupabaseAvailable) return;

    try {
      const { data, error } = await supabase
        .from('touch_grass_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setPlantState(data.plant_state_snapshot);
        
        // Calculate total minutes from all sessions
        const { data: allSessions } = await supabase
          .from('touch_grass_sessions')
          .select('duration_minutes')
          .eq('user_id', user.id)
          .eq('is_completed', true);

        const total = allSessions?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) || 0;
        setTotalMinutes(total);
      }
    } catch (error) {
      console.error('Error loading plant state:', error);
    }
  };

  const triggerGrowthAnimation = () => {
    plantScale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 8 })
    );
    
    sparkleOpacity.value = withSequence(
      withTiming(1, { duration: 500 }),
      withTiming(0, { duration: 1000 })
    );
  };

  const triggerBackgroundBonus = () => {
    showToast({
      type: 'success',
      title: '🌱 Background Bonus!',
      message: 'Your plant grows faster when you put your phone down!',
    });
    
    rewardPulse.value = withSequence(
      withSpring(1.3, { damping: 6 }),
      withSpring(1, { damping: 6 })
    );
  };

  const checkForLevelUp = (minutes: number) => {
    const newLevel = Math.floor(minutes / 10) + 1; // Level up every 10 minutes
    const newGrowth = (minutes % 10) * 10; // Growth percentage within level
    
    if (newLevel > plantState.level) {
      // Level up!
      const newPlant = plantTypes.find(p => p.unlockAt <= totalMinutes + minutes);
      if (newPlant && !plantState.unlocked_plants.includes(newPlant.id)) {
        setPlantState(prev => ({
          ...prev,
          level: newLevel,
          growth: newGrowth,
          unlocked_plants: [...prev.unlocked_plants, newPlant.id],
          current_plant: newPlant.id,
        }));
        
        showToast({
          type: 'success',
          title: `🎉 New Plant Unlocked!`,
          message: `You've unlocked the ${newPlant.name} ${newPlant.emoji}`,
        });
      } else {
        setPlantState(prev => ({
          ...prev,
          level: newLevel,
          growth: newGrowth,
        }));
      }
      
      triggerGrowthAnimation();
    } else {
      setPlantState(prev => ({
        ...prev,
        growth: newGrowth,
      }));
    }
  };

  const startSession = async () => {
    if (!user) return;

    const session: TouchGrassSession = {
      start_time: new Date().toISOString(),
      duration_minutes: 0,
      rewards_earned: 0,
      plant_state_snapshot: plantState,
      is_completed: false,
    };

    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase
          .from('touch_grass_sessions')
          .insert({
            user_id: user.id,
            ...session,
          })
          .select()
          .single();

        if (error) throw error;
        setCurrentSession(data);
      } else {
        setCurrentSession({ ...session, id: Date.now().toString() });
      }

      setIsActive(true);
      setIsPaused(false);
      setSessionTime(0);
      
      // Start background animation
      backgroundShift.value = withRepeat(
        withTiming(1, { duration: 10000 }),
        -1,
        true
      );

      showToast({
        type: 'success',
        title: '🌱 Stroll Started!',
        message: 'Put your phone down and enjoy the real world!',
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to start session',
      });
    }
  };

  const pauseSession = () => {
    setIsPaused(true);
    showToast({
      type: 'info',
      title: '⏸️ Session Paused',
      message: 'Take your time, resume when ready!',
    });
  };

  const resumeSession = () => {
    setIsPaused(false);
    showToast({
      type: 'success',
      title: '▶️ Session Resumed',
      message: 'Back to growing your digital garden!',
    });
  };

  const endSession = async () => {
    if (!currentSession || !user) return;

    const durationMinutes = Math.floor(sessionTime / 60);
    const rewardsEarned = Math.floor(durationMinutes * 1.5); // 1.5 points per minute

    try {
      if (isSupabaseAvailable && currentSession.id) {
        await supabase
          .from('touch_grass_sessions')
          .update({
            end_time: new Date().toISOString(),
            duration_minutes: durationMinutes,
            rewards_earned: rewardsEarned,
            plant_state_snapshot: plantState,
            is_completed: true,
          })
          .eq('id', currentSession.id);
      }

      setIsActive(false);
      setIsPaused(false);
      setCurrentSession(null);
      setTotalMinutes(prev => prev + durationMinutes);
      
      if (durationMinutes > 0) {
        showToast({
          type: 'success',
          title: '🎉 Session Complete!',
          message: `Great job! You earned ${rewardsEarned} seeds in ${durationMinutes} minutes!`,
        });
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to save session',
      });
    }
  };

  const getCurrentPlant = () => {
    return plantTypes.find(p => p.id === plantState.current_plant) || plantTypes[0];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Animated styles
  const plantAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: plantScale.value }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(backgroundShift.value, [0, 1], [0, -20])
    }],
  }));

  const rewardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rewardPulse.value }],
  }));

  const currentPlant = getCurrentPlant();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    closeButton: {
      padding: spacing.sm,
      backgroundColor: colors.gray[100],
      borderRadius: spacing.lg,
    },
    headerTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      fontWeight: '700',
    },
    placeholder: {
      width: 40,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
    },
    gardenContainer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    plantContainer: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: colors.success[50],
      borderWidth: 4,
      borderColor: colors.success[200],
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
      position: 'relative',
    },
    plantEmoji: {
      fontSize: 80,
    },
    sparkleContainer: {
      position: 'absolute',
      top: -10,
      right: -10,
    },
    levelBadge: {
      position: 'absolute',
      bottom: -10,
      backgroundColor: colors.warning[500],
      borderRadius: spacing.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    levelText: {
      ...typography.textStyles.caption.lg,
      color: colors.white,
      fontWeight: '700',
      marginLeft: spacing.xs,
    },
    plantName: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    growthBar: {
      width: 150,
      height: 8,
      backgroundColor: colors.gray[200],
      borderRadius: spacing.xs,
      overflow: 'hidden',
    },
    growthFill: {
      height: '100%',
      backgroundColor: colors.success[500],
      borderRadius: spacing.xs,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    statItem: {
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: spacing.lg,
      padding: spacing.lg,
      flex: 1,
      marginHorizontal: spacing.xs,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statValue: {
      ...typography.textStyles.heading.md,
      color: colors.primary[500],
      fontWeight: '800',
      marginBottom: spacing.xs,
    },
    statLabel: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      textAlign: 'center',
      fontWeight: '600',
    },
    timerContainer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    timer: {
      ...typography.textStyles.display.md,
      color: isActive ? colors.success[600] : colors.text.primary,
      fontWeight: '800',
      marginBottom: spacing.sm,
    },
    timerLabel: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.lg,
      marginBottom: spacing.xl,
    },
    controlButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    startButton: {
      backgroundColor: colors.success[500],
    },
    pauseButton: {
      backgroundColor: colors.warning[500],
    },
    stopButton: {
      backgroundColor: colors.error[500],
    },
    secondaryButton: {
      backgroundColor: colors.gray[400],
    },
    tipsContainer: {
      backgroundColor: colors.gray[50],
      borderRadius: spacing.lg,
      padding: spacing.lg,
      width: '100%',
    },
    tipsTitle: {
      ...typography.textStyles.heading.sm,
      color: colors.text.primary,
      marginBottom: spacing.md,
      fontWeight: '700',
      textAlign: 'center',
    },
    tip: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 22,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    unlockedPlantsContainer: {
      marginTop: spacing.lg,
    },
    unlockedPlantsTitle: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    plantsGrid: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    plantChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.success[100],
      borderRadius: spacing.lg,
    },
    plantChipEmoji: {
      fontSize: 16,
      marginRight: spacing.xs,
    },
    plantChipText: {
      ...typography.textStyles.caption.lg,
      color: colors.success[700],
      fontWeight: '600',
    },
  });

  const tips = [
    "🌱 Put your phone face down for bonus growth",
    "🌸 Your plant grows faster in background mode",
    "🌳 Take a real walk outside for maximum benefits",
    "🌺 Each minute offline earns you seeds",
    "🌲 Unlock new plants by spending more time offline",
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
        >
          <X color={colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Touch Grass Stroll</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Background */}
      <Animated.View style={[styles.backgroundImage, backgroundAnimatedStyle]}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg' }}
          style={{ width: screenWidth, height: screenHeight }}
          resizeMode="cover"
        />
      </Animated.View>

      <View style={styles.content}>
        {/* Garden Display */}
        <View style={styles.gardenContainer}>
          <Animated.View style={[styles.plantContainer, plantAnimatedStyle]}>
            <Text style={styles.plantEmoji}>{currentPlant.emoji}</Text>
            
            <Animated.View style={[styles.sparkleContainer, sparkleAnimatedStyle]}>
              <Sparkles color={colors.warning[500]} size={24} />
            </Animated.View>
            
            <Animated.View style={[styles.levelBadge, rewardAnimatedStyle]}>
              <Award color={colors.white} size={16} />
              <Text style={styles.levelText}>Lv. {plantState.level}</Text>
            </Animated.View>
          </Animated.View>
          
          <Text style={styles.plantName}>{currentPlant.name}</Text>
          <View style={styles.growthBar}>
            <View 
              style={[
                styles.growthFill, 
                { width: `${plantState.growth}%` }
              ]} 
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>Total Minutes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{plantState.unlocked_plants.length}</Text>
            <Text style={styles.statLabel}>Plants Unlocked</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.floor(sessionTime / 60)}</Text>
            <Text style={styles.statLabel}>Session Minutes</Text>
          </View>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{formatTime(sessionTime)}</Text>
          <Text style={styles.timerLabel}>
            {isActive ? (isPaused ? 'Paused' : 'Growing...') : 'Ready to grow'}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!isActive ? (
            <TouchableOpacity
              style={[styles.controlButton, styles.startButton]}
              onPress={startSession}
            >
              <Play color={colors.white} size={24} />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.controlButton, isPaused ? styles.startButton : styles.pauseButton]}
                onPress={isPaused ? resumeSession : pauseSession}
              >
                {isPaused ? (
                  <Play color={colors.white} size={24} />
                ) : (
                  <Pause color={colors.white} size={24} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, styles.stopButton]}
                onPress={endSession}
              >
                <Square color={colors.white} size={24} />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>🌱 Growing Tips</Text>
          {tips.map((tip, index) => (
            <Text key={index} style={styles.tip}>{tip}</Text>
          ))}
          
          {/* Unlocked Plants */}
          {plantState.unlocked_plants.length > 1 && (
            <View style={styles.unlockedPlantsContainer}>
              <Text style={styles.unlockedPlantsTitle}>Your Garden Collection</Text>
              <View style={styles.plantsGrid}>
                {plantState.unlocked_plants.map(plantId => {
                  const plant = plantTypes.find(p => p.id === plantId);
                  return plant ? (
                    <View key={plantId} style={styles.plantChip}>
                      <Text style={styles.plantChipEmoji}>{plant.emoji}</Text>
                      <Text style={styles.plantChipText}>{plant.name}</Text>
                    </View>
                  ) : null;
                })}
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
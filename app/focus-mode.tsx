import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../theme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { X, Play, Pause, RotateCcw, Zap } from 'lucide-react-native';

export default function FocusModeScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [duration, setDuration] = useState(parseInt(params.duration as string) || 25); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            Alert.alert(
              '🎉 Focus Session Complete!',
              'Amazing work! You just completed a focused session. Your brain is getting stronger!',
              [
                { text: 'Start Another', onPress: resetTimer },
                { text: 'Done', onPress: () => router.back() }
              ]
            );
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (newDuration: number) => {
    if (!isActive) {
      setDuration(newDuration);
      setTimeLeft(newDuration * 60);
    }
  };

  const durations = [15, 25, 45, 60]; // minutes

  const getTimerColor = () => {
    const percentage = (timeLeft / (duration * 60)) * 100;
    if (percentage > 50) return colors.success[500];
    if (percentage > 25) return colors.warning[500];
    return colors.error[500];
  };

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
      padding: spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    timerCard: {
      alignItems: 'center',
      marginBottom: spacing.xl,
      width: '100%',
      backgroundColor: colors.white,
      borderRadius: spacing.xl,
      padding: spacing.xl,
      shadowColor: getTimerColor(),
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    timerDisplay: {
      ...typography.textStyles.display.lg,
      color: getTimerColor(),
      fontWeight: '800',
      marginBottom: spacing.lg,
      fontSize: 72,
    },
    statusText: {
      ...typography.textStyles.heading.md,
      color: colors.text.secondary,
      marginBottom: spacing.xl,
      fontWeight: '600',
    },
    inspirationalImage: {
      width: '100%',
      height: 120,
      borderRadius: spacing.lg,
      marginBottom: spacing.lg,
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xl,
      gap: spacing.lg,
    },
    controlButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: getTimerColor(),
      shadowColor: getTimerColor(),
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    controlButtonSecondary: {
      backgroundColor: colors.gray[400],
      shadowColor: colors.gray[400],
    },
    durationsContainer: {
      width: '100%',
      marginBottom: spacing.xl,
    },
    durationsTitle: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.lg,
      fontWeight: '700',
    },
    durationsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    durationButton: {
      flex: 1,
      minWidth: '22%',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.sm,
      borderRadius: spacing.lg,
      borderWidth: 2,
      borderColor: colors.border.primary,
      alignItems: 'center',
      backgroundColor: colors.white,
    },
    durationButtonActive: {
      borderColor: colors.primary[500],
      backgroundColor: colors.primary[50],
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    durationButtonDisabled: {
      opacity: 0.5,
    },
    durationText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      fontWeight: '700',
    },
    durationTextActive: {
      color: colors.primary[500],
    },
    tipsCard: {
      width: '100%',
      backgroundColor: colors.gray[50],
      borderRadius: spacing.lg,
      padding: spacing.lg,
    },
    tipsTitle: {
      ...typography.textStyles.heading.sm,
      color: colors.text.primary,
      marginBottom: spacing.md,
      fontWeight: '700',
    },
    tipItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    tipBullet: {
      ...typography.textStyles.body.medium,
      color: colors.primary[500],
      marginRight: spacing.sm,
      marginTop: 2,
      fontWeight: '700',
    },
    tipText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      flex: 1,
      lineHeight: 20,
    },
    motivationText: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: spacing.lg,
    },
  });

  const tips = [
    'Put your phone in another room or drawer',
    'Close unnecessary browser tabs and apps',
    'Use noise-canceling headphones or calming music',
    'Take three deep breaths before starting',
    'Set a clear intention for this session',
  ];

  const motivationalMessages = [
    "You've got this! Every minute of focus builds your mental strength.",
    "Deep work is a superpower. You're developing yours right now.",
    "Focus is the gateway to flow state. Let's get there together.",
    "Your future self will thank you for this focused time.",
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
        <Text style={styles.headerTitle}>Focus Mode</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Timer Display */}
        <Card style={styles.timerCard} padding="none">
          <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>
          <Text style={styles.statusText}>
            {isActive ? (isPaused ? 'Paused - Take a breath' : 'Focusing... You\'re in the zone! 🔥') : 'Ready to focus and crush it?'}
          </Text>
          
          {!isActive && (
            <>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg' }}
                style={styles.inspirationalImage}
                resizeMode="cover"
              />
              <Text style={styles.motivationText}>
                {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
              </Text>
            </>
          )}
          
          {/* Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.controlButton, styles.controlButtonSecondary]}
              onPress={resetTimer}
            >
              <RotateCcw color={colors.white} size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={isActive ? pauseTimer : startTimer}
            >
              {isActive && !isPaused ? (
                <Pause color={colors.white} size={24} />
              ) : (
                <Play color={colors.white} size={24} />
              )}
            </TouchableOpacity>
          </View>
        </Card>

        {/* Duration Selection */}
        {!isActive && (
          <View style={styles.durationsContainer}>
            <Text style={styles.durationsTitle}>Choose Your Focus Duration</Text>
            <View style={styles.durationsGrid}>
              {durations.map((dur) => (
                <TouchableOpacity
                  key={dur}
                  style={[
                    styles.durationButton,
                    duration === dur && styles.durationButtonActive,
                    isActive && styles.durationButtonDisabled,
                  ]}
                  onPress={() => handleDurationChange(dur)}
                  disabled={isActive}
                >
                  <Text style={[
                    styles.durationText,
                    duration === dur && styles.durationTextActive,
                  ]}>
                    {dur}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Tips */}
        {!isActive && (
          <Card style={styles.tipsCard} padding="none">
            <Text style={styles.tipsTitle}>💡 Pro Focus Tips</Text>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../theme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { X, Play, Pause, RotateCcw } from 'lucide-react-native';

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
              'Great job! You completed your focus session.',
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
    },
    headerTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
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
    },
    timerDisplay: {
      ...typography.textStyles.display.lg,
      color: colors.primary[500],
      fontWeight: 'bold',
      marginBottom: spacing.lg,
      fontSize: 72,
    },
    statusText: {
      ...typography.textStyles.heading.md,
      color: colors.text.secondary,
      marginBottom: spacing.xl,
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
      backgroundColor: colors.primary[500],
    },
    controlButtonSecondary: {
      backgroundColor: colors.gray[300],
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
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: spacing.md,
      borderWidth: 2,
      borderColor: colors.border.primary,
      alignItems: 'center',
    },
    durationButtonActive: {
      borderColor: colors.primary[500],
      backgroundColor: colors.primary[50],
    },
    durationButtonDisabled: {
      opacity: 0.5,
    },
    durationText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    durationTextActive: {
      color: colors.primary[500],
    },
    tipsCard: {
      width: '100%',
    },
    tipsTitle: {
      ...typography.textStyles.heading.sm,
      color: colors.text.primary,
      marginBottom: spacing.md,
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
    },
    tipText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      flex: 1,
      lineHeight: 20,
    },
  });

  const tips = [
    'Put your phone in another room',
    'Close unnecessary browser tabs',
    'Use noise-canceling headphones',
    'Take deep breaths before starting',
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
        <Card style={styles.timerCard} padding="large">
          <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>
          <Text style={styles.statusText}>
            {isActive ? (isPaused ? 'Paused' : 'Focusing...') : 'Ready to focus'}
          </Text>
          
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
            <Text style={styles.durationsTitle}>Focus Duration</Text>
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
          <Card style={styles.tipsCard} padding="large">
            <Text style={styles.tipsTitle}>Focus Tips</Text>
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
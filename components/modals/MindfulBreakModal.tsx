import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { X, Heart, Sparkles } from 'lucide-react-native';

interface MindfulBreakModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
  type?: 'breathing' | 'reflection' | 'gratitude';
}

const { width: screenWidth } = Dimensions.get('window');

export const MindfulBreakModal: React.FC<MindfulBreakModalProps> = ({
  visible,
  onClose,
  onComplete,
  type = 'breathing',
}) => {
  const { colors, typography, spacing } = useTheme();
  const [phase, setPhase] = useState<'intro' | 'exercise' | 'complete'>('intro');
  const [countdown, setCountdown] = useState(0);
  const [exerciseStep, setExerciseStep] = useState(0);

  const breathingScale = useSharedValue(1);
  const sparkleOpacity = useSharedValue(0);
  const heartScale = useSharedValue(1);

  const exercises = {
    breathing: {
      title: 'Mindful Breathing',
      icon: <Heart color={colors.primary[500]} size={48} />,
      steps: [
        'Take a comfortable position',
        'Close your eyes or soften your gaze',
        'Breathe in slowly for 4 counts',
        'Hold for 4 counts',
        'Breathe out slowly for 6 counts',
        'Repeat this cycle 3 more times',
      ],
      duration: 60, // seconds
    },
    reflection: {
      title: 'Mindful Reflection',
      icon: <Sparkles color={colors.secondary[500]} size={48} />,
      steps: [
        'Pause and notice your current state',
        'What are you feeling right now?',
        'What thoughts are present?',
        'Accept whatever arises without judgment',
        'Take three deep breaths',
        'Set an intention for the next hour',
      ],
      duration: 45,
    },
    gratitude: {
      title: 'Gratitude Moment',
      icon: <Sparkles color={colors.warning[500]} size={48} />,
      steps: [
        'Think of something you\'re grateful for today',
        'Feel the warmth of that gratitude',
        'Think of someone who made you smile',
        'Appreciate a simple pleasure you enjoyed',
        'Notice something beautiful around you',
        'Carry this feeling forward',
      ],
      duration: 40,
    },
  };

  const currentExercise = exercises[type];

  useEffect(() => {
    if (phase === 'exercise') {
      // Start breathing animation
      breathingScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      // Sparkle animation
      sparkleOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );

      // Heart pulse
      heartScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );

      // Countdown timer
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setPhase('complete');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Step progression
      const stepInterval = setInterval(() => {
        setExerciseStep(prev => {
          const nextStep = prev + 1;
          if (nextStep >= currentExercise.steps.length) {
            clearInterval(stepInterval);
            return prev;
          }
          return nextStep;
        });
      }, currentExercise.duration * 1000 / currentExercise.steps.length);

      setCountdown(currentExercise.duration);

      return () => {
        clearInterval(timer);
        clearInterval(stepInterval);
      };
    }
  }, [phase]);

  const breathingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathingScale.value }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleStart = () => {
    setPhase('exercise');
    setExerciseStep(0);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
    setPhase('intro');
    setExerciseStep(0);
    setCountdown(0);
  };

  const handleSkip = () => {
    onClose();
    setPhase('intro');
    setExerciseStep(0);
    setCountdown(0);
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface.primary,
      borderRadius: spacing.xl,
      padding: spacing.xl,
      width: screenWidth * 0.9,
      maxWidth: 400,
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      padding: spacing.sm,
      backgroundColor: colors.gray[100],
      borderRadius: spacing.lg,
    },
    iconContainer: {
      marginBottom: spacing.xl,
      alignItems: 'center',
    },
    title: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.lg,
      fontWeight: '700',
    },
    description: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: spacing.xl,
    },
    breathingCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary[100],
      borderWidth: 3,
      borderColor: colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    breathingText: {
      ...typography.textStyles.body.medium,
      color: colors.primary[600],
      fontWeight: '600',
    },
    stepContainer: {
      backgroundColor: colors.gray[50],
      borderRadius: spacing.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      width: '100%',
    },
    stepText: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      textAlign: 'center',
      fontWeight: '600',
      lineHeight: 24,
    },
    countdownContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    countdownText: {
      ...typography.textStyles.heading.md,
      color: colors.primary[500],
      fontWeight: '700',
      marginLeft: spacing.sm,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: spacing.lg,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: spacing.lg,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
    },
    primaryButton: {
      backgroundColor: colors.primary[500],
    },
    secondaryButton: {
      backgroundColor: colors.gray[200],
    },
    buttonText: {
      ...typography.textStyles.button.md,
      fontWeight: '700',
    },
    primaryButtonText: {
      color: colors.white,
    },
    secondaryButtonText: {
      color: colors.text.secondary,
    },
    completeContainer: {
      alignItems: 'center',
    },
    completeIcon: {
      marginBottom: spacing.lg,
    },
    completeTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.success[600],
      textAlign: 'center',
      marginBottom: spacing.md,
      fontWeight: '700',
    },
    completeMessage: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: spacing.xl,
    },
    sparkleContainer: {
      position: 'absolute',
      top: -10,
      right: -10,
    },
  });

  const renderIntro = () => (
    <>
      <View style={styles.iconContainer}>
        {currentExercise.icon}
        <Animated.View style={[styles.sparkleContainer, sparkleAnimatedStyle]}>
          <Sparkles color={colors.warning[500]} size={24} />
        </Animated.View>
      </View>
      <Text style={styles.title}>{currentExercise.title}</Text>
      <Text style={styles.description}>
        Take a moment to pause and reconnect with yourself. This brief exercise will help you feel more centered and present.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSkip}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleStart}>
          <Text style={[styles.buttonText, styles.primaryButtonText]}>Begin</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderExercise = () => (
    <>
      <Animated.View style={[styles.breathingCircle, breathingAnimatedStyle]}>
        <Animated.View style={heartAnimatedStyle}>
          <Heart color={colors.primary[500]} size={32} />
        </Animated.View>
      </Animated.View>

      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</Text>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.stepText}>
          {currentExercise.steps[exerciseStep] || currentExercise.steps[currentExercise.steps.length - 1]}
        </Text>
      </View>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSkip}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>End Early</Text>
      </TouchableOpacity>
    </>
  );

  const renderComplete = () => (
    <View style={styles.completeContainer}>
      <Animated.View style={[styles.completeIcon, heartAnimatedStyle]}>
        <Sparkles color={colors.success[500]} size={64} />
      </Animated.View>
      <Text style={styles.completeTitle}>Well Done! ✨</Text>
      <Text style={styles.completeMessage}>
        You've taken a meaningful moment for yourself. Notice how you feel now compared to when you started.
      </Text>
      <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleComplete}>
        <Text style={[styles.buttonText, styles.primaryButtonText]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={handleSkip}>
            <X color={colors.text.secondary} size={20} />
          </TouchableOpacity>

          {phase === 'intro' && renderIntro()}
          {phase === 'exercise' && renderExercise()}
          {phase === 'complete' && renderComplete()}
        </View>
      </View>
    </Modal>
  );
};
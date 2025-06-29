import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Sparkles, Target, Zap, Shield } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  color: string;
}

export default function OnboardingScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to RealityCheck',
      subtitle: 'Your Digital Wellness Journey Starts Here',
      description: 'Take control of your screen time and build healthier digital habits with our AI-powered wellness platform.',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
      icon: <Sparkles color={colors.primary[500]} size={32} />,
      color: colors.primary[500],
    },
    {
      id: 'goals',
      title: 'Set Meaningful Goals',
      subtitle: 'Turn Dreams into Achievements',
      description: 'Create personalized goals for screen time, mindfulness, and productivity. Track your progress and celebrate wins.',
      image: 'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg',
      icon: <Target color={colors.success[500]} size={32} />,
      color: colors.success[500],
    },
    {
      id: 'focus',
      title: 'Master Your Focus',
      subtitle: 'Eliminate Distractions, Amplify Results',
      description: 'Use focus modes and app blocking to create distraction-free environments for deep work and mindful living.',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
      icon: <Zap color={colors.warning[500]} size={32} />,
      color: colors.warning[500],
    },
    {
      id: 'privacy',
      title: 'Your Data, Your Control',
      subtitle: 'Privacy-First Digital Wellness',
      description: 'All your data stays secure and private. You have complete control over what you share and with whom.',
      image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
      icon: <Shield color={colors.purple[500]} size={32} />,
      color: colors.purple[500],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGetStarted = () => {
    router.replace('/auth/register');
  };

  const handleSkip = () => {
    router.replace('/auth/login');
  };

  const currentStepData = steps[currentStep];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    skipButton: {
      padding: spacing.sm,
    },
    skipText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    progressDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: spacing.xs,
      backgroundColor: colors.gray[300],
    },
    progressDotActive: {
      backgroundColor: currentStepData.color,
      width: 24,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    heroImage: {
      width: screenWidth * 0.8,
      height: screenWidth * 0.6,
      borderRadius: spacing.xl,
      marginBottom: spacing.lg,
    },
    iconContainer: {
      backgroundColor: `${currentStepData.color}20`,
      borderRadius: spacing.xl,
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    textContainer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      ...typography.textStyles.heading['2xl'],
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
      fontWeight: '800',
    },
    subtitle: {
      ...typography.textStyles.heading.md,
      color: currentStepData.color,
      textAlign: 'center',
      marginBottom: spacing.lg,
      fontWeight: '700',
    },
    description: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 26,
      paddingHorizontal: spacing.md,
    },
    footer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    navigationButton: {
      flex: 1,
      marginHorizontal: spacing.sm,
    },
    primaryButton: {
      backgroundColor: currentStepData.color,
      shadowColor: currentStepData.color,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.border.primary,
    },
    featureHighlights: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: spacing.xl,
      paddingHorizontal: spacing.md,
    },
    featureHighlight: {
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: spacing.sm,
    },
    featureIcon: {
      backgroundColor: colors.gray[100],
      borderRadius: spacing.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    featureText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      textAlign: 'center',
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 60 }} />
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Image and Icon */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentStepData.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.iconContainer}>
              {currentStepData.icon}
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentStepData.title}</Text>
            <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
            <Text style={styles.description}>{currentStepData.description}</Text>
          </View>

          {/* Feature Highlights for last step */}
          {currentStep === steps.length - 1 && (
            <View style={styles.featureHighlights}>
              <View style={styles.featureHighlight}>
                <View style={styles.featureIcon}>
                  <Target color={colors.primary[500]} size={20} />
                </View>
                <Text style={styles.featureText}>Smart Goals</Text>
              </View>
              <View style={styles.featureHighlight}>
                <View style={styles.featureIcon}>
                  <Zap color={colors.warning[500]} size={20} />
                </View>
                <Text style={styles.featureText}>Focus Modes</Text>
              </View>
              <View style={styles.featureHighlight}>
                <View style={styles.featureIcon}>
                  <Shield color={colors.success[500]} size={20} />
                </View>
                <Text style={styles.featureText}>Privacy First</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {currentStep > 0 ? (
            <Button
              title="Previous"
              onPress={handlePrevious}
              variant="outline"
              style={[styles.navigationButton, styles.secondaryButton]}
            />
          ) : (
            <View style={styles.navigationButton} />
          )}
          
          <Button
            title={currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            style={[styles.navigationButton, styles.primaryButton]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
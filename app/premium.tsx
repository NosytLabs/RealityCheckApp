import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { X, Check, Star, Zap, Shield, ChartBar as BarChart3 } from 'lucide-react-native';

export default function PremiumScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();

  const features = [
    {
      icon: <BarChart3 color={colors.primary[500]} size={24} />,
      title: 'Advanced Analytics',
      description: 'Detailed insights into your digital habits with custom reports',
    },
    {
      icon: <Zap color={colors.warning[500]} size={24} />,
      title: 'Smart Interventions',
      description: 'AI-powered personalized recommendations and interventions',
    },
    {
      icon: <Shield color={colors.success[500]} size={24} />,
      title: 'Enhanced Privacy',
      description: 'Advanced privacy controls and data encryption',
    },
    {
      icon: <Star color={colors.purple[500]} size={24} />,
      title: 'Priority Support',
      description: '24/7 premium support and early access to new features',
    },
  ];

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$9.99',
      period: '/month',
      description: 'Perfect for trying out premium features',
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$79.99',
      period: '/year',
      description: 'Save 33% with annual billing',
      popular: true,
      savings: 'Save $40',
    },
  ];

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
    scrollContainer: {
      padding: spacing.lg,
    },
    heroSection: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    heroIcon: {
      marginBottom: spacing.lg,
    },
    heroTitle: {
      ...typography.textStyles.display.small,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    heroSubtitle: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    featuresSection: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    featureCard: {
      marginBottom: spacing.md,
    },
    featureContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    featureIcon: {
      marginRight: spacing.md,
      marginTop: spacing.xs,
    },
    featureText: {
      flex: 1,
    },
    featureTitle: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    featureDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    plansSection: {
      marginBottom: spacing.xl,
    },
    planCard: {
      marginBottom: spacing.md,
      borderWidth: 2,
      borderColor: colors.border.primary,
    },
    planCardPopular: {
      borderColor: colors.primary[500],
      position: 'relative',
    },
    popularBadge: {
      position: 'absolute',
      top: -12,
      left: spacing.lg,
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: 12,
    },
    popularBadgeText: {
      ...typography.textStyles.caption.lg,
      color: colors.white,
      fontWeight: '600',
    },
    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    planInfo: {
      flex: 1,
    },
    planName: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    planDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
    },
    planPricing: {
      alignItems: 'flex-end',
    },
    planPrice: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      fontWeight: 'bold',
    },
    planPeriod: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
    },
    planSavings: {
      ...typography.textStyles.caption.lg,
      color: colors.success[600],
      fontWeight: '600',
      marginTop: spacing.xs,
    },
    ctaSection: {
      marginBottom: spacing.lg,
    },
    ctaButton: {
      marginBottom: spacing.md,
    },
    termsText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 18,
    },
    termsLink: {
      color: colors.primary[500],
      textDecorationLine: 'underline',
    },
  });

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
        <Text style={styles.headerTitle}>Premium Features</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Star color={colors.primary[500]} size={64} />
          </View>
          <Text style={styles.heroTitle}>Unlock Your Full Potential</Text>
          <Text style={styles.heroSubtitle}>
            Get advanced insights, personalized recommendations, and premium support 
            to accelerate your digital wellness journey.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard} padding="large">
              <View style={styles.featureContent}>
                <View style={styles.featureIcon}>
                  {feature.icon}
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Plans Section */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              style={[
                styles.planCard,
                plan.popular && styles.planCardPopular
              ]} 
              padding="large"
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </View>
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>
                    {plan.price}
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                  </Text>
                  {plan.savings && (
                    <Text style={styles.planSavings}>{plan.savings}</Text>
                  )}
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Button
            title="Start Free Trial"
            onPress={() => console.log('Start trial')}
            fullWidth
            style={styles.ctaButton}
          />
          <Text style={styles.termsText}>
            7-day free trial, then {plans[1].price}/year. Cancel anytime.{'\n'}
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
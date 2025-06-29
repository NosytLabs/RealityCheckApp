import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { X, Check, Star, Zap, Shield, ChartBar as BarChart3, Crown, Sparkles } from 'lucide-react-native';

export default function PremiumScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();

  const features = [
    {
      icon: <BarChart3 color={colors.primary[500]} size={28} />,
      title: 'Advanced Analytics',
      description: 'Deep insights into your digital habits with AI-powered recommendations and custom reports',
      highlight: 'Most Popular',
    },
    {
      icon: <Zap color={colors.warning[500]} size={28} />,
      title: 'Smart Interventions',
      description: 'Personalized mindfulness prompts and reality checks powered by machine learning',
      highlight: 'New',
    },
    {
      icon: <Shield color={colors.success[500]} size={28} />,
      title: 'Enhanced Privacy',
      description: 'Advanced privacy controls, data encryption, and complete control over your information',
      highlight: null,
    },
    {
      icon: <Crown color={colors.purple[500]} size={28} />,
      title: 'Priority Support',
      description: '24/7 premium support, early access to features, and direct feedback channel',
      highlight: null,
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
      features: ['All premium features', 'Advanced analytics', 'Priority support'],
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$79.99',
      period: '/year',
      description: 'Best value - save 33% with annual billing',
      popular: true,
      savings: 'Save $40',
      features: ['Everything in Monthly', 'Exclusive yearly bonuses', 'Beta feature access'],
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
      background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
    },
    closeButton: {
      padding: spacing.sm,
      backgroundColor: colors.white,
      borderRadius: spacing.lg,
    },
    headerTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      fontWeight: '800',
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
      backgroundColor: colors.primary[50],
      borderRadius: spacing.lg,
      padding: spacing.xl,
    },
    heroIcon: {
      marginBottom: spacing.lg,
      backgroundColor: colors.primary[500],
      borderRadius: spacing.xl,
      padding: spacing.lg,
    },
    heroTitle: {
      ...typography.textStyles.display.small,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.md,
      fontWeight: '800',
    },
    heroSubtitle: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: spacing.lg,
    },
    heroImage: {
      width: '100%',
      height: 160,
      borderRadius: spacing.lg,
    },
    featuresSection: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.lg,
      textAlign: 'center',
      fontWeight: '700',
    },
    featureCard: {
      marginBottom: spacing.lg,
      borderRadius: spacing.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    featureContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: spacing.lg,
    },
    featureIcon: {
      marginRight: spacing.lg,
      backgroundColor: colors.gray[50],
      borderRadius: spacing.lg,
      padding: spacing.md,
    },
    featureText: {
      flex: 1,
    },
    featureHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    featureTitle: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '700',
      flex: 1,
    },
    featureHighlight: {
      backgroundColor: colors.warning[100],
      borderRadius: spacing.md,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      marginLeft: spacing.sm,
    },
    featureHighlightText: {
      ...typography.textStyles.caption.lg,
      color: colors.warning[700],
      fontWeight: '700',
    },
    featureDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 22,
    },
    plansSection: {
      marginBottom: spacing.xl,
    },
    planCard: {
      marginBottom: spacing.lg,
      borderWidth: 2,
      borderColor: colors.border.primary,
      borderRadius: spacing.lg,
      overflow: 'hidden',
    },
    planCardPopular: {
      borderColor: colors.primary[500],
      position: 'relative',
      transform: [{ scale: 1.02 }],
    },
    popularBadge: {
      position: 'absolute',
      top: -12,
      left: spacing.lg,
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    popularBadgeText: {
      ...typography.textStyles.caption.lg,
      color: colors.white,
      fontWeight: '700',
      marginLeft: spacing.xs,
    },
    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.lg,
      padding: spacing.lg,
      paddingBottom: 0,
    },
    planInfo: {
      flex: 1,
    },
    planName: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      marginBottom: spacing.xs,
      fontWeight: '700',
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
      fontWeight: '800',
    },
    planPeriod: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
    },
    planSavings: {
      ...typography.textStyles.caption.lg,
      color: colors.success[600],
      fontWeight: '700',
      marginTop: spacing.xs,
      backgroundColor: colors.success[100],
      borderRadius: spacing.md,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    planFeatures: {
      padding: spacing.lg,
      paddingTop: 0,
    },
    planFeature: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    planFeatureText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      marginLeft: spacing.sm,
      fontWeight: '500',
    },
    ctaSection: {
      marginBottom: spacing.lg,
    },
    ctaButton: {
      marginBottom: spacing.lg,
      backgroundColor: colors.primary[500],
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    revenueCatSection: {
      backgroundColor: colors.blue[50],
      borderRadius: spacing.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    revenueCatTitle: {
      ...typography.textStyles.heading.md,
      color: colors.blue[700],
      marginBottom: spacing.sm,
      fontWeight: '700',
    },
    revenueCatText: {
      ...typography.textStyles.body.medium,
      color: colors.blue[600],
      lineHeight: 22,
      marginBottom: spacing.md,
    },
    revenueCatLink: {
      ...typography.textStyles.body.medium,
      color: colors.blue[500],
      textDecorationLine: 'underline',
      fontWeight: '600',
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
      fontWeight: '600',
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
            <Star color={colors.white} size={48} />
          </View>
          <Text style={styles.heroTitle}>Unlock Your Full Potential</Text>
          <Text style={styles.heroSubtitle}>
            Get advanced insights, personalized recommendations, and premium support 
            to accelerate your digital wellness journey like never before.
          </Text>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard} padding="none">
              <View style={styles.featureContent}>
                <View style={styles.featureIcon}>
                  {feature.icon}
                </View>
                <View style={styles.featureText}>
                  <View style={styles.featureHeader}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    {feature.highlight && (
                      <View style={styles.featureHighlight}>
                        <Text style={styles.featureHighlightText}>{feature.highlight}</Text>
                      </View>
                    )}
                  </View>
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
              padding="none"
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Sparkles color={colors.white} size={16} />
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
              
              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.planFeature}>
                    <Check color={colors.success[500]} size={20} />
                    <Text style={styles.planFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </Card>
          ))}
        </View>

        {/* RevenueCat Integration Info */}
        <View style={styles.revenueCatSection}>
          <Text style={styles.revenueCatTitle}>💳 In-App Purchases & Subscriptions</Text>
          <Text style={styles.revenueCatText}>
            For the best mobile subscription experience, this app uses RevenueCat - the industry standard for mobile monetization. 
            To implement subscriptions, you'll need to export this project and set up RevenueCat locally.
          </Text>
          <Text style={styles.revenueCatLink}>
            📖 RevenueCat Expo Setup Guide: https://www.revenuecat.com/docs/getting-started/installation/expo
          </Text>
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
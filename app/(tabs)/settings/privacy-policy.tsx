import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { ArrowLeft } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();

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
      backgroundColor: colors.surface.primary,
    },
    headerTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      flex: 1,
      textAlign: 'center',
    },
    backButton: {
      padding: spacing.sm,
    },
    placeholder: {
      width: 60, // Same width as back button for centering
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    lastUpdated: {
      ...typography.textStyles.caption.md,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    sectionContent: {
      ...typography.textStyles.body.md,
      color: colors.text.secondary,
      lineHeight: 24,
      marginBottom: spacing.md,
    },
    bulletPoint: {
      ...typography.textStyles.body.md,
      color: colors.text.secondary,
      lineHeight: 24,
      marginLeft: spacing.md,
      marginBottom: spacing.sm,
    },
    contactInfo: {
      backgroundColor: colors.surface.secondary,
      padding: spacing.lg,
      borderRadius: spacing.md,
      marginTop: spacing.lg,
    },
    contactTitle: {
      ...typography.textStyles.heading.sm,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    contactText: {
      ...typography.textStyles.body.sm,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    emailLink: {
      color: colors.primary[500],
      textDecorationLine: 'underline',
    },
  });

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
          testID="privacy-policy-back-button"
        >
          <ArrowLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <Text style={styles.lastUpdated}>
          Last updated: January 2025
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.sectionContent}>
            Welcome to RealityCheck. We are committed to protecting your privacy and ensuring 
            the security of your personal information. This Privacy Policy explains how we 
            collect, use, disclose, and safeguard your information when you use our mobile 
            application and related services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.sectionContent}>
            We may collect the following types of information:
          </Text>
          <Text style={styles.bulletPoint}>
            • Personal Information: Name, email address, and profile information you provide
          </Text>
          <Text style={styles.bulletPoint}>
            • Usage Data: Information about how you use the app, including screen time data
          </Text>
          <Text style={styles.bulletPoint}>
            • Device Information: Device type, operating system, and app version
          </Text>
          <Text style={styles.bulletPoint}>
            • Analytics Data: Aggregated usage patterns to improve our services
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.sectionContent}>
            We use the collected information to:
          </Text>
          <Text style={styles.bulletPoint}>
            • Provide and maintain our services
          </Text>
          <Text style={styles.bulletPoint}>
            • Personalize your experience and provide relevant insights
          </Text>
          <Text style={styles.bulletPoint}>
            • Improve our app and develop new features
          </Text>
          <Text style={styles.bulletPoint}>
            • Send you important updates and notifications
          </Text>
          <Text style={styles.bulletPoint}>
            • Ensure the security and integrity of our services
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sharing and Disclosure</Text>
          <Text style={styles.sectionContent}>
            We do not sell, trade, or otherwise transfer your personal information to third 
            parties without your consent, except in the following circumstances:
          </Text>
          <Text style={styles.bulletPoint}>
            • With your explicit consent
          </Text>
          <Text style={styles.bulletPoint}>
            • To comply with legal obligations or protect our rights
          </Text>
          <Text style={styles.bulletPoint}>
            • With trusted service providers who assist in operating our app
          </Text>
          <Text style={styles.bulletPoint}>
            • In connection with a business transfer or acquisition
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.sectionContent}>
            We implement appropriate technical and organizational security measures to protect 
            your personal information against unauthorized access, alteration, disclosure, or 
            destruction. However, no method of transmission over the internet or electronic 
            storage is 100% secure.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.sectionContent}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>
            • Access and review your personal information
          </Text>
          <Text style={styles.bulletPoint}>
            • Request correction of inaccurate data
          </Text>
          <Text style={styles.bulletPoint}>
            • Request deletion of your personal information
          </Text>
          <Text style={styles.bulletPoint}>
            • Opt-out of certain data processing activities
          </Text>
          <Text style={styles.bulletPoint}>
            • Export your data in a portable format
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention</Text>
          <Text style={styles.sectionContent}>
            We retain your personal information only for as long as necessary to fulfill the 
            purposes outlined in this Privacy Policy, unless a longer retention period is 
            required or permitted by law. When we no longer need your information, we will 
            securely delete or anonymize it.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.sectionContent}>
            Our service is not intended for children under the age of 13. We do not knowingly 
            collect personal information from children under 13. If you are a parent or guardian 
            and believe your child has provided us with personal information, please contact us 
            immediately.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to This Policy</Text>
          <Text style={styles.sectionContent}>
            We may update this Privacy Policy from time to time. We will notify you of any 
            changes by posting the new Privacy Policy on this page and updating the "Last 
            updated" date. You are advised to review this Privacy Policy periodically for 
            any changes.
          </Text>
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <Text style={styles.contactText}>
            If you have any questions about this Privacy Policy or our data practices, 
            please contact us at:{'\n\n'}
            Email: <Text style={styles.emailLink}>privacy@realitycheck.app</Text>{'\n'}
            Address: RealityCheck Privacy Team{'\n'}
            123 Digital Wellness Street{'\n'}
            Tech City, TC 12345
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
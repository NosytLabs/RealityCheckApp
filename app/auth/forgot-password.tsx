import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';

export default function ForgotPasswordScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      ...typography.textStyles.heading['2xl'],
      color: colors.text.primary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    form: {
      marginBottom: spacing.lg,
    },
    inputContainer: {
      marginBottom: spacing.lg,
    },
    resetButton: {
      marginBottom: spacing.md,
    },
    backButton: {
      alignSelf: 'center',
    },
    successContainer: {
      alignItems: 'center',
      padding: spacing.xl,
    },
    successIcon: {
      fontSize: 64,
      marginBottom: spacing.lg,
    },
    successTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    successMessage: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: spacing.xl,
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    resendText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      marginRight: spacing.xs,
    },
    resendButton: {
      padding: 0,
    },
  });

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Card padding="large">
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>📧</Text>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successMessage}>
                We've sent a password reset link to {email}. Please check your email 
                and follow the instructions to reset your password.
              </Text>
              
              <Button
                title="Back to Login"
                onPress={handleBackToLogin}
                fullWidth
                testID="back-to-login-button"
              />
              
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the email?</Text>
                <Button
                  title="Resend"
                  onPress={handleResetPassword}
                  variant="ghost"
                  size="small"
                  style={styles.resendButton}
                  loading={isLoading}
                  testID="resend-button"
                />
              </View>
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
          </View>

          <Card padding="large">
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={error}
                  testID="email-input"
                />
              </View>

              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                loading={isLoading}
                fullWidth
                style={styles.resetButton}
                testID="reset-button"
              />
              
              <Button
                title="Back to Login"
                onPress={handleBackToLogin}
                variant="ghost"
                style={styles.backButton}
                testID="back-button"
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
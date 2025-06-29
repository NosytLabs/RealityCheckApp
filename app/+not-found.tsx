import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme';
import { Button } from '../components/common/Button';

export default function NotFoundScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    icon: {
      fontSize: 64,
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.textStyles.heading['2xl'],
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    message: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.icon}>🤔</Text>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.message}>
        The page you're looking for doesn't exist or has been moved.
      </Text>
      <Button
        title="Go Back Home"
        onPress={() => router.replace('/(tabs)')}
      />
    </SafeAreaView>
  );
}
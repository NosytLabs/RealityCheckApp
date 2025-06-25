import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { crossPlatformScreenTimeService as screenTimeService } from '../services/CrossPlatformScreenTimeService';

interface OnboardingPermissionsScreenProps {
  navigation: any;
}

interface Permission {
  id: string;
  title: string;
  description: string;
  icon: string;
  required: boolean;
  granted: boolean;
}

export const OnboardingPermissionsScreen: React.FC<OnboardingPermissionsScreenProps> = ({ 
  navigation 
}) => {
  const { colors, typography, spacing } = useTheme();
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'screen_time',
      title: 'Screen Time Access',
      description: 'Required to track your app usage and screen time data.',
      icon: '📱',
      required: true,
      granted: false,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Get gentle reminders and goal achievement celebrations.',
      icon: '🔔',
      required: false,
      granted: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const requestScreenTimePermission = async () => {
    try {
      setIsLoading(true);
      const hasPermission = await screenTimeService.requestPermissions();
      
      setPermissions(prev => prev.map(permission => 
        permission.id === 'screen_time' 
          ? { ...permission, granted: hasPermission }
          : permission
      ));
      
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          Platform.OS === 'ios' 
            ? 'Please enable Screen Time access in Settings > Screen Time > Share Across Devices to continue.'
            : 'Please enable Usage Access in Settings > Apps > Special Access > Usage Access to continue.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => screenTimeService.openSettings() }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to request screen time permission. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      // This would integrate with expo-notifications
      // For now, we'll simulate the permission request
      setPermissions(prev => prev.map(permission => 
        permission.id === 'notifications' 
          ? { ...permission, granted: true }
          : permission
      ));
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to request notification permission.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePermissionRequest = (permissionId: string) => {
    switch (permissionId) {
      case 'screen_time':
        requestScreenTimePermission();
        break;
      case 'notifications':
        requestNotificationPermission();
        break;
    }
  };

  const canContinue = () => {
    const requiredPermissions = permissions.filter(p => p.required);
    return requiredPermissions.every(p => p.granted);
  };

  const handleContinue = () => {
    if (canContinue()) {
      navigation.navigate('OnboardingGoals');
    } else {
      Alert.alert(
        'Required Permissions',
        'Please grant the required permissions to continue using RealityCheck.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Setup?',
      'You can always enable permissions later in Settings, but some features may not work properly.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => navigation.navigate('Dashboard') }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      ...typography.textStyles.display.small,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    permissionCard: {
      marginBottom: spacing.md,
    },
    permissionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    permissionIcon: {
      fontSize: 24,
      marginRight: spacing.md,
    },
    permissionTitleContainer: {
      flex: 1,
    },
    permissionTitle: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '600',
    },
    requiredBadge: {
      backgroundColor: colors.error[100],
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: spacing.sm,
    },
    requiredText: {
      ...typography.textStyles.caption,
      color: colors.error[700],
      fontSize: 10,
    },
    permissionDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      marginBottom: spacing.md,
      lineHeight: 20,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 12,
    },
    statusBadgeGranted: {
      backgroundColor: colors.success[100],
    },
    statusBadgeDenied: {
      backgroundColor: colors.border.secondary,
    },
    statusIcon: {
      fontSize: 12,
      marginRight: spacing.xs,
    },
    statusText: {
      ...typography.textStyles.caption,
      fontWeight: '500',
    },
    statusTextGranted: {
      color: colors.success[700],
    },
    statusTextDenied: {
      color: colors.text.secondary,
    },
    buttonContainer: {
      marginTop: spacing.xl,
      gap: spacing.md,
    },
    skipButton: {
      alignSelf: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Permissions Setup</Text>
          <Text style={styles.subtitle}>
            RealityCheck needs a few permissions to provide you with the best experience.
          </Text>
        </View>

        {permissions.map((permission) => (
          <Card key={permission.id} style={styles.permissionCard} padding="large">
            <View style={styles.permissionHeader}>
              <Text style={styles.permissionIcon}>{permission.icon}</Text>
              <View style={styles.permissionTitleContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.permissionTitle}>{permission.title}</Text>
                  {permission.required && (
                    <View style={styles.requiredBadge}>
                      <Text style={styles.requiredText}>REQUIRED</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            <Text style={styles.permissionDescription}>
              {permission.description}
            </Text>
            
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                permission.granted ? styles.statusBadgeGranted : styles.statusBadgeDenied
              ]}>
                <Text style={styles.statusIcon}>
                  {permission.granted ? '✓' : '○'}
                </Text>
                <Text style={[
                  styles.statusText,
                  permission.granted ? styles.statusTextGranted : styles.statusTextDenied
                ]}>
                  {permission.granted ? 'Granted' : 'Not granted'}
                </Text>
              </View>
              
              {!permission.granted && (
                <Button
                  title="Grant"
                  onPress={() => handlePermissionRequest(permission.id)}
                  variant="outline"
                  size="small"
                  loading={isLoading && permission.id === 'screen_time'}
                  testID={`grant-${permission.id}-button`}
                />
              )}
            </View>
          </Card>
        ))}

        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            fullWidth
            disabled={!canContinue()}
            testID="permissions-continue-button"
          />
          
          <Button
            title="Skip for now"
            onPress={handleSkip}
            variant="ghost"
            style={styles.skipButton}
            testID="permissions-skip-button"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingPermissionsScreen;
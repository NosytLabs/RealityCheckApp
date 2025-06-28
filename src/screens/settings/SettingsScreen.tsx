import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useApp } from '../../providers/AppProvider';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

const SettingsScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  const { user, signOut } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Feature Coming Soon', 'Account deletion will be available in a future update.');
          }
        }
      ]
    );
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: '👤',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon.'),
        },
        {
          id: 'premium',
          title: 'Premium Features',
          subtitle: 'Unlock advanced digital wellness tools',
          icon: '⭐',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Premium features will be available soon.'),
        },
      ],
    },
    {
      title: 'Digital Wellness',
      items: [
        {
          id: 'focus_mode',
          title: 'Focus Mode',
          subtitle: 'Block distracting apps during focus sessions',
          icon: '🎯',
          type: 'toggle',
          value: focusModeEnabled,
          onToggle: setFocusModeEnabled,
        },
        {
          id: 'app_limits',
          title: 'App Usage Limits',
          subtitle: 'Set daily time limits for specific apps',
          icon: '⏱️',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'App limits will be available soon.'),
        },
        {
          id: 'downtime',
          title: 'Scheduled Downtime',
          subtitle: 'Schedule regular breaks from your device',
          icon: '🌙',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Scheduled downtime will be available soon.'),
        },
        {
          id: 'interventions',
          title: 'Mindful Interventions',
          subtitle: 'Configure reality check prompts',
          icon: '🧘',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Intervention settings will be available soon.'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Receive reminders and updates',
          icon: '🔔',
          type: 'toggle',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'dark_mode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme for better night viewing',
          icon: '🌙',
          type: 'toggle',
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled,
        },
        {
          id: 'analytics',
          title: 'Usage Analytics',
          subtitle: 'Help improve the app with anonymous data',
          icon: '📊',
          type: 'toggle',
          value: analyticsEnabled,
          onToggle: setAnalyticsEnabled,
        },
      ],
    },
    {
      title: 'Support & Legal',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help with using RealityCheck',
          icon: '❓',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Help center will be available soon.'),
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'Learn how we protect your data',
          icon: '🔒',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Privacy policy will be available soon.'),
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          subtitle: 'Read our terms and conditions',
          icon: '📄',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Terms of service will be available soon.'),
        },
        {
          id: 'about',
          title: 'About RealityCheck',
          subtitle: 'Version 2.0.0',
          icon: 'ℹ️',
          type: 'navigation',
          onPress: () => Alert.alert(
            'About RealityCheck',
            'RealityCheck v2.0.0\n\nA digital wellness app designed to help you build a healthier relationship with technology.\n\n© 2025 RealityCheck'
          ),
        },
      ],
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'sign_out',
          title: 'Sign Out',
          subtitle: 'Sign out of your account',
          icon: '🚪',
          type: 'action',
          onPress: handleSignOut,
        },
        {
          id: 'delete_account',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account and data',
          icon: '🗑️',
          type: 'action',
          destructive: true,
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  const renderSettingsItem = (item: SettingsItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.settingsItem,
          { borderBottomColor: colors.border.primary }
        ]}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
        activeOpacity={item.type === 'toggle' ? 1 : 0.7}
      >
        <View style={styles.settingsItemLeft}>
          <Text style={styles.settingsIcon}>{item.icon}</Text>
          <View style={styles.settingsItemText}>
            <Text style={[
              styles.settingsItemTitle,
              { color: item.destructive ? colors.error[500] : colors.text.primary }
            ]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={[styles.settingsItemSubtitle, { color: colors.text.secondary }]}>
                {item.subtitle}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.settingsItemRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ 
                false: colors.gray[300], 
                true: colors.primary[200] 
              }}
              thumbColor={item.value ? colors.primary[500] : colors.gray[500]}
            />
          )}
          {item.type === 'navigation' && (
            <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (section: SettingsSection) => {
    return (
      <View key={section.title} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
          {section.title.toUpperCase()}
        </Text>
        <Card style={styles.sectionCard} padding="none">
          {section.items.map((item, index) => (
            <View key={item.id}>
              {renderSettingsItem(item)}
              {index < section.items.length - 1 && (
                <View style={[styles.separator, { backgroundColor: colors.border.primary }]} />
              )}
            </View>
          ))}
        </Card>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      padding: spacing.lg,
      paddingBottom: spacing.md,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.gray[200],
      marginBottom: spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 32,
      color: colors.text.secondary,
    },
    userName: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    userEmail: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
    },
    title: {
      ...typography.textStyles.heading['2xl'],
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    scrollContainer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.textStyles.caption.lg,
      fontWeight: '600',
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
      marginLeft: spacing.sm,
    },
    sectionCard: {
      overflow: 'hidden',
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      minHeight: 60,
    },
    settingsItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingsIcon: {
      fontSize: 20,
      marginRight: spacing.md,
      width: 24,
      textAlign: 'center',
    },
    settingsItemText: {
      flex: 1,
    },
    settingsItemTitle: {
      ...typography.textStyles.body.large,
      fontWeight: '500',
      marginBottom: 2,
    },
    settingsItemSubtitle: {
      ...typography.textStyles.body.medium,
      lineHeight: 18,
    },
    settingsItemRight: {
      marginLeft: spacing.md,
    },
    chevron: {
      fontSize: 20,
      fontWeight: '300',
    },
    separator: {
      height: 1,
      marginLeft: spacing.lg + 24 + spacing.md, // Icon width + margin
    },
    versionInfo: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    versionText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.tertiary,
    },
    appName: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || '👤'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map(renderSection)}
        
        {/* App Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.appName}>RealityCheck</Text>
          <Text style={styles.versionText}>Version 2.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
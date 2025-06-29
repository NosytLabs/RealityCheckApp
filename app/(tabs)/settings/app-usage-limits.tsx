import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { ArrowLeft, Plus, Clock, Smartphone } from 'lucide-react-native';

interface AppLimit {
  id: string;
  appName: string;
  icon: string;
  dailyLimit: number; // in minutes
  currentUsage: number; // in minutes
  enabled: boolean;
  category: string;
}

interface NewLimitForm {
  appName: string;
  dailyLimit: string;
  category: string;
}

export default function AppUsageLimitsScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();
  
  const [appLimits, setAppLimits] = useState<AppLimit[]>([
    {
      id: '1',
      appName: 'Instagram',
      icon: '📷',
      dailyLimit: 60,
      currentUsage: 45,
      enabled: true,
      category: 'Social Media',
    },
    {
      id: '2',
      appName: 'TikTok',
      icon: '🎵',
      dailyLimit: 30,
      currentUsage: 35,
      enabled: true,
      category: 'Entertainment',
    },
    {
      id: '3',
      appName: 'YouTube',
      icon: '📺',
      dailyLimit: 90,
      currentUsage: 25,
      enabled: false,
      category: 'Entertainment',
    },
    {
      id: '4',
      appName: 'Twitter',
      icon: '🐦',
      dailyLimit: 45,
      currentUsage: 20,
      enabled: true,
      category: 'Social Media',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLimit, setNewLimit] = useState<NewLimitForm>({
    appName: '',
    dailyLimit: '',
    category: 'Social Media',
  });

  const [globalSettings, setGlobalSettings] = useState({
    enableNotifications: true,
    blockAfterLimit: false,
    showWarningAt: 80, // percentage
  });

  const categories = ['Social Media', 'Entertainment', 'Productivity', 'Games', 'News', 'Other'];

  const handleToggleLimit = (id: string) => {
    setAppLimits(prev => 
      prev.map(limit => 
        limit.id === id 
          ? { ...limit, enabled: !limit.enabled }
          : limit
      )
    );
  };

  const handleUpdateLimit = (id: string, newLimitMinutes: number) => {
    setAppLimits(prev => 
      prev.map(limit => 
        limit.id === id 
          ? { ...limit, dailyLimit: newLimitMinutes }
          : limit
      )
    );
  };

  const handleAddLimit = () => {
    if (!newLimit.appName.trim() || !newLimit.dailyLimit.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const limitMinutes = parseInt(newLimit.dailyLimit);
    if (isNaN(limitMinutes) || limitMinutes <= 0) {
      Alert.alert('Error', 'Please enter a valid time limit in minutes.');
      return;
    }

    const newAppLimit: AppLimit = {
      id: Date.now().toString(),
      appName: newLimit.appName.trim(),
      icon: '📱',
      dailyLimit: limitMinutes,
      currentUsage: 0,
      enabled: true,
      category: newLimit.category,
    };

    setAppLimits(prev => [...prev, newAppLimit]);
    setShowAddModal(false);
    setNewLimit({
      appName: '',
      dailyLimit: '',
      category: 'Social Media',
    });

    Alert.alert('Success', `Limit added for ${newLimit.appName}`);
  };

  const handleRemoveLimit = (id: string) => {
    const limit = appLimits.find(l => l.id === id);
    Alert.alert(
      'Remove Limit',
      `Are you sure you want to remove the limit for ${limit?.appName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setAppLimits(prev => prev.filter(l => l.id !== id));
          }
        }
      ]
    );
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getUsagePercentage = (current: number, limit: number): number => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 100) return colors.error[500];
    if (percentage >= 80) return colors.warning[500];
    return colors.success[500];
  };

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
    addButton: {
      padding: spacing.sm,
    },
    scrollContainer: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    sectionDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    appLimitCard: {
      marginBottom: spacing.md,
    },
    appLimitHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    appInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    appIcon: {
      fontSize: 24,
      marginRight: spacing.md,
    },
    appDetails: {
      flex: 1,
    },
    appName: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    appCategory: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
    },
    usageInfo: {
      alignItems: 'flex-end',
    },
    usageText: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      fontWeight: '500',
    },
    limitText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
    },
    progressContainer: {
      marginBottom: spacing.md,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.gray[200],
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: spacing.sm,
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    progressInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progressPercentage: {
      ...typography.textStyles.caption.lg,
      fontWeight: '600',
    },
    limitActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    editLimitButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    editLimitText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
    },
    removeLimitButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    removeLimitText: {
      ...typography.textStyles.caption.lg,
      color: colors.error[500],
    },
    globalSettingsCard: {
      marginBottom: spacing.lg,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    settingRowLast: {
      borderBottomWidth: 0,
    },
    settingInfo: {
      flex: 1,
      marginRight: spacing.md,
    },
    settingTitle: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      fontWeight: '500',
      marginBottom: spacing.xs,
    },
    settingDescription: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      lineHeight: 18,
    },
    emptyState: {
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyStateIcon: {
      marginBottom: spacing.lg,
    },
    emptyStateTitle: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    emptyStateText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: colors.surface.primary,
      borderRadius: spacing.lg,
      padding: spacing.xl,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      marginBottom: spacing.sm,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: spacing.md,
      padding: spacing.md,
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      backgroundColor: colors.background.primary,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
    },
    modalButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: spacing.md,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.gray[200],
      marginRight: spacing.sm,
    },
    saveButton: {
      backgroundColor: colors.primary[500],
      marginLeft: spacing.sm,
    },
    modalButtonText: {
      ...typography.textStyles.button.md,
    },
    cancelButtonText: {
      color: colors.text.secondary,
    },
    saveButtonText: {
      color: colors.white,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Usage Limits</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowAddModal(true)}
        >
          <Plus color={colors.primary[500]} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily App Limits</Text>
          <Text style={styles.sectionDescription}>
            Set daily time limits for specific apps to help manage your screen time. 
            You'll receive notifications when you're approaching your limits.
          </Text>
        </View>

        {/* App Limits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your App Limits</Text>
          {appLimits.length > 0 ? (
            appLimits.map((limit) => {
              const usagePercentage = getUsagePercentage(limit.currentUsage, limit.dailyLimit);
              const usageColor = getUsageColor(usagePercentage);
              
              return (
                <Card key={limit.id} style={styles.appLimitCard} padding="large">
                  <View style={styles.appLimitHeader}>
                    <View style={styles.appInfo}>
                      <Text style={styles.appIcon}>{limit.icon}</Text>
                      <View style={styles.appDetails}>
                        <Text style={styles.appName}>{limit.appName}</Text>
                        <Text style={styles.appCategory}>{limit.category}</Text>
                      </View>
                    </View>
                    <View style={styles.usageInfo}>
                      <Text style={styles.usageText}>
                        {formatTime(limit.currentUsage)} / {formatTime(limit.dailyLimit)}
                      </Text>
                      <Switch
                        value={limit.enabled}
                        onValueChange={() => handleToggleLimit(limit.id)}
                        trackColor={{ 
                          false: colors.gray[300], 
                          true: colors.primary[200] 
                        }}
                        thumbColor={limit.enabled ? colors.primary[500] : colors.gray[500]}
                      />
                    </View>
                  </View>

                  {limit.enabled && (
                    <>
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill,
                              { 
                                backgroundColor: usageColor,
                                width: `${usagePercentage}%`
                              }
                            ]} 
                          />
                        </View>
                        <View style={styles.progressInfo}>
                          <Text style={[styles.progressPercentage, { color: usageColor }]}>
                            {Math.round(usagePercentage)}% used
                          </Text>
                          <Text style={styles.limitText}>
                            {limit.dailyLimit - limit.currentUsage > 0 
                              ? `${formatTime(limit.dailyLimit - limit.currentUsage)} remaining`
                              : 'Limit exceeded'
                            }
                          </Text>
                        </View>
                      </View>

                      <View style={styles.limitActions}>
                        <TouchableOpacity
                          style={styles.editLimitButton}
                          onPress={() => {
                            Alert.prompt(
                              'Edit Limit',
                              `Current limit: ${limit.dailyLimit} minutes`,
                              [
                                { text: 'Cancel', style: 'cancel' },
                                { 
                                  text: 'Update', 
                                  onPress: (value) => {
                                    const newLimit = parseInt(value || '0');
                                    if (!isNaN(newLimit) && newLimit > 0) {
                                      handleUpdateLimit(limit.id, newLimit);
                                    }
                                  }
                                }
                              ],
                              'plain-text',
                              limit.dailyLimit.toString()
                            );
                          }}
                        >
                          <Text style={styles.editLimitText}>Edit Limit</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.removeLimitButton}
                          onPress={() => handleRemoveLimit(limit.id)}
                        >
                          <Text style={styles.removeLimitText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </Card>
              );
            })
          ) : (
            <Card padding="large">
              <View style={styles.emptyState}>
                <Smartphone color={colors.text.secondary} size={48} style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateTitle}>No App Limits Set</Text>
                <Text style={styles.emptyStateText}>
                  Tap the + button to add your first app limit and start managing your screen time.
                </Text>
                <Button
                  title="Add App Limit"
                  onPress={() => setShowAddModal(true)}
                />
              </View>
            </Card>
          )}
        </View>

        {/* Global Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limit Settings</Text>
          <Card style={styles.globalSettingsCard} padding="large">
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Enable Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get notified when approaching your daily limits
                </Text>
              </View>
              <Switch
                value={globalSettings.enableNotifications}
                onValueChange={(value) => 
                  setGlobalSettings(prev => ({ ...prev, enableNotifications: value }))
                }
                trackColor={{ 
                  false: colors.gray[300], 
                  true: colors.primary[200] 
                }}
                thumbColor={globalSettings.enableNotifications ? colors.primary[500] : colors.gray[500]}
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Block After Limit</Text>
                <Text style={styles.settingDescription}>
                  Prevent app usage after reaching daily limit
                </Text>
              </View>
              <Switch
                value={globalSettings.blockAfterLimit}
                onValueChange={(value) => 
                  setGlobalSettings(prev => ({ ...prev, blockAfterLimit: value }))
                }
                trackColor={{ 
                  false: colors.gray[300], 
                  true: colors.primary[200] 
                }}
                thumbColor={globalSettings.blockAfterLimit ? colors.primary[500] : colors.gray[500]}
              />
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Add Limit Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add App Limit</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>App Name *</Text>
              <TextInput
                style={styles.input}
                value={newLimit.appName}
                onChangeText={(text) => setNewLimit(prev => ({ ...prev, appName: text }))}
                placeholder="e.g., Instagram, TikTok"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Daily Limit (minutes) *</Text>
              <TextInput
                style={styles.input}
                value={newLimit.dailyLimit}
                onChangeText={(text) => setNewLimit(prev => ({ ...prev, dailyLimit: text }))}
                placeholder="e.g., 60"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddLimit}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Add Limit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
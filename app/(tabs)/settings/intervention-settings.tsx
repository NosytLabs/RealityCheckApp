import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { ArrowLeft } from 'lucide-react-native';

interface InterventionSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  frequency: 'low' | 'medium' | 'high';
  type: 'time_based' | 'usage_based' | 'behavior_based';
}

export default function InterventionSettingsScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();
  
  const [interventions, setInterventions] = useState<InterventionSetting[]>([
    {
      id: 'reality_check',
      title: 'Reality Check Prompts',
      description: 'Gentle reminders to pause and reflect on your current activity',
      enabled: true,
      frequency: 'medium',
      type: 'time_based',
    },
    {
      id: 'mindful_breathing',
      title: 'Breathing Exercises',
      description: 'Guided breathing sessions when stress is detected',
      enabled: true,
      frequency: 'low',
      type: 'behavior_based',
    },
    {
      id: 'usage_alerts',
      title: 'Usage Limit Alerts',
      description: 'Notifications when approaching daily usage limits',
      enabled: false,
      frequency: 'high',
      type: 'usage_based',
    },
    {
      id: 'focus_reminders',
      title: 'Focus Session Reminders',
      description: 'Suggestions to start focused work sessions',
      enabled: true,
      frequency: 'medium',
      type: 'time_based',
    },
    {
      id: 'digital_detox',
      title: 'Digital Detox Suggestions',
      description: 'Recommendations for device-free activities',
      enabled: false,
      frequency: 'low',
      type: 'behavior_based',
    },
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    enableDuringFocus: false,
    enableDuringDowntime: true,
    adaptiveFrequency: true,
    respectDoNotDisturb: true,
  });

  const handleToggleIntervention = (id: string) => {
    setInterventions(prev => 
      prev.map(intervention => 
        intervention.id === id 
          ? { ...intervention, enabled: !intervention.enabled }
          : intervention
      )
    );
  };

  const handleFrequencyChange = (id: string, frequency: 'low' | 'medium' | 'high') => {
    setInterventions(prev => 
      prev.map(intervention => 
        intervention.id === id 
          ? { ...intervention, frequency }
          : intervention
      )
    );
  };

  const handleSaveSettings = () => {
    Alert.alert(
      'Settings Saved',
      'Your intervention preferences have been updated successfully.',
      [{ text: 'OK' }]
    );
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'This will reset all intervention settings to their default values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // Reset to default values
            setInterventions(prev => 
              prev.map(intervention => ({
                ...intervention,
                enabled: intervention.id === 'reality_check' || intervention.id === 'mindful_breathing' || intervention.id === 'focus_reminders',
                frequency: 'medium',
              }))
            );
            setGlobalSettings({
              enableDuringFocus: false,
              enableDuringDowntime: true,
              adaptiveFrequency: true,
              respectDoNotDisturb: true,
            });
            Alert.alert('Reset Complete', 'Settings have been reset to defaults.');
          }
        }
      ]
    );
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'low': return colors.success[500];
      case 'medium': return colors.warning[500];
      case 'high': return colors.error[500];
      default: return colors.text.secondary;
    }
  };

  const getFrequencyDescription = (frequency: string) => {
    switch (frequency) {
      case 'low': return 'Few interruptions';
      case 'medium': return 'Balanced approach';
      case 'high': return 'Frequent reminders';
      default: return '';
    }
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
    placeholder: {
      width: 60,
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
    interventionCard: {
      marginBottom: spacing.md,
    },
    interventionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    interventionInfo: {
      flex: 1,
      marginRight: spacing.md,
    },
    interventionTitle: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    interventionDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    frequencyContainer: {
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
    },
    frequencyLabel: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      fontWeight: '500',
      marginBottom: spacing.sm,
    },
    frequencyOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    frequencyOption: {
      flex: 1,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xs,
      borderRadius: spacing.md,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    frequencyOptionActive: {
      borderWidth: 2,
    },
    frequencyOptionText: {
      ...typography.textStyles.caption.lg,
      fontWeight: '600',
      marginBottom: 2,
    },
    frequencyOptionDescription: {
      ...typography.textStyles.caption.sm,
      textAlign: 'center',
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
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
    },
    resetButton: {
      flex: 1,
      marginRight: spacing.sm,
    },
    saveButton: {
      flex: 1,
      marginLeft: spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          testID="intervention-settings-back-button"
        >
          <ArrowLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mindful Interventions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Interventions</Text>
          <Text style={styles.sectionDescription}>
            Configure gentle reminders and mindful prompts to help you build healthier 
            digital habits. These interventions are designed to increase awareness without 
            being intrusive.
          </Text>
        </View>

        {/* Individual Interventions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intervention Types</Text>
          {interventions.map((intervention, index) => (
            <Card key={intervention.id} style={styles.interventionCard} padding="large">
              <View style={styles.interventionHeader}>
                <View style={styles.interventionInfo}>
                  <Text style={styles.interventionTitle}>{intervention.title}</Text>
                  <Text style={styles.interventionDescription}>
                    {intervention.description}
                  </Text>
                </View>
                <Switch
                  value={intervention.enabled}
                  onValueChange={() => handleToggleIntervention(intervention.id)}
                  trackColor={{ 
                    false: colors.gray[300], 
                    true: colors.primary[200] 
                  }}
                  thumbColor={intervention.enabled ? colors.primary[500] : colors.gray[500]}
                />
              </View>

              {intervention.enabled && (
                <View style={styles.frequencyContainer}>
                  <Text style={styles.frequencyLabel}>Frequency</Text>
                  <View style={styles.frequencyOptions}>
                    {(['low', 'medium', 'high'] as const).map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        style={[
                          styles.frequencyOption,
                          intervention.frequency === freq && {
                            ...styles.frequencyOptionActive,
                            borderColor: getFrequencyColor(freq),
                            backgroundColor: `${getFrequencyColor(freq)}10`,
                          }
                        ]}
                        onPress={() => handleFrequencyChange(intervention.id, freq)}
                      >
                        <Text style={[
                          styles.frequencyOptionText,
                          { color: intervention.frequency === freq ? getFrequencyColor(freq) : colors.text.secondary }
                        ]}>
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </Text>
                        <Text style={[
                          styles.frequencyOptionDescription,
                          { color: intervention.frequency === freq ? getFrequencyColor(freq) : colors.text.tertiary }
                        ]}>
                          {getFrequencyDescription(freq)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </Card>
          ))}
        </View>

        {/* Global Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Global Settings</Text>
          <Card style={styles.globalSettingsCard} padding="large">
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Enable During Focus Sessions</Text>
                <Text style={styles.settingDescription}>
                  Allow interventions during active focus sessions
                </Text>
              </View>
              <Switch
                value={globalSettings.enableDuringFocus}
                onValueChange={(value) => 
                  setGlobalSettings(prev => ({ ...prev, enableDuringFocus: value }))
                }
                trackColor={{ 
                  false: colors.gray[300], 
                  true: colors.primary[200] 
                }}
                thumbColor={globalSettings.enableDuringFocus ? colors.primary[500] : colors.gray[500]}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Enable During Downtime</Text>
                <Text style={styles.settingDescription}>
                  Show interventions during scheduled downtime periods
                </Text>
              </View>
              <Switch
                value={globalSettings.enableDuringDowntime}
                onValueChange={(value) => 
                  setGlobalSettings(prev => ({ ...prev, enableDuringDowntime: value }))
                }
                trackColor={{ 
                  false: colors.gray[300], 
                  true: colors.primary[200] 
                }}
                thumbColor={globalSettings.enableDuringDowntime ? colors.primary[500] : colors.gray[500]}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Adaptive Frequency</Text>
                <Text style={styles.settingDescription}>
                  Automatically adjust frequency based on your usage patterns
                </Text>
              </View>
              <Switch
                value={globalSettings.adaptiveFrequency}
                onValueChange={(value) => 
                  setGlobalSettings(prev => ({ ...prev, adaptiveFrequency: value }))
                }
                trackColor={{ 
                  false: colors.gray[300], 
                  true: colors.primary[200] 
                }}
                thumbColor={globalSettings.adaptiveFrequency ? colors.primary[500] : colors.gray[500]}
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Respect Do Not Disturb</Text>
                <Text style={styles.settingDescription}>
                  Pause interventions when Do Not Disturb is enabled
                </Text>
              </View>
              <Switch
                value={globalSettings.respectDoNotDisturb}
                onValueChange={(value) => 
                  setGlobalSettings(prev => ({ ...prev, respectDoNotDisturb: value }))
                }
                trackColor={{ 
                  false: colors.gray[300], 
                  true: colors.primary[200] 
                }}
                thumbColor={globalSettings.respectDoNotDisturb ? colors.primary[500] : colors.gray[500]}
              />
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Reset to Defaults"
            onPress={handleResetToDefaults}
            variant="outline"
            style={styles.resetButton}
            testID="reset-defaults-button"
          />
          <Button
            title="Save Settings"
            onPress={handleSaveSettings}
            style={styles.saveButton}
            testID="save-settings-button"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
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
import { ArrowLeft, Moon, Sun, Clock } from 'lucide-react-native';

interface DowntimeSchedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
  enabled: boolean;
  allowedApps: string[];
}

export default function ScheduledDowntimeScreen() {
  const { colors, typography, spacing } = useTheme();
  const router = useRouter();
  
  const [downtimeSchedules, setDowntimeSchedules] = useState<DowntimeSchedule[]>([
    {
      id: '1',
      name: 'Sleep Time',
      startTime: '22:00',
      endTime: '07:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      enabled: true,
      allowedApps: ['Phone', 'Messages', 'Clock'],
    },
    {
      id: '2',
      name: 'Work Focus',
      startTime: '09:00',
      endTime: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      enabled: false,
      allowedApps: ['Email', 'Calendar', 'Notes', 'Slack'],
    },
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    enableNotifications: true,
    showCountdown: true,
    allowEmergencyBypass: true,
    blockAllApps: false,
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayAbbreviations = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleToggleSchedule = (id: string) => {
    setDowntimeSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id 
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule
      )
    );
  };

  const handleEditSchedule = (id: string) => {
    Alert.alert('Coming Soon', 'Schedule editing will be available in a future update.');
  };

  const handleDeleteSchedule = (id: string) => {
    const schedule = downtimeSchedules.find(s => s.id === id);
    Alert.alert(
      'Delete Schedule',
      `Are you sure you want to delete "${schedule?.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setDowntimeSchedules(prev => prev.filter(s => s.id !== id));
          }
        }
      ]
    );
  };

  const handleAddSchedule = () => {
    Alert.alert('Coming Soon', 'Adding new schedules will be available in a future update.');
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDaysDisplay = (days: string[]): string => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && !days.includes('Saturday') && !days.includes('Sunday')) {
      return 'Weekdays';
    }
    if (days.length === 2 && days.includes('Saturday') && days.includes('Sunday')) {
      return 'Weekends';
    }
    return days.map(day => dayAbbreviations[daysOfWeek.indexOf(day)]).join(', ');
  };

  const getScheduleIcon = (name: string) => {
    if (name.toLowerCase().includes('sleep') || name.toLowerCase().includes('night')) {
      return <Moon color={colors.primary[500]} size={24} />;
    }
    if (name.toLowerCase().includes('work') || name.toLowerCase().includes('focus')) {
      return <Sun color={colors.warning[500]} size={24} />;
    }
    return <Clock color={colors.text.secondary} size={24} />;
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
    scheduleCard: {
      marginBottom: spacing.md,
    },
    scheduleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    scheduleInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    scheduleIcon: {
      marginRight: spacing.md,
    },
    scheduleDetails: {
      flex: 1,
    },
    scheduleName: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    scheduleTime: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    scheduleDays: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
    },
    scheduleActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
    },
    actionButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    actionButtonText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
    },
    deleteButton: {
      borderColor: colors.error[300],
    },
    deleteButtonText: {
      color: colors.error[500],
    },
    allowedApps: {
      marginTop: spacing.sm,
    },
    allowedAppsLabel: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    allowedAppsList: {
      ...typography.textStyles.caption.md,
      color: colors.text.tertiary,
      fontStyle: 'italic',
    },
    addScheduleCard: {
      alignItems: 'center',
      padding: spacing.xl,
      borderWidth: 2,
      borderColor: colors.border.primary,
      borderStyle: 'dashed',
    },
    addScheduleIcon: {
      marginBottom: spacing.md,
    },
    addScheduleTitle: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.sm,
    },
    addScheduleDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: spacing.lg,
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
        <Text style={styles.headerTitle}>Scheduled Downtime</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automatic Downtime</Text>
          <Text style={styles.sectionDescription}>
            Schedule regular breaks from your device to promote better sleep, focus, 
            and work-life balance. During downtime, only essential apps will be available.
          </Text>
        </View>

        {/* Downtime Schedules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Schedules</Text>
          {downtimeSchedules.length > 0 ? (
            <>
              {downtimeSchedules.map((schedule) => (
                <Card key={schedule.id} style={styles.scheduleCard} padding="large">
                  <View style={styles.scheduleHeader}>
                    <View style={styles.scheduleInfo}>
                      <View style={styles.scheduleIcon}>
                        {getScheduleIcon(schedule.name)}
                      </View>
                      <View style={styles.scheduleDetails}>
                        <Text style={styles.scheduleName}>{schedule.name}</Text>
                        <Text style={styles.scheduleTime}>
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </Text>
                        <Text style={styles.scheduleDays}>
                          {getDaysDisplay(schedule.days)}
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={schedule.enabled}
                      onValueChange={() => handleToggleSchedule(schedule.id)}
                      trackColor={{ 
                        false: colors.gray[300], 
                        true: colors.primary[200] 
                      }}
                      thumbColor={schedule.enabled ? colors.primary[500] : colors.gray[500]}
                    />
                  </View>

                  {schedule.enabled && (
                    <View style={styles.allowedApps}>
                      <Text style={styles.allowedAppsLabel}>Allowed apps:</Text>
                      <Text style={styles.allowedAppsList}>
                        {schedule.allowedApps.join(', ')}
                      </Text>
                    </View>
                  )}

                  <View style={styles.scheduleActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditSchedule(schedule.id)}
                    >
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteSchedule(schedule.id)}
                    >
                      <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
              
              {/* Add New Schedule */}
              <TouchableOpacity onPress={handleAddSchedule}>
                <Card style={styles.addScheduleCard} padding="none">
                  <Clock color={colors.text.secondary} size={32} style={styles.addScheduleIcon} />
                  <Text style={styles.addScheduleTitle}>Add New Schedule</Text>
                  <Text style={styles.addScheduleDescription}>
                    Create a custom downtime schedule for specific times and days
                  </Text>
                  <Button
                    title="Add Schedule"
                    onPress={handleAddSchedule}
                    variant="outline"
                  />
                </Card>
              </TouchableOpacity>
            </>
          ) : (
            <Card padding="large">
              <View style={styles.emptyState}>
                <Moon color={colors.text.secondary} size={48} style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateTitle}>No Schedules Set</Text>
                <Text style={styles.emptyStateText}>
                  Create your first downtime schedule to automatically limit device usage 
                  during specific times.
                </Text>
                <Button
                  title="Create Schedule"
                  onPress={handleAddSchedule}
                />
              </View>
            </Card>
          )}
        </View>

        {/* Global Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Downtime Settings</Text>
          <Card style={styles.globalSettingsCard} padding="large">
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Enable Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get notified when downtime is about to start
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

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Show Countdown</Text>
                <Text style={styles.settingDescription}>
                  Display countdown timer before downtime starts
                </Text>
              </View>
              <Switch
                value={globalSettings.showCountdown}
                onValueChange={(value) => 
                  setGlobalSettings(prev => ({ ...prev, showCountdown: value }))
                }
                trackColor={{ 
                  false: colors.gray[300], 
                  true: colors.primary[200] 
                }}
                thumbColor={globalSettings.showCountdown ? colors.primary[500] : colors.gray[500]}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Allow Emergency Bypass</Text>
                <Text style={styles.settingDescription}>
                  Allow bypassing downtime for emergency situations
                </Text>
              </View>
              <Switch
                value={globalSettings.allowEmergencyBypass}
                onValueChange={(value) => 
                  setGlobalSettings(prev => ({ ...prev, allowEmergencyBypass: value }))
                }
                trackColor={{ 
                  false: colors.gray[300], 
                  true: colors.primary[200] 
                }}
                thumbColor={globalSettings.allowEmergencyBypass ? colors.primary[500] : colors.gray[500]}
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Block All Apps</Text>
                <Text style={styles.settingDescription}>
                  Block all apps during downtime (except allowed apps)
                </Text>
              </View>
              <Switch
                value={globalSettings.blockAllApps}
                onValueChange={(value) => 
                  setGlobalSettings(prev => ({ ...prev, blockAllApps: value }))
                }
                trackColor={{ 
                  false: colors.gray[300], 
                  true: colors.primary[200] 
                }}
                thumbColor={globalSettings.blockAllApps ? colors.primary[500] : colors.gray[500]}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
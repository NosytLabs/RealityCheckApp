import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import { useInAppTracking } from '../../hooks/useInAppTracking';
import { useToast } from '../common/Toast';
import { X, Clock, Smartphone } from 'lucide-react-native';

interface ExternalUsageModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const popularApps = [
  { name: 'Instagram', icon: '📷', category: 'Social Media' },
  { name: 'TikTok', icon: '🎵', category: 'Entertainment' },
  { name: 'YouTube', icon: '📺', category: 'Entertainment' },
  { name: 'Twitter', icon: '🐦', category: 'Social Media' },
  { name: 'Facebook', icon: '👥', category: 'Social Media' },
  { name: 'WhatsApp', icon: '💬', category: 'Communication' },
  { name: 'Netflix', icon: '🎬', category: 'Entertainment' },
  { name: 'Spotify', icon: '🎧', category: 'Music' },
  { name: 'Gmail', icon: '📧', category: 'Productivity' },
  { name: 'Safari', icon: '🌐', category: 'Productivity' },
  { name: 'Chrome', icon: '🌐', category: 'Productivity' },
  { name: 'Games', icon: '🎮', category: 'Games' },
];

export const ExternalUsageModal: React.FC<ExternalUsageModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { colors, typography, spacing } = useTheme();
  const { logExternalUsage } = useInAppTracking();
  const { showToast } = useToast();
  
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [customApp, setCustomApp] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const appName = selectedApp || customApp.trim();
    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);

    if (!appName) {
      showToast({
        type: 'error',
        title: 'Missing App Name',
        message: 'Please select an app or enter a custom app name.',
      });
      return;
    }

    if (totalMinutes <= 0) {
      showToast({
        type: 'error',
        title: 'Invalid Duration',
        message: 'Please enter a valid time duration.',
      });
      return;
    }

    if (totalMinutes > 24 * 60) {
      showToast({
        type: 'error',
        title: 'Duration Too Long',
        message: 'Please enter a duration less than 24 hours.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await logExternalUsage(appName, totalMinutes);
      showToast({
        type: 'success',
        title: 'Usage Logged! 📊',
        message: `Added ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m for ${appName}`,
      });
      onSuccess();
      handleClose();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to log usage',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedApp('');
    setCustomApp('');
    setHours('');
    setMinutes('');
    onClose();
  };

  const formatTime = (h: string, m: string) => {
    const totalMinutes = (parseInt(h) || 0) * 60 + (parseInt(m) || 0);
    if (totalMinutes === 0) return '';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const styles = StyleSheet.create({
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
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      fontWeight: '700',
    },
    closeButton: {
      padding: spacing.sm,
      backgroundColor: colors.gray[100],
      borderRadius: spacing.lg,
    },
    description: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.md,
    },
    appsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    appChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.lg,
      borderWidth: 2,
      borderColor: colors.border.primary,
      backgroundColor: colors.white,
    },
    appChipSelected: {
      borderColor: colors.primary[500],
      backgroundColor: colors.primary[50],
    },
    appIcon: {
      fontSize: 16,
      marginRight: spacing.xs,
    },
    appName: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    appNameSelected: {
      color: colors.primary[600],
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
    timeInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    timeInput: {
      flex: 1,
      textAlign: 'center',
    },
    timeLabel: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      fontWeight: '600',
    },
    previewContainer: {
      backgroundColor: colors.gray[50],
      borderRadius: spacing.md,
      padding: spacing.md,
      marginTop: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewText: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      fontWeight: '600',
      marginLeft: spacing.sm,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: spacing.md,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.gray[200],
      marginRight: spacing.sm,
    },
    submitButton: {
      backgroundColor: colors.primary[500],
      marginLeft: spacing.sm,
    },
    buttonText: {
      ...typography.textStyles.button.md,
      fontWeight: '700',
    },
    cancelButtonText: {
      color: colors.text.secondary,
    },
    submitButtonText: {
      color: colors.white,
    },
    disabledButton: {
      opacity: 0.5,
    },
  });

  const totalTime = formatTime(hours, minutes);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Log App Usage</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X color={colors.text.secondary} size={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Manually log time spent on other apps to get a complete picture of your digital habits.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select App</Text>
              <View style={styles.appsGrid}>
                {popularApps.map((app) => (
                  <TouchableOpacity
                    key={app.name}
                    style={[
                      styles.appChip,
                      selectedApp === app.name && styles.appChipSelected,
                    ]}
                    onPress={() => {
                      setSelectedApp(selectedApp === app.name ? '' : app.name);
                      setCustomApp('');
                    }}
                  >
                    <Text style={styles.appIcon}>{app.icon}</Text>
                    <Text style={[
                      styles.appName,
                      selectedApp === app.name && styles.appNameSelected,
                    ]}>
                      {app.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Or Enter Custom App</Text>
              <TextInput
                style={styles.input}
                value={customApp}
                onChangeText={(text) => {
                  setCustomApp(text);
                  setSelectedApp('');
                }}
                placeholder="e.g., Reddit, Discord, etc."
                placeholderTextColor={colors.text.tertiary}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Time Spent</Text>
              <View style={styles.timeInputContainer}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={[styles.input, styles.timeInput]}
                    value={hours}
                    onChangeText={setHours}
                    placeholder="0"
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text style={[styles.timeLabel, { textAlign: 'center', marginTop: spacing.xs }]}>
                    Hours
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={[styles.input, styles.timeInput]}
                    value={minutes}
                    onChangeText={setMinutes}
                    placeholder="0"
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text style={[styles.timeLabel, { textAlign: 'center', marginTop: spacing.xs }]}>
                    Minutes
                  </Text>
                </View>
              </View>

              {totalTime && (
                <View style={styles.previewContainer}>
                  <Clock color={colors.primary[500]} size={20} />
                  <Text style={styles.previewText}>
                    Total: {totalTime}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                (isLoading || !totalTime || (!selectedApp && !customApp.trim())) && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={isLoading || !totalTime || (!selectedApp && !customApp.trim())}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {isLoading ? 'Logging...' : 'Log Usage'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
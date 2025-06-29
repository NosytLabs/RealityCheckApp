import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useOfflineTracking } from '../../hooks/useOfflineTracking';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Trophy, 
  Smartphone, 
  Shield, 
  Target,
  Zap,
  Award
} from 'lucide-react-native';

export default function OfflineScreen() {
  const { colors, typography, spacing } = useTheme();
  const {
    stats,
    activeSession,
    challenges,
    blockedApps,
    loading,
    error,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    refreshData,
    updateBlockedApp,
    joinChallenge,
  } = useOfflineTracking();

  const [refreshing, setRefreshing] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showBlockedAppsModal, setShowBlockedAppsModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDuration = (startTime: string, endTime?: string): string => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const minutes = Math.floor(diffMs / (1000 * 60));
    return formatTime(minutes);
  };

  const handleStartSession = async (duration?: number) => {
    try {
      await startSession(duration);
      Alert.alert(
        '🌿 Time Off Started',
        'Your offline session has begun. Selected apps are now blocked.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start session');
    }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;

    Alert.alert(
      'End Session',
      'Are you sure you want to end your offline session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          onPress: async () => {
            try {
              await endSession();
              const duration = formatDuration(activeSession.start_time, new Date().toISOString());
              Alert.alert(
                '🎉 Session Complete!',
                `Great job! You stayed offline for ${duration}.`,
                [{ text: 'Awesome!' }]
              );
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to end session');
            }
          },
        },
      ]
    );
  };

  const handleJoinChallenge = async (challenge: any) => {
    try {
      await joinChallenge(challenge.id);
      setShowChallengeModal(false);
      Alert.alert(
        '🏆 Challenge Accepted!',
        `You've joined "${challenge.title}". Good luck!`,
        [{ text: 'Let\'s Go!' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to join challenge');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return colors.success[500];
      case 'medium': return colors.warning[500];
      case 'hard': return colors.error[500];
      default: return colors.text.secondary;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
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
    title: {
      ...typography.textStyles.heading['2xl'],
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
    },
    scrollContainer: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    statCard: {
      width: '48%',
      marginBottom: spacing.md,
      alignItems: 'center',
    },
    statIcon: {
      marginBottom: spacing.sm,
    },
    statValue: {
      ...typography.textStyles.heading.lg,
      color: colors.primary[500],
      marginBottom: spacing.xs,
    },
    statLabel: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    activeSessionCard: {
      backgroundColor: colors.success[50],
      borderColor: colors.success[200],
      borderWidth: 2,
    },
    sessionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sessionStatus: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.success[500],
      marginRight: spacing.sm,
    },
    sessionStatusText: {
      ...typography.textStyles.body.large,
      color: colors.success[700],
      fontWeight: '600',
    },
    sessionDuration: {
      ...typography.textStyles.heading.xl,
      color: colors.success[700],
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    sessionControls: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.md,
    },
    controlButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: spacing.md,
      backgroundColor: colors.success[500],
    },
    controlButtonSecondary: {
      backgroundColor: colors.gray[300],
    },
    controlButtonText: {
      ...typography.textStyles.button.md,
      color: colors.white,
      marginLeft: spacing.sm,
    },
    startSessionCard: {
      alignItems: 'center',
    },
    startSessionIcon: {
      marginBottom: spacing.lg,
    },
    startSessionTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    startSessionDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    quickStartButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: spacing.lg,
    },
    quickStartButton: {
      flex: 1,
      marginHorizontal: spacing.xs,
      paddingVertical: spacing.md,
      borderRadius: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.primary,
      alignItems: 'center',
    },
    quickStartButtonActive: {
      backgroundColor: colors.primary[50],
      borderColor: colors.primary[500],
    },
    quickStartButtonText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      fontWeight: '500',
    },
    quickStartButtonTextActive: {
      color: colors.primary[500],
    },
    challengesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    challengeCard: {
      width: '48%',
      marginBottom: spacing.md,
    },
    challengeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    challengeDifficulty: {
      fontSize: 16,
    },
    challengeTitle: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.xs,
      flex: 1,
    },
    challengeDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 20,
      marginBottom: spacing.sm,
    },
    challengeReward: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    challengePoints: {
      ...typography.textStyles.caption.lg,
      color: colors.warning[600],
      fontWeight: '600',
    },
    challengeDuration: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
    },
    blockedAppsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    manageAppsButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    manageAppsText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
    },
    blockedAppsList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    blockedAppChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: colors.error[100],
      borderRadius: spacing.md,
    },
    blockedAppText: {
      ...typography.textStyles.caption.lg,
      color: colors.error[700],
      marginLeft: spacing.xs,
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
      maxHeight: '80%',
    },
    modalTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      marginBottom: spacing.lg,
      textAlign: 'center',
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
    joinButton: {
      backgroundColor: colors.primary[500],
      marginLeft: spacing.sm,
    },
    modalButtonText: {
      ...typography.textStyles.button.md,
    },
    cancelButtonText: {
      color: colors.text.secondary,
    },
    joinButtonText: {
      color: colors.white,
    },
    appItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    appItemLast: {
      borderBottomWidth: 0,
    },
    appInfo: {
      flex: 1,
    },
    appName: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      fontWeight: '500',
    },
    appIdentifier: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
    },
    errorText: {
      ...typography.textStyles.body.medium,
      color: colors.error[500],
      textAlign: 'center',
      marginBottom: spacing.md,
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
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.emptyState, { flex: 1, justifyContent: 'center' }]}>
          <Text style={[styles.emptyStateTitle, { color: colors.text.secondary }]}>
            Loading your time off data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Time Off</Text>
        <Text style={styles.subtitle}>
          Take breaks from technology and reconnect with the real world
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard} padding="medium">
              <Clock color={colors.primary[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>
                {formatTime(stats?.total_offline_minutes || 0)}
              </Text>
              <Text style={styles.statLabel}>Total Time Off</Text>
            </Card>

            <Card style={styles.statCard} padding="medium">
              <Target color={colors.success[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>{stats?.offline_session_count || 0}</Text>
              <Text style={styles.statLabel}>Sessions Completed</Text>
            </Card>

            <Card style={styles.statCard} padding="medium">
              <Zap color={colors.warning[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>{stats?.current_offline_streak || 0}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </Card>

            <Card style={styles.statCard} padding="medium">
              <Award color={colors.purple[500]} size={32} style={styles.statIcon} />
              <Text style={styles.statValue}>{stats?.longest_offline_streak || 0}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </Card>
          </View>
        </View>

        {/* Active Session or Start Session */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Session</Text>
          {activeSession ? (
            <Card style={[styles.activeSessionCard]} padding="large">
              <View style={styles.sessionHeader}>
                <View style={styles.sessionStatus}>
                  <View style={styles.statusDot} />
                  <Text style={styles.sessionStatusText}>
                    {activeSession.end_time ? 'Paused' : 'Active'}
                  </Text>
                </View>
                <Text style={styles.sessionDuration}>
                  {formatDuration(activeSession.start_time, activeSession.end_time)}
                </Text>
              </View>

              <View style={styles.sessionControls}>
                {!activeSession.end_time ? (
                  <>
                    <TouchableOpacity
                      style={[styles.controlButton, styles.controlButtonSecondary]}
                      onPress={pauseSession}
                    >
                      <Pause color={colors.white} size={20} />
                      <Text style={styles.controlButtonText}>Pause</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={handleEndSession}
                    >
                      <Square color={colors.white} size={20} />
                      <Text style={styles.controlButtonText}>End Session</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={resumeSession}
                    >
                      <Play color={colors.white} size={20} />
                      <Text style={styles.controlButtonText}>Resume</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.controlButton, styles.controlButtonSecondary]}
                      onPress={handleEndSession}
                    >
                      <Square color={colors.white} size={20} />
                      <Text style={styles.controlButtonText}>End Session</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Card>
          ) : (
            <Card padding="large" style={styles.startSessionCard}>
              <Leaf color={colors.primary[500]} size={64} style={styles.startSessionIcon} />
              <Text style={styles.startSessionTitle}>Start Your Time Off</Text>
              <Text style={styles.startSessionDescription}>
                Choose a duration and disconnect from distracting apps. 
                Focus on what matters most.
              </Text>

              <View style={styles.quickStartButtons}>
                <TouchableOpacity
                  style={styles.quickStartButton}
                  onPress={() => handleStartSession(15)}
                >
                  <Text style={styles.quickStartButtonText}>15 min</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickStartButton}
                  onPress={() => handleStartSession(30)}
                >
                  <Text style={styles.quickStartButtonText}>30 min</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickStartButton}
                  onPress={() => handleStartSession(60)}
                >
                  <Text style={styles.quickStartButtonText}>1 hour</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickStartButton}
                  onPress={() => handleStartSession(120)}
                >
                  <Text style={styles.quickStartButtonText}>2 hours</Text>
                </TouchableOpacity>
              </View>

              <Button
                title="Start Custom Session"
                onPress={() => handleStartSession()}
                fullWidth
              />
            </Card>
          )}
        </View>

        {/* Blocked Apps */}
        <View style={styles.section}>
          <View style={styles.blockedAppsHeader}>
            <Text style={styles.sectionTitle}>Blocked Apps</Text>
            <TouchableOpacity
              style={styles.manageAppsButton}
              onPress={() => setShowBlockedAppsModal(true)}
            >
              <Text style={styles.manageAppsText}>Manage</Text>
            </TouchableOpacity>
          </View>

          <Card padding="large">
            {blockedApps.filter(app => app.is_enabled && app.block_during_offline).length > 0 ? (
              <View style={styles.blockedAppsList}>
                {blockedApps
                  .filter(app => app.is_enabled && app.block_during_offline)
                  .map((app) => (
                    <View key={app.id} style={styles.blockedAppChip}>
                      <Shield color={colors.error[700]} size={14} />
                      <Text style={styles.blockedAppText}>{app.app_name}</Text>
                    </View>
                  ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Smartphone color={colors.text.secondary} size={48} style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateTitle}>No Apps Blocked</Text>
                <Text style={styles.emptyStateText}>
                  Configure which apps to block during your time off sessions.
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Challenges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Challenges</Text>
          {challenges.length > 0 ? (
            <View style={styles.challengesGrid}>
              {challenges.slice(0, 4).map((challenge) => (
                <TouchableOpacity
                  key={challenge.id}
                  onPress={() => {
                    setSelectedChallenge(challenge);
                    setShowChallengeModal(true);
                  }}
                >
                  <Card style={styles.challengeCard} padding="medium">
                    <View style={styles.challengeHeader}>
                      <Text style={styles.challengeDifficulty}>
                        {getDifficultyIcon(challenge.difficulty)}
                      </Text>
                    </View>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeDescription}>
                      {challenge.description}
                    </Text>
                    <View style={styles.challengeReward}>
                      <Text style={styles.challengePoints}>
                        +{challenge.points_reward} pts
                      </Text>
                      <Text style={styles.challengeDuration}>
                        {formatTime(challenge.duration_minutes)}
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Card padding="large">
              <View style={styles.emptyState}>
                <Trophy color={colors.text.secondary} size={48} style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateTitle}>No Challenges Available</Text>
                <Text style={styles.emptyStateText}>
                  Check back later for new challenges to test your focus.
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Challenge Modal */}
      <Modal
        visible={showChallengeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChallengeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedChallenge?.title}
            </Text>
            
            {selectedChallenge && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.challengeDescription, { textAlign: 'center', marginBottom: spacing.lg }]}>
                  {selectedChallenge.description}
                </Text>
                
                <View style={styles.challengeReward}>
                  <Text style={styles.challengePoints}>
                    Reward: +{selectedChallenge.points_reward} points
                  </Text>
                  <Text style={styles.challengeDuration}>
                    Duration: {formatTime(selectedChallenge.duration_minutes)}
                  </Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowChallengeModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.joinButton]}
                onPress={() => selectedChallenge && handleJoinChallenge(selectedChallenge)}
              >
                <Text style={[styles.modalButtonText, styles.joinButtonText]}>Join Challenge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Blocked Apps Modal */}
      <Modal
        visible={showBlockedAppsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBlockedAppsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Manage Blocked Apps</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {blockedApps.map((app, index) => (
                <View 
                  key={app.id} 
                  style={[
                    styles.appItem,
                    index === blockedApps.length - 1 && styles.appItemLast
                  ]}
                >
                  <View style={styles.appInfo}>
                    <Text style={styles.appName}>{app.app_name}</Text>
                    <Text style={styles.appIdentifier}>{app.app_identifier}</Text>
                  </View>
                  <Switch
                    value={app.is_enabled && app.block_during_offline}
                    onValueChange={(value) => updateBlockedApp(app.id, { 
                      is_enabled: value,
                      block_during_offline: value 
                    })}
                    trackColor={{ 
                      false: colors.gray[300], 
                      true: colors.primary[200] 
                    }}
                    thumbColor={app.is_enabled && app.block_during_offline ? colors.primary[500] : colors.gray[500]}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.joinButton]}
                onPress={() => setShowBlockedAppsModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.joinButtonText]}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
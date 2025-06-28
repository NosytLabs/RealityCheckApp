import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useApp } from '../../providers/AppProvider';

const { width: screenWidth } = Dimensions.get('window');

interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: 'screen_time' | 'mindfulness' | 'productivity' | 'wellness';
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
}

interface NewGoalForm {
  title: string;
  description: string;
  targetValue: string;
  unit: string;
  category: Goal['category'];
  deadline: string;
}

export const GoalsScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  const { user } = useApp();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | Goal['category']>('all');
  const [newGoal, setNewGoal] = useState<NewGoalForm>({
    title: '',
    description: '',
    targetValue: '',
    unit: 'minutes',
    category: 'screen_time',
    deadline: '',
  });

  const categories = [
    { key: 'all', label: 'All Goals', icon: '🎯', color: colors.primary[500] },
    { key: 'screen_time', label: 'Screen Time', icon: '📱', color: colors.blue[500] },
    { key: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: colors.green[500] },
    { key: 'productivity', label: 'Productivity', icon: '⚡', color: colors.orange[500] },
    { key: 'wellness', label: 'Wellness', icon: '💪', color: colors.purple[500] },
  ];

  // Mock data for demonstration
  const mockGoals: Goal[] = [
    {
      id: '1',
      title: 'Reduce Daily Screen Time',
      description: 'Limit daily screen time to 4 hours or less',
      targetValue: 240,
      currentValue: 180,
      unit: 'minutes',
      category: 'screen_time',
      deadline: '2025-02-15',
      isCompleted: false,
      createdAt: '2025-01-01',
    },
    {
      id: '2',
      title: 'Daily Meditation',
      description: 'Practice mindfulness meditation for 20 minutes daily',
      targetValue: 20,
      currentValue: 15,
      unit: 'minutes',
      category: 'mindfulness',
      deadline: '2025-01-31',
      isCompleted: false,
      createdAt: '2025-01-01',
    },
    {
      id: '3',
      title: 'Focus Sessions',
      description: 'Complete 5 focused work sessions per day',
      targetValue: 5,
      currentValue: 5,
      unit: 'sessions',
      category: 'productivity',
      deadline: '2025-01-30',
      isCompleted: true,
      createdAt: '2025-01-01',
    },
    {
      id: '4',
      title: 'Digital Detox Hours',
      description: 'Maintain 2 hours of device-free time daily',
      targetValue: 2,
      currentValue: 1.5,
      unit: 'hours',
      category: 'wellness',
      deadline: '2025-02-28',
      isCompleted: false,
      createdAt: '2025-01-01',
    },
  ];

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGoals(mockGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
      Alert.alert('Error', 'Failed to load goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  };

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getProgressColor = (percentage: number, isCompleted: boolean) => {
    if (isCompleted) return colors.success[500];
    if (percentage >= 80) return colors.success[500];
    if (percentage >= 50) return colors.warning[500];
    return colors.error[500];
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateGoal = () => {
    if (!newGoal.title.trim() || !newGoal.targetValue.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title.trim(),
      description: newGoal.description.trim(),
      targetValue: parseFloat(newGoal.targetValue),
      currentValue: 0,
      unit: newGoal.unit,
      category: newGoal.category,
      deadline: newGoal.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isCompleted: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setGoals(prev => [goal, ...prev]);
    setShowCreateModal(false);
    setNewGoal({
      title: '',
      description: '',
      targetValue: '',
      unit: 'minutes',
      category: 'screen_time',
      deadline: '',
    });

    Alert.alert('Success', 'Goal created successfully!');
  };

  const handleUpdateProgress = (goalId: string, newValue: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, currentValue: newValue };
        if (newValue >= goal.targetValue && !goal.isCompleted) {
          updatedGoal.isCompleted = true;
          Alert.alert('🎉 Congratulations!', `You've completed your goal: ${goal.title}`);
        }
        return updatedGoal;
      }
      return goal;
    }));
  };

  const renderGoalCard = (goal: Goal) => {
    const progress = getProgressPercentage(goal);
    const progressColor = getProgressColor(progress, goal.isCompleted);
    const daysRemaining = getDaysRemaining(goal.deadline);
    const category = categories.find(cat => cat.key === goal.category);

    return (
      <View key={goal.id} style={[styles.goalCard, { backgroundColor: colors.surface.primary }]}>
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleContainer}>
            <Text style={styles.goalCategory}>{category?.icon} {category?.label}</Text>
            <Text style={[styles.goalTitle, { color: colors.text.primary }]}>{goal.title}</Text>
            {goal.description ? (
              <Text style={[styles.goalDescription, { color: colors.text.secondary }]}>
                {goal.description}
              </Text>
            ) : null}
          </View>
          {goal.isCompleted && (
            <View style={[styles.completedBadge, { backgroundColor: colors.success[100] }]}>
              <Text style={[styles.completedText, { color: colors.success[700] }]}>✓ Completed</Text>
            </View>
          )}
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: colors.text.primary }]}>
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </Text>
            <Text style={[styles.progressPercentage, { color: progressColor }]}>
              {Math.round(progress)}%
            </Text>
          </View>
          
          <View style={[styles.progressBarContainer, { backgroundColor: colors.gray[200] }]}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  backgroundColor: progressColor,
                  width: `${progress}%`
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.goalFooter}>
          <Text style={[styles.deadlineText, { color: colors.text.secondary }]}>
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 
             daysRemaining === 0 ? 'Due today' : 
             `${Math.abs(daysRemaining)} days overdue`}
          </Text>
          
          {!goal.isCompleted && (
            <TouchableOpacity
              style={[styles.updateButton, { backgroundColor: colors.primary[500] }]}
              onPress={() => {
                Alert.prompt(
                  'Update Progress',
                  `Current: ${goal.currentValue} ${goal.unit}`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Update', 
                      onPress: (value) => {
                        const numValue = parseFloat(value || '0');
                        if (!isNaN(numValue) && numValue >= 0) {
                          handleUpdateProgress(goal.id, numValue);
                        }
                      }
                    }
                  ],
                  'plain-text',
                  goal.currentValue.toString()
                );
              }}
            >
              <Text style={[styles.updateButtonText, { color: colors.white }]}>Update</Text>
            </TouchableOpacity>
          )}
        </View>
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
    title: {
      ...typography.textStyles.heading['2xl'],
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      marginBottom: spacing.lg,
    },
    createButton: {
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: spacing.borderRadius.lg,
      alignSelf: 'flex-start',
    },
    createButtonText: {
      ...typography.textStyles.button.md,
      color: colors.white,
    },
    categoriesContainer: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    categoriesScroll: {
      paddingVertical: spacing.sm,
    },
    categoryChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.borderRadius.full,
      marginRight: spacing.sm,
      borderWidth: 1,
    },
    categoryChipActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    categoryChipInactive: {
      backgroundColor: 'transparent',
      borderColor: colors.border.primary,
    },
    categoryChipText: {
      ...typography.textStyles.body.medium,
      fontWeight: '500',
    },
    categoryChipTextActive: {
      color: colors.white,
    },
    categoryChipTextInactive: {
      color: colors.text.secondary,
    },
    goalsContainer: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    goalCard: {
      padding: spacing.lg,
      borderRadius: spacing.borderRadius.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    goalTitleContainer: {
      flex: 1,
      marginRight: spacing.md,
    },
    goalCategory: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    goalTitle: {
      ...typography.textStyles.heading.md,
      marginBottom: spacing.xs,
    },
    goalDescription: {
      ...typography.textStyles.body.medium,
      lineHeight: 20,
    },
    completedBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: spacing.borderRadius.md,
    },
    completedText: {
      ...typography.textStyles.caption.lg,
      fontWeight: '600',
    },
    progressSection: {
      marginBottom: spacing.md,
    },
    progressInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    progressText: {
      ...typography.textStyles.body.medium,
      fontWeight: '500',
    },
    progressPercentage: {
      ...typography.textStyles.body.medium,
      fontWeight: '600',
    },
    progressBarContainer: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      borderRadius: 4,
    },
    goalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deadlineText: {
      ...typography.textStyles.caption.lg,
    },
    updateButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.borderRadius.md,
    },
    updateButtonText: {
      ...typography.textStyles.button.sm,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyStateIcon: {
      fontSize: 64,
      marginBottom: spacing.lg,
    },
    emptyStateTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    emptyStateText: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
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
      borderRadius: spacing.borderRadius.lg,
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
      borderRadius: spacing.borderRadius.md,
      padding: spacing.md,
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      backgroundColor: colors.background.primary,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
    },
    modalButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: spacing.borderRadius.md,
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.emptyState, { justifyContent: 'center' }]}>
          <Text style={[styles.emptyStateTitle, { color: colors.text.secondary }]}>
            Loading your goals...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>
        <Text style={styles.subtitle}>
          Track your digital wellness journey with personalized goals
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>+ Create New Goal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryChip,
                selectedCategory === category.key 
                  ? styles.categoryChipActive 
                  : styles.categoryChipInactive
              ]}
              onPress={() => setSelectedCategory(category.key as any)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.key 
                  ? styles.categoryChipTextActive 
                  : styles.categoryChipTextInactive
              ]}>
                {category.icon} {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.goalsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredGoals.length > 0 ? (
          filteredGoals.map(renderGoalCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎯</Text>
            <Text style={styles.emptyStateTitle}>No Goals Yet</Text>
            <Text style={styles.emptyStateText}>
              Create your first goal to start tracking your digital wellness journey. 
              Set targets for screen time, mindfulness, productivity, and more.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Goal</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Goal Title *</Text>
                <TextInput
                  style={styles.input}
                  value={newGoal.title}
                  onChangeText={(text) => setNewGoal(prev => ({ ...prev, title: text }))}
                  placeholder="e.g., Reduce daily screen time"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newGoal.description}
                  onChangeText={(text) => setNewGoal(prev => ({ ...prev, description: text }))}
                  placeholder="Describe your goal..."
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Target Value *</Text>
                <TextInput
                  style={styles.input}
                  value={newGoal.targetValue}
                  onChangeText={(text) => setNewGoal(prev => ({ ...prev, targetValue: text }))}
                  placeholder="e.g., 240"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  style={styles.input}
                  value={newGoal.unit}
                  onChangeText={(text) => setNewGoal(prev => ({ ...prev, unit: text }))}
                  placeholder="e.g., minutes, hours, sessions"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreateGoal}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GoalsScreen;
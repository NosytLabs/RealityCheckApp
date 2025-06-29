import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useGoals } from '../../hooks/useGoals';
import { useToast } from '../../components/common/Toast';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

interface NewGoalForm {
  title: string;
  description: string;
  targetValue: string;
  targetDate: string;
}

export default function GoalsScreen() {
  const { colors, typography, spacing } = useTheme();
  const { goals, loading, error, createGoal, updateGoal, deleteGoal, refreshGoals } = useGoals();
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [newGoal, setNewGoal] = useState<NewGoalForm>({
    title: '',
    description: '',
    targetValue: '',
    targetDate: '',
  });

  const categories = [
    { key: 'all', label: 'All Goals', icon: '🎯', color: colors.primary[500] },
    { key: 'screen_time', label: 'Screen Time', icon: '📱', color: colors.blue[500] },
    { key: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: colors.green[500] },
    { key: 'productivity', label: 'Productivity', icon: '⚡', color: colors.orange[500] },
    { key: 'wellness', label: 'Wellness', icon: '💪', color: colors.purple[500] },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshGoals();
    setRefreshing(false);
  };

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.title.toLowerCase().includes(selectedCategory));

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
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

  const handleCreateGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.targetValue.trim()) {
      showToast({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    try {
      await createGoal({
        title: newGoal.title.trim(),
        description: newGoal.description.trim() || null,
        target_value: parseFloat(newGoal.targetValue),
        target_date: newGoal.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

      setShowCreateModal(false);
      setNewGoal({
        title: '',
        description: '',
        targetValue: '',
        targetDate: '',
      });

      showToast({
        type: 'success',
        title: 'Goal Created',
        message: 'Your new goal has been added successfully!',
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create goal',
      });
    }
  };

  const handleUpdateProgress = async (goalId: string, newValue: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const isCompleted = newValue >= goal.target_value;
      
      await updateGoal(goalId, {
        current_value: newValue,
        is_completed: isCompleted,
      });

      if (isCompleted && !goal.is_completed) {
        showToast({
          type: 'success',
          title: '🎉 Goal Completed!',
          message: `Congratulations on completing "${goal.title}"!`,
        });
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update goal',
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    
    showToast({
      type: 'warning',
      title: 'Delete Goal',
      message: `Are you sure you want to delete "${goal?.title}"?`,
      action: {
        label: 'Delete',
        onPress: async () => {
          try {
            await deleteGoal(goalId);
            showToast({
              type: 'success',
              title: 'Goal Deleted',
              message: 'The goal has been removed.',
            });
          } catch (error: any) {
            showToast({
              type: 'error',
              title: 'Error',
              message: error.message || 'Failed to delete goal',
            });
          }
        },
      },
    });
  };

  const renderGoalCard = (goal: any) => {
    const progress = getProgressPercentage(goal.current_value || 0, goal.target_value);
    const progressColor = getProgressColor(progress, goal.is_completed);
    const daysRemaining = getDaysRemaining(goal.target_date);
    const category = categories.find(cat => goal.title.toLowerCase().includes(cat.key)) || categories[0];

    return (
      <Card key={goal.id} style={styles.goalCard} padding="large">
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleContainer}>
            <Text style={[styles.goalCategory, { color: colors.text.secondary }]}>
              {category?.icon} {category?.label}
            </Text>
            <Text style={[styles.goalTitle, { color: colors.text.primary }]}>{goal.title}</Text>
            {goal.description ? (
              <Text style={[styles.goalDescription, { color: colors.text.secondary }]}>
                {goal.description}
              </Text>
            ) : null}
          </View>
          {goal.is_completed && (
            <View style={[styles.completedBadge, { backgroundColor: colors.success[100] }]}>
              <Text style={[styles.completedText, { color: colors.success[700] }]}>✓ Completed</Text>
            </View>
          )}
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: colors.text.primary }]}>
              {goal.current_value || 0} / {goal.target_value}
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
          
          <View style={styles.goalActions}>
            {!goal.is_completed && (
              <TouchableOpacity
                style={[styles.updateButton, { backgroundColor: colors.primary[500] }]}
                onPress={() => {
                  // Simple increment for demo - in real app, show input modal
                  const newValue = (goal.current_value || 0) + 1;
                  handleUpdateProgress(goal.id, newValue);
                }}
              >
                <Text style={[styles.updateButtonText, { color: colors.white }]}>+1</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.deleteButton, { borderColor: colors.error[300] }]}
              onPress={() => handleDeleteGoal(goal.id)}
            >
              <Text style={[styles.deleteButtonText, { color: colors.error[500] }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
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
      borderRadius: spacing.md,
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
      borderRadius: 20,
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
      borderRadius: spacing.md,
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
      flex: 1,
    },
    goalActions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    updateButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.md,
    },
    updateButtonText: {
      ...typography.textStyles.button.sm,
    },
    deleteButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.md,
      borderWidth: 1,
    },
    deleteButtonText: {
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
    errorText: {
      ...typography.textStyles.body.medium,
      color: colors.error[500],
      textAlign: 'center',
      marginBottom: spacing.md,
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
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
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
                <Text style={styles.label}>Target Date</Text>
                <TextInput
                  style={styles.input}
                  value={newGoal.targetDate}
                  onChangeText={(text) => setNewGoal(prev => ({ ...prev, targetDate: text }))}
                  placeholder="YYYY-MM-DD (optional)"
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
}
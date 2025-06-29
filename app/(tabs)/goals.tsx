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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useGoals } from '../../hooks/useGoals';
import { useToast } from '../../components/common/Toast';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Target, Plus, Zap, Award, Calendar, TrendingUp } from 'lucide-react-native';

interface NewGoalForm {
  title: string;
  description: string;
  targetValue: string;
  targetDate: string;
}

interface ProgressUpdateForm {
  goalId: string;
  currentValue: string;
}

export default function GoalsScreen() {
  const { colors, typography, spacing } = useTheme();
  const { goals, loading, error, createGoal, updateGoal, deleteGoal, refreshGoals } = useGoals();
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [newGoal, setNewGoal] = useState<NewGoalForm>({
    title: '',
    description: '',
    targetValue: '',
    targetDate: '',
  });
  const [progressUpdate, setProgressUpdate] = useState<ProgressUpdateForm>({
    goalId: '',
    currentValue: '',
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
    return colors.primary[500];
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
        title: 'Goal Created! 🎯',
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

  const handleUpdateProgress = async () => {
    if (!progressUpdate.currentValue.trim()) {
      showToast({
        type: 'error',
        title: 'Invalid Input',
        message: 'Please enter a valid progress value.',
      });
      return;
    }

    try {
      const goal = goals.find(g => g.id === progressUpdate.goalId);
      if (!goal) return;

      const newValue = parseFloat(progressUpdate.currentValue);
      const isCompleted = newValue >= goal.target_value;
      
      await updateGoal(progressUpdate.goalId, {
        current_value: newValue,
        is_completed: isCompleted,
      });

      setShowProgressModal(false);
      setProgressUpdate({ goalId: '', currentValue: '' });

      if (isCompleted && !goal.is_completed) {
        showToast({
          type: 'success',
          title: '🎉 Goal Completed!',
          message: `Amazing work on "${goal.title}"! You're crushing it!`,
        });
      } else {
        showToast({
          type: 'success',
          title: 'Progress Updated! 📈',
          message: 'Keep up the great momentum!',
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

  const openProgressModal = (goalId: string, currentValue: number) => {
    setProgressUpdate({
      goalId,
      currentValue: currentValue.toString(),
    });
    setShowProgressModal(true);
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
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryIcon}>{category?.icon}</Text>
              <Text style={[styles.categoryLabel, { color: category?.color }]}>{category?.label}</Text>
            </View>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            {goal.description ? (
              <Text style={styles.goalDescription}>{goal.description}</Text>
            ) : null}
          </View>
          {goal.is_completed && (
            <View style={styles.completedBadge}>
              <Award color={colors.warning[600]} size={20} />
              <Text style={styles.completedText}>Completed!</Text>
            </View>
          )}
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {goal.current_value || 0} / {goal.target_value}
            </Text>
            <Text style={[styles.progressPercentage, { color: progressColor }]}>
              {Math.round(progress)}%
            </Text>
          </View>
          
          <View style={styles.progressBarContainer}>
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

          <View style={styles.progressDetails}>
            <View style={styles.progressDetailItem}>
              <Calendar color={colors.text.secondary} size={16} />
              <Text style={styles.progressDetailText}>
                {daysRemaining > 0 ? `${daysRemaining} days left` : 
                 daysRemaining === 0 ? 'Due today' : 
                 `${Math.abs(daysRemaining)} days overdue`}
              </Text>
            </View>
            <View style={styles.progressDetailItem}>
              <TrendingUp color={progressColor} size={16} />
              <Text style={[styles.progressDetailText, { color: progressColor }]}>
                {progress >= 75 ? 'Great progress!' : progress >= 50 ? 'Keep going!' : 'Just getting started'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.goalActions}>
          {!goal.is_completed && (
            <TouchableOpacity
              style={[styles.actionButton, styles.updateButton]}
              onPress={() => openProgressModal(goal.id, goal.current_value || 0)}
            >
              <Zap color={colors.white} size={18} />
              <Text style={styles.updateButtonText}>Update Progress</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteGoal(goal.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
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
      background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
    },
    title: {
      ...typography.textStyles.heading['2xl'],
      color: colors.text.primary,
      marginBottom: spacing.sm,
      fontWeight: '800',
    },
    subtitle: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      marginBottom: spacing.lg,
    },
    heroCard: {
      marginHorizontal: spacing.lg,
      marginTop: -spacing.xl,
      marginBottom: spacing.lg,
      backgroundColor: colors.white,
      borderRadius: spacing.lg,
      padding: spacing.xl,
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: spacing.lg,
      alignSelf: 'flex-start',
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    createButtonText: {
      ...typography.textStyles.button.md,
      color: colors.white,
      marginLeft: spacing.sm,
      fontWeight: '700',
    },
    inspirationalImage: {
      width: '100%',
      height: 120,
      borderRadius: spacing.md,
      marginTop: spacing.md,
    },
    categoriesContainer: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    categoriesScroll: {
      paddingVertical: spacing.sm,
    },
    categoryChip: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: spacing.lg,
      marginRight: spacing.md,
      borderWidth: 2,
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    categoryChipActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    categoryChipInactive: {
      backgroundColor: colors.white,
      borderColor: colors.border.primary,
    },
    categoryChipText: {
      ...typography.textStyles.body.medium,
      fontWeight: '700',
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
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: spacing.lg,
      overflow: 'hidden',
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.lg,
    },
    goalTitleContainer: {
      flex: 1,
      marginRight: spacing.md,
    },
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gray[100],
      borderRadius: spacing.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      alignSelf: 'flex-start',
      marginBottom: spacing.sm,
    },
    categoryIcon: {
      fontSize: 16,
      marginRight: spacing.xs,
    },
    categoryLabel: {
      ...typography.textStyles.caption.lg,
      fontWeight: '700',
    },
    goalTitle: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      marginBottom: spacing.xs,
      fontWeight: '700',
    },
    goalDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 22,
    },
    completedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.warning[100],
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.lg,
    },
    completedText: {
      ...typography.textStyles.caption.lg,
      color: colors.warning[700],
      fontWeight: '700',
      marginLeft: spacing.xs,
    },
    progressSection: {
      marginBottom: spacing.lg,
    },
    progressInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    progressText: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '700',
    },
    progressPercentage: {
      ...typography.textStyles.body.large,
      fontWeight: '800',
    },
    progressBarContainer: {
      height: 12,
      backgroundColor: colors.gray[200],
      borderRadius: spacing.md,
      overflow: 'hidden',
      marginBottom: spacing.md,
    },
    progressBar: {
      height: '100%',
      borderRadius: spacing.md,
    },
    progressDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    progressDetailItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressDetailText: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
      fontWeight: '600',
    },
    goalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: spacing.md,
    },
    updateButton: {
      backgroundColor: colors.primary[500],
      flex: 1,
      marginRight: spacing.sm,
    },
    updateButtonText: {
      ...typography.textStyles.button.sm,
      color: colors.white,
      marginLeft: spacing.xs,
      fontWeight: '700',
    },
    deleteButton: {
      borderWidth: 1,
      borderColor: colors.error[300],
    },
    deleteButtonText: {
      ...typography.textStyles.button.sm,
      color: colors.error[500],
      fontWeight: '600',
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
      fontWeight: '700',
    },
    emptyStateText: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: spacing.xl,
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
      fontWeight: '700',
    },
    formGroup: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      marginBottom: spacing.sm,
      fontWeight: '600',
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
      fontWeight: '700',
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
        <Text style={styles.title}>Your Goals</Text>
        <Text style={styles.subtitle}>
          Turn dreams into achievements, one goal at a time
        </Text>
      </View>

      {/* Hero Card */}
      <Card style={styles.heroCard} padding="none">
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus color={colors.white} size={20} />
          <Text style={styles.createButtonText}>Create New Goal</Text>
        </TouchableOpacity>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg' }}
          style={styles.inspirationalImage}
          resizeMode="cover"
        />
      </Card>

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
              Ready to level up? Create your first goal and start your journey to digital wellness mastery!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Goal Modal */}
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

      {/* Progress Update Modal */}
      <Modal
        visible={showProgressModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProgressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Progress</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Progress *</Text>
              <TextInput
                style={styles.input}
                value={progressUpdate.currentValue}
                onChangeText={(text) => setProgressUpdate(prev => ({ ...prev, currentValue: text }))}
                placeholder="Enter current value"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowProgressModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateProgress}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
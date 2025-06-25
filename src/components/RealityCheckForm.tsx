import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { supabase } from '../config/supabase';
import { useUser } from '../hooks/useUser';
import MoodTracker, { MoodData } from './MoodTracker';
import MediaAttachmentComponent, { MediaAttachment } from './MediaAttachment';

interface RealityCheckFormProps {
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

interface RealityCheckData {
  trigger: string;
  emotion: string;
  thought: string;
  reality: string;
  action: string;
  mood_before?: number;
  mood_after?: number;
  tags?: string[];
}

const RealityCheckForm: React.FC<RealityCheckFormProps> = ({
  onSubmitSuccess,
  onCancel,
}) => {
  const { user } = useUser();
  const [formData, setFormData] = useState<RealityCheckData>({
    trigger: '',
    emotion: '',
    thought: '',
    reality: '',
    action: '',
    mood_before: undefined,
    mood_after: undefined,
    tags: [],
  });
  const [moodData, setMoodData] = useState<MoodData>({ before: null, after: null });
  const [showAfterMood, setShowAfterMood] = useState(false);
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<RealityCheckData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RealityCheckData> = {};

    if (!formData.trigger.trim()) {
      newErrors.trigger = 'Please describe what triggered this reality check';
    }
    if (!formData.emotion.trim()) {
      newErrors.emotion = 'Please describe your current emotion';
    }
    if (!formData.thought.trim()) {
      newErrors.thought = 'Please share your thoughts';
    }
    if (!formData.reality.trim()) {
      newErrors.reality = 'Please describe the reality of the situation';
    }
    if (!formData.action.trim()) {
      newErrors.action = 'Please describe what action you will take';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit a reality check');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('reality_checks')
        .insert([
          {
            user_id: user.id,
            trigger: formData.trigger.trim(),
            emotion: formData.emotion.trim(),
            thought: formData.thought.trim(),
            reality: formData.reality.trim(),
            action: formData.action.trim(),
            mood_before: moodData.before,
            mood_after: moodData.after,
            tags: formData.tags || [],
            is_private: false,
            attachments: attachments.map(att => ({
              type: att.type,
              uri: att.uri,
              duration: att.duration,
            })),
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      // Reset form
      setFormData({
        trigger: '',
        emotion: '',
        thought: '',
        reality: '',
        action: '',
        mood_before: undefined,
        mood_after: undefined,
        tags: [],
      });
      setMoodData({ before: null, after: null });
      setShowAfterMood(false);
      setAttachments([]);
      setErrors({});

      Alert.alert(
        'Success!',
        'Your reality check has been saved. Great job taking a moment to reflect!',
        [
          {
            text: 'OK',
            onPress: onSubmitSuccess,
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting reality check:', error);
      Alert.alert(
        'Error',
        'Failed to save your reality check. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof RealityCheckData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleMoodChange = (mood: MoodData) => {
    setMoodData(mood);
    setFormData(prev => ({
      ...prev,
      mood_before: mood.before || undefined,
      mood_after: mood.after || undefined,
    }));
  };

  const handleActionComplete = () => {
    // Show after-mood tracking when user completes the action field
    if (formData.action.trim() && !showAfterMood) {
      setShowAfterMood(true);
    }
  };

  const handleAddAttachment = (attachment: Omit<MediaAttachment, 'id' | 'timestamp'>) => {
    const newAttachment: MediaAttachment = {
      ...attachment,
      id: `attachment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setAttachments(prev => [...prev, newAttachment]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Reality Check</Text>
        <Text style={styles.subtitle}>
          Take a moment to reflect on your current situation
        </Text>
      </View>

      <View style={styles.form}>
        {/* Mood Tracking */}
        <MoodTracker
          onMoodChange={handleMoodChange}
          initialMood={moodData}
          showAfterMood={showAfterMood}
        />

        {/* Trigger Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>What triggered this reality check? *</Text>
          <TextInput
            style={[styles.input, errors.trigger && styles.inputError]}
            value={formData.trigger}
            onChangeText={(value) => updateField('trigger', value)}
            placeholder="e.g., Feeling overwhelmed by social media..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {errors.trigger && (
            <Text style={styles.errorText}>{errors.trigger}</Text>
          )}
        </View>

        {/* Emotion Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>How are you feeling right now? *</Text>
          <TextInput
            style={[styles.input, errors.emotion && styles.inputError]}
            value={formData.emotion}
            onChangeText={(value) => updateField('emotion', value)}
            placeholder="e.g., Anxious, stressed, overwhelmed..."
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
          {errors.emotion && (
            <Text style={styles.errorText}>{errors.emotion}</Text>
          )}
        </View>

        {/* Thought Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>What thoughts are going through your mind? *</Text>
          <TextInput
            style={[styles.input, errors.thought && styles.inputError]}
            value={formData.thought}
            onChangeText={(value) => updateField('thought', value)}
            placeholder="e.g., I need to check my phone constantly..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {errors.thought && (
            <Text style={styles.errorText}>{errors.thought}</Text>
          )}
        </View>

        {/* Reality Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>What's the reality of this situation? *</Text>
          <TextInput
            style={[styles.input, errors.reality && styles.inputError]}
            value={formData.reality}
            onChangeText={(value) => updateField('reality', value)}
            placeholder="e.g., I've been on my phone for 3 hours straight..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {errors.reality && (
            <Text style={styles.errorText}>{errors.reality}</Text>
          )}
        </View>

        {/* Action Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>What action will you take now? *</Text>
          <TextInput
            style={[styles.input, errors.action && styles.inputError]}
            value={formData.action}
            onChangeText={(value) => {
              updateField('action', value);
              if (value.trim()) {
                setTimeout(handleActionComplete, 500); // Delay to show after user finishes typing
              }
            }}
            placeholder="e.g., Put my phone away and go for a walk..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          {errors.action && (
            <Text style={styles.errorText}>{errors.action}</Text>
          )}
        </View>

        {/* Media Attachments */}
        <MediaAttachmentComponent
          attachments={attachments}
          onAddAttachment={handleAddAttachment}
          onRemoveAttachment={handleRemoveAttachment}
          maxAttachments={3}
        />
 
         {/* Show completion message when after-mood tracking appears */}
         {showAfterMood && (
           <View style={styles.completionMessage}>
             <Text style={styles.completionText}>
               Great! Now that you've planned your action, how are you feeling? 🌟
             </Text>
           </View>
         )}
      </View>

      <View style={styles.buttonContainer}>
        {onCancel && (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Reality Check</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 30,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
    minHeight: 60,
  },
  inputError: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  completionMessage: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  completionText: {
    color: '#2D5A2D',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default RealityCheckForm;
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { useApp } from '../../../providers/AppProvider';
import { useToast } from '../../../components/common/Toast';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { ArrowLeft, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface ProfileData {
  display_name: string;
  bio: string;
}

export default function EditProfileScreen() {
  const { colors, typography, spacing } = useTheme();
  const { profile, updateProfile } = useApp();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileData>>({});
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile?.avatar_url || null
  );

  const scrollViewRef = useRef<ScrollView>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileData> = {};

    if (!profileData.display_name.trim()) {
      newErrors.display_name = 'Display name is required';
    } else if (profileData.display_name.trim().length < 2) {
      newErrors.display_name = 'Display name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        display_name: profileData.display_name.trim(),
        bio: profileData.bio.trim() || null,
        avatar_url: avatarUrl,
      });
      
      showToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully!',
      });
      
      router.back();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAvatar = async () => {
    if (Platform.OS === 'web') {
      // Web implementation using HTML file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setAvatarUrl(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      // Native implementation using expo-image-picker
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
          showToast({
            type: 'error',
            title: 'Permission Required',
            message: 'Sorry, we need camera roll permissions to change your avatar.',
          });
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          setAvatarUrl(result.assets[0].uri);
        }
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to pick image. Please try again.',
        });
      }
    }
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
    },
    headerTitle: {
      ...typography.textStyles.heading.lg,
      color: colors.text.primary,
    },
    backButton: {
      padding: spacing.sm,
    },
    saveButton: {
      padding: spacing.sm,
    },
    saveButtonText: {
      ...typography.textStyles.body.lg,
      color: colors.primary[500],
      fontWeight: '600',
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: spacing.md,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.gray[200],
    },
    avatarPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.gray[200],
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarPlaceholderText: {
      ...typography.textStyles.heading.xl,
      color: colors.gray[500],
    },
    changeAvatarButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary[500],
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.background.primary,
    },
    changeAvatarLabel: {
      ...typography.textStyles.body.md,
      color: colors.primary[500],
      fontWeight: '500',
    },
    formSection: {
      marginBottom: spacing.lg,
    },
    fieldContainer: {
      marginBottom: spacing.lg,
    },
    label: {
      ...typography.textStyles.body.md,
      color: colors.text.primary,
      fontWeight: '600',
      marginBottom: spacing.sm,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: spacing.md,
      padding: spacing.md,
      ...typography.textStyles.body.md,
      color: colors.text.primary,
      backgroundColor: colors.background.primary,
      minHeight: 48,
    },
    inputError: {
      borderColor: colors.error[500],
      backgroundColor: colors.error[50],
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    errorText: {
      ...typography.textStyles.caption.md,
      color: colors.error[500],
      marginTop: spacing.xs,
    },
    helperText: {
      ...typography.textStyles.caption.md,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    buttonContainer: {
      marginTop: spacing.xl,
      marginBottom: spacing.lg,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      ...typography.textStyles.body.md,
      color: colors.text.secondary,
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
        >
          <ArrowLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Edit Profile</Text>
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={[styles.saveButtonText, isLoading && { opacity: 0.5 }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handleChangeAvatar}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {profileData.display_name.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
            <View style={styles.changeAvatarButton}>
              <Camera color={colors.white} size={18} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChangeAvatar}>
            <Text style={styles.changeAvatarLabel}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <Card style={styles.formSection} padding="large">
          {/* Display Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Display Name *</Text>
            <TextInput
              style={[styles.input, errors.display_name && styles.inputError]}
              value={profileData.display_name}
              onChangeText={(value) => updateField('display_name', value)}
              placeholder="Enter your display name"
              placeholderTextColor={colors.text.secondary}
              maxLength={50}
            />
            {errors.display_name && (
              <Text style={styles.errorText}>{errors.display_name}</Text>
            )}
          </View>

          {/* Bio */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={profileData.bio}
              onChangeText={(value) => updateField('bio', value)}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.text.secondary}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
            <Text style={styles.helperText}>
              {profileData.bio.length}/200 characters
            </Text>
          </View>
        </Card>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={isLoading}
            fullWidth
            testID="save-profile-button"
          />
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary[500]} />
              <Text style={styles.loadingText}>Updating your profile...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
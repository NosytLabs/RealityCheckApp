import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useApp } from '../../providers/AppProvider';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

interface EditProfileScreenProps {
  navigation: any;
}

interface ProfileData {
  displayName: string;
  email: string;
  bio: string;
  phone: string;
  location: string;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { colors, typography, spacing } = useTheme();
  const { user } = useApp();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: user?.user_metadata?.display_name || '',
    email: user?.email || '',
    bio: user?.user_metadata?.bio || '',
    phone: user?.user_metadata?.phone || '',
    location: user?.user_metadata?.location || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileData>>({});
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.user_metadata?.avatar_url || null
  );

  const scrollViewRef = useRef<ScrollView>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileData> = {};

    if (!profileData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (profileData.displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (profileData.phone && !/^\+?[\d\s\-\(\)]+$/.test(profileData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically call your user service to update the profile
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        'Your profile has been updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to update profile. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      'Change Avatar',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Photo Library', onPress: () => console.log('Open photo library') },
        { text: 'Remove Photo', onPress: () => setAvatarUrl(null), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
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
    backButtonText: {
      ...typography.textStyles.body.lg,
      color: colors.primary[500],
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
    changeAvatarText: {
      color: colors.white,
      fontSize: 18,
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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Cancel</Text>
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
                  {profileData.displayName.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
            <View style={styles.changeAvatarButton}>
              <Text style={styles.changeAvatarText}>✎</Text>
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
              style={[styles.input, errors.displayName && styles.inputError]}
              value={profileData.displayName}
              onChangeText={(value) => updateField('displayName', value)}
              placeholder="Enter your display name"
              placeholderTextColor={colors.text.secondary}
              maxLength={50}
            />
            {errors.displayName && (
              <Text style={styles.errorText}>{errors.displayName}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={profileData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="Enter your email"
              placeholderTextColor={colors.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
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

          {/* Phone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={profileData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.text.secondary}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          {/* Location */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={profileData.location}
              onChangeText={(value) => updateField('location', value)}
              placeholder="Enter your location"
              placeholderTextColor={colors.text.secondary}
              maxLength={100}
            />
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
};

export default EditProfileScreen;
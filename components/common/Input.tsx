import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Eye, EyeOff, X } from 'lucide-react-native';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  showPasswordToggle?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
  showClearButton?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>((
  {
    label,
    placeholder,
    value,
    onChangeText,
    onBlur,
    onFocus,
    error,
    disabled = false,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    autoComplete,
    maxLength,
    multiline = false,
    numberOfLines = 1,
    showPasswordToggle = false,
    style,
    inputStyle,
    testID,
    showClearButton = true,
  },
  ref
) => {
  const { colors, typography, spacing } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleClear = () => {
    onChangeText('');
  };

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: error ? colors.error[500] : isFocused ? colors.primary[500] : colors.border.primary,
    borderRadius: spacing.md,
    backgroundColor: disabled ? colors.gray[100] : colors.background.primary,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  });

  const getInputStyle = (): TextStyle => ({
    ...typography.textStyles.body.md,
    flex: 1,
    color: disabled ? colors.text.secondary : colors.text.primary,
    paddingVertical: spacing.sm,
  });

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.sm,
    },
    label: {
      ...typography.textStyles.body.md,
      color: colors.text.primary,
      fontWeight: '500',
      marginBottom: spacing.sm,
    },
    inputContainer: getInputContainerStyle(),
    input: getInputStyle(),
    rightActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: spacing.sm,
    },
    iconButton: {
      padding: spacing.xs,
      marginLeft: spacing.xs,
    },
    errorText: {
      ...typography.textStyles.caption.md,
      color: colors.error[500],
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.inputContainer}>
        <TextInput
          ref={ref}
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          testID={testID}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
        />
        
        <View style={styles.rightActions}>
          {showClearButton && value.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.iconButton}>
              <X color={colors.text.secondary} size={16} />
            </TouchableOpacity>
          )}
          
          {showPasswordToggle && secureTextEntry && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.iconButton}
              testID={`${testID}-password-toggle`}
            >
              {isPasswordVisible ? (
                <EyeOff color={colors.text.secondary} size={16} />
              ) : (
                <Eye color={colors.text.secondary} size={16} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;
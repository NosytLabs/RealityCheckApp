import React, { useState, forwardRef, useRef, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon, IconName } from '../Icon';

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
  leftIconName?: IconName;
  rightIconName?: IconName;
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
    leftIconName,
    rightIconName,
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
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

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

  const labelStyle: Animated.WithAnimatedObject<TextStyle> = {
    position: 'absolute',
    left: spacing.md,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [spacing.md, -spacing.sm],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [typography.body.fontSize, typography.caption.fontSize],
    }),
    color: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.text.secondary, colors.primary.main],
    }),
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
  };

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: error ? colors.error.main : isFocused ? colors.primary.main : colors.border,
    borderRadius: spacing.borderRadius.medium,
    backgroundColor: disabled ? colors.gray[100] : colors.background,
    paddingHorizontal: spacing.md,
    height: 56,
  });

  const getInputStyle = (): TextStyle => ({
    ...typography.body,
    flex: 1,
    color: disabled ? colors.text.disabled : colors.text.primary,
    paddingVertical: 0,
  });

  const getErrorStyle = (): TextStyle => ({
    ...typography.caption,
    color: colors.error.main,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
  });

  return (
    <View style={style}>
      <View style={getInputContainerStyle()}>
        {leftIconName && (
          <Icon name={leftIconName} size={20} color={colors.text.secondary} style={{ marginRight: spacing.sm }} />
        )}
        <TextInput
          ref={ref}
          style={getInputStyle()}
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
          placeholder={isFocused ? placeholder : ''}
          placeholderTextColor={colors.text.placeholder}
        />
        {showClearButton && value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={{ marginLeft: spacing.sm }}>
            <Icon name="close-circle" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{ marginLeft: spacing.sm }}
            testID={`${testID}-password-toggle`}
          >
            <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
        {rightIconName && (
          <Icon name={rightIconName} size={20} color={colors.text.secondary} style={{ marginLeft: spacing.sm }} />
        )}
      </View>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      {error && <Text style={getErrorStyle()}>{error}</Text>}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;
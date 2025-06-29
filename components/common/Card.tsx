import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  onPress,
  disabled = false,
  style,
  testID,
}) => {
  const { colors, spacing } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: spacing.lg,
      backgroundColor: colors.surface.primary,
    };

    const variantStyles = {
      default: {},
      elevated: {
        backgroundColor: colors.surface.primary,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      outlined: {
        borderWidth: 1,
        borderColor: colors.border.primary,
      },
    };

    const paddingStyles = {
      none: {},
      small: { padding: spacing.sm },
      medium: { padding: spacing.md },
      large: { padding: spacing.lg },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      opacity: disabled ? 0.6 : 1,
    };
  };

  const CardContent = () => (
    <View style={getCardStyle()}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={style}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        testID={testID}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]} testID={testID}>
      {children}
    </View>
  );
};

export default Card;
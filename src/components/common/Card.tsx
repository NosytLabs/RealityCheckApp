import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
  gradient?: {
    colors: string[];
    start?: [number, number];
    end?: [number, number];
  };
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  onPress,
  disabled = false,
  style,
  testID,
  gradient,
}) => {
  const { colors, spacing, shadows } = useTheme();
  const animatedValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: spacing.borderRadius.large,
      backgroundColor: colors.background,
    };

    const variantStyles = {
      default: {},
      elevated: {
        backgroundColor: colors.surface,
        ...shadows.large,
      },
      outlined: {
        borderWidth: 1,
        borderColor: colors.border,
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

  const animatedStyle = {
    transform: [{ scale: animatedValue }],
  };

  const CardContent = () => (
    <View style={getCardStyle()}>
      {gradient ? (
        <LinearGradient
          colors={gradient.colors}
          start={gradient.start || [0, 0]}
          end={gradient.end || [1, 1]}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[animatedStyle, style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        testID={testID}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]} testID={testID}>
      <CardContent />
    </View>
  );
};

export default Card;
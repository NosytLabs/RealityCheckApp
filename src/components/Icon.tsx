import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { SvgProps } from 'react-native-svg';

// Import your SVG icons here
// Example: import CheckIcon from '../assets/icons/check.svg';

import CloseCircleIcon from '../assets/icons/close-circle.svg';
import EyeIcon from '../assets/icons/eye.svg';
import EyeOffIcon from '../assets/icons/eye-off.svg';

export const iconRegistry = {
  'close-circle': CloseCircleIcon,
  eye: EyeIcon,
  'eye-off': EyeOffIcon,
};

export type IconName = keyof typeof iconRegistry;

export interface IconProps extends SvgProps {
  name: IconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, style, color, ...rest }) => {
  const { colors } = useTheme();
  const IconComponent = iconRegistry[name];

  if (!IconComponent) {
    return null; // Or return a default icon
  }

  const iconColor = color || colors.text.primary;

  return (
    <IconComponent
      width={size}
      height={size}
      fill={iconColor}
      style={style}
      {...rest}
    />
  );
};

export default Icon;
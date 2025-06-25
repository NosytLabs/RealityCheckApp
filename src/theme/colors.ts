// Color palette for RealityCheck app
// Following modern design principles with accessibility in mind

export const lightColors = {
  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Secondary colors for accents
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef', // Main secondary
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },

  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },

  // Surface colors
  surface: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    elevated: '#ffffff',
  },

  // Text colors
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
    disabled: '#d1d5db',
  },

  // Border colors
  border: {
    primary: '#e5e7eb',
    secondary: '#d1d5db',
    focus: '#0ea5e9',
    error: '#ef4444',
  },

  // Special colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  transparent: 'transparent',
};

export const modernColors = {
  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Accent colors
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },

  // Other colors remain the same as lightColors
  ...lightColors,
};

export const darkColors = {
  // Primary brand colors (adjusted for dark mode)
  primary: {
    50: '#0c4a6e',
    100: '#075985',
    200: '#0369a1',
    300: '#0284c7',
    400: '#0ea5e9',
    500: '#38bdf8', // Main primary (lighter in dark mode)
    600: '#7dd3fc',
    700: '#bae6fd',
    800: '#e0f2fe',
    900: '#f0f9ff',
  },

  // Secondary colors
  secondary: {
    50: '#701a75',
    100: '#86198f',
    200: '#a21caf',
    300: '#c026d3',
    400: '#d946ef',
    500: '#e879f9', // Main secondary
    600: '#f0abfc',
    700: '#f5d0fe',
    800: '#fae8ff',
    900: '#fdf4ff',
  },

  // Success colors
  success: {
    50: '#14532d',
    100: '#166534',
    200: '#15803d',
    300: '#16a34a',
    400: '#22c55e',
    500: '#4ade80', // Main success
    600: '#86efac',
    700: '#bbf7d0',
    800: '#dcfce7',
    900: '#f0fdf4',
  },

  // Warning colors
  warning: {
    50: '#78350f',
    100: '#92400e',
    200: '#b45309',
    300: '#d97706',
    400: '#f59e0b',
    500: '#fbbf24', // Main warning
    600: '#fcd34d',
    700: '#fde68a',
    800: '#fef3c7',
    900: '#fffbeb',
  },

  // Error colors
  error: {
    50: '#7f1d1d',
    100: '#991b1b',
    200: '#b91c1c',
    300: '#dc2626',
    400: '#ef4444',
    500: '#f87171', // Main error
    600: '#fca5a5',
    700: '#fecaca',
    800: '#fee2e2',
    900: '#fef2f2',
  },

  // Neutral grays (inverted)
  gray: {
    50: '#111827',
    100: '#1f2937',
    200: '#374151',
    300: '#4b5563',
    400: '#6b7280',
    500: '#9ca3af',
    600: '#d1d5db',
    700: '#e5e7eb',
    800: '#f3f4f6',
    900: '#f9fafb',
  },

  // Background colors
  background: {
    primary: '#111827',
    secondary: '#1f2937',
    tertiary: '#374151',
  },

  // Surface colors
  surface: {
    primary: '#1f2937',
    secondary: '#374151',
    elevated: '#4b5563',
  },

  // Text colors
  text: {
    primary: '#f9fafb',
    secondary: '#d1d5db',
    tertiary: '#9ca3af',
    inverse: '#111827',
    disabled: '#6b7280',
  },

  // Border colors
  border: {
    primary: '#374151',
    secondary: '#4b5563',
    focus: '#38bdf8',
    error: '#f87171',
  },

  // Special colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  transparent: 'transparent',
};

export type ColorScheme = typeof lightColors;
export type ColorName = keyof ColorScheme;
export type ColorShade = keyof ColorScheme['primary'];

// Helper function to get color value
export const getColor = (
  colors: ColorScheme,
  colorName: ColorName,
  shade?: ColorShade | 'primary' | 'secondary'
): string => {
  const colorGroup = colors[colorName];
  
  if (typeof colorGroup === 'string') {
    return colorGroup;
  }
  
  if (typeof colorGroup === 'object') {
    if (shade === 'primary') {
      return (colorGroup as any).primary || (colorGroup as any)[500];
    }
    if (shade === 'secondary') {
      return (colorGroup as any).secondary || (colorGroup as any)[100];
    }
    if (shade && shade in colorGroup) {
      return (colorGroup as any)[shade];
    }
    // Default to 500 if available, otherwise first available value
    return (colorGroup as any)[500] || Object.values(colorGroup)[0];
  }
  
  return '#000000'; // Fallback
};
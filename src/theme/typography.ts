import { Platform } from 'react-native';

// Font families for different platforms
export const fontFamilies = {
  // Primary font family
  primary: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    semiBold: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },
  
  // Monospace font for code/data
  monospace: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

// Font weights
export const fontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

// Font sizes following a modular scale
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
  '9xl': 128,
};

// Line heights
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// Letter spacing
export const letterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
};

// Text styles for common use cases
export const textStyles = {
  // Display styles (large headings)
  display: {
    large: {
      fontSize: fontSizes['6xl'],
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
    },
    medium: {
      fontSize: fontSizes['5xl'],
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
    },
    small: {
      fontSize: fontSizes['4xl'],
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.normal,
    },
  },

  // Heading styles
  heading: {
    h1: {
      fontSize: fontSizes['3xl'],
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
    },
    h2: {
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.tight,
    },
    h3: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.snug,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.normal,
    },
    h4: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.snug,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.normal,
    },
    h5: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.normal,
    },
    h6: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.wide,
    },
  },

  // Body text styles
  body: {
    large: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.relaxed,
      fontWeight: fontWeights.regular,
      letterSpacing: letterSpacing.normal,
    },
    medium: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.regular,
      letterSpacing: letterSpacing.normal,
    },
    small: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.regular,
      letterSpacing: letterSpacing.normal,
    },
  },

  // Label styles
  label: {
    large: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.normal,
    },
    medium: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.normal,
    },
    small: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.wide,
    },
  },

  // Caption styles
  caption: {
    large: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.regular,
      letterSpacing: letterSpacing.normal,
    },
    medium: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.regular,
      letterSpacing: letterSpacing.normal,
    },
  },

  // Button styles
  button: {
    large: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.wide,
    },
    medium: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.wide,
    },
    small: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.wider,
    },
  },

  // Code/monospace styles
  code: {
    large: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.regular,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.monospace,
    },
    medium: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.regular,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.monospace,
    },
    small: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.regular,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.monospace,
    },
  },
};

// Helper function to get font family with weight
export const getFontFamily = (weight: keyof typeof fontWeights = 'regular'): string => {
  switch (weight) {
    case 'light':
    case 'regular':
      return fontFamilies.primary.regular;
    case 'medium':
      return fontFamilies.primary.medium;
    case 'semiBold':
      return fontFamilies.primary.semiBold;
    case 'bold':
    case 'extraBold':
      return fontFamilies.primary.bold;
    default:
      return fontFamilies.primary.regular;
  }
};

// Helper function to create text style
export const createTextStyle = ({
  size = 'base',
  weight = 'regular',
  lineHeight = 'normal',
  letterSpacing: letterSpacingValue = 'normal',
  fontFamily,
}: {
  size?: keyof typeof fontSizes;
  weight?: keyof typeof fontWeights;
  lineHeight?: keyof typeof lineHeights;
  letterSpacing?: keyof typeof letterSpacing;
  fontFamily?: string;
} = {}) => ({
  fontSize: fontSizes[size],
  fontWeight: fontWeights[weight],
  lineHeight: lineHeights[lineHeight] * fontSizes[size],
  letterSpacing: letterSpacing[letterSpacingValue],
  fontFamily: fontFamily || getFontFamily(weight),
});

export type TextStyle = keyof typeof textStyles;
export type TextVariant = keyof typeof textStyles[TextStyle];
// Typography system for consistent text styling
// Based on a modular scale for harmonious proportions

// Font families
export const fontFamilies = {
  // System fonts for better performance and native feel
  system: {
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  },
  
  // Custom fonts (if needed)
  primary: {
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System',
  },
  
  // Monospace for code
  mono: {
    ios: 'SF Mono',
    android: 'Roboto Mono',
    default: 'Courier New',
  },
} as const;

// Font weights
export const fontWeights = {
  thin: '100',
  extraLight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;

// Font sizes based on modular scale (1.25 ratio)
export const fontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
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
} as const;

// Line heights for optimal readability
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Letter spacing for fine-tuning
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

// Text styles for common use cases
export const textStyles = {
  // Display styles for large headings
  display: {
    '2xl': {
      fontSize: fontSizes['8xl'], // 96
      lineHeight: lineHeights.none, // 1
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
    },
    xl: {
      fontSize: fontSizes['7xl'], // 72
      lineHeight: lineHeights.none, // 1
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
    },
    lg: {
      fontSize: fontSizes['6xl'], // 60
      lineHeight: lineHeights.none, // 1
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
    },
    md: {
      fontSize: fontSizes['5xl'], // 48
      lineHeight: lineHeights.none, // 1
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
    },
    sm: {
      fontSize: fontSizes['4xl'], // 36
      lineHeight: lineHeights.tight, // 1.25
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
    },
    small: {
      fontSize: fontSizes['4xl'], // 36
      lineHeight: lineHeights.tight, // 1.25
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
    },
  },
  
  // Heading styles
  heading: {
    '4xl': {
      fontSize: fontSizes['4xl'], // 36
      lineHeight: lineHeights.tight, // 1.25
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
    },
    '3xl': {
      fontSize: fontSizes['3xl'], // 30
      lineHeight: lineHeights.tight, // 1.25
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.tight,
    },
    '2xl': {
      fontSize: fontSizes['2xl'], // 24
      lineHeight: lineHeights.tight, // 1.25
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacing.normal,
    },
    xl: {
      fontSize: fontSizes.xl, // 20
      lineHeight: lineHeights.tight, // 1.25
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.normal,
    },
    lg: {
      fontSize: fontSizes.lg, // 18
      lineHeight: lineHeights.tight, // 1.25
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.normal,
    },
    md: {
      fontSize: fontSizes.md, // 16
      lineHeight: lineHeights.snug, // 1.375
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.normal,
    },
    sm: {
      fontSize: fontSizes.base, // 14
      lineHeight: lineHeights.snug, // 1.375
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.normal,
    },
  },
  
  // Body text styles
  body: {
    xl: {
      fontSize: fontSizes.xl, // 20
      lineHeight: lineHeights.relaxed, // 1.625
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
    },
    lg: {
      fontSize: fontSizes.lg, // 18
      lineHeight: lineHeights.relaxed, // 1.625
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
    },
    large: {
      fontSize: fontSizes.lg, // 18
      lineHeight: lineHeights.relaxed, // 1.625
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
    },
    md: {
      fontSize: fontSizes.md, // 16
      lineHeight: lineHeights.normal, // 1.5
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
    },
    medium: {
      fontSize: fontSizes.md, // 16
      lineHeight: lineHeights.normal, // 1.5
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
    },
    sm: {
      fontSize: fontSizes.base, // 14
      lineHeight: lineHeights.normal, // 1.5
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
    },
    xs: {
      fontSize: fontSizes.sm, // 12
      lineHeight: lineHeights.normal, // 1.5
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
    },
  },
  
  // Caption and small text
  caption: {
    lg: {
      fontSize: fontSizes.sm, // 12
      lineHeight: lineHeights.normal, // 1.5
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.wide,
    },
    md: {
      fontSize: fontSizes.xs, // 10
      lineHeight: lineHeights.normal, // 1.5
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.wide,
    },
    sm: {
      fontSize: fontSizes.xs, // 10
      lineHeight: lineHeights.tight, // 1.25
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.wider,
    },
  },
  
  // Button text styles
  button: {
    lg: {
      fontSize: fontSizes.lg, // 18
      lineHeight: lineHeights.none, // 1
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.normal,
    },
    md: {
      fontSize: fontSizes.md, // 16
      lineHeight: lineHeights.none, // 1
      fontWeight: fontWeights.semiBold,
      letterSpacing: letterSpacing.normal,
    },
    sm: {
      fontSize: fontSizes.base, // 14
      lineHeight: lineHeights.none, // 1
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.normal,
    },
    xs: {
      fontSize: fontSizes.sm, // 12
      lineHeight: lineHeights.none, // 1
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.wide,
    },
  },
  
  // Label styles
  label: {
    lg: {
      fontSize: fontSizes.base, // 14
      lineHeight: lineHeights.tight, // 1.25
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.normal,
    },
    md: {
      fontSize: fontSizes.sm, // 12
      lineHeight: lineHeights.tight, // 1.25
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.normal,
    },
    sm: {
      fontSize: fontSizes.xs, // 10
      lineHeight: lineHeights.tight, // 1.25
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacing.wide,
    },
  },
  
  // Code and monospace
  code: {
    lg: {
      fontSize: fontSizes.md, // 16
      lineHeight: lineHeights.normal, // 1.5
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.mono.default,
    },
    md: {
      fontSize: fontSizes.base, // 14
      lineHeight: lineHeights.normal, // 1.5
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.mono.default,
    },
    sm: {
      fontSize: fontSizes.sm, // 12
      lineHeight: lineHeights.normal, // 1.5
      fontWeight: fontWeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.mono.default,
    },
  },
} as const;

// Helper functions
export const getFontSize = (size: keyof typeof fontSizes): number => fontSizes[size];
export const getLineHeight = (height: keyof typeof lineHeights): number => lineHeights[height];
export const getFontWeight = (weight: keyof typeof fontWeights): string => fontWeights[weight];
export const getLetterSpacing = (spacing: keyof typeof letterSpacing): number => letterSpacing[spacing];

// Platform-specific font family helper
export const getPlatformFontFamily = (family: keyof typeof fontFamilies, platform: 'ios' | 'android' | 'default' = 'default'): string => {
  return fontFamilies[family][platform];
};

// Text style helper
export const getTextStyle = (category: keyof typeof textStyles, size: string) => {
  const styles = textStyles[category] as any;
  return styles[size] || styles.md || {};
};

// Type definitions
export type FontSize = keyof typeof fontSizes;
export type LineHeight = keyof typeof lineHeights;
export type FontWeight = keyof typeof fontWeights;
export type LetterSpacing = keyof typeof letterSpacing;
export type TextStyleCategory = keyof typeof textStyles;

// Common text style combinations
export const commonTextStyles = {
  screenTitle: textStyles.heading['2xl'],
  sectionTitle: textStyles.heading.lg,
  cardTitle: textStyles.heading.md,
  bodyText: textStyles.body.md,
  smallText: textStyles.body.xs,
  buttonText: textStyles.button.md,
  inputLabel: textStyles.label.md,
  helperText: textStyles.caption.md,
  errorText: {
    ...textStyles.caption.md,
    // Error color will be applied by theme
  },
} as const;
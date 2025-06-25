// Spacing system based on 4px grid
// Following 8-point grid system for consistent spacing

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

// Semantic spacing names for common use cases
export const semanticSpacing = {
  // Extra small spacing
  xs: spacing[1], // 4px
  
  // Small spacing
  sm: spacing[2], // 8px
  
  // Medium spacing (base unit)
  md: spacing[4], // 16px
  
  // Large spacing
  lg: spacing[6], // 24px
  
  // Extra large spacing
  xl: spacing[8], // 32px
  
  // 2x extra large
  '2xl': spacing[12], // 48px
  
  // 3x extra large
  '3xl': spacing[16], // 64px
  
  // 4x extra large
  '4xl': spacing[24], // 96px
  
  // 5x extra large
  '5xl': spacing[32], // 128px
} as const;

// Component-specific spacing
export const componentSpacing = {
  // Button padding
  button: {
    small: {
      horizontal: spacing[3], // 12px
      vertical: spacing[2], // 8px
    },
    medium: {
      horizontal: spacing[4], // 16px
      vertical: spacing[3], // 12px
    },
    large: {
      horizontal: spacing[6], // 24px
      vertical: spacing[4], // 16px
    },
  },
  
  // Input padding
  input: {
    horizontal: spacing[3], // 12px
    vertical: spacing[3], // 12px
  },
  
  // Card padding
  card: {
    small: spacing[3], // 12px
    medium: spacing[4], // 16px
    large: spacing[6], // 24px
  },
  
  // Screen padding
  screen: {
    horizontal: spacing[4], // 16px
    vertical: spacing[6], // 24px
  },
  
  // Modal padding
  modal: {
    horizontal: spacing[6], // 24px
    vertical: spacing[8], // 32px
  },
  
  // List item padding
  listItem: {
    horizontal: spacing[4], // 16px
    vertical: spacing[3], // 12px
  },
  
  // Section spacing
  section: {
    small: spacing[4], // 16px
    medium: spacing[6], // 24px
    large: spacing[8], // 32px
  },
} as const;

// Border radius values
export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
} as const;

// Shadow definitions
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 16,
  },
} as const;

// Layout dimensions
export const layout = {
  // Container max widths
  container: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Common component heights
  height: {
    button: {
      small: 32,
      medium: 40,
      large: 48,
    },
    input: {
      small: 32,
      medium: 40,
      large: 48,
    },
    header: 56,
    tabBar: 60,
    bottomSheet: {
      peek: 120,
      half: '50%',
      full: '90%',
    },
  },
  
  // Icon sizes
  icon: {
    xs: 12,
    sm: 16,
    base: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
    '3xl': 64,
  },
  
  // Avatar sizes
  avatar: {
    xs: 24,
    sm: 32,
    base: 40,
    md: 48,
    lg: 64,
    xl: 80,
    '2xl': 96,
  },
} as const;

// Z-index values for layering
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  banner: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  skipLink: 1070,
  toast: 1080,
  tooltip: 1090,
} as const;

// Helper functions
export const getSpacing = (value: keyof typeof spacing): number => spacing[value];
export const getSemanticSpacing = (value: keyof typeof semanticSpacing): number => semanticSpacing[value];
export const getBorderRadius = (value: keyof typeof borderRadius): number => borderRadius[value];
export const getShadow = (value: keyof typeof shadows) => shadows[value];

// Responsive breakpoints (for future use with responsive design)
export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type SpacingKey = keyof typeof spacing;
export type SemanticSpacingKey = keyof typeof semanticSpacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type ShadowKey = keyof typeof shadows;
export type ZIndexKey = keyof typeof zIndex;
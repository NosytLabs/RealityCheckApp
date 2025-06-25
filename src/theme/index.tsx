import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { lightColors, darkColors, modernColors, ColorScheme } from './colors';
import { textStyles, fontFamilies, fontWeights, fontSizes, lineHeights, letterSpacing } from './typography';
import { modernTheme } from '../styles/ModernTheme';
import { spacing, semanticSpacing, componentSpacing, borderRadius, shadows, layout, zIndex } from './spacing';

// Theme interface
export interface Theme {
  colors: ColorScheme;
  typography: {
    textStyles: typeof textStyles;
    fontFamilies: typeof fontFamilies;
    fontWeights: typeof fontWeights;
    fontSizes: typeof fontSizes;
    lineHeights: typeof lineHeights;
    letterSpacing: typeof letterSpacing;
  };
  spacing: {
    spacing: typeof spacing;
    semanticSpacing: typeof semanticSpacing;
    componentSpacing: typeof componentSpacing;
  };
  layout: {
    borderRadius: typeof borderRadius;
    shadows: typeof shadows;
    layout: typeof layout;
    zIndex: typeof zIndex;
  };
  isDark: boolean;
}

// Create light and dark themes
const lightTheme: Theme = {
  colors: lightColors,
  typography: {
    textStyles,
    fontFamilies,
    fontWeights,
    fontSizes,
    lineHeights,
    letterSpacing,
  },
  spacing: {
    spacing,
    semanticSpacing,
    componentSpacing,
  },
  layout: {
    borderRadius,
    shadows,
    layout,
    zIndex,
  },
  isDark: false,
};

const darkTheme: Theme = {
  ...lightTheme,
  colors: darkColors,
  isDark: true,
};

const modernThemeWithFunctions: Theme = {
  ...modernTheme,
  isDark: false,
};

// Theme context
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  themeName: 'light' | 'dark' | 'modern';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'modern') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark' | 'system';
}

// Storage key for theme preference
const THEME_STORAGE_KEY = '@RealityCheck:theme';

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'system' 
}) => {
  const [themeName, setThemeName] = useState<'light' | 'dark' | 'modern'>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      handleSystemThemeChange(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      
      if (savedTheme) {
        const themeData = JSON.parse(savedTheme);
        if (themeData.mode === 'system') {
          const systemColorScheme = Appearance.getColorScheme();
          setIsDark(systemColorScheme === 'dark');
        } else {
          setIsDark(themeData.isDark);
        }
      } else {
        // Default to system theme
        const systemColorScheme = Appearance.getColorScheme();
        setIsDark(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Fallback to system theme
      const systemColorScheme = Appearance.getColorScheme();
      setIsDark(systemColorScheme === 'dark');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemThemeChange = async (colorScheme: ColorSchemeName) => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        const themeData = JSON.parse(savedTheme);
        if (themeData.mode === 'system') {
          setIsDark(colorScheme === 'dark');
        }
      } else {
        // If no saved preference, follow system
        setIsDark(colorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error handling system theme change:', error);
    }
  };

  const saveThemePreference = async (isDarkMode: boolean, mode: 'manual' | 'system' = 'manual') => {
    try {
      const themeData = {
        isDark: isDarkMode,
        mode,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeData));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    saveThemePreference(newIsDark, 'manual');
  };

  const setTheme = (isDarkMode: boolean) => {
    setIsDark(isDarkMode);
    saveThemePreference(isDarkMode, 'manual');
  };

  const theme = themeName === 'dark' ? darkTheme : themeName === 'modern' ? modernThemeWithFunctions : lightTheme;
  const isDark = themeName === 'dark';

  const contextValue: ThemeContextType = {
    theme,
    isDark,
    themeName,
    toggleTheme,
    setTheme: (newTheme: 'light' | 'dark' | 'modern') => {
      setThemeName(newTheme);
      saveThemePreference(newTheme === 'dark', 'manual', newTheme);
    },
  };

  // Show loading state while theme is being loaded
  if (isLoading) {
    return null; // or a loading component
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to use colors specifically
export const useColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

// Hook to use typography specifically
export const useTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

// Hook to use spacing specifically
export const useSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

// Hook to use layout specifically
export const useLayout = () => {
  const { theme } = useTheme();
  return theme.layout;
};

// Export theme utilities
export * from './colors';
export * from './typography';
export * from './spacing';

// Export themes and types
export { lightTheme, darkTheme };
export type { Theme, ColorScheme };
import { useFrameworkReady } from '@/hooks/useFrameworkReady'import 'react-native-svg';
import { Svg, Circle, Rect, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../providers/AppProvider';
import { ThemeProvider } from '../theme';
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// Initialize SVG components globally BEFORE any React components render
// This ensures DevLoadingView and other internal components can access them
if (typeof global !== 'undefined') {
  global.Svg = Svg;
  global.Circle = Circle;
  global.Rect = Rect;
  global.Path = Path;
  global.G = G;
  global.Defs = Defs;
  global.LinearGradient = LinearGradient;
  global.Stop = Stop;
}

export default function RootLayout() {
  useFrameworkReady();
  return (
    <ErrorBoundary>
      <AppProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen 
              name="premium" 
              options={{ 
                presentation: 'modal',
                headerShown: true,
                title: 'Premium Features'
              }} 
            />
            <Stack.Screen 
              name="focus-mode" 
              options={{ 
                presentation: 'modal',
                headerShown: true,
                title: 'Focus Mode'
              }} 
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
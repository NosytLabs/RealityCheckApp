import 'react-native-web';
import 'react-native-svg';
import 'path-browserify';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '../providers/AppProvider';
import { ThemeProvider } from '../theme';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ToastProvider } from '../components/common/Toast';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  return (
    <ErrorBoundary>
      <AppProvider>
        <ThemeProvider>
          <ToastProvider>
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
              <Stack.Screen 
                name="touch-grass-stroll" 
                options={{ 
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Touch Grass Stroll'
                }} 
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ToastProvider>
        </ThemeProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
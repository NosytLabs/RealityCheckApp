import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import 'react-native-svg';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../providers/AppProvider';
import { ThemeProvider } from '../theme';
import { ErrorBoundary } from '../components/ErrorBoundary';

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
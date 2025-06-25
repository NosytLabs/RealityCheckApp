import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/theme';
import { AppProvider } from './src/providers/AppProvider';

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </ThemeProvider>
    </AppProvider>
  );
}
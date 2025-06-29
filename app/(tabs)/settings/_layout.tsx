import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="intervention-settings" />
      <Stack.Screen name="app-usage-limits" />
      <Stack.Screen name="scheduled-downtime" />
    </Stack>
  );
}
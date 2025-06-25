import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme';
import { useApp } from '../providers/AppProvider';

// Import screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';
import { GoalsScreen } from '../screens/goals/GoalsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import EditProfileScreen from '../screens/settings/EditProfileScreen';
import PrivacyPolicyScreen from '../screens/settings/PrivacyPolicyScreen';
import InterventionSettingsScreen from '../screens/settings/InterventionSettingsScreen';
import AppUsageLimitsScreen from '../screens/AppUsageLimitsScreen';
import ScheduledDowntimeScreen from '../screens/ScheduledDowntimeScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import PremiumScreen from '../screens/PremiumScreen';
import FocusModeScreen from '../screens/FocusModeScreen';

import { RootStackParamList, AuthStackParamList, MainTabParamList, SettingsStackParamList } from '../types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

// Auth Stack Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// Settings Stack Navigator
const SettingsNavigator = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
      <SettingsStack.Screen name="EditProfile" component={EditProfileScreen} />
      <SettingsStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <SettingsStack.Screen name="InterventionSettings" component={InterventionSettingsScreen} />
      <SettingsStack.Screen name="AppUsageLimits" component={AppUsageLimitsScreen} />
      <SettingsStack.Screen name="ScheduledDowntime" component={ScheduledDowntimeScreen} />
      <SettingsStack.Screen 
        name="Premium" 
        component={PremiumScreen}
        options={{
          headerShown: true,
          title: 'Premium Features',
          headerBackTitleVisible: false,
        }}
      />
    </SettingsStack.Navigator>
  );
};

// Placeholder components for main tabs
const PlaceholderScreen = ({ title }: { title: string }) => {
  const { colors, typography } = useTheme();
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background.primary,
    }}>
      <Text style={{
        ...typography.textStyles.heading.large,
        color: colors.text.primary,
      }}>
        {title} Screen
      </Text>
      <Text style={{
        ...typography.textStyles.body.medium,
        color: colors.text.secondary,
        marginTop: 8,
      }}>
        Coming Soon
      </Text>
    </View>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  const { colors, typography } = useTheme();

  return (
    <MainTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface.primary,
          borderTopColor: colors.border.default,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          ...typography.textStyles.caption,
          fontSize: 12,
        },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text.secondary,
      }}
    >
      <MainTabs.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <MainTabs.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📊</Text>
          ),
        }}
      />
      <MainTabs.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarLabel: 'Goals',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🎯</Text>
          ),
        }}
      />
      <MainTabs.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>⚙️</Text>
          ),
        }}
      />
    </MainTabs.Navigator>
  );
};

// Root Navigator
export const AppNavigator = () => {
  const { colors, isDark } = useTheme();
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) {
    // Simple loading screen
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.primary,
      }}>
        <Text style={{ color: colors.text.primary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: colors.primary[500],
          background: colors.background.primary,
          card: colors.surface.primary,
          text: colors.text.primary,
          border: colors.border.default,
          notification: colors.error[500],
        },
      }}
    >
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
            <RootStack.Screen 
              name="Premium" 
              component={PremiumScreen}
              options={{
                headerShown: true,
                title: 'Premium Features',
                headerBackTitleVisible: false,
                presentation: 'modal',
              }}
            />
            <RootStack.Screen 
              name="FocusMode" 
              component={FocusModeScreen}
              options={{
                presentation: 'modal',
              }}
            />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
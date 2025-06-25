// src/types/index.ts

import { z } from 'zod';

// ==========================================
// ENUMERATED TYPES
// ==========================================

export const AffirmationCategorySchema = z.enum([
  'self-love',
  'anxiety-relief',
  'motivation',
  'gratitude',
  'mindfulness',
  'positivity',
]);

export const MoodTypeSchema = z.enum([
  'happy',
  'sad',
  'anxious',
  'calm',
  'motivated',
  'tired',
  'neutral',
]);

export const ChallengeCategorySchema = z.enum([
  'nature',
  'urban',
  'creative',
  'mindfulness',
  'social',
]);

export const WeatherConditionSchema = z.enum([
  'sunny',
  'cloudy',
  'rainy',
  'stormy',
  'snowy',
  'windy',
]);

// ==========================================
// APP USAGE AND SCREEN TIME SCHEMAS
// ==========================================

// ==========================================
// USER MANAGEMENT SCHEMAS
// ==========================================

export const ScrollModeSettingsSchema = z.object({
  enabled: z.boolean(),
  sensitivity: z.number().min(0).max(1),
  unlockDuration: z.number().positive(), // in minutes
});

export const UserSettingsSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long.'),
  enableNotifications: z.boolean(),
  notificationTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  theme: z.enum(['light', 'dark', 'system']),
  scrollMode: ScrollModeSettingsSchema,
});

export const UserStatsSchema = z.object({
  totalAffirmations: z.number().nonnegative(),
  completedChallenges: z.number().nonnegative(),
  currentStreak: z.number().nonnegative(),
  longestStreak: z.number().nonnegative(),
  joinDate: z.date(),
});

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  settings: UserSettingsSchema,
  stats: UserStatsSchema,
  lastLogin: z.date(),
});

// ==========================================
// AFFIRMATION & CHALLENGE SCHEMAS
// ==========================================

export const AffirmationSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  category: AffirmationCategorySchema,
  isFavorite: z.boolean(),
  viewCount: z.number().nonnegative(),
  lastViewed: z.date().optional(),
});

export const ChallengeRequirementSchema = z.object({
  type: z.enum(['label', 'gps', 'timeOfDay']),
  value: z.string(), // e.g., 'tree', '40.7128,-74.0060', 'sunset'
  confidenceThreshold: z.number().min(0).max(1).optional(),
});

export const ChallengeSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  category: ChallengeCategorySchema,
  requirements: z.array(ChallengeRequirementSchema),
  difficulty: z.number().min(1).max(5),
  rewardPoints: z.number().positive(),
});

// ==========================================
// APP USAGE & ANALYTICS SCHEMAS
// ==========================================

export const AppUsageSessionSchema = z.object({
  sessionId: z.string().uuid(),
  startTime: z.date(),
  endTime: z.date(),
  duration: z.number().positive(), // in seconds
  scrollEvents: z.number().nonnegative(),
  affirmationsViewed: z.number().nonnegative(),
});

export const AnalyticsEventSchema = z.object({
  eventName: z.string(),
  timestamp: z.date(),
  properties: z.record(z.any()).optional(),
});

// ==========================================
// VISION & SENSOR DATA SCHEMAS
// ==========================================

export const GpsDataSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timestamp: z.date(),
});

export const VisionAnalysisResultSchema = z.object({
  verified: z.boolean(),
  outdoorScore: z.number().min(0).max(1),
  labels: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

export const PhotoVerificationRequestSchema = z.object({
  imageUri: z.string(),
  challengeType: z.string(),
  gpsData: GpsDataSchema.optional(),
  lightLevel: z.number().optional(),
});

// ==========================================
// INFERRED TYPES
// ==========================================

export type Affirmation = z.infer<typeof AffirmationSchema>;
export type AffirmationCategory = z.infer<typeof AffirmationCategorySchema>;
export type MoodType = z.infer<typeof MoodTypeSchema>;
export type Challenge = z.infer<typeof ChallengeSchema>;
export type ChallengeCategory = z.infer<typeof ChallengeCategorySchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type UserStats = z.infer<typeof UserStatsSchema>;
export type AppUsageSession = z.infer<typeof AppUsageSessionSchema>;
export type VisionAnalysisResult = z.infer<typeof VisionAnalysisResultSchema>;
export type PhotoVerificationRequest = z.infer<typeof PhotoVerificationRequestSchema>;

// ==========================================
// NAVIGATION-RELATED TYPES
// ==========================================

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  Premium: undefined;
  FocusMode: { duration: number; returnTo?: string };
  Onboarding: undefined;
  Main: undefined;
  Camera: { challengeType: string };
  AffirmationHistory: undefined;
  ScrollMode: undefined;
  LocationTracking: undefined;
  Achievements: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Analytics: undefined;
  Goals: undefined;
  Settings: undefined;
  Home: undefined;
  ScrollMode: undefined;
  LocationTracking: undefined;
  Achievements: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  EditProfile: undefined;
  PrivacyPolicy: undefined;
  InterventionSettings: undefined;
  Premium: undefined;
  AppUsageLimits: undefined;
  ScheduledDowntime: undefined;
};
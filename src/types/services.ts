// Android native module interfaces
export interface AndroidScreenTimeModule {
  getScreenTime(packageName: string): Promise<number>;
  getAppUsageStats(startTime: number, endTime: number): Promise<AppUsageInfo[]>;
  requestUsageStatsPermission(): Promise<boolean>;
  hasUsageStatsPermission(): Promise<boolean>;
}

export interface AppUsageInfo {
  packageName: string;
  totalTimeInForeground: number;
  firstTimeStamp: number;
  lastTimeStamp: number;
  lastTimeUsed: number;
}

// Intervention system interfaces
export interface InterventionSystem {
  triggerIntervention(type: InterventionType, context: InterventionContext): Promise<InterventionResult>;
  getAvailableInterventions(): Promise<InterventionType[]>;
  recordInterventionResponse(response: InterventionResponse): Promise<void>;
}

export interface InterventionContext {
  appName: string;
  sessionDuration: number;
  scrollDistance?: number;
  timeOfDay: string;
  userMood?: string;
  recentActivity?: string[];
}

export interface InterventionResult {
  success: boolean;
  interventionId: string;
  type: InterventionType;
  timestamp: string;
  userResponse?: InterventionResponse;
}

export interface InterventionResponse {
  interventionId: string;
  responseType: 'dismissed' | 'engaged' | 'completed';
  responseTime: number;
  additionalData?: Record<string, any>;
}

export type InterventionType = 
  | 'mindful_break'
  | 'breathing_exercise'
  | 'reality_check'
  | 'affirmation'
  | 'time_awareness'
  | 'goal_reminder'
  | 'social_connection';

// Session types
export interface CheckInSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  mood: string;
  energy: number;
  stress: number;
  gratitude?: string[];
  goals?: string[];
  reflections?: string;
  completed: boolean;
}

export interface StrollSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  appsVisited: string[];
  interventionsTriggered: number;
  mindfulMoments: number;
  totalScrollDistance: number;
  sessionQuality: 'mindful' | 'neutral' | 'mindless';
  completed: boolean;
}
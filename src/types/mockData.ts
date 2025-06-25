import { User, Affirmation, Challenge, AnalyticsData } from './index';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'user1@example.com',
    displayName: 'John Doe',
    avatarUrl: 'https://example.com/avatar1.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    }
  },
  {
    id: '2',
    email: 'user2@example.com',
    displayName: 'Jane Smith',
    avatarUrl: 'https://example.com/avatar2.jpg',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    preferences: {
      theme: 'dark',
      notifications: false,
      language: 'es'
    }
  }
];

export const mockAffirmations: Affirmation[] = [
  {
    id: '1',
    text: 'I am in control of my digital habits',
    category: 'self-control',
    createdAt: '2023-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '2',
    text: 'I choose mindful engagement over mindless scrolling',
    category: 'mindfulness',
    createdAt: '2023-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '3',
    text: 'My time is valuable and I use it intentionally',
    category: 'time-awareness',
    createdAt: '2023-01-01T00:00:00Z',
    isActive: true
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Mindful Scrolling',
    description: 'Practice mindful awareness while using social media for 30 days',
    type: 'habit-building',
    duration: 30,
    difficulty: 'medium',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Digital Sunset',
    description: 'No screens 1 hour before bedtime for a week',
    type: 'digital-wellness',
    duration: 7,
    difficulty: 'hard',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

export const mockAnalyticsData: AnalyticsData[] = [
  {
    id: '1',
    userId: '1',
    date: '2023-01-01',
    screenTime: 240, // 4 hours in minutes
    appUsage: {
      'Instagram': 90,
      'TikTok': 60,
      'Twitter': 45,
      'YouTube': 45
    },
    interventions: 12,
    mindfulMoments: 8,
    moodScore: 7,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    date: '2023-01-02',
    screenTime: 180, // 3 hours in minutes
    appUsage: {
      'Instagram': 60,
      'TikTok': 45,
      'Twitter': 30,
      'YouTube': 45
    },
    interventions: 8,
    mindfulMoments: 12,
    moodScore: 8,
    createdAt: '2023-01-02T00:00:00Z'
  }
];
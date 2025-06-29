module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/test-utils/setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/android/',
    '<rootDir>/ios/',
    '<rootDir>/e2e/'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*|@react-navigation|@supabase|expo|@expo|lucide-react-native)/)/',
  ],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!test-utils/**',
    '!**/__tests__/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/config/(.*)$': '<rootDir>/config/$1',
    '^@/services/(.*)$': '<rootDir>/services/$1',
    '^@/theme/(.*)$': '<rootDir>/theme/$1',
    '^@/providers/(.*)$': '<rootDir>/providers/$1',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/components/**/__tests__/**/*.test.tsx',
    '<rootDir>/app/**/__tests__/**/*.test.tsx',
  ],
};
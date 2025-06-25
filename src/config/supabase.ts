// Supabase configuration and client setup

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE } from './constants';
import { createMockSupabaseClient, MockSupabaseService } from './supabase-mock';
import { Environment } from './environment';

// Database table names
export const TABLES = {
  USERS: 'users',
  AFFIRMATIONS: 'affirmations',
  CHALLENGES: 'challenges',
  SESSIONS: 'sessions',
  ANALYTICS: 'analytics',
  INTERVENTIONS: 'interventions',
  SCREEN_TIME: 'screen_time',
  USER_RESPONSES: 'user_responses',
} as const;

// Row Level Security (RLS) policies
export const RLS_POLICIES = {
  USER_DATA: 'Users can only access their own data',
  PUBLIC_READ: 'Anyone can read public data',
  AUTHENTICATED_WRITE: 'Only authenticated users can write',
} as const;

// Supabase client instance
let supabaseClient: SupabaseClient | any = null;
let mockService: MockSupabaseService | null = null;
let isUsingMock = false;

// Initialize Supabase client
const initializeSupabase = (): SupabaseClient | any => {
  try {
    // Check if we have valid Supabase credentials
    if (!SUPABASE.URL || !SUPABASE.ANON_KEY || 
        SUPABASE.URL === 'your-supabase-url' || 
        SUPABASE.ANON_KEY === 'your-supabase-anon-key') {
      
      console.warn('Supabase credentials not configured, using mock client');
      isUsingMock = true;
      mockService = new MockSupabaseService();
      return createMockSupabaseClient();
    }

    // Create real Supabase client
    const client = createClient(SUPABASE.URL, SUPABASE.ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });

    console.log('Supabase client initialized successfully');
    return client;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    console.warn('Falling back to mock client');
    
    isUsingMock = true;
    mockService = new MockSupabaseService();
    return createMockSupabaseClient();
  }
};

// Get Supabase client (singleton)
export const getSupabaseClient = (): SupabaseClient | any => {
  if (!supabaseClient) {
    supabaseClient = initializeSupabase();
  }
  return supabaseClient;
};

// Check if using mock client
export const isUsingMockClient = (): boolean => {
  return isUsingMock;
};

// Get mock service (if available)
export const getMockService = (): MockSupabaseService | null => {
  return mockService;
};

// Validate Supabase connection
export const validateSupabaseConnection = async (): Promise<{
  isConnected: boolean;
  isUsingMock: boolean;
  error?: string;
}> => {
  try {
    const client = getSupabaseClient();
    
    if (isUsingMock) {
      const mockConnected = await mockService?.checkConnection();
      return {
        isConnected: mockConnected || false,
        isUsingMock: true,
      };
    }

    // Test real Supabase connection
    const { data, error } = await client
      .from(TABLES.USERS)
      .select('id')
      .limit(1);

    if (error) {
      return {
        isConnected: false,
        isUsingMock: false,
        error: error.message,
      };
    }

    return {
      isConnected: true,
      isUsingMock: false,
    };
  } catch (error) {
    return {
      isConnected: false,
      isUsingMock: isUsingMock,
      error: (error as Error).message,
    };
  }
};

// Test Supabase functionality
export const testSupabaseFunctionality = async (): Promise<{
  auth: boolean;
  database: boolean;
  storage: boolean;
  realtime: boolean;
  errors: string[];
}> => {
  const results = {
    auth: false,
    database: false,
    storage: false,
    realtime: false,
    errors: [] as string[],
  };

  const client = getSupabaseClient();

  // Test database
  try {
    if (isUsingMock) {
      const testResult = await mockService?.testQuery();
      results.database = !testResult?.error;
    } else {
      const { error } = await client.from(TABLES.USERS).select('id').limit(1);
      results.database = !error;
    }
  } catch (error) {
    results.errors.push(`Database: ${(error as Error).message}`);
  }

  // Test auth (basic check)
  try {
    if (isUsingMock) {
      results.auth = true; // Mock auth always works
    } else {
      const { error } = await client.auth.getSession();
      results.auth = !error;
    }
  } catch (error) {
    results.errors.push(`Auth: ${(error as Error).message}`);
  }

  // Test storage (basic check)
  try {
    if (isUsingMock) {
      results.storage = true; // Mock storage always works
    } else {
      const { error } = await client.storage.listBuckets();
      results.storage = !error;
    }
  } catch (error) {
    results.errors.push(`Storage: ${(error as Error).message}`);
  }

  // Test realtime (basic check)
  try {
    if (isUsingMock) {
      results.realtime = true; // Mock realtime always works
    } else {
      // Just check if realtime is available
      results.realtime = !!client.realtime;
    }
  } catch (error) {
    results.errors.push(`Realtime: ${(error as Error).message}`);
  }

  return results;
};

// Database helper functions
export const dbHelpers = {
  // Generic select with filters
  async select<T>(table: string, options: {
    columns?: string;
    filters?: { column: string; value: any; operator?: string }[];
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    range?: { from: number; to: number };
  } = {}): Promise<{ data: T[] | null; error: any }> {
    try {
      const client = getSupabaseClient();
      let query = client.from(table).select(options.columns || '*');

      // Apply filters
      if (options.filters) {
        options.filters.forEach(filter => {
          const operator = filter.operator || 'eq';
          query = query[operator](filter.column, filter.value);
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending !== false 
        });
      }

      // Apply limit or range
      if (options.range) {
        query = query.range(options.range.from, options.range.to);
      } else if (options.limit) {
        query = query.limit(options.limit);
      }

      return await query;
    } catch (error) {
      return { data: null, error };
    }
  },

  // Generic insert
  async insert<T>(table: string, data: Partial<T> | Partial<T>[]): Promise<{ data: T | null; error: any }> {
    try {
      const client = getSupabaseClient();
      return await client.from(table).insert(data).select().single();
    } catch (error) {
      return { data: null, error };
    }
  },

  // Generic update
  async update<T>(table: string, id: string, data: Partial<T>): Promise<{ data: T | null; error: any }> {
    try {
      const client = getSupabaseClient();
      return await client.from(table).update(data).eq('id', id).select().single();
    } catch (error) {
      return { data: null, error };
    }
  },

  // Generic delete
  async delete(table: string, id: string): Promise<{ error: any }> {
    try {
      const client = getSupabaseClient();
      return await client.from(table).delete().eq('id', id);
    } catch (error) {
      return { error };
    }
  },

  // Get user data
  async getUserData(userId: string): Promise<{ data: any | null; error: any }> {
    return this.select('users', {
      filters: [{ column: 'id', value: userId }],
    });
  },

  // Get user sessions
  async getUserSessions(userId: string, limit = 10): Promise<{ data: any[] | null; error: any }> {
    return this.select('sessions', {
      filters: [{ column: 'user_id', value: userId }],
      orderBy: { column: 'created_at', ascending: false },
      limit,
    });
  },

  // Get user analytics
  async getUserAnalytics(userId: string, dateRange?: { from: string; to: string }): Promise<{ data: any[] | null; error: any }> {
    const filters = [{ column: 'user_id', value: userId }];
    
    if (dateRange) {
      filters.push(
        { column: 'created_at', value: dateRange.from, operator: 'gte' },
        { column: 'created_at', value: dateRange.to, operator: 'lte' }
      );
    }

    return this.select('analytics', {
      filters,
      orderBy: { column: 'created_at', ascending: false },
    });
  },
};

// Export the client for direct use
export const supabase = getSupabaseClient();

// Initialize on import if in development
if (Environment.isDevelopment) {
  validateSupabaseConnection().then(result => {
    if (Environment.enableLogging) {
      console.log('Supabase connection status:', result);
    }
  });
}

export default supabase;
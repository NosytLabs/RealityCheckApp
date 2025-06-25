// Mock Supabase client for development and testing
// This provides a fallback when Supabase is not available

import { mockData } from '../types/mockData';

// Mock Supabase client interface
export interface MockSupabaseClient {
  from: (table: string) => MockQueryBuilder;
  auth: MockAuth;
  storage: MockStorage;
}

interface MockQueryBuilder {
  select: (columns?: string) => MockQueryBuilder;
  insert: (data: any) => MockQueryBuilder;
  update: (data: any) => MockQueryBuilder;
  delete: () => MockQueryBuilder;
  eq: (column: string, value: any) => MockQueryBuilder;
  neq: (column: string, value: any) => MockQueryBuilder;
  gt: (column: string, value: any) => MockQueryBuilder;
  gte: (column: string, value: any) => MockQueryBuilder;
  lt: (column: string, value: any) => MockQueryBuilder;
  lte: (column: string, value: any) => MockQueryBuilder;
  like: (column: string, pattern: string) => MockQueryBuilder;
  ilike: (column: string, pattern: string) => MockQueryBuilder;
  in: (column: string, values: any[]) => MockQueryBuilder;
  order: (column: string, options?: { ascending?: boolean }) => MockQueryBuilder;
  limit: (count: number) => MockQueryBuilder;
  range: (from: number, to: number) => MockQueryBuilder;
  single: () => Promise<{ data: any; error: any }>;
  maybeSingle: () => Promise<{ data: any; error: any }>;
  then: (callback: (result: { data: any; error: any }) => void) => Promise<any>;
}

interface MockAuth {
  signUp: (credentials: any) => Promise<{ data: any; error: any }>;
  signInWithPassword: (credentials: any) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  getSession: () => Promise<{ data: { session: any }; error: any }>;
  getUser: () => Promise<{ data: { user: any }; error: any }>;
  onAuthStateChange: (callback: (event: string, session: any) => void) => { data: { subscription: any } };
}

interface MockStorage {
  from: (bucket: string) => MockBucket;
}

interface MockBucket {
  upload: (path: string, file: any) => Promise<{ data: any; error: any }>;
  download: (path: string) => Promise<{ data: any; error: any }>;
  remove: (paths: string[]) => Promise<{ data: any; error: any }>;
  list: (path?: string) => Promise<{ data: any; error: any }>;
  getPublicUrl: (path: string) => { data: { publicUrl: string } };
}

// Mock data store
class MockDataStore {
  private data: { [table: string]: any[] } = {
    users: mockData.users,
    affirmations: mockData.affirmations,
    challenges: mockData.challenges,
    sessions: mockData.sessions,
    analytics: mockData.analytics,
    interventions: mockData.interventions,
  };

  private currentUser: any = null;
  private authCallbacks: ((event: string, session: any) => void)[] = [];

  getTable(table: string): any[] {
    return this.data[table] || [];
  }

  setTable(table: string, data: any[]): void {
    this.data[table] = data;
  }

  addToTable(table: string, item: any): any {
    const items = this.getTable(table);
    const newItem = { ...item, id: Date.now().toString() };
    items.push(newItem);
    return newItem;
  }

  updateInTable(table: string, id: string, updates: any): any {
    const items = this.getTable(table);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      return items[index];
    }
    return null;
  }

  deleteFromTable(table: string, id: string): boolean {
    const items = this.getTable(table);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items.splice(index, 1);
      return true;
    }
    return false;
  }

  setCurrentUser(user: any): void {
    this.currentUser = user;
    this.authCallbacks.forEach(callback => {
      callback('SIGNED_IN', { user });
    });
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  addAuthCallback(callback: (event: string, session: any) => void): void {
    this.authCallbacks.push(callback);
  }
}

const mockStore = new MockDataStore();

// Mock query builder implementation
class MockQueryBuilderImpl implements MockQueryBuilder {
  private table: string;
  private selectColumns: string = '*';
  private filters: any[] = [];
  private orderBy: { column: string; ascending: boolean } | null = null;
  private limitCount: number | null = null;
  private rangeFrom: number | null = null;
  private rangeTo: number | null = null;
  private operation: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private insertData: any = null;
  private updateData: any = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*'): MockQueryBuilder {
    this.selectColumns = columns;
    this.operation = 'select';
    return this;
  }

  insert(data: any): MockQueryBuilder {
    this.insertData = data;
    this.operation = 'insert';
    return this;
  }

  update(data: any): MockQueryBuilder {
    this.updateData = data;
    this.operation = 'update';
    return this;
  }

  delete(): MockQueryBuilder {
    this.operation = 'delete';
    return this;
  }

  eq(column: string, value: any): MockQueryBuilder {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }

  neq(column: string, value: any): MockQueryBuilder {
    this.filters.push({ type: 'neq', column, value });
    return this;
  }

  gt(column: string, value: any): MockQueryBuilder {
    this.filters.push({ type: 'gt', column, value });
    return this;
  }

  gte(column: string, value: any): MockQueryBuilder {
    this.filters.push({ type: 'gte', column, value });
    return this;
  }

  lt(column: string, value: any): MockQueryBuilder {
    this.filters.push({ type: 'lt', column, value });
    return this;
  }

  lte(column: string, value: any): MockQueryBuilder {
    this.filters.push({ type: 'lte', column, value });
    return this;
  }

  like(column: string, pattern: string): MockQueryBuilder {
    this.filters.push({ type: 'like', column, value: pattern });
    return this;
  }

  ilike(column: string, pattern: string): MockQueryBuilder {
    this.filters.push({ type: 'ilike', column, value: pattern });
    return this;
  }

  in(column: string, values: any[]): MockQueryBuilder {
    this.filters.push({ type: 'in', column, value: values });
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}): MockQueryBuilder {
    this.orderBy = { column, ascending: options.ascending !== false };
    return this;
  }

  limit(count: number): MockQueryBuilder {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number): MockQueryBuilder {
    this.rangeFrom = from;
    this.rangeTo = to;
    return this;
  }

  private applyFilters(data: any[]): any[] {
    return data.filter(item => {
      return this.filters.every(filter => {
        const value = item[filter.column];
        switch (filter.type) {
          case 'eq': return value === filter.value;
          case 'neq': return value !== filter.value;
          case 'gt': return value > filter.value;
          case 'gte': return value >= filter.value;
          case 'lt': return value < filter.value;
          case 'lte': return value <= filter.value;
          case 'like':
          case 'ilike':
            const pattern = filter.value.replace(/%/g, '.*');
            const regex = new RegExp(pattern, filter.type === 'ilike' ? 'i' : '');
            return regex.test(String(value));
          case 'in': return filter.value.includes(value);
          default: return true;
        }
      });
    });
  }

  private applyOrder(data: any[]): any[] {
    if (!this.orderBy) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[this.orderBy!.column];
      const bVal = b[this.orderBy!.column];
      
      if (aVal < bVal) return this.orderBy!.ascending ? -1 : 1;
      if (aVal > bVal) return this.orderBy!.ascending ? 1 : -1;
      return 0;
    });
  }

  private applyRange(data: any[]): any[] {
    if (this.rangeFrom !== null && this.rangeTo !== null) {
      return data.slice(this.rangeFrom, this.rangeTo + 1);
    }
    if (this.limitCount !== null) {
      return data.slice(0, this.limitCount);
    }
    return data;
  }

  async single(): Promise<{ data: any; error: any }> {
    const result = await this.execute();
    if (result.error) return result;
    
    const data = Array.isArray(result.data) ? result.data[0] || null : result.data;
    return { data, error: null };
  }

  async maybeSingle(): Promise<{ data: any; error: any }> {
    return this.single();
  }

  async then(callback: (result: { data: any; error: any }) => void): Promise<any> {
    const result = await this.execute();
    return callback(result);
  }

  private async execute(): Promise<{ data: any; error: any }> {
    try {
      switch (this.operation) {
        case 'select': {
          let data = mockStore.getTable(this.table);
          data = this.applyFilters(data);
          data = this.applyOrder(data);
          data = this.applyRange(data);
          return { data, error: null };
        }
        
        case 'insert': {
          const newItem = mockStore.addToTable(this.table, this.insertData);
          return { data: newItem, error: null };
        }
        
        case 'update': {
          // For simplicity, update the first matching item
          const items = mockStore.getTable(this.table);
          const filtered = this.applyFilters(items);
          if (filtered.length > 0) {
            const updated = mockStore.updateInTable(this.table, filtered[0].id, this.updateData);
            return { data: updated, error: null };
          }
          return { data: null, error: { message: 'No matching records found' } };
        }
        
        case 'delete': {
          const items = mockStore.getTable(this.table);
          const filtered = this.applyFilters(items);
          const deleted = filtered.map(item => {
            mockStore.deleteFromTable(this.table, item.id);
            return item;
          });
          return { data: deleted, error: null };
        }
        
        default:
          return { data: null, error: { message: 'Unknown operation' } };
      }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } };
    }
  }
}

// Mock auth implementation
const mockAuth: MockAuth = {
  async signUp(credentials: any) {
    // Simulate sign up
    const user = {
      id: Date.now().toString(),
      email: credentials.email,
      created_at: new Date().toISOString(),
    };
    mockStore.setCurrentUser(user);
    return { data: { user }, error: null };
  },

  async signInWithPassword(credentials: any) {
    // Simulate sign in
    const users = mockStore.getTable('users');
    const user = users.find(u => u.email === credentials.email);
    
    if (user) {
      mockStore.setCurrentUser(user);
      return { data: { user }, error: null };
    }
    
    return { data: null, error: { message: 'Invalid credentials' } };
  },

  async signOut() {
    mockStore.setCurrentUser(null);
    return { error: null };
  },

  async getSession() {
    const user = mockStore.getCurrentUser();
    const session = user ? { user } : null;
    return { data: { session }, error: null };
  },

  async getUser() {
    const user = mockStore.getCurrentUser();
    return { data: { user }, error: null };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    mockStore.addAuthCallback(callback);
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
};

// Mock storage implementation
const mockStorage: MockStorage = {
  from(bucket: string): MockBucket {
    return {
      async upload(path: string, file: any) {
        // Simulate file upload
        return {
          data: { path, fullPath: `${bucket}/${path}` },
          error: null,
        };
      },

      async download(path: string) {
        // Simulate file download
        return {
          data: new Blob(['mock file content']),
          error: null,
        };
      },

      async remove(paths: string[]) {
        // Simulate file removal
        return {
          data: paths.map(path => ({ path })),
          error: null,
        };
      },

      async list(path: string = '') {
        // Simulate file listing
        return {
          data: [
            { name: 'mock-file-1.jpg', id: '1' },
            { name: 'mock-file-2.png', id: '2' },
          ],
          error: null,
        };
      },

      getPublicUrl(path: string) {
        return {
          data: { publicUrl: `https://mock-storage.com/${bucket}/${path}` },
        };
      },
    };
  },
};

// Main mock client
export const createMockSupabaseClient = (): MockSupabaseClient => {
  return {
    from: (table: string) => new MockQueryBuilderImpl(table),
    auth: mockAuth,
    storage: mockStorage,
  };
};

// Mock service for checking connection
export class MockSupabaseService {
  private client: MockSupabaseClient;

  constructor() {
    this.client = createMockSupabaseClient();
  }

  async checkConnection(): Promise<boolean> {
    // Always return true for mock
    return true;
  }

  getClient(): MockSupabaseClient {
    return this.client;
  }

  async testQuery(): Promise<any> {
    try {
      const result = await this.client.from('users').select('*').limit(1);
      return result;
    } catch (error) {
      return { data: null, error };
    }
  }
}

export default createMockSupabaseClient;
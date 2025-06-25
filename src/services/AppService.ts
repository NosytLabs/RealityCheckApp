import { ServiceRegistry } from './ServiceManager';
import { SupabaseAuthService } from './SupabaseAuthService';
import { SupabaseStorageService } from './SupabaseStorageService';
import { SupabaseAnalyticsService } from './SupabaseAnalyticsService';
import { CacheService } from './CacheService';
import { EventBusService } from './EventBusService';
import { PrivacyComplianceService } from './PrivacyComplianceService';
import { AppState, AppStateStatus } from 'react-native';
import { supabase } from '../config/supabase';

export interface IAppService {
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
  getHealthStatus(): Promise<AppHealthStatus>;
  handleAppStateChange(nextAppState: AppStateStatus): Promise<void>;
  handleUserAuthentication(userId: string | null): Promise<void>;
}

export interface AppHealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, {
    status: 'healthy' | 'degraded' | 'unhealthy';
    lastCheck: Date;
    error?: string;
  }>;
  uptime: number;
  memoryUsage?: {
    used: number;
    total: number;
  };
}

export class AppService implements IAppService {
  private serviceRegistry: ServiceRegistry;
  private isInitialized = false;
  private startTime: Date;
  private currentAppState: AppStateStatus = 'active';
  private healthCheckInterval?: NodeJS.Timeout;
  private readonly HEALTH_CHECK_INTERVAL = 60000; // 1 minute

  constructor() {
    this.serviceRegistry = new ServiceRegistry();
    this.startTime = new Date();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('AppService already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing RealityCheck App Services...');

      // Register all services
      await this.registerServices();

      // Initialize services in dependency order
      await this.initializeServices();

      // Set up app state monitoring
      this.setupAppStateMonitoring();

      // Start health monitoring
      this.startHealthMonitoring();

      // Set up global error handling
      this.setupErrorHandling();

      this.isInitialized = true;
      console.log('✅ App services initialized successfully');

      // Track app initialization
      const analyticsService = this.serviceRegistry.getService<SupabaseAnalyticsService>('analytics');
      if (analyticsService) {
        await analyticsService.trackAppStart();
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Failed to initialize app services:', errorMessage);
      throw new Error(`App initialization failed: ${errorMessage}`);
    }
  }

  async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      console.log('🔄 Shutting down app services...');

      // Stop health monitoring
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }

      // Track app shutdown
      const analyticsService = this.serviceRegistry.getService<SupabaseAnalyticsService>('analytics');
      if (analyticsService) {
        await analyticsService.trackAppEnd();
      }

      // Dispose services in reverse order
      await this.serviceRegistry.disposeAll();

      this.isInitialized = false;
      console.log('✅ App services shut down successfully');

    } catch (error) {
      console.error('❌ Error during app shutdown:', error);
    }
  }

  async getHealthStatus(): Promise<AppHealthStatus> {
    const services = this.serviceRegistry.getAllServices();
    const serviceStatuses: Record<string, any> = {};
    let overallHealthy = true;
    let overallDegraded = false;

    // Check each service health
    for (const [name, service] of Object.entries(services)) {
      try {
        const isHealthy = await service.healthCheck();
        serviceStatuses[name] = {
          status: isHealthy ? 'healthy' : 'unhealthy',
          lastCheck: new Date(),
        };
        
        if (!isHealthy) {
          overallHealthy = false;
          overallDegraded = true;
        }
      } catch (error) {
        serviceStatuses[name] = {
          status: 'unhealthy',
          lastCheck: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        overallHealthy = false;
      }
    }

    // Determine overall status
    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (overallHealthy) {
      overall = 'healthy';
    } else if (overallDegraded) {
      overall = 'degraded';
    } else {
      overall = 'unhealthy';
    }

    return {
      overall,
      services: serviceStatuses,
      uptime: Date.now() - this.startTime.getTime(),
    };
  }

  async handleAppStateChange(nextAppState: AppStateStatus): Promise<void> {
    const previousState = this.currentAppState;
    this.currentAppState = nextAppState;

    console.log(`App state changed: ${previousState} -> ${nextAppState}`);

    const analyticsService = this.serviceRegistry.getService<SupabaseAnalyticsService>('analytics');
    const eventBus = this.serviceRegistry.getService<EventBusService>('eventBus');

    try {
      switch (nextAppState) {
        case 'active':
          if (previousState === 'background') {
            // App came to foreground
            if (analyticsService) {
              await analyticsService.trackAppStart();
            }
            if (eventBus) {
              eventBus.emit('app:foreground', { previousState, timestamp: new Date() });
            }
          }
          break;

        case 'background':
          // App went to background
          if (analyticsService) {
            await analyticsService.trackAppEnd();
          }
          if (eventBus) {
            eventBus.emit('app:background', { previousState, timestamp: new Date() });
          }
          break;

        case 'inactive':
          // App became inactive (e.g., phone call, notification)
          if (eventBus) {
            eventBus.emit('app:inactive', { previousState, timestamp: new Date() });
          }
          break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error handling app state change:', errorMessage);
    }
  }

  async handleUserAuthentication(userId: string | null): Promise<void> {
    const eventBus = this.serviceRegistry.getService<EventBusService>('eventBus');
    const analyticsService = this.serviceRegistry.getService<SupabaseAnalyticsService>('analytics');

    try {
      if (userId) {
        // User signed in
        console.log(`User authenticated: ${userId}`);
        
        if (eventBus) {
          eventBus.emit('auth:signIn', { userId, timestamp: new Date() });
        }
        
        if (analyticsService) {
          await analyticsService.trackEvent('user_sign_in', { userId });
        }
      } else {
        // User signed out
        console.log('User signed out');
        
        if (eventBus) {
          eventBus.emit('auth:signOut', { timestamp: new Date() });
        }
        
        if (analyticsService) {
          await analyticsService.trackEvent('user_sign_out', {});
        }

        // Clear user-specific caches
        const cacheService = this.serviceRegistry.getService<CacheService>('cache');
        if (cacheService) {
          await cacheService.clear();
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error handling user authentication:', errorMessage);
    }
  }

  // Get service instance
  getService<T>(name: string): T | null {
    return this.serviceRegistry.getService<T>(name);
  }

  private async registerServices(): Promise<void> {
    // Register services
    this.serviceRegistry.registerService('eventBus', new EventBusService());
    this.serviceRegistry.registerService('cache', new CacheService());
    this.serviceRegistry.registerService('auth', new SupabaseAuthService(supabase));
    this.serviceRegistry.registerService('storage', new SupabaseStorageService(supabase));
    this.serviceRegistry.registerService('analytics', new SupabaseAnalyticsService(supabase));
    this.serviceRegistry.registerService('privacy', new PrivacyComplianceService(supabase));
  }

  private async initializeServices(): Promise<void> {
    // Initialize in dependency order
    const initOrder = ['eventBus', 'cache', 'auth', 'storage', 'analytics', 'privacy'];
    
    for (const serviceName of initOrder) {
      const service = this.serviceRegistry.getService(serviceName);
      if (service && 'initialize' in service) {
        console.log(`Initializing ${serviceName} service...`);
        await (service as any).initialize();
      }
    }
  }

  private setupAppStateMonitoring(): void {
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
  }

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const health = await this.getHealthStatus();
        if (health.overall !== 'healthy') {
          console.warn('App health check failed:', health);
          
          const eventBus = this.serviceRegistry.getService<EventBusService>('eventBus');
          if (eventBus) {
            eventBus.emit('app:healthCheck', { status: health, timestamp: new Date() });
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Health check error:', errorMessage);
      }
    }, this.HEALTH_CHECK_INTERVAL);
  }

  private setupErrorHandling(): void {
    // Global error handler for unhandled promise rejections
    const originalHandler = global.onunhandledrejection;
    global.onunhandledrejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      const analyticsService = this.serviceRegistry.getService<SupabaseAnalyticsService>('analytics');
      if (analyticsService) {
        analyticsService.trackEvent('app_error', {
          type: 'unhandled_rejection',
          error: event.reason?.toString() || 'Unknown error',
          timestamp: new Date().toISOString(),
        }).catch(console.error);
      }
      
      if (originalHandler) {
        originalHandler(event);
      }
    };
  }
}

// Singleton instance
let appServiceInstance: AppService | null = null;

export const getAppService = (): AppService => {
  if (!appServiceInstance) {
    appServiceInstance = new AppService();
  }
  return appServiceInstance;
};

export default AppService;
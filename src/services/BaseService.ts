// src/services/BaseService.ts

// Base service dependencies will be injected through ServiceManager
// to avoid circular dependencies

/**
 * Base service class providing common functionality and dependency injection
 * for all application services. This eliminates code duplication and
 * standardizes service patterns across the application.
 */
export abstract class BaseService {
  protected isInitialized: boolean = false;
  protected serviceName: string;
  private serviceManager?: any; // Will be injected

  constructor(serviceName?: string) {
    this.serviceName = serviceName || this.constructor.name;
  }

  /**
   * Inject the service manager for dependency access
   */
  setServiceManager(manager: any): void {
    this.serviceManager = manager;
  }

  /**
   * Get a service dependency through the service manager
   */
  protected getService<T>(serviceName: string): T | undefined {
    return this.serviceManager?.getService<T>(serviceName);
  }

  /**
   * Initialize the service with common setup logic
   */
  async initialize(): Promise<void> {
    try {
      this.isInitialized = true;
      this.log(`${this.serviceName} initialized`);
    } catch (error) {
      await this.handleError('Service initialization failed', error);
      throw error;
    }
  }

  /**
   * Cleanup service resources
   */
  async dispose(): Promise<void> {
    try {
      this.isInitialized = false;
      this.log(`${this.serviceName} disposed`);
    } catch (error) {
      await this.handleError('Service disposal failed', error);
    }
  }

  /**
   * Check if service is healthy and operational
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        return false;
      }
      return await this.onHealthCheck();
    } catch (error) {
      await this.handleError('Health check failed', error);
      return false;
    }
  }

  /**
   * Standardized error handling across all services
   */
  protected async handleError(message: string, error: any): Promise<void> {
    console.error(`[${this.serviceName}] ${message}:`, error);
    
    // Track error through service manager if available
    const analytics = this.getService('analytics');
    if (analytics) {
      try {
        await analytics.trackEvent('service_error', {
          serviceName: this.serviceName,
          message,
          error: error?.message || String(error),
          timestamp: new Date().toISOString()
        });
      } catch (analyticsError) {
        console.error('Failed to track service error:', analyticsError);
      }
    }
  }

  /**
   * Standardized logging with service context
   */
  protected log(message: string, data?: any): void {
    console.log(`[${this.serviceName}] ${message}`, data || '');
  }

  /**
   * Execute operation with standardized error handling and retry logic
   */
  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        
        if (attempt > 1) {
          await this.log('info', `Operation succeeded on attempt ${attempt}`, {
            operationName,
            attempt
          });
        }
        
        return result;
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          await this.handleError(`Operation failed after ${maxRetries} attempts: ${operationName}`, error);
          break;
        }
        
        await this.log('warn', `Operation failed on attempt ${attempt}, retrying...`, {
          operationName,
          attempt,
          error: error?.message
        });
        
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
    
    throw lastError;
  }

  /**
   * Validate service state before operations
   */
  protected validateInitialized(): void {
    if (!this.isInitialized) {
      throw new Error(`${this.serviceName} is not initialized. Call initialize() first.`);
    }
  }

  // Virtual methods that can be overridden by concrete services
  protected async onInitialize(): Promise<void> {
    // Default implementation - can be overridden
  }
  
  protected async onDispose(): Promise<void> {
    // Default implementation - can be overridden
  }
  
  protected async onHealthCheck(): Promise<boolean> {
    // Default implementation - can be overridden
    return this.isInitialized;
  }
}

/**
 * Service factory for managing service instances and dependencies
 */
export class ServiceFactory {
  private static instances = new Map<string, BaseService>();
  private static initializationPromises = new Map<string, Promise<void>>();

  /**
   * Get or create a service instance
   */
  static async getService<T extends BaseService>(
    serviceClass: new (...args: any[]) => T,
    ...args: any[]
  ): Promise<T> {
    const serviceName = serviceClass.name;
    
    if (!this.instances.has(serviceName)) {
      const instance = new serviceClass(...args);
      this.instances.set(serviceName, instance);
      
      // Ensure initialization happens only once
      if (!this.initializationPromises.has(serviceName)) {
        const initPromise = instance.initialize();
        this.initializationPromises.set(serviceName, initPromise);
      }
    }
    
    // Wait for initialization to complete
    await this.initializationPromises.get(serviceName);
    
    return this.instances.get(serviceName) as T;
  }

  /**
   * Dispose all services
   */
  static async disposeAll(): Promise<void> {
    const disposePromises = Array.from(this.instances.values()).map(service => 
      service.dispose().catch(error => 
        console.error(`Failed to dispose service ${service.constructor.name}:`, error)
      )
    );
    
    await Promise.all(disposePromises);
    
    this.instances.clear();
    this.initializationPromises.clear();
  }

  /**
   * Get health status of all services
   */
  static async getHealthStatus(): Promise<Record<string, boolean>> {
    const healthChecks = Array.from(this.instances.entries()).map(async ([name, service]) => {
      try {
        const isHealthy = await service.healthCheck();
        return [name, isHealthy] as [string, boolean];
      } catch (error) {
        console.error(`Health check failed for ${name}:`, error);
        return [name, false] as [string, boolean];
      }
    });
    
    const results = await Promise.all(healthChecks);
    return Object.fromEntries(results);
  }
}
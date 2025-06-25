// Performance optimization configuration for RealityCheck app

export const PerformanceConfig = {
  // Bundle optimization settings
  bundle: {
    enableHermes: true,
    enableCodeSplitting: true,
    enableTreeShaking: true,
    targetBundleSize: 30, // MB
    enableSourceMaps: false, // Disable in production
  },

  // Image optimization settings
  images: {
    enableWebP: true,
    compressionQuality: 0.8,
    maxImageSize: 1024, // pixels
    enableLazyLoading: true,
  },

  // Memory management
  memory: {
    enableMemoryWarnings: true,
    maxMemoryUsage: 100, // MB
    enableGarbageCollection: true,
    componentCacheSize: 50,
  },

  // Network optimization
  network: {
    enableRequestCaching: true,
    requestTimeout: 10000, // ms
    maxConcurrentRequests: 5,
    enableCompression: true,
  },

  // Animation performance
  animations: {
    enableNativeDriver: true,
    useLayoutAnimation: false, // Use sparingly
    maxAnimationDuration: 300, // ms
    enableInteractionManager: true,
  },

  // List performance
  lists: {
    enableVirtualization: true,
    initialNumToRender: 10,
    maxToRenderPerBatch: 5,
    windowSize: 10,
    removeClippedSubviews: true,
  },

  // Development vs Production settings
  development: {
    enableFlipperIntegration: true,
    enablePerformanceMonitor: true,
    enableDebugger: true,
    logLevel: 'debug',
  },

  production: {
    enableFlipperIntegration: false,
    enablePerformanceMonitor: false,
    enableDebugger: false,
    logLevel: 'error',
  },
};

// Performance monitoring utilities
export class PerformanceMonitor {
  private static startTimes: Map<string, number> = new Map();
  private static metrics: Map<string, number[]> = new Map();

  static startTimer(label: string): void {
    if (__DEV__ || PerformanceConfig.production.enablePerformanceMonitor) {
      this.startTimes.set(label, Date.now());
    }
  }

  static endTimer(label: string): number | null {
    if (__DEV__ || PerformanceConfig.production.enablePerformanceMonitor) {
      const startTime = this.startTimes.get(label);
      if (startTime) {
        const duration = Date.now() - startTime;
        
        // Store metrics
        const existing = this.metrics.get(label) || [];
        existing.push(duration);
        this.metrics.set(label, existing.slice(-100)); // Keep last 100 measurements
        
        this.startTimes.delete(label);
        return duration;
      }
    }
    return null;
  }

  static getAverageTime(label: string): number | null {
    const times = this.metrics.get(label);
    if (times && times.length > 0) {
      return times.reduce((sum, time) => sum + time, 0) / times.length;
    }
    return null;
  }

  static logMetrics(): void {
    if (__DEV__) {
      console.log('Performance Metrics:');
      this.metrics.forEach((times, label) => {
        const avg = this.getAverageTime(label);
        const max = Math.max(...times);
        const min = Math.min(...times);
        console.log(`${label}: avg=${avg?.toFixed(2)}ms, min=${min}ms, max=${max}ms`);
      });
    }
  }

  static clearMetrics(): void {
    this.startTimes.clear();
    this.metrics.clear();
  }
}

// Memory usage monitoring
export class MemoryMonitor {
  private static memoryWarningThreshold = PerformanceConfig.memory.maxMemoryUsage;
  private static isMonitoring = false;

  static startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Check memory usage every 30 seconds
    const interval = setInterval(() => {
      this.checkMemoryUsage();
    }, 30000);

    // Clean up on app background
    const cleanup = () => {
      clearInterval(interval);
      this.isMonitoring = false;
    };

    // Note: In a real app, you'd want to listen to app state changes
    // AppState.addEventListener('change', (nextAppState) => {
    //   if (nextAppState === 'background') cleanup();
    // });
  }

  private static checkMemoryUsage(): void {
    // This would require a native module to get actual memory usage
    // For now, we'll just log that monitoring is active
    if (__DEV__) {
      console.log('Memory monitoring active - implement native memory tracking');
    }
  }

  static forceGarbageCollection(): void {
    if (global.gc && __DEV__) {
      global.gc();
      console.log('Forced garbage collection');
    }
  }
}

// Image optimization utilities
export class ImageOptimizer {
  static getOptimizedImageUri(uri: string, width?: number, height?: number): string {
    if (!PerformanceConfig.images.enableWebP) {
      return uri;
    }

    // In a real implementation, you might use a service like Cloudinary
    // or implement native image optimization
    const maxSize = PerformanceConfig.images.maxImageSize;
    const quality = PerformanceConfig.images.compressionQuality;
    
    // This is a placeholder - implement actual image optimization
    return uri;
  }

  static shouldLazyLoad(): boolean {
    return PerformanceConfig.images.enableLazyLoading;
  }
}

export default PerformanceConfig;
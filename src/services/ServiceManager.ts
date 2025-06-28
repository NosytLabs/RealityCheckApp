export interface IService {
  name: string;
  version: string;
  initialize(): Promise<void>;
  dispose(): Promise<void>;
  healthCheck(): Promise<boolean>;
}

export interface ServiceManager {
  registerService<T extends IService>(name: string, service: T): void;
  getService<T>(name: string): T | null;
  getAllServices(): Record<string, IService>;
  disposeAll(): Promise<void>;
}

export class ServiceRegistry implements ServiceManager {
  private services: Map<string, IService> = new Map();

  registerService<T extends IService>(name: string, service: T): void {
    this.services.set(name, service);
  }

  getService<T>(name: string): T | null {
    const service = this.services.get(name);
    return service ? (service as T) : null;
  }

  getAllServices(): Record<string, IService> {
    const result: Record<string, IService> = {};
    this.services.forEach((service, name) => {
      result[name] = service;
    });
    return result;
  }

  async disposeAll(): Promise<void> {
    const disposePromises = Array.from(this.services.values()).map(service => 
      service.dispose().catch(error => 
        console.error(`Failed to dispose service ${service.name}:`, error)
      )
    );
    
    await Promise.all(disposePromises);
    this.services.clear();
  }
}
//
//  IOSScreenTimeModule.m
//  RealityCheckApp
//
//  React Native Bridge for iOS Screen Time Module
//  Exposes Swift methods to JavaScript
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(IOSScreenTimeModule, NSObject)

// Family Controls Authorization
RCT_EXTERN_METHOD(requestFamilyControlsAuthorization:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(checkFamilyControlsAuthorizationStatus:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// App Selection and Blocking
RCT_EXTERN_METHOD(presentAppSelectionSheet:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setBlockedApps:(NSArray<NSString *> *)appTokens
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeBlockedApps:(NSArray<NSString *> *)appTokens
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Device Activity Monitoring
RCT_EXTERN_METHOD(startDeviceActivityMonitoring:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopDeviceActivityMonitoring:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Usage Data
RCT_EXTERN_METHOD(getAppUsageData:(NSDictionary *)timeInterval
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Shield Configuration
RCT_EXTERN_METHOD(configureShieldSettings:(NSDictionary *)settings
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
//
//  IOSScreenTimeModule.swift
//  RealityCheckApp
//
//  iOS Screen Time API Native Module
//  Bridges React Native with iOS Screen Time API using Family Controls framework
//

import Foundation
import React
import FamilyControls
import DeviceActivity
import ManagedSettings

@objc(IOSScreenTimeModule)
class IOSScreenTimeModule: NSObject {
    
    // MARK: - Properties
    
    private let authorizationCenter = AuthorizationCenter.shared
    private let deviceActivityCenter = DeviceActivityCenter()
    private let managedSettingsStore = ManagedSettingsStore()
    
    private var isMonitoring = false
    private var selectedApps: FamilyActivitySelection = FamilyActivitySelection()
    
    // MARK: - React Native Bridge Setup
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc
    static func moduleName() -> String! {
        return "IOSScreenTimeModule"
    }
    
    // MARK: - Family Controls Authorization
    
    @objc
    func requestFamilyControlsAuthorization(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                try await authorizationCenter.requestAuthorization(for: .individual)
                
                DispatchQueue.main.async {
                    let isAuthorized = self.authorizationCenter.authorizationStatus == .approved
                    resolve(isAuthorized)
                }
            } catch {
                DispatchQueue.main.async {
                    reject("AUTHORIZATION_ERROR", "Failed to request Family Controls authorization", error)
                }
            }
        }
    }
    
    @objc
    func checkFamilyControlsAuthorizationStatus(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let status: String
        
        switch authorizationCenter.authorizationStatus {
        case .notDetermined:
            status = "notDetermined"
        case .denied:
            status = "denied"
        case .approved:
            status = "authorized"
        @unknown default:
            status = "notDetermined"
        }
        
        resolve(status)
    }
    
    // MARK: - App Selection and Blocking
    
    @objc
    func presentAppSelectionSheet(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard authorizationCenter.authorizationStatus == .approved else {
            reject("NOT_AUTHORIZED", "Family Controls not authorized", nil)
            return
        }
        
        DispatchQueue.main.async {
            guard let rootViewController = RCTKeyWindow()?.rootViewController else {
                reject("NO_ROOT_VC", "No root view controller found", nil)
                return
            }
            
            let familyActivityPicker = FamilyActivityPicker(selection: self.selectedApps)
            familyActivityPicker.delegate = self
            
            let navigationController = UINavigationController(rootViewController: familyActivityPicker)
            navigationController.modalPresentationStyle = .pageSheet
            
            rootViewController.present(navigationController, animated: true) {
                // Store resolve block for later use in delegate
                self.pendingResolveBlock = resolve
                self.pendingRejectBlock = reject
            }
        }
    }
    
    // Store resolve/reject blocks for async app selection
    private var pendingResolveBlock: RCTPromiseResolveBlock?
    private var pendingRejectBlock: RCTPromiseRejectBlock?
    
    @objc
    func setBlockedApps(
        _ appTokens: [String],
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard authorizationCenter.authorizationStatus == .approved else {
            reject("NOT_AUTHORIZED", "Family Controls not authorized", nil)
            return
        }
        
        // Convert app tokens to ApplicationTokens
        let applicationTokens = Set(appTokens.compactMap { tokenString in
            return ApplicationToken(from: tokenString)
        })
        
        // Update managed settings to block these apps
        managedSettingsStore.application.blockedApplications = applicationTokens
        
        // Configure shield settings
        managedSettingsStore.shield.applications = applicationTokens
        
        resolve(true)
    }
    
    @objc
    func removeBlockedApps(
        _ appTokens: [String],
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard authorizationCenter.authorizationStatus == .approved else {
            reject("NOT_AUTHORIZED", "Family Controls not authorized", nil)
            return
        }
        
        // Get current blocked apps
        var currentBlockedApps = managedSettingsStore.application.blockedApplications
        
        // Remove specified apps
        let tokensToRemove = Set(appTokens.compactMap { tokenString in
            return ApplicationToken(from: tokenString)
        })
        
        currentBlockedApps.subtract(tokensToRemove)
        
        // Update managed settings
        managedSettingsStore.application.blockedApplications = currentBlockedApps
        managedSettingsStore.shield.applications = currentBlockedApps
        
        resolve(true)
    }
    
    // MARK: - Device Activity Monitoring
    
    @objc
    func startDeviceActivityMonitoring(
        _ config: [String: Any],
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard authorizationCenter.authorizationStatus == .approved else {
            reject("NOT_AUTHORIZED", "Family Controls not authorized", nil)
            return
        }
        
        let monitorName = config["monitorName"] as? String ?? "RealityCheckMonitor"
        let eventThreshold = config["eventThreshold"] as? Int ?? 5 // minutes
        let warningThreshold = config["warningThreshold"] as? Int ?? 3 // minutes
        
        // Create device activity schedule (daily)
        let schedule = DeviceActivitySchedule(
            intervalStart: DateComponents(hour: 0, minute: 0),
            intervalEnd: DateComponents(hour: 23, minute: 59),
            repeats: true
        )
        
        // Create activity name
        let activityName = DeviceActivityName(monitorName)
        
        do {
            // Start monitoring
            try deviceActivityCenter.startMonitoring(activityName, during: schedule)
            
            isMonitoring = true
            resolve(true)
            
        } catch {
            reject("MONITORING_ERROR", "Failed to start device activity monitoring", error)
        }
    }
    
    @objc
    func stopDeviceActivityMonitoring(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let activityName = DeviceActivityName("RealityCheckMonitor")
        
        deviceActivityCenter.stopMonitoring([activityName])
        isMonitoring = false
        
        resolve(nil)
    }
    
    // MARK: - Usage Data
    
    @objc
    func getAppUsageData(
        _ timeInterval: [String: Any],
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        // Note: iOS Screen Time API doesn't provide direct access to usage statistics
        // This would typically require DeviceActivityReport which runs in an extension
        // For now, return empty array and log that this requires extension implementation
        
        print("getAppUsageData: This method requires DeviceActivityReport extension implementation")
        resolve([])
    }
    
    // MARK: - Shield Configuration
    
    @objc
    func configureShieldSettings(
        _ settings: [String: Any],
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        // Shield configuration is handled through the ShieldConfiguration extension
        // This method acknowledges the configuration request
        
        let title = settings["title"] as? String ?? "Take a Mindful Moment"
        let subtitle = settings["subtitle"] as? String ?? "Before continuing, let's pause for a reality check"
        
        // Store shield configuration in UserDefaults for the extension to read
        let shieldConfig = [
            "title": title,
            "subtitle": subtitle,
            "primaryButtonLabel": settings["primaryButtonLabel"] as? String ?? "Continue Mindfully",
            "secondaryButtonLabel": settings["secondaryButtonLabel"] as? String ?? "Choose Different App",
            "backgroundColor": settings["backgroundColor"] as? String ?? "#6366F1"
        ]
        
        if let sharedDefaults = UserDefaults(suiteName: "group.com.realitycheck.app") {
            sharedDefaults.set(shieldConfig, forKey: "shieldConfiguration")
            sharedDefaults.synchronize()
        }
        
        resolve(true)
    }
}

// MARK: - FamilyActivityPickerDelegate

extension IOSScreenTimeModule: FamilyActivityPickerDelegate {
    
    func familyActivityPickerDidFinish(_ picker: FamilyActivityPicker) {
        picker.dismiss(animated: true) {
            // Convert selected apps to token strings
            let appTokens = self.selectedApps.applicationTokens.map { token in
                return token.stringRepresentation
            }
            
            self.pendingResolveBlock?(appTokens)
            self.pendingResolveBlock = nil
            self.pendingRejectBlock = nil
        }
    }
    
    func familyActivityPickerDidCancel(_ picker: FamilyActivityPicker) {
        picker.dismiss(animated: true) {
            self.pendingResolveBlock?([])
            self.pendingResolveBlock = nil
            self.pendingRejectBlock = nil
        }
    }
}

// MARK: - ApplicationToken Extension

extension ApplicationToken {
    
    init?(from string: String) {
        // This is a simplified implementation
        // In practice, you'd need proper token serialization/deserialization
        guard let data = Data(base64Encoded: string) else { return nil }
        
        do {
            self = try NSKeyedUnarchiver.unarchivedObject(ofClass: ApplicationToken.self, from: data) ?? ApplicationToken()
        } catch {
            return nil
        }
    }
    
    var stringRepresentation: String {
        do {
            let data = try NSKeyedArchiver.archivedData(withRootObject: self, requiringSecureCoding: true)
            return data.base64EncodedString()
        } catch {
            return ""
        }
    }
}

// MARK: - React Native Bridge Exports

@objc(IOSScreenTimeModuleBridge)
class IOSScreenTimeModuleBridge: NSObject {
    
    @objc
    static func moduleName() -> String! {
        return "IOSScreenTimeModule"
    }
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
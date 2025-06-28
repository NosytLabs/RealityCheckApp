//
//  RealityCheckDeviceActivityMonitor.swift
//  RealityCheckApp
//
//  Device Activity Monitor Extension for iOS Screen Time API
//  Handles background monitoring and intervention triggers
//

import DeviceActivity
import FamilyControls
import ManagedSettings
import Foundation

class RealityCheckDeviceActivityMonitor: DeviceActivityMonitor {
    
    // MARK: - Properties
    
    private let managedSettingsStore = ManagedSettingsStore()
    private let userDefaults = UserDefaults(suiteName: "group.com.realitycheck.app")
    
    // MARK: - DeviceActivityMonitor Overrides
    
    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        
        // Log the start of monitoring interval
        logEvent("Device activity monitoring started for: \(activity)")
        
        // Reset daily counters if needed
        resetDailyCountersIfNeeded()
    }
    
    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        
        // Log the end of monitoring interval
        logEvent("Device activity monitoring ended for: \(activity)")
        
        // Generate daily summary
        generateDailySummary()
    }
    
    override func eventDidReachThreshold(_ event: DeviceActivityEvent.Name, activity: DeviceActivityName) {
        super.eventDidReachThreshold(event, activity: activity)
        
        // Log threshold reached
        logEvent("Threshold reached for event: \(event) in activity: \(activity)")
        
        // Handle different types of thresholds
        handleThresholdReached(event: event, activity: activity)
    }
    
    override func intervalWillStartWarning(for activity: DeviceActivityName) {
        super.intervalWillStartWarning(for: activity)
        
        // Log warning
        logEvent("Warning interval starting for: \(activity)")
        
        // Trigger pre-intervention warning
        triggerPreInterventionWarning()
    }
    
    override func intervalWillEndWarning(for activity: DeviceActivityName) {
        super.intervalWillEndWarning(for: activity)
        
        // Log warning end
        logEvent("Warning interval ending for: \(activity)")
        
        // Prepare for intervention
        prepareForIntervention()
    }
    
    // MARK: - Threshold Handling
    
    private func handleThresholdReached(event: DeviceActivityEvent.Name, activity: DeviceActivityName) {
        
        // Get current configuration
        guard let config = getMonitoringConfiguration() else {
            logEvent("No monitoring configuration found")
            return
        }
        
        // Determine intervention type based on event
        let interventionType = determineInterventionType(for: event)
        
        // Record usage event
        recordUsageEvent(event: event, activity: activity, interventionType: interventionType)
        
        // Trigger appropriate intervention
        switch interventionType {
        case .mindfulnessReminder:
            triggerMindfulnessReminder()
        case .realityCheck:
            triggerRealityCheck()
        case .temporaryBlock:
            triggerTemporaryBlock(config: config)
        case .fullBlock:
            triggerFullBlock()
        }
    }
    
    private func determineInterventionType(for event: DeviceActivityEvent.Name) -> InterventionType {
        let eventString = String(describing: event)
        
        switch eventString {
        case let str where str.contains("warning"):
            return .mindfulnessReminder
        case let str where str.contains("threshold"):
            return .realityCheck
        case let str where str.contains("limit"):
            return .temporaryBlock
        default:
            return .realityCheck
        }
    }
    
    // MARK: - Intervention Triggers
    
    private func triggerMindfulnessReminder() {
        // Send notification to main app
        sendNotificationToMainApp(type: "mindfulness_reminder", data: [
            "title": "Mindful Moment",
            "message": "Take a breath and check in with yourself",
            "timestamp": Date().timeIntervalSince1970
        ])
        
        logEvent("Triggered mindfulness reminder")
    }
    
    private func triggerRealityCheck() {
        // Send notification to main app for reality check
        sendNotificationToMainApp(type: "reality_check", data: [
            "title": "Reality Check",
            "message": "How are you feeling right now?",
            "timestamp": Date().timeIntervalSince1970,
            "requiresResponse": true
        ])
        
        logEvent("Triggered reality check intervention")
    }
    
    private func triggerTemporaryBlock(config: [String: Any]) {
        let blockDuration = config["temporaryBlockDuration"] as? TimeInterval ?? 300 // 5 minutes default
        
        // Enable temporary shield
        enableTemporaryShield(duration: blockDuration)
        
        // Send notification
        sendNotificationToMainApp(type: "temporary_block", data: [
            "title": "Temporary Break",
            "message": "Taking a \(Int(blockDuration/60))-minute mindful break",
            "duration": blockDuration,
            "timestamp": Date().timeIntervalSince1970
        ])
        
        logEvent("Triggered temporary block for \(blockDuration) seconds")
    }
    
    private func triggerFullBlock() {
        // Send notification for full block
        sendNotificationToMainApp(type: "full_block", data: [
            "title": "Daily Limit Reached",
            "message": "You've reached your daily limit for this app",
            "timestamp": Date().timeIntervalSince1970
        ])
        
        logEvent("Triggered full block intervention")
    }
    
    private func triggerPreInterventionWarning() {
        sendNotificationToMainApp(type: "pre_intervention_warning", data: [
            "title": "Approaching Limit",
            "message": "You're approaching your usage limit",
            "timestamp": Date().timeIntervalSince1970
        ])
    }
    
    private func prepareForIntervention() {
        // Prepare any necessary data for upcoming intervention
        logEvent("Preparing for intervention")
    }
    
    // MARK: - Shield Management
    
    private func enableTemporaryShield(duration: TimeInterval) {
        // This would typically involve updating ManagedSettings
        // For now, we'll schedule a removal of the shield
        
        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            self.disableTemporaryShield()
        }
    }
    
    private func disableTemporaryShield() {
        // Remove temporary shield restrictions
        logEvent("Temporary shield disabled")
        
        sendNotificationToMainApp(type: "temporary_block_ended", data: [
            "title": "Break Complete",
            "message": "Your mindful break is complete",
            "timestamp": Date().timeIntervalSince1970
        ])
    }
    
    // MARK: - Data Management
    
    private func recordUsageEvent(event: DeviceActivityEvent.Name, activity: DeviceActivityName, interventionType: InterventionType) {
        let usageEvent: [String: Any] = [
            "id": UUID().uuidString,
            "event": String(describing: event),
            "activity": String(describing: activity),
            "interventionType": interventionType.rawValue,
            "timestamp": Date().timeIntervalSince1970,
            "date": ISO8601DateFormatter().string(from: Date())
        ]
        
        // Store in shared UserDefaults
        var existingEvents = userDefaults?.array(forKey: "usage_events") as? [[String: Any]] ?? []
        existingEvents.append(usageEvent)
        
        // Keep only last 100 events
        if existingEvents.count > 100 {
            existingEvents = Array(existingEvents.suffix(100))
        }
        
        userDefaults?.set(existingEvents, forKey: "usage_events")
        userDefaults?.synchronize()
    }
    
    private func resetDailyCountersIfNeeded() {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        
        if let lastReset = userDefaults?.object(forKey: "last_daily_reset") as? Date,
           calendar.isDate(lastReset, inSameDayAs: today) {
            return // Already reset today
        }
        
        // Reset daily counters
        userDefaults?.set(0, forKey: "daily_intervention_count")
        userDefaults?.set(0, forKey: "daily_reality_check_count")
        userDefaults?.set(today, forKey: "last_daily_reset")
        userDefaults?.synchronize()
        
        logEvent("Daily counters reset")
    }
    
    private func generateDailySummary() {
        let interventionCount = userDefaults?.integer(forKey: "daily_intervention_count") ?? 0
        let realityCheckCount = userDefaults?.integer(forKey: "daily_reality_check_count") ?? 0
        
        let summary: [String: Any] = [
            "date": ISO8601DateFormatter().string(from: Date()),
            "interventionCount": interventionCount,
            "realityCheckCount": realityCheckCount,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        sendNotificationToMainApp(type: "daily_summary", data: summary)
        logEvent("Generated daily summary: \(interventionCount) interventions, \(realityCheckCount) reality checks")
    }
    
    // MARK: - Configuration
    
    private func getMonitoringConfiguration() -> [String: Any]? {
        return userDefaults?.dictionary(forKey: "monitoring_configuration")
    }
    
    // MARK: - Communication
    
    private func sendNotificationToMainApp(type: String, data: [String: Any]) {
        var notificationData = data
        notificationData["type"] = type
        notificationData["source"] = "device_activity_monitor"
        
        userDefaults?.set(notificationData, forKey: "pending_notification")
        userDefaults?.synchronize()
        
        // Trigger local notification if app is not active
        triggerLocalNotification(type: type, data: data)
    }
    
    private func triggerLocalNotification(type: String, data: [String: Any]) {
        // This would typically use UNUserNotificationCenter
        // For now, we'll just log the notification
        logEvent("Local notification triggered: \(type)")
    }
    
    // MARK: - Logging
    
    private func logEvent(_ message: String) {
        let timestamp = ISO8601DateFormatter().string(from: Date())
        let logEntry = "[\(timestamp)] DeviceActivityMonitor: \(message)"
        
        // Store in shared UserDefaults for main app to read
        var logs = userDefaults?.array(forKey: "monitor_logs") as? [String] ?? []
        logs.append(logEntry)
        
        // Keep only last 50 log entries
        if logs.count > 50 {
            logs = Array(logs.suffix(50))
        }
        
        userDefaults?.set(logs, forKey: "monitor_logs")
        userDefaults?.synchronize()
        
        print(logEntry)
    }
}

// MARK: - Supporting Types

enum InterventionType: String, CaseIterable {
    case mindfulnessReminder = "mindfulness_reminder"
    case realityCheck = "reality_check"
    case temporaryBlock = "temporary_block"
    case fullBlock = "full_block"
}
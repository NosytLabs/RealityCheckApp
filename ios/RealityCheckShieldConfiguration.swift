//
//  RealityCheckShieldConfiguration.swift
//  RealityCheckApp
//
//  Shield Configuration Extension for iOS Screen Time API
//  Customizes the blocking screen shown when accessing blocked apps
//

import ManagedSettings
import ManagedSettingsUI
import UIKit
import SwiftUI

class RealityCheckShieldConfiguration: ShieldConfigurationDataSource {
    
    // MARK: - Properties
    
    private let userDefaults = UserDefaults(suiteName: "group.com.realitycheck.app")
    
    // MARK: - ShieldConfigurationDataSource
    
    override func configuration(shielding application: Application) -> ShieldConfiguration {
        
        // Get custom configuration from main app
        let config = getShieldConfiguration()
        
        // Create custom shield configuration
        return ShieldConfiguration(
            backgroundBlurStyle: .systemMaterial,
            backgroundColor: UIColor(hexString: config["backgroundColor"] as? String ?? "#6366F1"),
            icon: createCustomIcon(),
            title: ShieldConfiguration.Label(
                text: config["title"] as? String ?? "Take a Mindful Moment",
                color: .white
            ),
            subtitle: ShieldConfiguration.Label(
                text: config["subtitle"] as? String ?? "Before continuing, let's pause for a reality check",
                color: UIColor.white.withAlphaComponent(0.8)
            ),
            primaryButton: ShieldConfiguration.Button(
                label: ShieldConfiguration.Label(
                    text: config["primaryButtonLabel"] as? String ?? "Continue Mindfully",
                    color: .white
                ),
                backgroundColor: UIColor.white.withAlphaComponent(0.2)
            ),
            secondaryButton: ShieldConfiguration.Button(
                label: ShieldConfiguration.Label(
                    text: config["secondaryButtonLabel"] as? String ?? "Choose Different App",
                    color: UIColor.white.withAlphaComponent(0.7)
                ),
                backgroundColor: UIColor.clear
            )
        )
    }
    
    override func configuration(shielding applicationCategory: ApplicationCategory) -> ShieldConfiguration {
        
        // Get custom configuration for app categories
        let config = getShieldConfiguration()
        
        return ShieldConfiguration(
            backgroundBlurStyle: .systemMaterial,
            backgroundColor: UIColor(hexString: config["backgroundColor"] as? String ?? "#6366F1"),
            icon: createCategoryIcon(),
            title: ShieldConfiguration.Label(
                text: "Category Blocked",
                color: .white
            ),
            subtitle: ShieldConfiguration.Label(
                text: "This category of apps is currently blocked for mindful usage",
                color: UIColor.white.withAlphaComponent(0.8)
            ),
            primaryButton: ShieldConfiguration.Button(
                label: ShieldConfiguration.Label(
                    text: "Reflect & Continue",
                    color: .white
                ),
                backgroundColor: UIColor.white.withAlphaComponent(0.2)
            ),
            secondaryButton: ShieldConfiguration.Button(
                label: ShieldConfiguration.Label(
                    text: "Choose Different Activity",
                    color: UIColor.white.withAlphaComponent(0.7)
                ),
                backgroundColor: UIColor.clear
            )
        )
    }
    
    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
        
        // Configuration for blocked web domains
        let config = getShieldConfiguration()
        
        return ShieldConfiguration(
            backgroundBlurStyle: .systemMaterial,
            backgroundColor: UIColor(hexString: config["backgroundColor"] as? String ?? "#6366F1"),
            icon: createWebIcon(),
            title: ShieldConfiguration.Label(
                text: "Website Blocked",
                color: .white
            ),
            subtitle: ShieldConfiguration.Label(
                text: "This website is blocked to support mindful browsing",
                color: UIColor.white.withAlphaComponent(0.8)
            ),
            primaryButton: ShieldConfiguration.Button(
                label: ShieldConfiguration.Label(
                    text: "Continue Mindfully",
                    color: .white
                ),
                backgroundColor: UIColor.white.withAlphaComponent(0.2)
            ),
            secondaryButton: ShieldConfiguration.Button(
                label: ShieldConfiguration.Label(
                    text: "Browse Elsewhere",
                    color: UIColor.white.withAlphaComponent(0.7)
                ),
                backgroundColor: UIColor.clear
            )
        )
    }
    
    override func configuration(shielding webDomainCategory: WebDomainCategory) -> ShieldConfiguration {
        
        // Configuration for blocked web domain categories
        let config = getShieldConfiguration()
        
        return ShieldConfiguration(
            backgroundBlurStyle: .systemMaterial,
            backgroundColor: UIColor(hexString: config["backgroundColor"] as? String ?? "#6366F1"),
            icon: createWebCategoryIcon(),
            title: ShieldConfiguration.Label(
                text: "Website Category Blocked",
                color: .white
            ),
            subtitle: ShieldConfiguration.Label(
                text: "This category of websites is blocked for mindful browsing",
                color: UIColor.white.withAlphaComponent(0.8)
            ),
            primaryButton: ShieldConfiguration.Button(
                label: ShieldConfiguration.Label(
                    text: "Reflect & Continue",
                    color: .white
                ),
                backgroundColor: UIColor.white.withAlphaComponent(0.2)
            ),
            secondaryButton: ShieldConfiguration.Button(
                label: ShieldConfiguration.Label(
                    text: "Browse Mindfully",
                    color: UIColor.white.withAlphaComponent(0.7)
                ),
                backgroundColor: UIColor.clear
            )
        )
    }
    
    // MARK: - Configuration Management
    
    private func getShieldConfiguration() -> [String: Any] {
        return userDefaults?.dictionary(forKey: "shieldConfiguration") ?? [
            "title": "Take a Mindful Moment",
            "subtitle": "Before continuing, let's pause for a reality check",
            "primaryButtonLabel": "Continue Mindfully",
            "secondaryButtonLabel": "Choose Different App",
            "backgroundColor": "#6366F1"
        ]
    }
    
    // MARK: - Icon Creation
    
    private func createCustomIcon() -> UIImage? {
        // Create a custom icon for app blocking
        let size = CGSize(width: 60, height: 60)
        let renderer = UIGraphicsImageRenderer(size: size)
        
        return renderer.image { context in
            let rect = CGRect(origin: .zero, size: size)
            
            // Draw circular background
            UIColor.white.withAlphaComponent(0.2).setFill()
            context.cgContext.fillEllipse(in: rect)
            
            // Draw mindfulness symbol (simplified lotus or meditation icon)
            let symbolRect = rect.insetBy(dx: 15, dy: 15)
            UIColor.white.setFill()
            
            // Simple meditation pose silhouette
            let path = UIBezierPath()
            path.move(to: CGPoint(x: symbolRect.midX, y: symbolRect.minY + 5))
            path.addLine(to: CGPoint(x: symbolRect.midX - 8, y: symbolRect.midY - 2))
            path.addLine(to: CGPoint(x: symbolRect.minX + 5, y: symbolRect.maxY - 5))
            path.addLine(to: CGPoint(x: symbolRect.maxX - 5, y: symbolRect.maxY - 5))
            path.addLine(to: CGPoint(x: symbolRect.midX + 8, y: symbolRect.midY - 2))
            path.close()
            
            path.fill()
        }
    }
    
    private func createCategoryIcon() -> UIImage? {
        // Create icon for category blocking
        let size = CGSize(width: 60, height: 60)
        let renderer = UIGraphicsImageRenderer(size: size)
        
        return renderer.image { context in
            let rect = CGRect(origin: .zero, size: size)
            
            // Draw circular background
            UIColor.white.withAlphaComponent(0.2).setFill()
            context.cgContext.fillEllipse(in: rect)
            
            // Draw folder-like icon with pause symbol
            let symbolRect = rect.insetBy(dx: 12, dy: 12)
            UIColor.white.setStroke()
            UIColor.white.setFill()
            
            let folderPath = UIBezierPath(roundedRect: symbolRect, cornerRadius: 4)
            folderPath.lineWidth = 2
            folderPath.stroke()
            
            // Add pause bars
            let barWidth: CGFloat = 3
            let barHeight: CGFloat = 12
            let spacing: CGFloat = 4
            
            let leftBar = CGRect(
                x: symbolRect.midX - spacing/2 - barWidth,
                y: symbolRect.midY - barHeight/2,
                width: barWidth,
                height: barHeight
            )
            
            let rightBar = CGRect(
                x: symbolRect.midX + spacing/2,
                y: symbolRect.midY - barHeight/2,
                width: barWidth,
                height: barHeight
            )
            
            UIBezierPath(rect: leftBar).fill()
            UIBezierPath(rect: rightBar).fill()
        }
    }
    
    private func createWebIcon() -> UIImage? {
        // Create icon for web blocking
        let size = CGSize(width: 60, height: 60)
        let renderer = UIGraphicsImageRenderer(size: size)
        
        return renderer.image { context in
            let rect = CGRect(origin: .zero, size: size)
            
            // Draw circular background
            UIColor.white.withAlphaComponent(0.2).setFill()
            context.cgContext.fillEllipse(in: rect)
            
            // Draw globe icon with pause
            let symbolRect = rect.insetBy(dx: 12, dy: 12)
            UIColor.white.setStroke()
            
            // Globe outline
            let globePath = UIBezierPath(ovalIn: symbolRect)
            globePath.lineWidth = 2
            globePath.stroke()
            
            // Meridian lines
            let meridianPath = UIBezierPath()
            meridianPath.move(to: CGPoint(x: symbolRect.midX, y: symbolRect.minY))
            meridianPath.addLine(to: CGPoint(x: symbolRect.midX, y: symbolRect.maxY))
            meridianPath.move(to: CGPoint(x: symbolRect.minX, y: symbolRect.midY))
            meridianPath.addLine(to: CGPoint(x: symbolRect.maxX, y: symbolRect.midY))
            meridianPath.lineWidth = 1
            meridianPath.stroke()
        }
    }
    
    private func createWebCategoryIcon() -> UIImage? {
        // Create icon for web category blocking
        let size = CGSize(width: 60, height: 60)
        let renderer = UIGraphicsImageRenderer(size: size)
        
        return renderer.image { context in
            let rect = CGRect(origin: .zero, size: size)
            
            // Draw circular background
            UIColor.white.withAlphaComponent(0.2).setFill()
            context.cgContext.fillEllipse(in: rect)
            
            // Draw multiple overlapping browser windows
            UIColor.white.setStroke()
            UIColor.white.withAlphaComponent(0.1).setFill()
            
            let window1 = CGRect(x: rect.minX + 8, y: rect.minY + 8, width: 30, height: 24)
            let window2 = CGRect(x: rect.minX + 14, y: rect.minY + 14, width: 30, height: 24)
            let window3 = CGRect(x: rect.minX + 20, y: rect.minY + 20, width: 30, height: 24)
            
            for window in [window1, window2, window3] {
                let windowPath = UIBezierPath(roundedRect: window, cornerRadius: 2)
                windowPath.fill()
                windowPath.lineWidth = 1
                windowPath.stroke()
            }
        }
    }
}

// MARK: - UIColor Extension

extension UIColor {
    convenience init?(hexString: String) {
        let hex = hexString.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            return nil
        }
        
        self.init(
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            alpha: Double(a) / 255
        )
    }
}
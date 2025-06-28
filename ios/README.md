# iOS Screen Time API Integration

This directory contains the native iOS implementation for integrating the Reality Check app with Apple's Screen Time API using the Family Controls framework.

## Overview

The iOS Screen Time integration provides:
- **App Blocking**: Block distracting apps with custom intervention screens
- **Usage Monitoring**: Track app usage patterns and trigger mindful interventions
- **Custom Shields**: Display personalized blocking screens with mindfulness prompts
- **Background Monitoring**: Monitor device activity even when the app is closed

## Files Structure

### Core Native Module
- `IOSScreenTimeModule.swift` - Main Swift implementation bridging React Native with iOS Screen Time API
- `IOSScreenTimeModule.m` - Objective-C bridge header exposing Swift methods to React Native

### Extensions
- `RealityCheckDeviceActivityMonitor.swift` - Background monitoring extension for app usage events
- `RealityCheckShieldConfiguration.swift` - Custom blocking screen configuration extension

### Configuration
- `RealityCheckDeviceActivityMonitor-Info.plist` - Device Activity Monitor extension configuration
- `RealityCheckShieldConfiguration-Info.plist` - Shield Configuration extension configuration

## Setup Requirements

### 1. Apple Developer Account
- **Paid Apple Developer Account** required (not available with free account)
- **Family Controls capability** must be enabled in your app identifier
- **Special approval from Apple** may be required for App Store distribution

### 2. Xcode Project Configuration

When building with Expo's development build or ejecting to bare React Native:

#### Add Capabilities
1. Open your iOS project in Xcode
2. Select your app target
3. Go to "Signing & Capabilities"
4. Add the following capabilities:
   - **Family Controls**
   - **App Groups** (with identifier: `group.com.realitycheck.app`)

#### Add Extensions
1. **Device Activity Monitor Extension**:
   - File → New → Target
   - Choose "Device Activity Monitor Extension"
   - Product Name: `RealityCheckDeviceActivityMonitor`
   - Bundle Identifier: `com.realitycheck.app.deviceactivity`

2. **Shield Configuration Extension**:
   - File → New → Target
   - Choose "Shield Configuration Extension"
   - Product Name: `RealityCheckShieldConfiguration`
   - Bundle Identifier: `com.realitycheck.app.shieldconfiguration`

#### Configure App Groups
1. Enable App Groups capability for:
   - Main app target
   - Device Activity Monitor extension
   - Shield Configuration extension
2. Use the same group identifier: `group.com.realitycheck.app`

### 3. Expo Configuration

The `app.config.js` has been updated with necessary entitlements:

```javascript
ios: {
  entitlements: {
    'com.apple.developer.family-controls': true,
    'com.apple.developer.deviceactivity': true,
    'com.apple.developer.managedsettings': true,
    'com.apple.security.application-groups': [
      'group.com.realitycheck.app'
    ]
  },
  infoPlist: {
    NSFamilyControlsUsageDescription: '...',
    NSDeviceActivityUsageDescription: '...',
    NSManagedSettingsUsageDescription: '...'
  }
}
```

## Usage

### 1. Initialize the Service

```typescript
import { IOSScreenTimeService } from '../services/IOSScreenTimeService';

const screenTimeService = new IOSScreenTimeService();

// Initialize and request permissions
const initialized = await screenTimeService.initialize();
if (initialized) {
  console.log('Screen Time API ready');
}
```

### 2. Select Apps to Block

```typescript
// Present Apple's app selection interface
const selectedApps = await screenTimeService.selectAppsToBlock();
console.log('Selected apps:', selectedApps);
```

### 3. Start Monitoring

```typescript
// Start background monitoring
const monitoring = await screenTimeService.startMonitoring({
  interventionThreshold: 5, // minutes
  warningThreshold: 3, // minutes
  enableRealityChecks: true
});
```

### 4. Configure Custom Shields

```typescript
// Customize the blocking screen
await screenTimeService.configureShield({
  title: 'Take a Mindful Moment',
  subtitle: 'Before continuing, let\'s pause for a reality check',
  primaryButtonLabel: 'Continue Mindfully',
  secondaryButtonLabel: 'Choose Different App',
  backgroundColor: '#6366F1'
});
```

## How It Works

### 1. Authorization Flow
1. App requests Family Controls authorization
2. User grants permission in iOS Settings
3. App can now access Screen Time APIs

### 2. App Selection
1. Present Apple's FamilyActivityPicker
2. User selects apps to monitor/block
3. App tokens are stored securely

### 3. Monitoring
1. DeviceActivityMonitor runs in background
2. Monitors usage of selected apps
3. Triggers interventions when thresholds are reached

### 4. Interventions
1. **Mindfulness Reminders**: Gentle notifications
2. **Reality Checks**: Prompt user reflection
3. **Temporary Blocks**: Short cooling-off periods
4. **Custom Shields**: Full blocking with mindful messaging

## Limitations

### Technical Limitations
- **iOS 15.0+** required
- **Device Activity Reports** require separate extension (not implemented yet)
- **Usage statistics** are limited compared to Android
- **Background execution** is restricted by iOS

### App Store Considerations
- **Special approval** may be required from Apple
- **Detailed justification** needed for Family Controls usage
- **Privacy policy** must clearly explain Screen Time data usage
- **Parental controls** use case is preferred by Apple

## Development Notes

### Testing
1. **Device testing required** - Screen Time APIs don't work in Simulator
2. **Development provisioning** must include Family Controls capability
3. **Extension debugging** requires separate debug sessions

### Debugging
- Check device logs for extension output
- Use shared UserDefaults for communication between app and extensions
- Monitor authorization status changes

### Common Issues
1. **Authorization denied**: Check Apple Developer account and capabilities
2. **Extensions not loading**: Verify bundle identifiers and Info.plist configuration
3. **Monitoring not working**: Ensure proper DeviceActivitySchedule setup

## Security Considerations

- **App tokens** are securely managed by iOS
- **Shared data** uses App Groups with restricted access
- **User privacy** is protected by iOS permission system
- **No personal data** is accessed without explicit user consent

## Future Enhancements

1. **DeviceActivityReport Extension**: Detailed usage analytics
2. **Web Content Filtering**: Block distracting websites
3. **Time-based Restrictions**: Schedule-based blocking
4. **Family Sharing**: Multi-user support
5. **Shortcuts Integration**: Siri voice commands

## Support

For issues with iOS Screen Time integration:
1. Check Apple's Family Controls documentation
2. Verify all entitlements and capabilities are properly configured
3. Test on physical iOS device (not Simulator)
4. Review device logs for extension errors

---

**Note**: This implementation requires a paid Apple Developer account and may need special approval for App Store distribution. The Screen Time API is primarily intended for parental control and digital wellness applications.
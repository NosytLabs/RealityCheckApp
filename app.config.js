module.exports = {
  expo: {
    runtimeVersion: "1.0.0",
    extra: {
      eas: {
        projectId: "2915938a-b44d-41d0-8f6a-2480c45d421f"
      }
    },
    name: 'RealityCheck',
    slug: 'realitycheck-2025',
    version: '2.0.0',
    owner: 'nosytlabs',
    scheme: 'realitycheck',
    platforms: ['ios', 'android', 'web'],
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.realitycheck.app'
    },
    android: {
      package: 'com.realitycheck.app'
    },
    web: {
      bundler: 'metro',
      output: 'server'
    },
    plugins: [
      "expo-dev-client",
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them.",
          cameraPermission: "The app accesses your camera to let you take photos."
        }
      ]
    ]
  }
};
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for web compatibility
config.resolver = {
  ...config.resolver,
  alias: {
    ...config.resolver.alias,
    'react-native-svg': 'react-native-svg/lib/module/index.web.js',
  },
  platforms: ['ios', 'android', 'native', 'web'],
};

module.exports = config;
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure react-native-svg is properly handled for web
config.resolver.alias = {
  'react-native-svg': 'react-native-svg/lib/commonjs/ReactNativeSVG.web.js',
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
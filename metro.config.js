const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for better module resolution
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

// Configure aliases for web compatibility
config.resolver.alias = {
  'react-native-svg': 'react-native-svg/lib/commonjs/ReactNativeSVG.web.js',
  // Add path polyfill for web
  'path': 'path-browserify',
};

// Ensure proper SVG handling for web
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Add transformer options for better compatibility
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Ensure path-browserify is transpiled
config.transformer.transformIgnorePatterns = [
  'node_modules/(?!(react-native|@react-native|react-native-.*|@react-navigation|@supabase|expo|@expo|lucide-react-native|path-browserify)/)/',
];

module.exports = config;
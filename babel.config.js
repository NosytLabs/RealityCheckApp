module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      '@babel/plugin-proposal-export-namespace-from',
      [
        '@svgr/babel-plugin-transform-react-native-svg',
        {
          "svgoConfig": {
            "plugins": [
              { "removeDimensions": true },
              { "removeViewBox": false }
            ]
          }
        }
      ]
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
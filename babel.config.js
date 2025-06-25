module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
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
    ]
  };
};
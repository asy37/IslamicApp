module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo'],
      'nativewind/babel',
    ],
    plugins: [
      // Required by NativeWind v4
      'react-native-reanimated/plugin',
      // Explicitly add react-native-worklets plugin if needed
      // Note: This may be required by nativewind/babel preset
      require.resolve('react-native-worklets/plugin'),
    ],
  };
};


module.exports = function(api) {
  api.cache(true);
  
  const plugins = [
    // NativeWind v4 / worklets
    require.resolve('react-native-worklets/plugin'),
  ];

  if (process.env.NODE_ENV === 'production') {
    plugins.push('transform-remove-console');
  }

  return {
    presets: [
      ['babel-preset-expo'],
      'nativewind/babel',
    ],
    plugins,
  };
};


// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add node polyfills/fallbacks
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        url: require.resolve("url/"),
        //  crypto: require.resolve("crypto-browserify"),
        //  buffer: require.resolve("buffer/"),
        //  etc.
      };

      return webpackConfig;
    },
  },
};
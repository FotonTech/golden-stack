const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');

const babelLoaderFinder = makeLoaderFinder('babel-loader');

const defaultOptions = {
  include: [],
};

function modify(baseConfig, { target, dev }, webpack, userOptions = {}) {
  const options = { ...defaultOptions, ...userOptions };
  const config = { ...baseConfig };

  config.resolve.extensions = [...config.resolve.extensions, '.ts', '.tsx'];

  config.node = { fs: 'empty' };

  // Safely locate Babel-Loader in Razzle's webpack internals
  const babelLoader = config.module.rules.find(babelLoaderFinder);
  if (!babelLoader) {
    throw new Error(`'babel-loader' was erased from config, we need it to define typescript options`);
  }

  babelLoader.test = [babelLoader.test, /\.tsx?$/];
  babelLoader.include = [...babelLoader.include, ...options.include];
  babelLoader.use[0].options = {
    babelrc: false,
    cacheDirectory: true,
    presets: [['module:@golden-stack/babel-web', { target }]],
  };

  if (target === 'web' && dev) {
    // As suggested by Microsoft's Outlook team, these optimizations
    // crank up Webpack x TypeScript perf.
    // @see https://medium.com/@kenneth_chau/speeding-up-webpack-typescript-incremental-builds-by-7x-3912ba4c1d15
    config.output.pathinfo = false;
    config.optimization = {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    };
  }

  return config;
}

module.exports = modify;

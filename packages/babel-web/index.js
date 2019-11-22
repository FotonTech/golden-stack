// @ts-check

/**
 *
 * @param {import('@babel/core').ConfigAPI} api
 * @param {{ target: 'web' | 'node' }}
 */
function preset(api, { target = 'node' }) {
  api.cache.forever();
  const presetEnvOptions = {
    modules: false,
  };
  if (target === 'node') {
    presetEnvOptions.targets = {
      node: 'current',
    };
  }
  return {
    presets: ['@babel/preset-react', ['@babel/preset-env', presetEnvOptions], '@babel/preset-typescript'],
    plugins: [
      // 'loadable-components/babel',
      'babel-plugin-idx',
      'babel-plugin-styled-components',
      [
        'relay',
        {
          schema: 'data/schema.graphql',
        },
      ],
      // 'lodash',
      'react-hot-loader/babel',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-optional-chaining',
    ],
    // FIXME does a preset allow such kind of config preset?
    env: {
      test: {
        presets: ['@babel/preset-react', ['@babel/preset-env', presetEnvOptions], '@babel/preset-typescript'],
        plugins: [
          'babel-plugin-idx',
          '@babel/plugin-transform-runtime',
          'dynamic-import-node',
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-export-default-from',
          '@babel/plugin-proposal-export-namespace-from',
        ],
      },
    },
  };
}

module.exports = preset;

const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotEnv = require('dotenv-webpack');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HappyPack = require('happypack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// already required by webpack
// const WorkboxPlugin = require('workbox-webpack-plugin');

const cwd = process.cwd();

module.exports = {
  // https://webpack.js.org/concepts/mode/
  mode: 'production',
  context: path.join(cwd, './'),
  entry: './src/index.tsx',
  // devtool: 'source-map',
  output: {
    path: path.join(cwd, 'build'),
    publicPath: '/',
    filename: 'static/js/[chunkhash].js',
    chunkFilename: 'static/js/chunk-[id]-[chunkhash].js',
  },
  resolve: {
    modules: [path.join(cwd, 'src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        exclude: [/node_modules/],
        use: 'happypack/loader?id=js',
        include: [path.join(cwd, 'src'), path.join(cwd, '../')],
      },
      {
        test: /\.(jpg|png|gif|svg|ttf|woff(2)?)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash].[ext]',
              outputPath: 'static/img/',
            },
          },
        ],
      },
      {
        test: /\.(pdf|csv|xlsx)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash].[ext]',
              outputPath: 'static/media/',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: 'happypack/loader?id=styles',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new dotEnv({
      path: './.env',
    }),
    new HappyPack({
      id: 'js',
      threads: 4,
      loaders: ['babel-loader'],
    }),
    new HappyPack({
      id: 'styles',
      threads: 2,
      loaders: ['style-loader', 'css-loader'],
    }),
    // new FaviconsWebpackPlugin({
    //   logo: './src/static/logo.svg',
    //   prefix: 'static/icons/[hash]/',
    // }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunksSortMode: 'none',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    // new WorkboxPlugin.InjectManifest({
    //   swSrc: path.join(cwd, './src/sw.js'),
    //   swDest: 'sw.js',
    // }),
  ],
};

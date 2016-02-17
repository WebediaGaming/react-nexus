import webpack from 'webpack';

import babelConfig from './config/babel';
const webpackConfig = (env) => ({
  target: 'web',
  debug: env === 'prod',
  devtool: 'eval',
  module: {
    noParse: ['/^fb$/'],
    loaders: [
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader',
      },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          ignore: ['node_modules', 'dist'],
          plugins: babelConfig.browser[env].plugins,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.ProvidePlugin({
      'Promise': 'bluebird',
    }),
    new webpack.optimize.DedupePlugin(),
  ],
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
});
export default webpackConfig;

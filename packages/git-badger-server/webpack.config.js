const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
    libraryTarget: 'umd'
  },
  externals: [nodeExternals()],
  target: 'node',
  entry: {
    app: path.resolve('server.js')
  },
  module: {
    rules: [
      {
        test: /js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};

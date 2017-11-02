const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  output: {
    filename: 'app.js',
    path: path.resolve('dist')
  },
  externals: [nodeExternals()],
  target: 'node',
  entry: {
    app: path.resolve('index.js')
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

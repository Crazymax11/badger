const path = require('path');
const nodeExternals = require('webpack-node-externals');

const nodeSide = {
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

const web = {
  output: {
    filename: 'web.js',
    path: path.resolve('dist')
  },
  entry: {
    web: path.resolve('web/app.js')
  },
  module: {
    rules: [
      {
        test: /vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      }
    ]
  }
};

module.exports = [web];

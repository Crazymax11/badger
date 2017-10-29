const path = require('path');

module.exports = {
  target: 'node',
  output: {
    path: path.resolve('dist'),
    filename: 'app.js'
  },
  entry: path.resolve('src/app.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};

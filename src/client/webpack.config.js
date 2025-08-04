const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/client/index.js', // ✅ fix: path should not start with '/.' — it's relative
  output: {
    path: path.resolve(__dirname, 'dist'), // ✅ add output path
    filename: 'main.js', // ✅ add output filename
  },
  mode: 'development', // ✅ optional, useful during dev
  module: {
    rules: [
      {
        test: /\.js$/, // ✅ fix: regex had a typo
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  return {
    mode: isProd ? 'production' : 'development',
    target: 'web',
    entry: './src/client/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? 'main.[contenthash].js' : 'main.js',
      clean: true,
    },
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } } },
        { test: /\.(s[ac]ss|css)$/i, use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader','css-loader','sass-loader'] },
        { test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i, type: 'asset/resource' }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      ...(isProd ? [new MiniCssExtractPlugin({ filename: 'main.[contenthash].css' })] : [])
    ],
    optimization: { minimize: isProd, minimizer: ['...', new CssMinimizerPlugin()] }
  };
};

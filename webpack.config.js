const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fse = require('fs-extra');

/*
  Because I didn't bother making CSS part of our
  webpack workflow for this project I'm just
  manually copying the CSS file to the DIST folder. 
*/
class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap('Copy files', function () {
      fse.copySync('./app/css/main.css', './dist/css/main.css');
    });
  }
}

config = {
  entry: './app/Main.js',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'app'),
    filename: 'bundled.js',
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '.env'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index-template.html',
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', ['@babel/preset-env', { targets: { node: '12' } }]],
          },
        },
      },
      { test: /\.css$/, use: 'css-loader' },
    ],
  },
};

if (currentTask == 'webpackDev' || currentTask == 'dev') {
  config.devtool = 'source-map';
  config.devServer = {
    port: 3000,
    contentBase: path.join(__dirname, 'app'),
    hot: true,
    historyApiFallback: { index: 'index.html' },
  };
}

if (currentTask == 'webpackBuild') {
  config.plugins.push(new CleanWebpackPlugin(), new RunAfterCompile());
  config.mode = 'production';
  config.output = {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  };
}

module.exports = config;

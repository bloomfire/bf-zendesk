'use strict';

const path    = require('path'),
      webpack = require('webpack');

const PATHS = {
  src: path.join(__dirname, '/src'),
  styles: path.join(__dirname,'/src/less'),
  dist: path.join(__dirname, '/app/assets/dist')
};



module.exports = {
  entry: './src/index.js',
  output: {
    path: PATHS.dist,
    filename: 'bundle.js',
    publicPath: '/src/assets/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: PATHS.src,
        options: {
          presets: [
            'es2015',
            'react'
          ]
        }
      },
      {
        test: /\.less$/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'less-loader'
        ],
        include: PATHS.styles
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
        include: PATHS.src
      }
    ]
  },
  devtool: 'source-map'
};



// TODO: make dev/prod versions (see: https://blog.hellojs.org/setting-up-your-react-es6-development-environment-with-webpack-express-and-babel-e2a53994ade)
// TODO: use extract-text-webpack-plugin to generate standalone CSS file (see: https://github.com/webpack/extract-text-webpack-plugin/issues/250)

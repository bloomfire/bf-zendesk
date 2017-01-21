'use strict';

const path              = require('path'),
      webpack           = require('webpack');



module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/app', '/assets'),
    filename: 'bundle.js',
    publicPath: '/src/assets/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, '/src'),
        exclude: /node_modules/,
        options: {
          presets: [
            'es2015',
            'react'
          ]
        }
      },
      {
        test: /\.less$/,
        include: path.join(__dirname, '/src', '/less'),
        exclude: /node_modules/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'less-loader'
        ]
      }
    ]
  }
};



// TODO: make dev/prod versions (see: https://blog.hellojs.org/setting-up-your-react-es6-development-environment-with-webpack-express-and-babel-e2a53994ade)
// TODO: use extract-text-webpack-plugin to generate standalone CSS file (see: https://github.com/webpack/extract-text-webpack-plugin/issues/250)

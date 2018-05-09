const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-dnd',
      'react-dnd-html5-backend',
      'react-style-proptype',
      'redux-logger',
      'dnd-core',
      'dva-core',
      'redux-persist',
      'zrender',
      'react-split-pane',
      'redux-saga',
      'babel-polyfill',
      'antd',
      'echarts',
      'moment',
      'lodash',
      'core-js',
      'immutable',
      'draft-js',
      'rc-calendar',
      'rc-cascader',
      'rc-form',
      'rc-table',
      'rc-menu',
      'rc-tree',
      'rc-editor-core',
      'rc-select',
      'rc-dialog',
      'rc-tree-select',
      'rc-time-picker',
      'rc-tabs',
      'rc-upload',
      'rc-pagination',
      'rc-trigger',
      'rc-animate',
      'inline-style-prefixer',
      'core-decorators',
      'fbjs',
      'localforage',
      'history',
      'element-resize-detector',
      'async-validator',
      'ua-parser-js',
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].dll.js',
    library: '[name]_library',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../dist', '[name]-manifest.json'),
      name: '[name]_library',
    }),
    new CleanWebpackPlugin(
      ['../dist/*.js(on)?'],
      {
        root: __dirname,
        verbose: true,
        dry: false,
      }
    ),
  ],
};

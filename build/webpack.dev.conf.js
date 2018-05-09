var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var HappyPack = require('happypack')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var theme = require('../src/theme')

if (config.dev.enableHMR) {
  // add hot-reload related code to entry chunks
  Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
  })
}

var cssLoaders = utils.getCSSLoaders({
  disableCSSModules: !config.cssModules,
  sourceMap: config.dev.cssSourceMap
});

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'happypack/loader?id=jsx',
        include: config.src,
        exclude: [
          resolve('node_modules'),
          resolve('build'),
          resolve('dist'),
          resolve('config'),
        ],
      },
      {
        test: /\.css$/,
        include: config.src,
        use: ['style-loader'].concat(cssLoaders.own)
      },
      {
        test: /\.less$/,
        include: config.src,
        exclude: [
          resolve('node_modules'),
          resolve('build'),
          resolve('dist'),
          resolve('config'),
        ],
        use: ['style-loader'].concat(cssLoaders.own).concat({
          loader: 'less-loader',
          options: {
            modifyVars: theme
          }
        })
      },
      {
        test: /\.css$/,
        include: config.appNodeModules,
        use: ['style-loader'].concat(cssLoaders.nodeModules)
      },
      {
        test: /\.less$/,
        include: config.appNodeModules,
        exclude: [
          resolve('src'),
          resolve('build'),
          resolve('dist'),
          resolve('config'),
        ],
        use: ['style-loader'].concat(cssLoaders.nodeModules).concat({
          loader: 'less-loader',
          options: {
            modifyVars: theme
          }
        })
      }
    ]
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: false,
      template: 'index.html',
      chunks: ['index'],
      lang: 'en',
      title: '华泰证券理财平台',
      meta: [
        {
          name: 'charset',
          content: 'utf-8'
        }
      ]
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'newIndex.html',
      template: 'newIndex.html',
      chunks: ['newIndex'],
      inject: true
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../dist/vendor-manifest.json'),
    }),
    new HappyPack({
      id: 'jsx',
      threads: 4,
      loaders: [ 'babel-loader' ]
    }),
    new FriendlyErrorsPlugin()
  ]
})

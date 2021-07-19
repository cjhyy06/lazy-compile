const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const { createDLLReferencePlugin, buildHtmlWebpackIncludeAssets } = require('./util')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const WebpackRemoveStrictModePlugin = require('@qcc/webpack-remove-strict-mode-plugin')

module.exports = {
  mode: 'development',
  name: 'index',
  context: path.resolve(__dirname),
  entry: {
    index: [
      './src/client.js',
      'webpack-hot-middleware/client?name=index&overlay=true&reload=true'
    ]
  },
  devtool: 'source-map',

  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    unsafeCache: true,
    symlinks: false,
  },
  resolveLoader: {
    modules: ['node_modules']
  },

  watchOptions: {
    aggregateTimeout: 3000,
    poll: 1000
  },

  experiments: {
    lazyCompilation: {
      imports: true,
      entries: false
    }
  },

  module: {
    rules: [

      {
        test: /\.js$/i,
        include: path.join(process.cwd(), 'src'),
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.vue$/i,
        include: path.join(process.cwd(), 'src'),
        use: [
          {
            loader: 'vue-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [
          { loader: 'vue-style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
          }
        ]
      },
    ]
  },
  plugins: [
    ...createDLLReferencePlugin(),
    new copyWebpackPlugin({
      patterns: [
        path.resolve(path.join(__dirname, 'vendors'))
      ]
    }),
    new VueLoaderPlugin(),
    new MomentLocalesPlugin(),

    new WebpackRemoveStrictModePlugin(),

    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true
    }),

    new HtmlWebpackTagsPlugin(buildHtmlWebpackIncludeAssets()),

  ]
}
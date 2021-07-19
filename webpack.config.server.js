const webpack = require('webpack')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'development',
  target: 'node',
  devtool: 'source-map',
  entry: ['@babel/polyfill', './src/server.js'],
  cache: false,
  output: {
    path: path.join(process.cwd(), 'public'),
    filename: 'app.js',
    libraryTarget: 'commonjs2',
    publicPath: '/'
  },
  node: {
    __filename: false,
    __dirname: false
  },

  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(path.join(__dirname, '..', '..', 'src')) // 指向src
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/i,
        use: [
          {
            loader: 'babel-loader',
            options: {

            }
          }
        ],
        include: [path.join(process.cwd(), 'src')]
      },

      {
        test: /\.(ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name]-[contenthash:8].[ext]',
          emit: false
        }
      },
      {
        test: /\.(webp|mp4|webm|wav|mp3|m4a|aac|oga)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name]-[contenthash:8].[ext]',
          emit: false
        }
      },
      {
        test: /\.(woff2?|ttf|eot|svg)(\?[\s\S])?$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name]-[contenthash:8].[ext]',
          emit: false
        }
      }
    ]
  },

  externals: [
    ({ context, request }, callback) => {
      const isExternal =
        // the module name start with ('@' or 'a-z') character and contains 'a-z' or '/' or '.' or '-' or '0-9'
        request.match(/^[@a-z][a-z/.\-0-9]*$/i) && !request.match(/\.(css|less|scss)$/i)
      // environment config file, auto generated during build
      callback(null, Boolean(isExternal))
    }
  ],

  plugins: [
    new webpack.DefinePlugin({
      __BROWSER__: false,
      __BUILD__: true
    }),

    new webpack.BannerPlugin({
      banner: 'require(\'source-map-support\').install();process.env.NODE_ENV=\'production\';',
      raw: true,
      entryOnly: true
    }),

    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            drop_console: true
          },
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: true
        }
      })]
  },

  stats: {
    colors: true,
    warnings: true
  }
}

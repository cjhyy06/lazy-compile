const path = require('path')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config')
const webpack = require('webpack')
const configServer = require('./webpack.config.server')
const cp = require('child_process')
const browserSync = require('browser-sync')


async function start() {

  await new Promise(resolve => {
    (async () => {
      let watchOptions = {
        aggregateTimeout: 200,
        poll: true
      }
      let multiCompileModeConfig = [config]
      const serverCompiler = webpack(configServer)
      const clientCompiler = webpack(multiCompileModeConfig)

      const wpDevMiddleware = webpackDevMiddleware(clientCompiler, {
        publicPath: config.output.publicPath
      })

      const wpHotMiddleware = webpackHotMiddleware(clientCompiler.compilers.find(compiler => compiler.name === 'index'))
      let bs = null

      let handleServerBundleCompleted = () => {
        startServer()
        bs = browserSync.create()
        bs.init({
          port: 90,
          proxy: {
            target: `http://localhost:3000`,
            middleware: [
              require('connect-history-api-fallback')({
                verbose: false,
                rewrites: [

                ]
              }),
              wpDevMiddleware,
              wpHotMiddleware
            ],
            proxyOptions: {
              xfwd: true
            }
          }
        }, resolve)

        handleServerBundleCompleted = () => {
          startServer()
          setTimeout(() => { bs.reload() }, 1000)
        }
      }

      let server = null
      const format = (time) => {
        return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '[$1] ')
      }
      const onStdOut = (data) => {
        const match = data.toString('utf8').match(/Listening at http:\/\/(.*?)\//)
        process.stdout.write(format(new Date()))
        process.stdout.write(data)

        if (match) {
          server.stdout.removeListener('data', onStdOut)
          server.stdout.on('data', x => process.stdout.write(x))
        }
      }

      const startServer = function () {
        if (server) {
          server.kill('SIGTERM')
        }


        server = cp.spawn('node', ['./app'], {
          env: Object.assign({
            NODE_ENV: 'development'
          }, process.env),
          silent: false,
          cwd: path.join(process.cwd(), 'public')
        })

        server.stdout.on('data', onStdOut)
        server.stderr.on('data', x => process.stderr.write(x))
      }

      serverCompiler.watch({
        aggregateTimeout: watchOptions.aggregateTimeout,
        poll: watchOptions.poll,
        ignored: ['src/**/*.scss']
      }, (err, stats) => {
        if (err) {
          console.error(err) // eslint-disable-line
        }
        handleServerBundleCompleted(stats)
      })

      process.on('exit', () => {
        if (server) {
          server.kill('SIGTERM')
        }
      })

    })()
  })
}

start()
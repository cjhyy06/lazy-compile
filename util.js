const settings = require('./vendor-setting')
const webpack = require('webpack')
const path = require('path')
const createDLLReferencePlugin = () => {
  let result = []
  Object.keys(settings).forEach(key => {
    result.push(
      new webpack.DllReferencePlugin({
        manifest: require(path.join(process.cwd(), 'vendors', `${key}-manifest.json`))
      })
    )
  })

  return result
}

const buildHtmlWebpackIncludeAssets = () => {
  let result = []
  Object.keys(settings).forEach(key => {
    result.push(
      path.join(`${key}.dll.js`)
    )
  })
  return {
    scripts: result,
    append: false,
    usePublicPath: true,
    hash: true
  }
}

module.exports = { createDLLReferencePlugin, buildHtmlWebpackIncludeAssets }
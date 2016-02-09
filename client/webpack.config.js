import webpack from 'webpack'
import {join} from 'path'
import {readFileSync} from 'fs'

const entry = {
  main: [
    join(__dirname, 'node_modules', 'babel-core', 'browser-polyfill.js'),
    './app/scripts/main.js'
  ]
}

const worker = {
  output: {
    filename: '[hash].worker.js',
    chunkFilename: '[id].[hash].worker.js'
  }
}

const output = {
  path: join(__dirname, 'dist/js'),
  filename: 'app.js'
}

const resolve = {
  extensions: ['', '.webpack.js', '.web.js', '.js', '.json']
}

const plugins = [
  new webpack.DefinePlugin({
    'global.GENTLY': false
  }),
  new webpack.ProvidePlugin({
    'window.React': 'react'
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
]

const node = {
  __dirname: true
}

const babelOpts = JSON.parse(readFileSync('./.babelrc'))

const noParse = [
  /\/babel-core\/browser-polyfill\.js$/,
  /\/scripts\/vendors\/primus\.js/,
  /\/scripts\/vendors\/gunzip\.js/,
  /\/dist\/braintree\.js/
]

const loaders = [{
  test: /clipboard(-action)?\.js/,
  loader: 'babel-loader'
}, {
  test: /react\-infinite[\/\\]src[\/\\].*\.js/,
  loader: 'babel-loader'
}, {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader'
}, {
  test: /\.json$/,
  exclude: /node_modules/,
  loader: 'json'
}, {
  test: /blueimp/,
  loader: 'imports?define=>false'
}, {
  test: /worker.*\.js$/,
  exclude: /node_modules/,
  loader: 'worker?inline!babel-loader'
}]

module.exports.development = {
  debug: true,
  devtool: 'eval-source-map',
  entry: entry,
  webworker: worker,
  babel: babelOpts,
  output: {
    publicPath: 'http://localhost:3001/',
    ...output
  },
  resolve: resolve,
  module: {
    noParse: noParse,
    loaders: loaders
  },
  plugins: plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ]),
  node: node
}

module.exports.production = {
  debug: false,
  entry: entry,
  babel: babelOpts,
  output: {
    publicPath: '/js/',
    ...output
  },
  webworker: worker,
  resolve: resolve,
  module: {
    noParse: noParse,
    loaders: loaders
  },
  plugins: plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin()
  ]),
  node: node
}

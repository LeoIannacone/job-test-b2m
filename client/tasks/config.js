//
// Configuration
// =============
//

import gulpPlugins from 'gulp-load-plugins'

const $ = gulpPlugins()

// Set variable via $ gulp --type production
const environment = $.util.env.type || 'development'
const isProduction = environment === 'production'
const webpackConfig = require('../webpack.config.js')[environment]

export default {
  environment,
  isProduction,
  webpackConfig,
  port: $.util.env.port || 3001,
  app: 'app/',
  dist: 'dist/',
  printOpts: {
    verbose: 'debug',
    prefix: '/'
  },
  browsers: [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 6',
    'opera >= 23',
    'ios >= 6',
    'android >= 4.4',
    'bb >= 10'
  ]
}

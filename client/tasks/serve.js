//
// Serve task
// ==========
//

import gulp from 'gulp'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import gulpPlugins from 'gulp-load-plugins'

import {dist, port, webpackConfig} from './config'

const $ = gulpPlugins()

gulp.task('serve', () => {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35729
    },
    middleware() {
      const compiler = webpack(webpackConfig)

      return [
        webpackMiddleware(compiler, {
          inline: true,
          stats: {
            chunks: false
          }
        })
      ]
    }
  })
})

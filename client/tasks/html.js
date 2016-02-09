//
// HTML task
// =========
//

import gulp from 'gulp'
import gulpPlugins from 'gulp-load-plugins'

import {loadManifests} from './helpers'

import {
  app,
  dist,
  isProduction,
  printOpts
} from './config'

const $ = gulpPlugins()

// copy html from app to dist
gulp.task('html', () => {
  if (isProduction) {
    const manifest = loadManifests([
      'rev-css',
      'rev-fonts',
      'rev-images',
      'rev-js'
    ])

    return gulp.src(app + 'index.html')
      .pipe($.replace('http://localhost:3001', 'js'))
      .pipe($.fingerprint(manifest, printOpts))
      .pipe(gulp.dest(dist))
      .pipe($.size({title: 'html'}))
  }

  return gulp.src(app + 'index.html')
    .pipe(gulp.dest(dist))
    .pipe($.size({title: 'html'}))
    .pipe($.connect.reload())
})

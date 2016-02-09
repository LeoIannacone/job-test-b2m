// JavaScript Task
// ===============
//
// * Build webpack
// * Minify JS
// * Rev file and generate manifest
// * Generate Sourcemaps
// * Set config file depending on the environment
//

import {join} from 'path'
import gulp from 'gulp'
import gulpPlugins from 'gulp-load-plugins'
import RevAll from 'gulp-rev-all'

import {loadManifests} from './helpers'

import {
  webpackConfig,
  dist,
  printOpts
} from './config'

const $ = gulpPlugins()

gulp.task('js', () => {
  const rev = new RevAll({
    dontUpdateReference: [/app/g],
    fileNameManifest: 'rev-js.json'
  })

  const manifest = loadManifests([
    'rev-fonts',
    'rev-images'
  ])

  return gulp.src('app/scripts/main.js')
    .pipe($.webpack(webpackConfig))
    .pipe($.uglify())
    .pipe($.rename(path => {
      path.dirname = join('js', path.dirname)
    }))
    .pipe($.fingerprint(manifest, {
      mode: 'replace',
      ...printOpts
    }))
    .pipe(rev.revision())
    .pipe(gulp.dest(dist))
    .pipe($.size({title: 'js'}))
    .pipe(rev.manifestFile())
    .pipe(gulp.dest(dist))
})

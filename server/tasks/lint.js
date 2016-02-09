//
// Lint task
// =========
//

import gulp from 'gulp'
import gulpPlugins from 'gulp-load-plugins'

const $ = gulpPlugins()

gulp.task('lint', () => {
  return gulp.src([
    'app/scripts/**/*.js',
    'test/**/*.js',
    'gulpfile.js',
    'tasks/*.js',
    'webpack.config.js'
  ])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
})

//
// Test task
// =========
//

import gulp from 'gulp'
import gulpPlugins from 'gulp-load-plugins'

import {app} from './config'

const $ = gulpPlugins()

function _getTest() {
  return gulp.src([
    'test/bootstrap.js',
    'test/components/**/*.js',
    'test/pages/**/*.js',
    'test/mixins/**/*.js',
    'test/stores/**/*.js',
    'test/addons/**/*.js',
    'test/helpers/**/*.js',
    'test/actions/**/*.js'
  ], {read: false})
  .pipe($.mocha({
    timeout: 10000,
    reporter: 'dot'
  }))
}

gulp.task('_test', () => {
  return _getTest()
})

gulp.task('test', () => {
  return _getTest().on('end', () => process.exit(0))
})

gulp.task('bdd', () => {
  gulp.watch(app + 'scripts/**/*.js', ['_test'])
  gulp.watch('test/**/*.js', ['_test'])
})

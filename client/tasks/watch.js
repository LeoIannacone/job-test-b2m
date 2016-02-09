//
// Watch task
// ==========
//

import gulp from 'gulp'

import {app} from './config'

// watch less, html and js file changes
gulp.task('watch', () => {
  gulp.watch(app + 'styles/**/*.less', ['styles'])
  gulp.watch(app + 'index.html', ['html'])
})

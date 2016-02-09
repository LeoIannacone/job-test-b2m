import gulp from 'gulp'
import del from 'del'
import gulpPlugins from 'gulp-load-plugins'

const $ = gulpPlugins()

gulp.task('coverage:clean', () => {
  del('coverage')
})

gulp.task('coverage', ['coverage:clean'], () => {
  gulp.src(['app/**/*.js'])
    .pipe($.babelIstanbul()) // Covering files
    .pipe($.babelIstanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', () => {
      gulp.src(['test/**/*.js'])
        .pipe($.mocha({
          reporter: 'dot'
        }))
        .pipe($.babelIstanbul.writeReports()) // Creating the reports after tests ran
        .pipe($.babelIstanbul.enforceThresholds({
          thresholds: { global: 100 } // Enforce a coverage of at least 90%
        }))
        .on('error', ({message}) => {
          console.error(message)
          process.exit(1)
        })
        .on('end', () => {
          process.exit(0)
        })
    })
})

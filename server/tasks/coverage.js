import gulp from 'gulp'
import del from 'del'
import gulpPlugins from 'gulp-load-plugins'

const $ = gulpPlugins()

const handlErrors = ({message}) => {
  console.error(message)
  process.exit(1)
}

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
        })
        .on('error', handlErrors))
        .pipe($.babelIstanbul.writeReports()) // Creating the reports after tests ran
        .pipe($.babelIstanbul.enforceThresholds({
          thresholds: { global: 100 } // Enforce a coverage of at least 90%
        }))
        .on('error', handlErrors)
        .on('end', () => {
          process.exit(0)
        })
    })
})

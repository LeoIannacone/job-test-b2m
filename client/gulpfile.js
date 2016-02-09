/* eslint no-var:0 */

//
// Gulpfile
// ========
//

var gulp = require('gulp')
var sequence = require('run-sequence')

// Setup babel transforms for tests and other task definitions
require('babel/register')({
  ignore: [
    /node_modules[\/\\](?!react\-infinite[\/\\]src[\/\\])/,
    'node_modules/worker-loader/index.js?inline!*'
  ]
})

// Load all tasks from the tasks directory
require('require-dir')('tasks')

// Define aggregate tasks

gulp.task('default', ['lint', 'build-dev', 'serve', 'watch'])

gulp.task('build-dev', ['clean'], function () {
  gulp.start(['images', 'fonts', 'html', 'styles'])
})

// waits until clean is finished then builds the project
gulp.task('build', function (done) {
  sequence(
    'clean',
    ['images', 'fonts'],
    ['styles', 'js'],
    'html',
    done
  )
})

/* eslint no-var:0 */

//
// Gulpfile
// ========
//

var gulp = require('gulp')

// Setup babel transforms for tests and other task definitions
require('babel/register')({
  ignore: [
    'node_modules/**'
  ]
})

// Load all tasks from the tasks directory
require('require-dir')('tasks')

// Define aggregate tasks

gulp.task('serve', [], function () {
  require('./app/server')
})

gulp.task('default', ['serve'])


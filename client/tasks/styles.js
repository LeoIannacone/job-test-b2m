//
// Styles task
// ===========
//

import gulp from 'gulp'
import {join} from 'path'
import gulpPlugins from 'gulp-load-plugins'
import combiner from 'stream-combiner2'
import NpmImportPlugin from 'less-plugin-npm-import'
import lessPluginGlob from 'less-plugin-glob'
import RevAll from 'gulp-rev-all'

import {loadManifests} from './helpers'

import {
  app,
  dist,
  isProduction,
  printOpts,
  browsers
} from './config'

const $ = gulpPlugins()

gulp.task('images', () => {
  const images = join(app, 'images/**/*.{png,svg,jpg,jpeg,gif}')
  if (isProduction) {
    const rev = new RevAll({
      fileNameManifest: 'rev-images.json'
    })
    return gulp.src(images)
      .pipe($.rename(path => {
        path.dirname = join('images', path.dirname)
      }))
      .pipe(rev.revision())
      .pipe(gulp.dest(dist))
      .pipe($.size({title: 'images'}))
      .pipe(rev.manifestFile())
      .pipe(gulp.dest(dist))
  }

  return gulp.src(images)
    .pipe(gulp.dest(join(dist, 'images')))
    .pipe($.size({title: 'images'}))
})

gulp.task('fonts', () => {
  const fonts = join(app, 'fonts/*')
  if (isProduction) {
    const rev = new RevAll({
      fileNameManifest: 'rev-fonts.json'
    })

    return gulp
      .src(fonts)
      .pipe($.rename(path => {
        path.dirname = join('fonts', path.dirname)
      }))
      .pipe(rev.revision())
      .pipe(gulp.dest(dist))
      .pipe($.size({title: 'fonts'}))
      .pipe(rev.manifestFile())
      .pipe(gulp.dest(dist))
  }

  return gulp
    .src(fonts)
    .pipe($.size({title: 'fonts'}))
    .pipe(gulp.dest(join(dist, 'fonts')))
})

gulp.task('styles', () => {
  const less = join(app, 'styles/main.less')

  if (isProduction) {
    const rev = new RevAll({
      fileNameManifest: 'rev-css.json'
    })

    const manifest = loadManifests([
      'rev-fonts',
      'rev-images'
    ])

    return gulp.src(less)
      .pipe($.less({
        plugins: [
          new NpmImportPlugin(),
          lessPluginGlob
        ]
      }))
      .pipe($.autoprefixer({browsers}))
      .pipe($.fingerprint(manifest, printOpts))
      .pipe($.minifyCss({
        keepSpecialComments: false
      }))
      .pipe($.rename(path => {
        path.dirname = join('css', path.dirname)
      }))
      .pipe(rev.revision())
      .pipe(gulp.dest(dist))
      .pipe($.size({title: 'css'}))
      .pipe(rev.manifestFile())
      .pipe(gulp.dest(dist))
  }

  const combined = combiner.obj([
    gulp.src(less),

    $.less({
      plugins: [
        new NpmImportPlugin(),
        lessPluginGlob
      ]
    }),

    $.autoprefixer({browsers}),

    gulp.dest(join(dist, 'css')),

    $.size({title: 'css'}),

    $.connect.reload()
  ])

  combined.on('error', $.util.log.bind($.util))

  return combined
})

'use strict';

var del = require('del');                          // NodeJS delete files
var gulp = require('gulp');                        // Gulp
var gulpJade = require('gulp-jade');               // Jade
var sass = require('gulp-sass');                   // Sass/SCSS
var cssmin = require('gulp-cssmin');               // CSS minification
var rename = require('gulp-rename');               // Rename files
var autoprefixer = require('gulp-autoprefixer');   // Autoprefixer
var sourcemaps = require('gulp-sourcemaps');       // Source Maps
var newer = require('gulp-newer');                 // Only new files by date
var debug = require('gulp-debug');                 // Show debug info
var browserSync = require('browser-sync');         // Browser Sync
var notify = require('gulp-notify');               // Явно показывает уведомление об ошибке`
var plumber = require('gulp-plumber');             // модифицирует .pipe на всех потоках таска
var source = require('vinyl-source-stream');
var browserify = require('browserify');



/**
 * Copy images
 */
gulp.task('image', function(){
  return gulp.src(['img/*.*'])
    .pipe(gulp.dest('site/sample/lib/img'))
});

/**
 * Copy js
 */
gulp.task('js', function(){
  return gulp.src(['js/*.js'])
    .pipe(gulp.dest('site/sample/lib/js'))
});

/**
 * Build scss
 */
gulp.task('scss', function () {
  return gulp.src('scss/common.scss')
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {
          title: 'SCSS Error',
          message: err.message
        };
      })
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
});

/**
 * Samples build
 */

gulp.task('sample:build', function () {
  return gulp.src('sample/*.jade')
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {
          title: 'Jade Error',
          message: err.message
        };
      })
    }))
    .pipe(gulpJade({pretty: true}))
    .pipe(gulp.dest('site/sample'))
});

gulp.task('sample:css:copy', function() {
  return gulp.src('dist/css/**/*')
    // .pipe(newer('site/sample/lib/css'))
    .pipe(gulp.dest('site/sample/lib/css'))
});

gulp.task('sample:fonts:copy', function() {
  return gulp.src('fonts/**/*')
    .pipe(newer('site/sample/lib/fonts'))
    .pipe(gulp.dest('site/sample/lib/fonts'))
});

gulp.task('sample:js:copy', function() {
  console.log('yes');
  return gulp.src('dist/js/**/*')
    .pipe(gulp.dest('site/sample/lib/js'))
});

gulp.task('sample:clean', function() {
  return del('site/sample/*');
});

gulp.task('clean', gulp.series('sample:clean',  function(){
  return del(['dist/*', 'site']);
}));

gulp.task('bootstrap:js', function(){
  return gulp.src(['node_modules/bootstrap/dist/js/*.js'])
    .pipe(gulp.dest('site/sample/lib/js'))
});
gulp.task('bootstrap:fonts', function(){
  return gulp.src(['node_modules/bootstrap/dist/fonts/*.*'])
    .pipe(gulp.dest('site/sample/lib/fonts'))
});
gulp.task('bootstrap:css', function(){
  return gulp.src(['node_modules/bootstrap/dist/css/*.css'])
    .pipe(gulp.dest('site/sample/lib/css'))
});

gulp.task('bootstrap', gulp.series('bootstrap:js', 'bootstrap:fonts', 'bootstrap:css'));

gulp.task('sample:css', gulp.series('scss', 'sample:css:copy'));

gulp.task('sample', gulp.series( 'sample:build', 'sample:css', 'sample:fonts:copy', 'sample:js:copy', 'image', 'js', 'bootstrap'));




/**
 * Run browser sync
 */
gulp.task('serve:sample', function () {
  browserSync({
    server: {
      baseDir: "site/sample"
    },
    port: 3000,
    notify: true
  });

  browserSync.watch('site/sample/**/*').on('change', browserSync.reload);
});




gulp.task('run:sample', gulp.series('sample', gulp.parallel('serve:sample')));

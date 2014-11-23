require('6to5/polyfill');
var Promise = require('lodash-next').Promise;
var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var es6to5 = require('gulp-6to5');
var del = require('del');
var insert = require('gulp-insert');
var sourcemaps = require('gulp-sourcemaps');

function lint() {
  return gulp.src('src/**/*.js')
  .pipe(plumber())
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
}

function build() {
  return gulp.src('src/**/*.js')
  .pipe(plumber())
  .pipe(insert.prepend(
    'require(\'6to5/polyfill\'); ' +
    'const Promise = require(\'lodash-next\').Promise; ' +
    'const __DEV__ = (process.env.NODE_ENV !== \'production\'); ' +
    'const __PROD__ = !__DEV__; ' +
    'const __BROWSER__ = (typeof window === \'object\'); ' +
    'const __NODE__ = !__BROWSER__; '))
  .pipe(es6to5())
  .pipe(gulp.dest('dist'));
}

function clean() {
  del(['dist']);
}

gulp.task('lint', function() {
  return lint();
});

gulp.task('clean', function() {
  return clean();
});

gulp.task('build', ['lint', 'clean'], function() {
  return build();
});

gulp.task('default', ['build']);

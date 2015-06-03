var _ = require('lodash');
var should = require('should');
var Promise = (global || window).Promise = require('bluebird');
var __DEV__ = (process.env.NODE_ENV !== 'production');
var __PROD__ = !__DEV__;
var __BROWSER__ = (typeof window === 'object');
var __NODE__ = !__BROWSER__;
if(__DEV__) {
  Promise.longStackTraces();
}

var del = require('del');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var fs = Promise.promisifyAll(require('fs'));
var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var prepend = require('gulp-insert').prepend;

var readPrelude = fs.readFileAsync('./__prelude.js');

function clean() {
  del(['dist']);
}

function lint() {
  return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
  .pipe(plumber())
  .pipe(eslint())
  .pipe(eslint.format());
}

function build() {
  return readPrelude.then(function(prelude) {
    return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
    .pipe(plumber())
    .pipe(prepend(prelude))
    .pipe(babel({
      modules: 'common',
      optional: [
        'es7.classProperties',
        'es7.decorators',
        'runtime',
      ],
    }))
    .pipe(gulp.dest('dist'));
  });
}

gulp.task('clean', clean);
gulp.task('lint', lint);
gulp.task('build', ['lint', 'clean'], build);
gulp.task('default', ['build']);

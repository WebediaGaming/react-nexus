require('6to5/polyfill');
var Promise = require('bluebird');
var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var es6to5 = require('gulp-6to5');
var del = require('del');
var insert = require('gulp-insert');
var sourcemaps = require('gulp-sourcemaps');
var yuidoc = require('gulp-yuidoc');

function lint() {
  return gulp.src('src/**/*.js')
  .pipe(plumber())
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
}

function build() {
  return gulp.src('src/**/*.js')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(insert.prepend('require(\'6to5/polyfill\');\nconst Promise = require(\'bluebird\');\n'))
  .pipe(es6to5())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist'));
}

function clean() {
  del(['dist']);
}

function doc() {
    gulp.src('src/**/*.js')
    .pipe(yuidoc())
    .pipe(gulp.dest('doc'));
}

gulp.task('lint', lint);

gulp.task('clean', clean);

gulp.task('build', ['lint', 'clean'], build);

gulp.task('doc', ['lint'], doc)

gulp.task('default', ['build']);

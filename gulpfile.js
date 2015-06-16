require('babel/register')({
  optional: ['runtime']
});

var eslint = require('gulp-eslint');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var mocha = require('gulp-mocha');

function lint() {
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format());
}

function test() {
  return gulp.src('src/__tests__/*.js')
    .pipe(mocha());
}

gulp.task('lint', lint);
gulp.task('test', test);
gulp.task('default', ['lint', 'test']);

import eslint from 'gulp-eslint';
import gulp from 'gulp';
import path from 'path';
import plumber from 'gulp-plumber';

const jsFilesGlob = path.join(
  __dirname, // /config/gulp/tasks
  '..', // /config/gulp
  '..', // /config/
  '..', // /
  'lib', // /lib/
  '**',
  '*.js',
);

export default () =>
  gulp.task('lint', () => gulp.src(jsFilesGlob)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
  )
;

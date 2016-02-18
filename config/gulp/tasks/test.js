import gulp from 'gulp';
import mocha from 'gulp-mocha';
import path from 'path';
import through2 from 'through2';
import runSequence from 'run-sequence';

import babelConfig from '../../babel';

const root = path.join(
  __dirname, // /config/gulp/tasks
  '..', // /config/gulp
  '..', // /config/
  '..', // /
);

const dist = path.join(root, 'dist');

function sync(cb) {
  return through2.obj((data, enc, f) => f(), (f) => { f(); cb(); });
}

function createTest(platform, env) {
  const tests = [
    path.join(dist, platform, env, '**', '__tests__', '**', '*.js'),
    `!${path.join(dist, platform, env, '**', '__tests__', 'fixtures', '**', '*.js')}`,
    `!${path.join(dist, platform, env, '**', '__tests__', 'browser', '**', '*.js')}`,
  ];
  return (cb) => {
    gulp.src(tests, { read: false })
      .pipe(mocha())
      .pipe(sync(cb));
  };
}

export default () => {
  const platforms = Object.keys(babelConfig);
  platforms.forEach((platform) => {
    const envs = Object.keys(babelConfig[platform]);
    envs.forEach((env) =>
      gulp.task(`test-${platform}-${env}`, [`build-${platform}-${env}`], createTest(platform, env))
    );
  });
  gulp.task('test-selenium', (cb) => runSequence('test-selenium-dev', 'test-selenium-prod', cb));
  gulp.task('test-browser', (cb) => runSequence('test-browser-dev', 'test-browser-prod', cb));
  gulp.task('test-node', (cb) => runSequence('test-node-dev', 'test-node-prod', cb));
  gulp.task('test', (cb) => runSequence('test-browser', 'test-node', cb));
};

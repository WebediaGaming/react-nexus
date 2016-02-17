import path from 'path';

import gulp from 'gulp';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import webdriver from 'gulp-webdriver';
import rimraf from 'rimraf';
import selenium from 'selenium-standalone';
import webpack from 'webpack';
import gwebpack from 'webpack-stream';

import babelConfig from '../../babel';
import webpackConfig from '../../../webpackConfig';

const root = path.join(
  __dirname, // /config/gulp/tasks
  '..', // /config/gulp
  '..', // /config/
  '..', // /
);

const dist = path.join(root, 'dist');
const lib = path.join(root, 'lib');
const wdioConfig = path.join(root, 'config', 'wdio');

const staticAssets = {
  js: path.join('static', 'c.js'),
};

let seleniumServer;

// Setting build for production & development environments
Object.keys(babelConfig.browser).map((env) => {
  const isProd = env === 'prod';

  // Build the bundle of the client script with webpack.
  return gulp.task(`build-selenium-${env}`, [`build-browser-${env}`], () =>
    gulp.src(path.join(lib, '__tests__', 'fixtures', 'RenderClient.js'))
      .pipe(plumber())
      .pipe(isProd ? gutil.noop() : sourcemaps.init())
      .pipe(gwebpack(webpackConfig(env), webpack))
      .pipe(rename(staticAssets.js))
      .pipe(isProd ? uglify({
        mangle: { except: ['GeneratorFunction'] },
      }) : gutil.noop())
      .pipe(isProd ? gutil.noop() : sourcemaps.write())
      .pipe(gulp.dest(path.join(dist, 'browser', env)))
  );
});

// Install & Start selenium server.
gulp.task('selenium', (done) => {

  // Install selenium server with default config: (chrome & ie drivers).
  selenium.install({}, (errorInstall) => {
    if(errorInstall) {
      return done(errorInstall);
    }

    // Start selenium server.
    selenium.start((errStart, child) => {
      if (errStart) {
        return done(errStart);
      }
      seleniumServer = child;
      done();
    });
  });
});

export default () => {

  // Setting tests for production & development environments
  Object.keys(babelConfig.browser).map((env) => {
    const testSeleniumName = `test-selenium-${env}`;

    // Start tests with the selenium setup.
    gulp.task(testSeleniumName, ['selenium', `build-selenium-${env}`], () =>
      gulp.src(path.join(wdioConfig, env, 'wdio.conf.js'))
      .pipe(webdriver())
      .once('end', () => {
        rimraf(path.join(dist, 'browser', env, 'static'), (err) => {
          if(err) {
            console.log(err);
          }
        });
        seleniumServer.kill();
      })
    );
    return testSeleniumName;
  });
};

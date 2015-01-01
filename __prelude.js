require('6to5/polyfill');
const _ = require('lodash');
const should = require('should');
const Promise = (global || window).Promise = require('bluebird');
const __DEV__ = (process.env.NODE_ENV !== 'production');
const __PROD__ = !__DEV__;
const __BROWSER__ = (typeof window === 'object');
const __NODE__ = !__BROWSER__;
if(__DEV__) {
  Promise.longStackTraces();
}

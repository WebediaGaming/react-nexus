'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _2 = require('../');

var _testRoot = require('./test/Root');

var _testRoot2 = _interopRequireDefault(_testRoot);

var _ = require('lodash');
var should = require('should');
var Promise = (global || window).Promise = require('bluebird');
var __DEV__ = process.env.NODE_ENV !== 'production';
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === 'object';
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}

(0, _2.renderToStaticMarkup)(_react2['default'].createElement(_testRoot2['default'], { path: 'Königsberg', mood: 'happy', foo: 'bar' })).then(function (_ref) {
  var html = _ref.html;
  var data = _ref.data;

  html.should.be.exactly(['<div class="Root">', '<p>Route is Königsberg. User is <span>Kant. Immanuel Kant</span>.</p>', '<ul>', '<li>Immanuel Kant</li>', '<li>Friedrich Nietzsche</li>', '</ul>', '</div>'].join(''));
  JSON.stringify(data).should.be.exactly(JSON.stringify({
    local: {
      '/route': {
        'path': 'Königsberg' },
      '/session': {
        'userId': 1 },
      '/users/1': {
        firstName: 'Immanuel',
        lastName: 'Kant' },
      '/users': {
        '1': 1,
        '2': 2 },
      '/users/2': {
        firstName: 'Friedrich',
        lastName: 'Nietzsche' } } }));
  console.log(html);
  console.log(JSON.stringify(data, null, 2));
})['catch'](function (err) {
  throw err;
});
const path = require('path');
require('source-map-support/register');
require('babel-register')({
  only: ['config'],
  presets: [path.resolve(__dirname, './config/babel/node/dev')],
  retainLines: true,
});
require('babel-polyfill');
require('./config/gulp');

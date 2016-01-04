import 'babel-polyfill';
import Promise from 'bluebird';
Promise.config({
  warnings: process.env.NODE_ENV,
  longStackTraces: process.env.NODE_ENV,
  cancellation: true,
});

import Action from './Action';
import Flux from './Flux';
import preparable from './preparable';
import prepare from './prepare';
import Store from './Store';
import util from './util';

export default {
  Action,
  Flux,
  preparable,
  prepare,
  Store,
  util,
};

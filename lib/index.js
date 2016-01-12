import 'babel-polyfill';
import Promise from 'bluebird';
Promise.config({
  warnings: process.env.NODE_ENV,
  longStackTraces: process.env.NODE_ENV,
  cancellation: true,
});

import Action from './Action';
import actions from './actions';
import Flux from './Flux';
import Memory from './Memory';
import preparable from './preparable';
import prepare from './prepare';
import root from './root';
import Store from './Store';
import stores from './stores';
import util from './util';

export default {
  Action,
  actions,
  Flux,
  Memory,
  preparable,
  prepare,
  root,
  Store,
  stores,
  util,
};

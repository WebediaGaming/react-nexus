import 'babel-polyfill';
import Promise from 'bluebird';

const __DEV__ = process && process.env && process.env.NODE_ENV === 'development';
Promise.config({
  warnings: __DEV__,
  longStackTraces: __DEV__,
  cancellation: true,
});

import Action from './Action';
import actions from './actions';
import deps from './deps';
import Flux from './Flux';
import HTTP from './HTTP';
import Memory from './Memory';
import preparable from './preparable';
import prepare from './prepare';
import root from './root';
import Store from './Store';
import stores from './stores';

export default {
  Action,
  actions,
  deps,
  Flux,
  HTTP,
  Memory,
  preparable,
  prepare,
  root,
  Store,
  stores,
};

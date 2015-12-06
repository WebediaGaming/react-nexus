import 'babel-polyfill';
import Promise from 'bluebird';
const __DEV__ = (process.env.NODE_ENV === 'development');
Promise.config({
  warnings: __DEV__,
  longStackTraces: __DEV__,
  cancellation: true,
});

import Context from './components/Context';
import Flux from './fluxes/Flux';
import fromPayload from './utils/fromPayload';
import HTTPFlux from './fluxes/HTTPFlux';
import inject from './decorators/inject';
import Injector from './components/Injector';
import isPending from './utils/isPending';
import lastErrorOf from './utils/lastErrorOf';
import lastValueOf from './utils/lastValueOf';
import LocalFlux from './fluxes/LocalFlux';
import preparable from './decorators/preparable';
import prepare from './prepare';
import pure from './decorators/pure';
import toPayload from './utils/toPayload';

export default {
  Context,
  Flux,
  fromPayload,
  HTTPFlux,
  inject,
  Injector,
  isPending,
  lastErrorOf,
  lastValueOf,
  LocalFlux,
  preparable,
  prepare,
  pure,
  toPayload,
};

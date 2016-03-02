import 'babel-polyfill';
import Promise from 'bluebird';

const __DEV__ = process && process.env && process.env.NODE_ENV === 'development';
Promise.config({
  warnings: __DEV__,
  longStackTraces: __DEV__,
  cancellation: true,
});

export { default as Action } from './Action';
export { default as actions } from './actions';
export { default as deps } from './deps';
export { default as Flux } from './Flux';
export { default as preparable } from './preparable';
export { default as prepare } from './prepare';
export { default as root } from './root';
export { default as Store } from './Store';
export { default as stores } from './stores';

export { default as HTTPStore } from './HTTPStore';
export { default as MemoryStore } from './MemoryStore';

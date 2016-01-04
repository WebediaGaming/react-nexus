import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';

import Action from './Action';
import Store from './Store';
import creatable from './util/creatable';
import isExtensionOf from './util/isExtensionOf';

/**
 * Returned by _.findIndex when no matching element is found
 * @type {Number}
 */
const NOT_FOUND = -1;

/**
 * Given a route path (express-like route format, eg. /users/:userId),
 * returns a function which attemps to match a given string.
 * This function returns null if the given string doesn't match.
 * Otherwise this function returns an Object mapping the name of each part found
 * to its value. eg:
 * createMatcher('/users/:userId')('/users/4') will return { userId: '4' }.
 * @param {String} route Express-like route
 * @return {Function} Matcher function
 */
function createMatcher(route) {
  const keys = [];
  const re = pathToRegexp(route, keys);
  function matchPath(path) {
    const m = re.exec(path);
    if(m === null) {
      return null;
    }
    return _(keys)
      .map(({ name }, i) => [name, m[i]])
      .object()
    .value();
  }
  return matchPath;
}

/**
 * Error thrown by Flux#dispatchAction
 * @class
 * @extends Error
 */
class ActionNotFoundError extends Error {
  constructor(path) {
    super(`Action not found (path=${path})`);
  }
}

/**
 * Error throw by Flux#fetchStore, Flux#observeStore, and Flux#readStoreFromState
 * @class
 * @extends Error
 */
class StoreNotFoundError extends Error {
  constructor(path) {
    super(`Store not found (path=${path})`);
  }
}

function findInMatchers(needle, haystack) {
  return _(haystack)
    .map(([matcher, handler]) => [handler, matcher(needle)])
    .findIndex(([matcher]) => matcher !== null)
  .value();
}

@creatable
class Flux {
  static ActionNotFoundError = ActionNotFoundError;
  static StoreNotFoundError = StoreNotFoundError;

  constructor({ actions = [], stores = [] } = {}) {
    this.actions = actions.map(([route, action]) => this.action(route, action));
    this.stores = stores.map(([route, store]) => this.store(route, store));
  }

  loadState(initialState) {
    this.stores.forEach((store, k) => store.loadState(initialState[k]));
  }

  dumpState() {
    return this.stores.map((store) => store.dumpState());
  }

  getAction(path) {
    const first = findInMatchers(path, this.actions);
    if(first === NOT_FOUND) {
      throw new ActionNotFoundError(path);
    }
    return first;
  }

  setAction(route, action) {
    this.actions.push([createMatcher(route), action]);
    return [route, action];
  }

  action(...args) {
    const a = args[1];
    if(a !== void 0 && a instanceof Action) {
      return this.setAction(...args);
    }
    return this.getAction(...args);
  }

  getStore(path) {
    const first = findInMatchers(path, this.stores);
    if(first === NOT_FOUND) {
      throw new StoreNotFoundError(path);
    }
  }

  setStore(route, store) {
    this.stores.push([createMatcher(route), store]);
    return [route, store];
  }

  store(...args) {
    const s = args[1];
    if(s !== void 0 && s instanceof Store) {
      return this.setStore(...args);
    }
    return this.getStore(...args);
  }

  async dispatchAction(path, params) {
    const [action, query] = this.action(path);
    return await action.dispatch(query, params, this, path);
  }

  async fetchStore(path, params) {
    const [store, query] = this.store(path);
    return await store.fetch(query, params, this, path);
  }

  readStoreFromState(path, params) {
    const [store, query] = this.store(path);
    return store.readFromState(query, params, this, path);
  }

  observeStore(path, params, onChange) {
    const [store, query] = this.store(path);
    return store.observe(query, params, onChange, this, path);
  }
}

export default Flux;

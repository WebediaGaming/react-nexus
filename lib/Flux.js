import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';

import Action from './Action';
import Store from './Store';
import creatable from './util/creatable';

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
  const toPath = pathToRegexp.compile(route);
  function matchPath(path) {
    const m = re.exec(path);
    if(m === null) {
      return null;
    }
    const query = _(keys)
      .map(({ name }, i) => [name, m[i]])
      .object()
    .value();
    return [query, toPath(query)];
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
    this.actions = actions;
    this.stores = stores;
    actions.map((action) => this.action(action));
    stores.map((store) => this.store(store));
  }

  loadState(initialState) {
    this.stores.forEach((store, k) => store.loadState(initialState[k]));
  }

  dumpState() {
    return this.stores.map((store) => store.dumpState());
  }

  addAction(action) {
    const { route } = action;
    this.actions.push([createMatcher(route), action]);
    return [route, action];
  }

  findAction(path) {
    const [action] = this.matchAction(path);
    return action;
  }

  matchAction(path) {
    const first = findInMatchers(path, this.actions);
    if(first === NOT_FOUND) {
      throw new ActionNotFoundError(path);
    }
    return first;
  }

  action(a) {
    if(a instanceof Action) {
      return this.addAction(a);
    }
    return this.findAction(a);
  }

  addStore(store) {
    const { route } = store;
    this.stores.push([createMatcher(route), store]);
    return store;
  }

  findStore(path) {
    const [store] = this.matchStore(path);
    return store;
  }

  matchStore(path) {
    const first = findInMatchers(path, this.stores);
    if(first === NOT_FOUND) {
      throw new StoreNotFoundError(path);
    }
    return first;
  }

  store(s) {
    if(s instanceof Store) {
      return this.addStore(s);
    }
    return this.findStore(s);
  }

  async dispatchAction(path, params) {
    const [action, [query, normalizedPath]] = this.action(path);
    return await action.dispatch(query, params, this, normalizedPath);
  }

  async fetchStore(path, params) {
    const [store, [query, normalizedPath]] = this.store(path);
    return await store.fetch(query, params, this, normalizedPath);
  }

  readStoreFromState(path, params) {
    const [store, [query, normalizedPath]] = this.store(path);
    return store.readFromState(query, params, this, normalizedPath);
  }

  observeStore(path, params, onChange) {
    const [store, [query, normalizedPath]] = this.store(path);
    return store.observe(query, params, onChange, this, normalizedPath);
  }
}

export default Flux;

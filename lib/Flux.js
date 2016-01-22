import _ from 'lodash';

import Action from './Action';
import Store from './Store';
import creatable from './util/creatable';

/**
 * Given a route path (express-like route format, eg. /users/:userId),
 * returns a function which attemps to match a given string.
 * This function returns null if the given string doesn't match.
 * Otherwise this function returns an Object mapping the name of each part found
 * to its value. eg:
 * createMatcher('/users/:userId')('/users/4') will return { userId: '4' }.
 * @param {Routable} routable Instance of the Routable class or derived (usually Action or Store)
 * @return {Function} Matcher function
 */
function createMatcher({ keys, re }) {
  function matchPath(path) {
    const m = re.exec(path);
    return m === null ? null : _(keys)
      .map(({ name }, i) => [name, m[i + 1]])
      .fromPairs()
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
  .find(([, query]) => query !== null);
}

@creatable
class Flux {
  static ActionNotFoundError = ActionNotFoundError;
  static StoreNotFoundError = StoreNotFoundError;

  constructor({ actions = [], stores = [] } = {}) {
    this.actions = [];
    this.stores = [];
    actions.map((action) => this.action(action));
    stores.map((store) => this.store(store));
  }

  loadState(initialState) {
    this.stores.forEach(([, store], k) => store.loadState(initialState[k]));
    return this;
  }

  dumpState() {
    return this.stores.map(([, store]) => store.dumpState());
  }

  addAction(action) {
    this.actions.push([createMatcher(action), action]);
    return action;
  }

  findAction(needle) {
    return _(this.actions)
      .filter(([, { route }]) => route === needle)
      .map(([, action]) => action)
    .first();
  }

  matchAction(path) {
    const first = findInMatchers(path, this.actions);
    if(!first) {
      throw new ActionNotFoundError(path);
    }
    return first;
  }

  async dispatchAction(path, ...params) {
    const [action, query] = this.matchAction(path);
    return await action.dispatch(query, ...params);
  }

  action(a) {
    if(a instanceof Action) {
      return this.addAction(a);
    }
    return this.findAction(a);
  }

  addStore(store) {
    this.stores.push([createMatcher(store), store]);
    return store;
  }

  findStore(needle) {
    return _(this.stores)
      .filter(([, { route }]) => route === needle)
      .map(([, store]) => store)
    .first();
  }

  matchStore(path) {
    const first = findInMatchers(path, this.stores);
    if(!first) {
      throw new StoreNotFoundError(path);
    }
    return first;
  }

  async fetchStore(...binding) {
    const [path] = binding;
    const [store, query] = this.matchStore(path);
    return await store.fetch(query);
  }

  readStoreFromState(...binding) {
    const [path] = binding;
    const [store, query] = this.matchStore(path);
    return store.readFromState(query);
  }

  store(s) {
    if(s instanceof Store) {
      return this.addStore(s);
    }
    return this.findStore(s);
  }
}

export default Flux;

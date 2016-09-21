import _ from 'lodash';

import Action from './Action';
import Store from './Store';
import creatable from './util/creatable';

/**
 * Given a `route` (express-like route format, eg. /users/:userId),
 * returns a function which attemps to match a given string.
 * This function returns null if the given string doesn't match.
 * Otherwise this function returns an Object mapping the name of each part found
 * to its value.
 * @param {Routable} routable Instance of the Routable class or derived (usually Action or Store)
 * @return {Function} Matcher function
 * @example
 *
 * const userMatcher = createMatcher(pathToRegexp('/users/:userId', []));
 * userMatcher('/users/4') // => { userId: '4' }
 * userMatcher('/test/42') // => null
 */
function createMatcher({ keys, re }) {
  return function matchPath(path) {
    const m = re.exec(path);
    if(m === null) {
      return null;
    }

    // Creates an object with each key/value matching with route path.
    // Example:
    // path: `/:foo/:bar` - `route: /test/route`
    // Created object: `{ foo: 'test', bar: 'route' };`
    const mapMatchingKeys = _.map(keys, ({ name }, i) => [name, m[i + 1]]);
    return _.fromPairs(mapMatchingKeys);
  };
}

/**
 * Error thrown by Flux#dispatchAction when an action cannot be found.
 * @class
 * @extends Error
 */
class ActionNotFoundError extends Error {
  /**
   * Contructs a new ActionNotFoundError.
   * @constructor
   * @param {String} path Path of the requested action
   */
  constructor(path) {
    super(`Action not found (path=${path})`);
  }
}

/**
 * Error thrown by Flux#fetchStore, Flux#observeStore, and Flux#readStoreFromState when a store cannot be found.
 * @class
 * @extends Error
 */
class StoreNotFoundError extends Error {
  /**
   * Contructs a new StoreNotFoundError.
   * @constructor
   * @param {String} path Path of the requested store
   */
  constructor(path) {
    super(`Store not found (path=${path})`);
  }
}

/**
 * Find the first pair of {@link Routable} and given path's query which route path matches one of the
 * {@link Routable} matcher in the collection.
 * @param {String} path Route path
 * @param {Array<Array<Function|Routable>>} collection List containing pairs of matchers and their related
 *                                          {@link Routable}s.
 * @return {Array<Routable|Object>} The pair containing the {@link Routable} and its query if the given path matches
 *                                  one of the {@link Routable} matcher, null otherwise.
 */
function findInMatchers(path, collection) {
  const mapMatchers = _.map(collection, ([matcher, routable]) => [routable, matcher(path)]);
  return _.find(mapMatchers, ([, matchPath]) => matchPath !== null);
}

/**
 * Represent a Flux
 * A flux is a hub for {@Store}s and {@Action}s. It allows them to communicate.
 */
@creatable
class Flux {
  static ActionNotFoundError = ActionNotFoundError;
  static StoreNotFoundError = StoreNotFoundError;

  /**
   * Constructs a new Flux.
   * @constructor
   * @param {{ actions: Array<Action>, stores: Array<Store> }} List of stores and actions to be used
   * @param {Array<Action>} config.actions Initial actions
   * @param {Array<Store>} config.stores Initial stores
   */
  constructor({ actions = [], stores = [] } = {}) {
    this.actions = [];
    this.stores = [];
    actions.map((action) => this.action(action));
    stores.map((store) => this.store(store));
  }

  /**
   * Loads each stores of the Flux with the data from the provided Flux state
   * @param {Array<Object>} state Flux's stores states
   * @return {Flux} An instance of {@Flux}.
   */
  loadState(state) {
    this.stores.forEach(([, store], k) => store.loadState(state[k]));
    return this;
  }

  /**
   * Generates an array with every Flux's stores states.
   * @return {Array<Object>} Flux's stores states.
   */
  dumpState() {
    return this.stores.map(([, store]) => store.dumpState());
  }

  /**
   * Adds a new Action in the FLux.
   * @param {Action} action Action to add
   * @return {Action} Added action
   */
  addAction(action) {
    this.actions.push([createMatcher(action), action]);
    return action;
  }

  /**
   * Find an action given a route.
   * @param {String} routeToFind Route of the action to find
   * @return {Action} First Action matching the route
   */
  findAction(routeToFind) {
    const filteredActions = _.filter(this.actions, ([, { route }]) => route === routeToFind);
    const mapActions = _.map(filteredActions, ([, action]) => action);
    return _.first(mapActions);
  }

  /**
   * Given a path, find a corresponding action or throw an ActionNotFoundError if none match.
   * @throws ActionNotFoundError
   * @param {String} path Path of the action
   * @return {Action} Action corresponding to the path
   */
  matchAction(path) {
    const first = findInMatchers(path, this.actions);
    if(!first) {
      throw new ActionNotFoundError(path);
    }
    return first;
  }

  /**
   * Dispatch an action with parameters.
   * @throws ActionNotFoundError
   * @param {String} path Path of the action to dispatch
   * @param {...*} param Parameters to dispatch with the action
   * @return {Promise} Promise returned by the action handler
   */
  async dispatchAction(path, ...params) {
    const [action, query] = this.matchAction(path);
    return await action.dispatch(this, query, ...params);
  }

  /**
   * Find or create an action depending on the type of the parameter
   * - If the parameter is an {@link Action}, the action is added to the flux.
   * - If the parameter is a String, the action is returned if found, ActionNotFoundError is thrown otherwise.
   * @throws ActionNotFoundError
   * @param {String|Action} actionOrActionRoute Action to find or create
   * @return {Action} Action found or created
   */
  action(actionOrActionRoute) {
    if(actionOrActionRoute instanceof Action) {
      return this.addAction(actionOrActionRoute);
    }
    return this.findAction(actionOrActionRoute);
  }

  /**
   * Adds a new Store in the FLux.
   * @param {Store} store Store to add
   * @return {Store} Added store
   */
  addStore(store) {
    this.stores.push([createMatcher(store), store]);
    return store;
  }

  /**
   * Find a store given a route.
   * @param {String} routeToFind Route of the store to find
   * @return {Store} First Store matching the route
   */
  findStore(routeToFind) {
    const filteredStores = _.filter(this.stores, ([, { route }]) => route === routeToFind);
    const mapStores = _.map(filteredStores, ([, store]) => store);
    return _.first(mapStores);
  }

  /**
   * Given a path, finds a corresponding store, throws a StoreNotFoundError if none match.
   * @throws StoreNotFoundError
   * @param {String} path Path of the store
   * @return {Store} Store corresponding to the path
   */
  matchStore(path) {
    const first = findInMatchers(path, this.stores);
    if(!first) {
      throw new StoreNotFoundError(path);
    }
    return first;
  }

  /**
   * Fetch the content of a store given his path.
   * @param {String} path Path to fetch
   * @return {Promise<State>} {@link State} of the store
   */
  async fetchStore(path) {
    const [store, query] = this.matchStore(path);
    return await store.fetch(query);
  }

  observeStore(path, onChange) {
    const [store, query] = this.matchStore(path);
    return store.observe(query, onChange);
  }

  /**
   * Synchronously read the current state of the store.
   * @param {String} path Path to fetch
   * @return {State} Current {@link State} of the {@link Store}
   */
  readStoreFromState(path) {
    const [store, query] = this.matchStore(path);
    return store.readFromState(query);
  }

  /**
   * Find or create an store dependending the type of the parameter
   * - If the parameter is an {@link Store}: The store is added to the flux.
   * - If the parameter is a String: The store is searched and returned if found, throws a StoreNotFoundError otherwise.
   * @throws StoreNotFoundError
   * @param {String|Store} storeOrStoreRoute Store to find or create
   * @return {Store} Store found or created
   */
  store(storeOrStoreRoute) {
    if(storeOrStoreRoute instanceof Store) {
      return this.addStore(storeOrStoreRoute);
    }
    return this.findStore(storeOrStoreRoute);
  }
}

export default Flux;

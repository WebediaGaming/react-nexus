import abstract from './util/abstract';
import virtual from './util/virtual';

@abstract
class Flux {
  @virtual
  static unserialize() {}

  static Store = class Store {
    constructor(flux, params) {
      this.flux = flux;
      flux.validateStoreParams(params);
      this.keyedParams = {
        key: flux.keyForStoreParams(params),
        params,
      };
    }

    populate() {
      return this.flux.populateStore(this.keyedParams);
    }

    observe(onStateChange) {
      return this.flux.observeStore(this.keyedParams, onStateChange);
    }
  };

  static Action = class Action {
    constructor(flux, params) {
      this.flux = flux;
      flux.validateActionParams(params);
      this.keyedParams = {
        key: flux.keyForActionParams(params),
        params,
      };
    }

    dispatch(args) {
      return this.flux.dispatchAction(args);
    }
  };

  constructor() {
    this.keysForStores = new WeakMap();
    this.keysForActions = new WeakMap();
  }

  keyForActionParams(params) {
    if(!this.keysForActions.has(params)) {
      this.keysForActions.set(params, JSON.stringify(params));
    }
    return this.keysForActions.get(params);
  }

  keyForStoreParams(params) {
    if(!this.keysForStores.has(params)) {
      this.keysForStores.set(params, JSON.stringify(params));
    }
    return this.keysForStores.get(params);
  }

  @virtual
  serialize() {}

  @virtual
  validateStoreParams() {}

  @virtual
  populateStore() {}

  @virtual
  observeStore() {}

  @virtual
  validateActionParams() {}

  @virtual
  dispatchAction() {}
}

export default Flux;

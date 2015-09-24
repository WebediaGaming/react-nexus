import _ from 'lodash';

import creatable from './util/creatable';
import Routable from './Routable';

const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';

@creatable
class State {
  static pending(meta) {
    return this.create({ status: PENDING, meta });
  }

  static resolve(value, meta) {
    return this.create({ status: RESOLVED, value, meta });
  }

  static reject(reason, meta) {
    return this.create({ status: REJECTED, reason, meta });
  }

  static propType(type) {
    return (props, propName, componentName) => {
      const state = props[propName];
      if(!(state instanceof State)) {
        return new TypeError(`Expecting prop ${propName} of ${componentName} to be an instance of Store.State.`);
      }
      if(!state.isResolved()) {
        return null;
      }
      return type(state.value);
    };
  }

  constructor({ status, reason, value, meta }) {
    this.status = status;
    this.reason = reason;
    this.value = value;
    this.meta = meta;
  }

  isPending() {
    return this.status === PENDING;
  }

  isResolved() {
    return this.status === RESOLVED;
  }

  isRejected() {
    return this.status === REJECTED;
  }

  dump() {
    return _.pick(this,
      'status',
      'reason',
      'value',
      'meta',
    );
  }
}

@creatable
class Store extends Routable {
  static State = State;

  constructor(route, {
      dumpState,
      fetch,
      loadState,
      observe,
      readFromState,
  }) {
    super(route);
    this.dumpState = dumpState;
    this.fetch = fetch;
    this.loadState = loadState;
    this.observe = observe;
    this.readFromState = readFromState;
  }
}

export default Store;

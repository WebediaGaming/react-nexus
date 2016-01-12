import _ from 'lodash';

import creatable from './util/creatable';
import Routable from './Routable';

@creatable
class State {
  static PENDING = 'PENDING';
  static RESOLVED = 'RESOLVED';
  static REJECTED = 'REJECTED';

  static pending(meta) {
    return State.create({ status: State.PENDING, meta });
  }

  static resolve(value, meta) {
    return State.create({ status: State.RESOLVED, value, meta });
  }

  static reject(reason, meta) {
    return State.create({ status: State.REJECTED, reason, meta });
  }

  constructor({ status, reason, value, meta }) {
    this.status = status;
    this.reason = reason;
    this.value = value;
    this.meta = meta;
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

  constructor({
      dumpState,
      fetch,
      loadState,
      observe,
      readFromState,
      route,
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

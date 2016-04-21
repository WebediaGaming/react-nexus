import _ from 'lodash';

import creatable from './util/creatable';
import Routable from './Routable';

/**
 * Pending status of a {@link Store} State
 * @type {String}
 */
const PENDING = 'PENDING';

/**
 * Resolved status of a {@link Store} State
 * @type {String}
 */
const RESOLVED = 'RESOLVED';

/**
 * Rejected status of a {@link Store} State
 * @type {String}
 */
const REJECTED = 'REJECTED';

/**
 * State of a {@Store}
 */
@creatable
class State {
  /**
   * Creates a new pending State.
   * @param {*} defaultValue Default value exposed while the state of the store is pending.
   * @param {*} meta Metadata of the State
   * @return {State} The created State
   */
  static pending(defaultValue, meta) {
    return this.create({ value: defaultValue, status: PENDING, meta });
  }

  /**
   * Creates a new resolved State.
   * @param {*} value Value of the resolved State
   * @param {*} meta Metadata of the State
   * @return {State} The created State
   */
  static resolve(value, meta) {
    return this.create({ status: RESOLVED, value, meta });
  }

  /**
   * Creates a new rejected State.
   * @param {*} defaultValue Default value exposed when the store is in a rejected state.
   * @param {String} reason Reason why the State has been rejected
   * @param {*} meta Metadata of the State
   * @return {State} The created State
   */
  static reject(defaultValue, reason, meta) {
    return this.create({ value: defaultValue, status: REJECTED, reason, meta });
  }

  /**
   * Validate the state prop in a React Component.
   * @param {Function} type React PropType of the State's value
   * @return {Function} Validation function for a State
   */
  static validatePropType(type) {
    /**
     * Validates a {@link State} prop.
     * @param {Object} props React component props
     * @param {String} propName Name of the prop to validate.
     * @param {String} componentName Name of the React component.
     * @return {null|Error} Null if the prop is valid, an Error otherwise.
     */
    return (props, propName, componentName) => {
      const state = props[propName];
      if(!(state instanceof State)) {
        return new TypeError(`Expecting prop ${propName} of ${componentName} to be an instance of Store.State.`);
      }
      if(!state.isResolved()) {
        return null;
      }
      return type({ [propName]: state.value }, propName, componentName);
    };
  }

  /**
   * Utility function to validate the state prop in a React Component.
   * @param {Function} type React PropType of the State's value
   * @return {Function} Validation function for a State
   * @example
   *
   * ...
   * static propTypes = {
   *   foo: Store.State.propType(React.PropTypes.array),
   * };
   * ...
   */
  static propType(type) {
    const validatePropType = this.validatePropType(type);
    // By default, prop is optional (only validate if not undefined)
    const propType = (props, propName, componentName) => {
      const state = props[propName];
      if(state !== void 0) {
        return validatePropType(props, propName, componentName);
      }
    };
    // Chained with .isRequired, make the prop not optional (validate even if undefined)
    propType.isRequired = validatePropType;
    return propType;
  }

  /**
   * Constructs a new State instance.
   * @constructor
   * @param {Object} config Configuration object
   * @param {PENDING|RESOLVED|REJECTED} status Status of the State
   * @param {String} reason Reason why the State has been rejected
   * @param {*} value Value of the State
   * @param {*} meta Metadata of the State
   */
  constructor({ status, reason, value, meta }) {
    this.status = status;
    this.reason = reason;
    this.value = value;
    this.meta = meta;
  }

  /**
   * Checks if the status of the State is {@link PENDING}.
   * @return {Boolean} True if the status of the State is {@link PENDING}, false otherwise.
   */
  isPending() {
    return this.status === PENDING;
  }

  /**
   * Checks if the status of the State is {@link RESOLVED}.
   * @return {Boolean} True if the status of the State is {@link RESOLVED}, false otherwise.
   */
  isResolved() {
    return this.status === RESOLVED;
  }

  /**
   * Checks if the status of the State is {@link REJECTED}.
   * @return {Boolean} True if the status of the State is {@link REJECTED}, false otherwise.
   */
  isRejected() {
    return this.status === REJECTED;
  }

  /**
   * Returns the State as a plain serializable Object.
   * @return {Object} The State as a plain Object.
   */
  dump() {
    return _.pick(this,
      'status',
      'reason',
      'value',
      'meta',
    );
  }
}

/**
 * Represents a Store.
 * @extends Routable
 */
@creatable
class Store extends Routable {
  static State = State;

 /**
  * Constructs a new Store.
  * @constructor
  * @param {Stirng} route Route of the Store
  * @param {Object} config Configuration object
  * @param {Function} dumpState Implementation of the Store's dumpState method
  * @param {Function} fetch Implementation of the Store's fetch method
  * @param {Function} loadState Implementation of the Store's loadState method
  * @param {Function} observe Implementation of the Store's observe method
  * @param {Function} readFromState Implementation of the Store's readFromState method
  */
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

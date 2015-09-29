import should from 'should/as-function';
const __DEV__ = process.env.NODE_ENV === 'development';
/**
 * @abstract
 */
class Flux {
  static displayName = 'Flux';
  /**
   * Create a new Flux instance based on a previous call to serialize()
   * @param {Object} Previous return value of serialize()
   * @param {...*} Other constructor parameters
   * @return {Flux} New Flux instance with its internal state restored
   */
  static unserialize() {}

  constructor() {
    if(__DEV__) {
      if(this.constructor === Flux) {
        throw new Error('Nexus.Flux is an abstract class. You must extend it.');
      }
      should(this.constructor).have.property('displayName').which.is.a.String();
    }
  }

  /**
   * Export a JSON-serializable description of the instance internal state
   * @return {Object} JSON-serializable object
   */
  serialize() {}

  /**
   * Returns the list of the latest values the requested resource has taken
   * @param {Object} Requested resource parameters
   * @return {Array} List of the latest values the requested resource has taken
   */
  values() {}

  /**
   * Commands to asynchronously populate so that when the Promise is settled, values() doesn't throw
   * @return {Promise} Resolves if and when the population has been settled (whether it actually succeeded or not)
   */
  populate() {}

  /**
   * Start observing a resource (implicitly populating it) and register a callback whenever it receives a new value
   * @param {Object} Request resource parameters
   * @param {Function} Callback to be invoked whener the resource receives a new value
   * @return {Function} Callback to terminate the observation
   */
  observe() {}

  /**
   * Dispatches an action, whatever this could mean.
   * Returns a Promise for its resolution.
   * @param {Object} Action to dispatch
   * @return {Promise} Promise for the resolution of the action, whatever this could mean.
   */
  dispatch() {}
}

export default Flux;

/**
 * @abstract
 */
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Flux = (function () {
  _createClass(Flux, null, [{
    key: 'unserialize',

    /**
     * Create a new Flux instance based on a previous call to serialize()
     * @param {Object} Previous return value of serialize()
     * @param {...*} Other constructor parameters
     * @return {Flux} New Flux instance with its internal state restored
     */
    value: function unserialize() {}
  }]);

  function Flux() {
    _classCallCheck(this, Flux);

    if (this.constructor === Flux) {
      throw new Error('Nexus.Flux is an abstract class. You must extend it.');
    }
  }

  /**
   * Export a JSON-serializable description of the instance internal state
   * @return {Object} JSON-serializable object
   */

  _createClass(Flux, [{
    key: 'serialize',
    value: function serialize() {}

    /**
     * Returns the list of the latest values the requested resource has taken
     * @param {Object} Requested resource parameters
     * @return {Array} List of the latest values the requested resource has taken
     */
  }, {
    key: 'values',
    value: function values() {}

    /**
     * Commands to asynchronously populate so that when the Promise is settled, values() doesn't throw
     * @return {Promise} Resolves if and when the population has been settled (whether it actually succeeded or not)
     */
  }, {
    key: 'populate',
    value: function populate() {}

    /**
     * Start observing a resource (implicitly populating it) and register a callback whenever it receives a new value
     * @param {Object} Request resource parameters
     * @param {Function} Callback to be invoked whener the resource receives a new value
     * @return {Function} Callback to terminate the observation
     */
  }, {
    key: 'observe',
    value: function observe() {}

    /**
     * Dispatches an action, whatever this could mean.
     * Returns a Promise for its resolution.
     * @param {Object} Action to dispatch
     * @return {Promise} Promise for the resolution of the action, whatever this could mean.
     */
  }, {
    key: 'dispatch',
    value: function dispatch() {}
  }]);

  return Flux;
})();

exports['default'] = Flux;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZsdXguanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFHTSxJQUFJO2VBQUosSUFBSTs7Ozs7Ozs7O1dBT1UsdUJBQUcsRUFBRTs7O0FBRVosV0FUUCxJQUFJLEdBU007MEJBVFYsSUFBSTs7QUFVTixRQUFHLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFO0FBQzVCLFlBQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztLQUN6RTtHQUNGOzs7Ozs7O2VBYkcsSUFBSTs7V0FtQkMscUJBQUcsRUFBRTs7Ozs7Ozs7O1dBT1Isa0JBQUcsRUFBRTs7Ozs7Ozs7V0FNSCxvQkFBRyxFQUFFOzs7Ozs7Ozs7O1dBUU4sbUJBQUcsRUFBRTs7Ozs7Ozs7OztXQVFKLG9CQUFHLEVBQUU7OztTQWhEVCxJQUFJOzs7cUJBbURLLElBQUkiLCJmaWxlIjoiRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAYWJzdHJhY3RcclxuICovXHJcbmNsYXNzIEZsdXgge1xyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBGbHV4IGluc3RhbmNlIGJhc2VkIG9uIGEgcHJldmlvdXMgY2FsbCB0byBzZXJpYWxpemUoKVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBQcmV2aW91cyByZXR1cm4gdmFsdWUgb2Ygc2VyaWFsaXplKClcclxuICAgKiBAcGFyYW0gey4uLip9IE90aGVyIGNvbnN0cnVjdG9yIHBhcmFtZXRlcnNcclxuICAgKiBAcmV0dXJuIHtGbHV4fSBOZXcgRmx1eCBpbnN0YW5jZSB3aXRoIGl0cyBpbnRlcm5hbCBzdGF0ZSByZXN0b3JlZFxyXG4gICAqL1xyXG4gIHN0YXRpYyB1bnNlcmlhbGl6ZSgpIHt9XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgaWYodGhpcy5jb25zdHJ1Y3RvciA9PT0gRmx1eCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05leHVzLkZsdXggaXMgYW4gYWJzdHJhY3QgY2xhc3MuIFlvdSBtdXN0IGV4dGVuZCBpdC4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4cG9ydCBhIEpTT04tc2VyaWFsaXphYmxlIGRlc2NyaXB0aW9uIG9mIHRoZSBpbnN0YW5jZSBpbnRlcm5hbCBzdGF0ZVxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gSlNPTi1zZXJpYWxpemFibGUgb2JqZWN0XHJcbiAgICovXHJcbiAgc2VyaWFsaXplKCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgbGlzdCBvZiB0aGUgbGF0ZXN0IHZhbHVlcyB0aGUgcmVxdWVzdGVkIHJlc291cmNlIGhhcyB0YWtlblxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBSZXF1ZXN0ZWQgcmVzb3VyY2UgcGFyYW1ldGVyc1xyXG4gICAqIEByZXR1cm4ge0FycmF5fSBMaXN0IG9mIHRoZSBsYXRlc3QgdmFsdWVzIHRoZSByZXF1ZXN0ZWQgcmVzb3VyY2UgaGFzIHRha2VuXHJcbiAgICovXHJcbiAgdmFsdWVzKCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogQ29tbWFuZHMgdG8gYXN5bmNocm9ub3VzbHkgcG9wdWxhdGUgc28gdGhhdCB3aGVuIHRoZSBQcm9taXNlIGlzIHNldHRsZWQsIHZhbHVlcygpIGRvZXNuJ3QgdGhyb3dcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBSZXNvbHZlcyBpZiBhbmQgd2hlbiB0aGUgcG9wdWxhdGlvbiBoYXMgYmVlbiBzZXR0bGVkICh3aGV0aGVyIGl0IGFjdHVhbGx5IHN1Y2NlZWRlZCBvciBub3QpXHJcbiAgICovXHJcbiAgcG9wdWxhdGUoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBTdGFydCBvYnNlcnZpbmcgYSByZXNvdXJjZSAoaW1wbGljaXRseSBwb3B1bGF0aW5nIGl0KSBhbmQgcmVnaXN0ZXIgYSBjYWxsYmFjayB3aGVuZXZlciBpdCByZWNlaXZlcyBhIG5ldyB2YWx1ZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBSZXF1ZXN0IHJlc291cmNlIHBhcmFtZXRlcnNcclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDYWxsYmFjayB0byBiZSBpbnZva2VkIHdoZW5lciB0aGUgcmVzb3VyY2UgcmVjZWl2ZXMgYSBuZXcgdmFsdWVcclxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQ2FsbGJhY2sgdG8gdGVybWluYXRlIHRoZSBvYnNlcnZhdGlvblxyXG4gICAqL1xyXG4gIG9ic2VydmUoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBEaXNwYXRjaGVzIGFuIGFjdGlvbiwgd2hhdGV2ZXIgdGhpcyBjb3VsZCBtZWFuLlxyXG4gICAqIFJldHVybnMgYSBQcm9taXNlIGZvciBpdHMgcmVzb2x1dGlvbi5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gQWN0aW9uIHRvIGRpc3BhdGNoXHJcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSBmb3IgdGhlIHJlc29sdXRpb24gb2YgdGhlIGFjdGlvbiwgd2hhdGV2ZXIgdGhpcyBjb3VsZCBtZWFuLlxyXG4gICAqL1xyXG4gIGRpc3BhdGNoKCkge31cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmx1eDtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
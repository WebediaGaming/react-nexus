'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var __DEV__ = process.env.NODE_ENV === 'development';
/**
 * @abstract
 */

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
  }, {
    key: 'displayName',
    value: 'Flux',
    enumerable: true
  }]);

  function Flux() {
    _classCallCheck(this, Flux);

    if (__DEV__) {
      if (this.constructor === Flux) {
        throw new Error('Nexus.Flux is an abstract class. You must extend it.');
      }
      (0, _shouldAsFunction2['default'])(this.constructor).have.property('displayName').which.is.a.String();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZsdXguanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztnQ0FBbUIsb0JBQW9COzs7O0FBQ3ZDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLGFBQWEsQ0FBQzs7Ozs7SUFJakQsSUFBSTtlQUFKLElBQUk7Ozs7Ozs7OztXQVFVLHVCQUFHLEVBQUU7OztXQVBGLE1BQU07Ozs7QUFTaEIsV0FWUCxJQUFJLEdBVU07MEJBVlYsSUFBSTs7QUFXTixRQUFHLE9BQU8sRUFBRTtBQUNWLFVBQUcsSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJLEVBQUU7QUFDNUIsY0FBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO09BQ3pFO0FBQ0QseUNBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDM0U7R0FDRjs7Ozs7OztlQWpCRyxJQUFJOztXQXVCQyxxQkFBRyxFQUFFOzs7Ozs7Ozs7V0FPUixrQkFBRyxFQUFFOzs7Ozs7OztXQU1ILG9CQUFHLEVBQUU7Ozs7Ozs7Ozs7V0FRTixtQkFBRyxFQUFFOzs7Ozs7Ozs7O1dBUUosb0JBQUcsRUFBRTs7O1NBcERULElBQUk7OztxQkF1REssSUFBSSIsImZpbGUiOiJGbHV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNob3VsZCBmcm9tICdzaG91bGQvYXMtZnVuY3Rpb24nO1xyXG5jb25zdCBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XHJcbi8qKlxyXG4gKiBAYWJzdHJhY3RcclxuICovXHJcbmNsYXNzIEZsdXgge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdGbHV4JztcclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgRmx1eCBpbnN0YW5jZSBiYXNlZCBvbiBhIHByZXZpb3VzIGNhbGwgdG8gc2VyaWFsaXplKClcclxuICAgKiBAcGFyYW0ge09iamVjdH0gUHJldmlvdXMgcmV0dXJuIHZhbHVlIG9mIHNlcmlhbGl6ZSgpXHJcbiAgICogQHBhcmFtIHsuLi4qfSBPdGhlciBjb25zdHJ1Y3RvciBwYXJhbWV0ZXJzXHJcbiAgICogQHJldHVybiB7Rmx1eH0gTmV3IEZsdXggaW5zdGFuY2Ugd2l0aCBpdHMgaW50ZXJuYWwgc3RhdGUgcmVzdG9yZWRcclxuICAgKi9cclxuICBzdGF0aWMgdW5zZXJpYWxpemUoKSB7fVxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgaWYodGhpcy5jb25zdHJ1Y3RvciA9PT0gRmx1eCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTmV4dXMuRmx1eCBpcyBhbiBhYnN0cmFjdCBjbGFzcy4gWW91IG11c3QgZXh0ZW5kIGl0LicpO1xyXG4gICAgICB9XHJcbiAgICAgIHNob3VsZCh0aGlzLmNvbnN0cnVjdG9yKS5oYXZlLnByb3BlcnR5KCdkaXNwbGF5TmFtZScpLndoaWNoLmlzLmEuU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeHBvcnQgYSBKU09OLXNlcmlhbGl6YWJsZSBkZXNjcmlwdGlvbiBvZiB0aGUgaW5zdGFuY2UgaW50ZXJuYWwgc3RhdGVcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEpTT04tc2VyaWFsaXphYmxlIG9iamVjdFxyXG4gICAqL1xyXG4gIHNlcmlhbGl6ZSgpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGxpc3Qgb2YgdGhlIGxhdGVzdCB2YWx1ZXMgdGhlIHJlcXVlc3RlZCByZXNvdXJjZSBoYXMgdGFrZW5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gUmVxdWVzdGVkIHJlc291cmNlIHBhcmFtZXRlcnNcclxuICAgKiBAcmV0dXJuIHtBcnJheX0gTGlzdCBvZiB0aGUgbGF0ZXN0IHZhbHVlcyB0aGUgcmVxdWVzdGVkIHJlc291cmNlIGhhcyB0YWtlblxyXG4gICAqL1xyXG4gIHZhbHVlcygpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbW1hbmRzIHRvIGFzeW5jaHJvbm91c2x5IHBvcHVsYXRlIHNvIHRoYXQgd2hlbiB0aGUgUHJvbWlzZSBpcyBzZXR0bGVkLCB2YWx1ZXMoKSBkb2Vzbid0IHRocm93XHJcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUmVzb2x2ZXMgaWYgYW5kIHdoZW4gdGhlIHBvcHVsYXRpb24gaGFzIGJlZW4gc2V0dGxlZCAod2hldGhlciBpdCBhY3R1YWxseSBzdWNjZWVkZWQgb3Igbm90KVxyXG4gICAqL1xyXG4gIHBvcHVsYXRlKCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogU3RhcnQgb2JzZXJ2aW5nIGEgcmVzb3VyY2UgKGltcGxpY2l0bHkgcG9wdWxhdGluZyBpdCkgYW5kIHJlZ2lzdGVyIGEgY2FsbGJhY2sgd2hlbmV2ZXIgaXQgcmVjZWl2ZXMgYSBuZXcgdmFsdWVcclxuICAgKiBAcGFyYW0ge09iamVjdH0gUmVxdWVzdCByZXNvdXJjZSBwYXJhbWV0ZXJzXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aGVuZXIgdGhlIHJlc291cmNlIHJlY2VpdmVzIGEgbmV3IHZhbHVlXHJcbiAgICogQHJldHVybiB7RnVuY3Rpb259IENhbGxiYWNrIHRvIHRlcm1pbmF0ZSB0aGUgb2JzZXJ2YXRpb25cclxuICAgKi9cclxuICBvYnNlcnZlKCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogRGlzcGF0Y2hlcyBhbiBhY3Rpb24sIHdoYXRldmVyIHRoaXMgY291bGQgbWVhbi5cclxuICAgKiBSZXR1cm5zIGEgUHJvbWlzZSBmb3IgaXRzIHJlc29sdXRpb24uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IEFjdGlvbiB0byBkaXNwYXRjaFxyXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFByb21pc2UgZm9yIHRoZSByZXNvbHV0aW9uIG9mIHRoZSBhY3Rpb24sIHdoYXRldmVyIHRoaXMgY291bGQgbWVhbi5cclxuICAgKi9cclxuICBkaXNwYXRjaCgpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZsdXg7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
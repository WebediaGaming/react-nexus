'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var __DEV__ = process.env.NODE_ENV === 'development';
/**
 * @abstract
 */

var Flux = (function () {
  /**
   * Create a new Flux instance based on a previous call to serialize()
   * @param {Object} Previous return value of serialize()
   * @param {...*} Other constructor parameters
   * @return {Flux} New Flux instance with its internal state restored
   */

  Flux.unserialize = function unserialize() {};

  _createClass(Flux, null, [{
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
      _shouldAsFunction2['default'](this.constructor).have.property('displayName').which.is.a.String();
    }
  }

  /**
   * Export a JSON-serializable description of the instance internal state
   * @return {Object} JSON-serializable object
   */

  Flux.prototype.serialize = function serialize() {};

  /**
   * Returns the list of the latest values the requested resource has taken
   * @param {Object} Requested resource parameters
   * @return {Array} List of the latest values the requested resource has taken
   */

  Flux.prototype.values = function values() {};

  /**
   * Commands to asynchronously populate so that when the Promise is settled, values() doesn't throw
   * @return {Promise} Resolves if and when the population has been settled (whether it actually succeeded or not)
   */

  Flux.prototype.populate = function populate() {};

  /**
   * Start observing a resource (implicitly populating it) and register a callback whenever it receives a new value
   * @param {Object} Request resource parameters
   * @param {Function} Callback to be invoked whener the resource receives a new value
   * @return {Function} Callback to terminate the observation
   */

  Flux.prototype.observe = function observe() {};

  /**
   * Dispatches an action, whatever this could mean.
   * Returns a Promise for its resolution.
   * @param {Object} Action to dispatch
   * @return {Promise} Promise for the resolution of the action, whatever this could mean.
   */

  Flux.prototype.dispatch = function dispatch() {};

  return Flux;
})();

exports['default'] = Flux;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsdXhlcy9GbHV4LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2dDQUFtQixvQkFBb0I7Ozs7QUFDdkMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssYUFBYSxDQUFDOzs7OztJQUlqRCxJQUFJOzs7Ozs7OztBQUFKLE1BQUksQ0FRRCxXQUFXLEdBQUEsdUJBQUcsRUFBRTs7ZUFSbkIsSUFBSTs7V0FDYSxNQUFNOzs7O0FBU2hCLFdBVlAsSUFBSSxHQVVNOzBCQVZWLElBQUk7O0FBV04sUUFBRyxPQUFPLEVBQUU7QUFDVixVQUFHLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFO0FBQzVCLGNBQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztPQUN6RTtBQUNELG9DQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzNFO0dBQ0Y7Ozs7Ozs7QUFqQkcsTUFBSSxXQXVCUixTQUFTLEdBQUEscUJBQUcsRUFBRTs7Ozs7Ozs7QUF2QlYsTUFBSSxXQThCUixNQUFNLEdBQUEsa0JBQUcsRUFBRTs7Ozs7OztBQTlCUCxNQUFJLFdBb0NSLFFBQVEsR0FBQSxvQkFBRyxFQUFFOzs7Ozs7Ozs7QUFwQ1QsTUFBSSxXQTRDUixPQUFPLEdBQUEsbUJBQUcsRUFBRTs7Ozs7Ozs7O0FBNUNSLE1BQUksV0FvRFIsUUFBUSxHQUFBLG9CQUFHLEVBQUU7O1NBcERULElBQUk7OztxQkF1REssSUFBSSIsImZpbGUiOiJmbHV4ZXMvRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJztcclxuY29uc3QgX19ERVZfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG4vKipcclxuICogQGFic3RyYWN0XHJcbiAqL1xyXG5jbGFzcyBGbHV4IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnRmx1eCc7XHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgbmV3IEZsdXggaW5zdGFuY2UgYmFzZWQgb24gYSBwcmV2aW91cyBjYWxsIHRvIHNlcmlhbGl6ZSgpXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IFByZXZpb3VzIHJldHVybiB2YWx1ZSBvZiBzZXJpYWxpemUoKVxyXG4gICAqIEBwYXJhbSB7Li4uKn0gT3RoZXIgY29uc3RydWN0b3IgcGFyYW1ldGVyc1xyXG4gICAqIEByZXR1cm4ge0ZsdXh9IE5ldyBGbHV4IGluc3RhbmNlIHdpdGggaXRzIGludGVybmFsIHN0YXRlIHJlc3RvcmVkXHJcbiAgICovXHJcbiAgc3RhdGljIHVuc2VyaWFsaXplKCkge31cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIGlmKHRoaXMuY29uc3RydWN0b3IgPT09IEZsdXgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05leHVzLkZsdXggaXMgYW4gYWJzdHJhY3QgY2xhc3MuIFlvdSBtdXN0IGV4dGVuZCBpdC4nKTtcclxuICAgICAgfVxyXG4gICAgICBzaG91bGQodGhpcy5jb25zdHJ1Y3RvcikuaGF2ZS5wcm9wZXJ0eSgnZGlzcGxheU5hbWUnKS53aGljaC5pcy5hLlN0cmluZygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXhwb3J0IGEgSlNPTi1zZXJpYWxpemFibGUgZGVzY3JpcHRpb24gb2YgdGhlIGluc3RhbmNlIGludGVybmFsIHN0YXRlXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBKU09OLXNlcmlhbGl6YWJsZSBvYmplY3RcclxuICAgKi9cclxuICBzZXJpYWxpemUoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBsaXN0IG9mIHRoZSBsYXRlc3QgdmFsdWVzIHRoZSByZXF1ZXN0ZWQgcmVzb3VyY2UgaGFzIHRha2VuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IFJlcXVlc3RlZCByZXNvdXJjZSBwYXJhbWV0ZXJzXHJcbiAgICogQHJldHVybiB7QXJyYXl9IExpc3Qgb2YgdGhlIGxhdGVzdCB2YWx1ZXMgdGhlIHJlcXVlc3RlZCByZXNvdXJjZSBoYXMgdGFrZW5cclxuICAgKi9cclxuICB2YWx1ZXMoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBDb21tYW5kcyB0byBhc3luY2hyb25vdXNseSBwb3B1bGF0ZSBzbyB0aGF0IHdoZW4gdGhlIFByb21pc2UgaXMgc2V0dGxlZCwgdmFsdWVzKCkgZG9lc24ndCB0aHJvd1xyXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFJlc29sdmVzIGlmIGFuZCB3aGVuIHRoZSBwb3B1bGF0aW9uIGhhcyBiZWVuIHNldHRsZWQgKHdoZXRoZXIgaXQgYWN0dWFsbHkgc3VjY2VlZGVkIG9yIG5vdClcclxuICAgKi9cclxuICBwb3B1bGF0ZSgpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0YXJ0IG9ic2VydmluZyBhIHJlc291cmNlIChpbXBsaWNpdGx5IHBvcHVsYXRpbmcgaXQpIGFuZCByZWdpc3RlciBhIGNhbGxiYWNrIHdoZW5ldmVyIGl0IHJlY2VpdmVzIGEgbmV3IHZhbHVlXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IFJlcXVlc3QgcmVzb3VyY2UgcGFyYW1ldGVyc1xyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IENhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbmVyIHRoZSByZXNvdXJjZSByZWNlaXZlcyBhIG5ldyB2YWx1ZVxyXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBDYWxsYmFjayB0byB0ZXJtaW5hdGUgdGhlIG9ic2VydmF0aW9uXHJcbiAgICovXHJcbiAgb2JzZXJ2ZSgpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIERpc3BhdGNoZXMgYW4gYWN0aW9uLCB3aGF0ZXZlciB0aGlzIGNvdWxkIG1lYW4uXHJcbiAgICogUmV0dXJucyBhIFByb21pc2UgZm9yIGl0cyByZXNvbHV0aW9uLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBBY3Rpb24gdG8gZGlzcGF0Y2hcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBQcm9taXNlIGZvciB0aGUgcmVzb2x1dGlvbiBvZiB0aGUgYWN0aW9uLCB3aGF0ZXZlciB0aGlzIGNvdWxkIG1lYW4uXHJcbiAgICovXHJcbiAgZGlzcGF0Y2goKSB7fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGbHV4O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

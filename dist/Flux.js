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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZsdXguanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Z0NBQW1CLG9CQUFvQjs7OztBQUN2QyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxhQUFhLENBQUM7Ozs7O0lBSWpELElBQUk7Ozs7Ozs7O0FBQUosTUFBSSxDQVFELFdBQVcsR0FBQSx1QkFBRyxFQUFFOztlQVJuQixJQUFJOztXQUNhLE1BQU07Ozs7QUFTaEIsV0FWUCxJQUFJLEdBVU07MEJBVlYsSUFBSTs7QUFXTixRQUFHLE9BQU8sRUFBRTtBQUNWLFVBQUcsSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJLEVBQUU7QUFDNUIsY0FBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO09BQ3pFO0FBQ0Qsb0NBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDM0U7R0FDRjs7Ozs7OztBQWpCRyxNQUFJLFdBdUJSLFNBQVMsR0FBQSxxQkFBRyxFQUFFOzs7Ozs7OztBQXZCVixNQUFJLFdBOEJSLE1BQU0sR0FBQSxrQkFBRyxFQUFFOzs7Ozs7O0FBOUJQLE1BQUksV0FvQ1IsUUFBUSxHQUFBLG9CQUFHLEVBQUU7Ozs7Ozs7OztBQXBDVCxNQUFJLFdBNENSLE9BQU8sR0FBQSxtQkFBRyxFQUFFOzs7Ozs7Ozs7QUE1Q1IsTUFBSSxXQW9EUixRQUFRLEdBQUEsb0JBQUcsRUFBRTs7U0FwRFQsSUFBSTs7O3FCQXVESyxJQUFJIiwiZmlsZSI6IkZsdXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XHJcbmNvbnN0IF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcclxuLyoqXHJcbiAqIEBhYnN0cmFjdFxyXG4gKi9cclxuY2xhc3MgRmx1eCB7XHJcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ0ZsdXgnO1xyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBGbHV4IGluc3RhbmNlIGJhc2VkIG9uIGEgcHJldmlvdXMgY2FsbCB0byBzZXJpYWxpemUoKVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBQcmV2aW91cyByZXR1cm4gdmFsdWUgb2Ygc2VyaWFsaXplKClcclxuICAgKiBAcGFyYW0gey4uLip9IE90aGVyIGNvbnN0cnVjdG9yIHBhcmFtZXRlcnNcclxuICAgKiBAcmV0dXJuIHtGbHV4fSBOZXcgRmx1eCBpbnN0YW5jZSB3aXRoIGl0cyBpbnRlcm5hbCBzdGF0ZSByZXN0b3JlZFxyXG4gICAqL1xyXG4gIHN0YXRpYyB1bnNlcmlhbGl6ZSgpIHt9XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgaWYoX19ERVZfXykge1xyXG4gICAgICBpZih0aGlzLmNvbnN0cnVjdG9yID09PSBGbHV4KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXh1cy5GbHV4IGlzIGFuIGFic3RyYWN0IGNsYXNzLiBZb3UgbXVzdCBleHRlbmQgaXQuJyk7XHJcbiAgICAgIH1cclxuICAgICAgc2hvdWxkKHRoaXMuY29uc3RydWN0b3IpLmhhdmUucHJvcGVydHkoJ2Rpc3BsYXlOYW1lJykud2hpY2guaXMuYS5TdHJpbmcoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4cG9ydCBhIEpTT04tc2VyaWFsaXphYmxlIGRlc2NyaXB0aW9uIG9mIHRoZSBpbnN0YW5jZSBpbnRlcm5hbCBzdGF0ZVxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gSlNPTi1zZXJpYWxpemFibGUgb2JqZWN0XHJcbiAgICovXHJcbiAgc2VyaWFsaXplKCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgbGlzdCBvZiB0aGUgbGF0ZXN0IHZhbHVlcyB0aGUgcmVxdWVzdGVkIHJlc291cmNlIGhhcyB0YWtlblxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBSZXF1ZXN0ZWQgcmVzb3VyY2UgcGFyYW1ldGVyc1xyXG4gICAqIEByZXR1cm4ge0FycmF5fSBMaXN0IG9mIHRoZSBsYXRlc3QgdmFsdWVzIHRoZSByZXF1ZXN0ZWQgcmVzb3VyY2UgaGFzIHRha2VuXHJcbiAgICovXHJcbiAgdmFsdWVzKCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogQ29tbWFuZHMgdG8gYXN5bmNocm9ub3VzbHkgcG9wdWxhdGUgc28gdGhhdCB3aGVuIHRoZSBQcm9taXNlIGlzIHNldHRsZWQsIHZhbHVlcygpIGRvZXNuJ3QgdGhyb3dcclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBSZXNvbHZlcyBpZiBhbmQgd2hlbiB0aGUgcG9wdWxhdGlvbiBoYXMgYmVlbiBzZXR0bGVkICh3aGV0aGVyIGl0IGFjdHVhbGx5IHN1Y2NlZWRlZCBvciBub3QpXHJcbiAgICovXHJcbiAgcG9wdWxhdGUoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBTdGFydCBvYnNlcnZpbmcgYSByZXNvdXJjZSAoaW1wbGljaXRseSBwb3B1bGF0aW5nIGl0KSBhbmQgcmVnaXN0ZXIgYSBjYWxsYmFjayB3aGVuZXZlciBpdCByZWNlaXZlcyBhIG5ldyB2YWx1ZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBSZXF1ZXN0IHJlc291cmNlIHBhcmFtZXRlcnNcclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDYWxsYmFjayB0byBiZSBpbnZva2VkIHdoZW5lciB0aGUgcmVzb3VyY2UgcmVjZWl2ZXMgYSBuZXcgdmFsdWVcclxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQ2FsbGJhY2sgdG8gdGVybWluYXRlIHRoZSBvYnNlcnZhdGlvblxyXG4gICAqL1xyXG4gIG9ic2VydmUoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBEaXNwYXRjaGVzIGFuIGFjdGlvbiwgd2hhdGV2ZXIgdGhpcyBjb3VsZCBtZWFuLlxyXG4gICAqIFJldHVybnMgYSBQcm9taXNlIGZvciBpdHMgcmVzb2x1dGlvbi5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gQWN0aW9uIHRvIGRpc3BhdGNoXHJcbiAgICogQHJldHVybiB7UHJvbWlzZX0gUHJvbWlzZSBmb3IgdGhlIHJlc29sdXRpb24gb2YgdGhlIGFjdGlvbiwgd2hhdGV2ZXIgdGhpcyBjb3VsZCBtZWFuLlxyXG4gICAqL1xyXG4gIGRpc3BhdGNoKCkge31cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmx1eDtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

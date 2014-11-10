module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const requestAnimationFrame = require('raf');

  require('setimmediate');

  function clearAnimationFrame(handle) {
    requestAnimationFrame.cancel(handle);
  }

  const Async = {
    Mixin: {
      _AsyncMixinHasUnmounted: false,
      _AsyncMixinHasAsyncMixin: true,
      _AsyncMixinQueuedTimeouts: null,
      _AsyncMixinQueuedImmediates: null,
      _AsyncMixinQueuedAnimationFrames: null,

      componentWillMountcomponentWillMount() {
        this._AsyncMixinQueuedTimeouts = {};
        this._AsyncMixinQueuedImmediates = {};
        this._AsyncMixinQueuedAnimationFrames = {};
      },

      componentWillUnmount() {
        _.each(this._AsyncMixinQueuedTimeouts, clearTimeout);
        _.each(this._AsyncMixinQueuedImmediates, clearImmediate);
        _.each(this._AsyncMixinQueuedAnimationFrames, clearAnimationFrame);
        this._AsyncMixinHasUnmounted = true;
      },

      setStateIfMounted: Async.ifMounted(function() { this.setState(state); }),
    },

    ifMounted(fn) {
      return () => {
        _.dev(() => this._AsyncMixinHasAsyncMixin.should.be.ok);
        if(!this._AsyncMixinHasUnmounted) {
          return fn.apply(this, arguments);
        }
      };
    },

    _deferredImmediate(fn) {
      return () => {
        let args = arguments;
        let id = _.uniqueId('setImmediate');
        let q = setImmediate(() => {
          delete this._AsyncMixinQueuedImmediates[id];
          return fn.apply(this, args);
        });
        this._AsyncMixinQueuedImmediates[id] = q;
        return id;
      };
    },

    _deferredAnimationFrame(fn) {
      return () => {
        let args = arguments;
        let id = _.uniqueId('setImmediate');
        let q = requestAnimationFrame(() => {
          delete this._AsyncMixinQueuedAnimationFrames[id];
          return fn.apply(this, arguments);
        });
        this._AsyncMixinQueuedAnimationFrames[id] = q;
        return id;
      };
    },

    _deferredTimeout(delay) {
      return (fn) => () => {
        let args = arguments;
        let id = _.uniqueId('setTimeout');
        let q = setTimeout(() => {
          delete this._AsyncMixinQueuedTimeouts[id];
          return fn.apply(this, arguments);
        }, delay);
        this._AsyncMixinQueuedTimeouts[id] = q;
        return q;
      };
    },

    deferred(fn, delay) {
      let ifn = R.Async.ifMounted(fn);
      if(!delay) {
        return R.Async._deferredImmediate(ifn);
      }
      else {
        return R.Async._deferredTimeout(ifn, delay);
      }
    },

    deferredAnimationFrame(fn) {
      let ifn = R.Async.ifMounted(fn);
      return R.Async._deferredAnimationFrame(ifn);
    },
  };

  return Async;
};

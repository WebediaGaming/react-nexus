module.exports = function(R) {
  const _ = R._;
  const requestAnimationFrame = require('raf');

  require('setimmediate');

  function clearAnimationFrame(handle) {
    requestAnimationFrame.cancel(handle);
  }

  const Async = {
    ifMounted(fn) {
      return () => {
        _.dev(() => this._AsyncMixin.should.be.ok);
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
          return fn.apply(this, args);
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
          return fn.apply(this, args);
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

  _.extend(Async, {
    Mixin: {
      _AsyncMixin: true,
      _AsyncMixinHasUnmounted: false,
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

      setStateIfMounted: Async.ifMounted(function(state) { this.setState(state); }),
    },
  });

  return Async;
};

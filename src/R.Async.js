module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var requestAnimationFrame = require("raf");
    require("setimmediate");

    var clearAnimationFrame = function clearAnimationFrame(handle) {
        requestAnimationFrame.cancel(handle);
    };

    /**
     * Utilities for dealing with asynchronous callbacks in components.
     * @memberOf R
     * @public
     * @class R.Async
     */
    var Async = {
        /**
         * React mixin allowing the usage of the R.Async decorators: IfMounted, Deferred, DeferredImmediate and DeferredAnimationFrame.
         * @type Mixin
         * @mixin
         * @public
         */
        Mixin: null,
        /**
         * Decorates a method so that upon invocation, it is only actually invoked if the component has not unmounted.
         * @method IfMounted
         * @param {Function}
         * @return {Function}
         * @public
         */
        IfMounted: function IfMounted(fn) {
            return function() {
                R.Debug.dev(R.scope(function() {
                    assert(this._AsyncMixinHasAsyncMixin, "R.Async.IfMounted(...): requies R.Async.Mixin.");
                }, this));
                if(!this._AsyncMixinHasUnmounted) {
                    return fn.apply(this, arguments);
                }
                else {
                    return void 0;
                }
            };
        },
        /**
         * @method _DeferToNextImmediate
         * @param {Function}
         * @return {Function}
         * @private
         */
        _DeferToNextImmediate: function _DeferToNextImmediate(fn) {
            return function() {
                var args = arguments;
                var u = _.uniqueId("setImmediate");
                var q = setImmediate(R.scope(function() {
                    delete this._AsyncMixinQueuedImmediates[u];
                    return fn.apply(this, args);
                }, this));
                this._AsyncMixinQueuedImmediates[u] = q;
            };
        },
        /**
         * @method  _DeferToNextAnimationFrame
         * @param {Function}
         * @return {Function}
         * @private
         */
        _DeferToNextAnimationFrame: function _DeferToNextAnimationFrame(fn) {
            return function() {
                var args = arguments;
                var u = _.uniqueId("requestAnimationFrame");
                var q = requestAnimationFrame(R.scope(function() {
                    delete this._AsyncMixinQueuedAnimationFrames[u];
                    return fn.apply(this, args);
                }, this));
                this._AsyncMixinQueuedAnimationFrames[u] = q;
            };
        },
        /**
         * @method _DeferToTimeout
         * @param {Number}
         * @return {Function(Function): Function}
         * @private
         */
        _DeferToTimeout: function _DeferToTimeout(delay) {
            /**
             * @param {Function}
             * @return {Function}
             */
            return function(fn) {
                return function() {
                    var args = arguments;
                    var u = _.uniqueId("setTimeout");
                    var q = setTimeout(R.scope(function() {
                        delete this._AsyncMixinQueuedTimeouts[u];
                        return fn.apply(this, args);
                    }, this));
                    this._AsyncMixinQueuedTimeouts[u] = q;
                };
            };
        },
        /**
         * Decorates a method so that upon invocation, it is actually invoked after a timeout and only the component has not unmounted.
         * If no timeout is provided, then it will defer to setImmediate.
         * @method Deferred
         * @param {Function}
         * @return {Function}
         * @public
         */
        Deferred: function Deferred(fn, delay) {
            fn = R.Async.IfMounted(fn);
            if(!delay) {
                return R.Async.DeferredImmediate(fn);
            }
            else {
                return R.Async._DeferToTimeout(fn, delay);
            }
        },
        /**
         * Decorates a method so that upon invocation, it is actually invoked after deferral and only the component has not unmounted.
         * @method DeferredImmediate
         * @param {Function}
         * @return {Function}
         * @public
         */
        DeferredImmediate: function Deferred(fn) {
            fn = R.Async.IfMounted(fn);
            return R.Async._DeferToNextImmediate(fn);
        },
        /**
         * Decorates a method so that upon invocation, it is actually invoked upon the next animation frame and only the component has not unmounted.
         * @method DeferredAnimationFrame
         * @param {Function}
         * @return {Function}
         * @public
         */
        DeferredAnimationFrame: function DeferredAnimationFrame(fn) {
            fn = R.Async.IfMounted(fn);
            return R.Async._DeferToNextAnimationFrame(fn);
        },
    };

    Async.Mixin = {
        _AsyncMixinHasUnmounted: false,
        _AsyncMixinHasAsyncMixin:  true,
        _AsyncMixinQueuedTimeouts: null,
        _AsyncMixinQueuedImmediates: null,
        _AsyncMixinQueuedAnimationFrames: null,
        componentWillMount: function componentWillMount() {
            this._AsyncMixinQueuedTimeouts = {};
            this._AsyncMixinQueuedImmediates = {};
            this._AsyncMixinQueuedAnimationFrames = {};
        },
        componentWillUnmount: function componentWillUnmount() {
            _.each(this._AsyncMixinQueuedTimeouts, clearTimeout);
            _.each(this._AsyncMixinQueuedImmediates, clearImmediate);
            _.each(this._AsyncMixinQueuedAnimationFrames, clearAnimationFrame);
            this._AsyncMixinHasUnmounted = true;
        },
        setStateIfMounted: Async.IfMounted(function setStateIfMounted(state) {
            this.setState(state);
        }),
    };

    return Async;
};

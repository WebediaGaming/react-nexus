var R = require("./R");
var assert = require("assert");
var VError = require("verror");
var _ = require("lodash");
/**
 * Debugging utilities embedded with R.
 * Provides conditionals for dev/prod mode and associated assertions to avoid lengthy try/catch blocks in prod mode.
 * @memberof R
 * @type {Object}
 */
var Debug = /** @lends R.Debug */{
    /**
     * @type {String}
     * @private
     */
    _mode: function() {
        /* If in node or envified browser environment, read from env */
        if(process && process.env && process.env.NODE_ENV) {
            return process.env.NODE_ENV;
        }
        /* Defaults to 'development'. */
        else {
            return 'development';
        }
    }(),
    /**
     * Manually override mode to either 'production' or 'development'.
     * Use this if you don't want to use envify.
     * @param {String} mode
     * @public
     */
    setMode: function setMode(mode) {
        assert('development' === mode || 'production' === mode, "R.Debug.setMode(...): mode should be either 'development' or 'production'.");
        R.Debug._mode = mode;
    },
    /**
     * Returns a boolean describing whether the current mode is dev.
     * @return {Boolean} Truthy iff the current mode is dev.
     * @public
     */
    isDev: function isDev() {
        return 'development' === R.Debug._mode;
    },
    /**
     * Returns a boolean describing whether the current mode is prod.
     * @return {Boolean} Truthy iff the current mode is prod.
     * @public
     */
    isProd: function isProd() {
        return 'production' === R.Debug._mode;
    },
    /**
     * Runs a function iff the current mode is dev.
     * @param  {Function} fn The function to invoke iff the current mode is dev.
     * @return {*} The return value of fn iff the current mode is dev, undefined otherwise.
     * @public
     */
    dev: function dev(fn) {
        return R.Debug.isDev() ? fn() : void 0;
    },
    /**
     * Runs a function iff the current mode is prod.
     * @param  {Function} fn The function to invoke iff the current mode is prod.
     * @return {*} The return value of fn iff the current mode is prod, undefined otherwise.
     * @public
     */
    prod: function prod(fn) {
        return R.Debug.isProd() ? fn(): void 0;
    },
    /**
     * Returns a function iff the current mode is dev, otherwise returns a noop function.
     * "dev-only" maybe monad.
     * @param  {Function} fn The function to be returned if the current mode is dev.
     * @return {Function} The original function iff the current mode is dev, no-op function otherwise.
     * @public
     */
    maybeDev: function maybeDev(fn) {
        return R.Debug.isDev() ? fn : _.noop;
    },
    /**
     * Returns a function iff the current mode is prod, otherwise returns a noop function.
     * "prod-only" maybe monad.
     * @param  {Function} fn The function to be returned if the current mode is prod.
     * @return {Function} The original function iff the current mode is prod, no-op function otherwise.
     * @public
     */
    maybeProd: function maybeProd(fn) {
        return Debug.isProd() ? fn : _.noop;
    },
    /**
     * Trigger a debugger breakpoint without raising jshint errors.
     * @public
     */
    breakpoint: function breakpoint() {
        /* jshint debug:true */
        debugger;
        /* jshint debug:false */
    },
    assert: {
        /**
         * Runs assert from node core iff the current mode is dev.
         * Throws iff the assert fails and the current mode is dev.
         * @type {Function}
         * @public
         */
        dev: function dev() {
            if(Debug.isDev()) {
                return assert.apply(null, arguments);
            }
            else {
                return void 0;
            }
        },
        /**
         * Runs assert from node core iff the current mode is prod.
         * Throw iff the assert fails and the current mode is prod.
         * @type {Function}
         * @public
         */
        prod: function prod() {
            if(Debug.isProd()) {
                return assert.apply(null, arguments);
            }
            else {
                return void 0;
            }
        },
        /**
         * @see {assert}
         * @type {Function}
         * @public
         */
        always: assert,
    },
    /**
     * Runs assert from node core with the same arguments.
     * Throws if the assert fails and the current mode is dev.
     * console.error if the assert fails and the current mode is prod.
     * No side effect if the assert doesn't fail.
     * @return {Boolean} Truthy only if the assert doesn't fail. False if the assert fails and not in dev mode.
     * @type {Function}
     * @public
     */
    check: function check() {
        try {
            assert.apply(null, arguments);
        }
        catch(err) {
            if(Debug.isDev()) {
                throw err;
            }
            else {
                console.error(err);
                return false;
            }
        }
        return true;
    },
    /**
     * Extends an Error to provide additional information while preserving the error stack.
     * Uses VError under the hood.
     * @param  {Error} originalErr The original error.
     * @param  {Error|String} wrappingErr The error to use as wrapper.
     * @return {Error} The new, extended Error.
     * @public
     */
    extendError: function extendError(originalErr, wrappingErr) {
        if(_.isString(wrappingErr)) {
            wrappingErr = new Error(wrappingErr);
        }
        return new VError(originalErr, wrappingErr);
    },
    /**
     * Returns a function that will rethrow when passed an error.
     * @param  {Error|String} [wrappingErr] Optionnal error to use as wrapper.
     * @public
     */
    rethrow: function rethrow(wrappingErr) {
        if(!wrappingErr) {
            return function(err) {
                throw err;
            };
        }
        else {
            return function(err) {
                throw Debug.extendError(err, wrappingErr);
            };
        }
    },
};

module.exports = {
    Debug: Debug,
};

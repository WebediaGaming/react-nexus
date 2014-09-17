module.exports = function(R) {
    var VError = require("verror");
    var _ = require("lodash");
    var assert = require("assert");
    var util = require("util");
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
        display: function display(name, obj) {
            console.warn("++++[ " + name + " ]++++");
            for(var k in obj) {
                console.warn(k, ":", obj[k]);
            }
            console.warn("----[ " + name + " ]----");
        },
        fail: function fail(err) {
            throw err;
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
                    Debug.fail(err);
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
        extendError: function extendError(err, message) {
            return new VError(err, message);
        },
        /**
         * Returns a function that will rethrow when passed an error.
         * @param  {Error|String} [wrappingErr] Optionnal error to use as wrapper.
         * @public
         */
        rethrow: function rethrow(message) {
            if(!message) {
                return function(err) {
                    if(err) {
                        Debug.fail(err);
                    }
                };
            }
            else {
                return function(err) {
                    if(err) {
                        console.error(message);
                        Debug.fail(err);
                    }
                };
            }
        },
    };

    R.Debug = Debug;
    return R;
};

var R = require("./R");
var _request = require("request");
var sha256 = require("sha256");

module.exports = /** @lends R */{
    /**
     * Returns the original function modified so that its context is always the given context.
     * Lightweight alternative to Function.prototype.bind.
     * @param {Function} fn The function to scope.
     * @param {*} ctx The context to scope.
     * @return {Function} The scoped function.
     * @public
     */
    scope: function scope(fn, ctx) {
        return function() {
            return fn.apply(ctx, arguments);
        };
    },
    /**
     * Returns a POJO with a single key-val pair.
     * @param {String} key The unique key of the returned Object.
     * @param {*} val The unique value associated with the given key in the retuend Object.
     * @return {Object}
     * @public
     */
    record: function record(key, val) {
        var r = {};
        r[key] = val;
        return r;
    },
    noopThunk: function noopThunk(fn) {
        return function() {
            fn();
        };
    },
    callWith: function callWith() {
        var args = arguments;
        return function(fn) {
            fn.apply(null, args);
        };
    },
    isServer: function isServer() {
        return typeof window === 'undefined';
    },
    ifServer: function ifServer(fn) {
        if(R.isServer()) {
            fn();
        }
    },
    ifBrowser: function ifBrowser(fn) {
        if(!R.isServer()) {
            fn();
        }
    },
    request: function request() {
        var args = arguments;
        return function(fn) {
            args.push(fn);
            return _request.apply(null, args);
        };
    },
    hash: sha256,
    /**
     * @type {Function}
     * @private
     */
    _guidHelper: function _guidHelper() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    },
    /**
     * Returns a random, unique string GUID, with an optional prefix.
     * @param {String?} prefix
     * @return {String}
     */
    guid: function guid(prefix) {
        s4 = R._guidHelper;
        prefix = prefix || '';
        return '' + prefix + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
};

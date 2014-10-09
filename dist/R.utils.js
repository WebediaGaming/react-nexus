module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var sha256 = require("sha256");
    var jsonpatch = require("jsonpatch");

    return {
        /**
         * Returns the original function modified so that its context is always the given context.
         * Lightweight alternative to Function.prototype.bind.
         * @param {Function} fn The function to scope.
         * @param {*} ctx The context to scope.
         * @return {Function} The scoped function.
         * @public
         */
        scope: function scope(fn, ctx) {
            if(process.NODE_ENV !== 'production' || (R.Debug && R.Debug.isDev && R.Debug.isDev())) {
                if(!ctx || (R.isClient() && window === ctx)) {
                    throw new Error("R.scope(...): unbound scoping context.");
                }
                return _.extend(function() {
                    return fn.apply(ctx, arguments);
                }, { __unscoped: fn });
            }
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
        noopThunk: function noopThunk() {
            return function(fn) {
                _.defer(function() {
                    fn(null);
                });
            };
        },
        timeoutThunk: function timeoutThunk(delay) {
            return function(fn) {
                setTimeout(function() {
                    fn(null);
                }, delay);
            };
        },
        constantThunk: function constantThunk(val) {
            return function(fn) {
                _.defer(function() {
                    fn(null, val);
                });
            };
        },
        callWith: function callWith() {
            var args = arguments;
            return function(fn) {
                return fn.apply(null, args);
            };
        },
        isServer: function isServer() {
            return typeof window === 'undefined';
        },
        isClient: function isClient() {
            return !R.isServer();
        },
        ifServer: function ifServer(fn) {
            if(R.isServer()) {
                fn();
            }
        },
        ifClient: function ifClient(fn) {
            if(!R.isClient()) {
                fn();
            }
        },
        startsWith: function startsWith(str, prefix) {
            var begin = str.slice(0, prefix.length - 1);
            return begin === prefix;
        },
        hash: sha256,
        diff: function diff(prev, next) {
            return jsonpatch.compare(prev, next);
        },
        patch: function patch(prev, next) {
            return jsonpatch.apply(prev, next);
        },
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
        Base64: {
            encode: function encode(s) {
                return new Buffer(s).toString("base64");
            },
            decode: function decode(s) {
                return new Buffer(s, "base64").toString('utf-8');
            },
        },
    };
};

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
};

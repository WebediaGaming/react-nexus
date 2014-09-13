var R = require("./R");
/**
 * @memberOf R
 * Decorate a function with a wrapper.
 * @param {Function} wrapper Single-argument decorator Function.
 * @param {Function} fn Function to be decorated
 * @param {*} [ctx] Context to bind. Defaults to this. Not required if used on a React autobound method.
 * @return {Function} The decorated function.
 * @public
 */
var Decorate = function(wrapper, fn, ctx) {
    ctx = ctx || this;
    return function() {
        return wrapper.call(ctx, fn.apply(ctx, arguments));
    };
};

/**
 * @memberOf R.Decorate
 * @param  {Function} wrapper Single-argument decorator Function.
 * @param  {String} name Name of the method to decorate.
 * @return {*} The decorated method.
 * @public
 */
Decorate.method = function(wrapper, name) {
    var _this = this;
    return function() {
        return wrapper.call(this, _this[name](arguments));
    };
};

module.exports = {
    Decorate: Decorate,
};

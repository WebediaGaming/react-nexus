module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    /**
    * <p>R.Route provides methods in order to define specifics routes for the Router components</p>
    * @class R.Router
    */
    var Router = function Router() {
        this._routes = {};
    };

    _.extend(Router.prototype, /** @lends R.Router.prototype */ {
        _routes: null,
        _default: null,
        /**
        * <p>Sets a route in a pattern, and combines function returning specific data</p>
        * @method route
        * @param {string} pattern The pattern that will be associated with function
        * @param {string} pattern The pattern that will be associated with function
        * @return {object} this
        */
        route: function route(pattern, fn) {
            R.Debug.dev(R.scope(function() {
                if(_.has(this._routes, pattern)) {
                    console.warn("R.Router.route(...): route already registered.");
                }
            }, this));
            var regexp = this._routeToRegExp(pattern);
            this._routes[pattern] = {
                regexp: regexp,
                fn: fn,
            };
            return this;
        },
        /**
        * @method routes
        * @param {string} patterns
        * @return {object} this
        */
        routes: function routes(patterns) {
            if(_.isUndefined(patterns)) {
                return this._routes;
            }
            _.each(patterns, R.scope(function(fn, pattern) {
                this.route(pattern, fn);
            }, this));
            return this;
        },
        /**
        * <p> Setting up the default fonction to use for the match Function </p>
        * @method def
        * @param {string} fn
        * @return {object} this
        */
        def: function def(fn) {
            this._default = fn;
            return this;
        },
        /**
        * <p>Determines whether the sentence match with at least one of routes</p>
        * @method match
        * @param {string} fragment The sentence to test
        * @return {object} res The object of the corresponding route
        */
        match: function match(fragment) {
            var res = null;
            _.each(this._routes, R.scope(function(r) {
                var regexp = r.regexp;
                var fn = r.fn;
                if(res !== null) {
                    return;
                }
                if(fragment.match(regexp) !== null) {
                    var params = this._extractParameters(regexp, fragment);
                    params.push(fragment);
                    res = fn.apply(null, params);
                }
            }, this));
            if(!res && this._default) {
                res = this._default.call(null, fragment);
            }
            return res;
        },
        /**
        * @method _routeToRegExp
        * @param {object} route
        * @return {object} RegExp
        * @private
        */
        _routeToRegExp: function _routeToRegExp(route) {
            route = route.replace(escapeRegExp, '\\$&')
                         .replace(optionalParam, '(?:$1)?')
                         .replace(namedParam, function(match, optional) {
                            return optional ? match : '([^/?]+)';
                         })
                         .replace(splatParam, '([^?]*?)');
            return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
        },
        /**
        * @method _extractParameters
        * @param {object} regexp
        * @param {object} fragment
        * @return {object} param
        * @private
        */
        _extractParameters: function _extractParameters(regexp, fragment) {
            var params = regexp.exec(fragment).slice(1);
            return _.map(params, function(param, i) {
                if(i === params.length - 1) {
                    return param || null;
                }
                return param ? decodeURIComponent(param) : null;
            });
        },
    });

    return Router;
};

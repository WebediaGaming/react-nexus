module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    var Router = function Router() {
        this._routes = {};
    };

    _.extend(Router.prototype, /** @lends R.Router.prototype */ {
        _routes: null,
        _default: null,
        route: function route(pattern, fn) {
            R.Debug.dev(R.scope(function() {
                if(_.has(this._routes, pattern)) {
                    console.warn("R.Router.route(...): route already registered.");
                }
            }, this));
            regexp = this._routeToRegExp(pattern);
            this._routes[pattern] = {
                regexp: regexp,
                fn: fn,
            };
        },
        routes: function routes(patterns) {
            if(_.isUndefined(patterns)) {
                return this._routes;
            }
            _.each(patterns, R.scope(function(fn, pattern) {
                this.route(pattern, fn);
            }, this));
        },
        def: function def(fn) {
            this._default = fn;
        },
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
                res = this._default.fn.call(null, fragment);
            }
            return res;
        },
        _routeToRegExp: function _routeToRegExp(route) {
            route = route.replace(escapeRegExp, '\\$&')
                         .replace(optionalParam, '(?:$1)?')
                         .replace(namedParam, function(match, optional) {
                            return optional ? match : '([^/?]+)';
                         })
                         .replace(splatParam, '([^?]*?)');
            return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
        },
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

    R.Router = Router;
    return R;
};

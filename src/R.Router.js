var R = require("../");

var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

var Router = function Router() {
    this._routes = [];
};

_.extend(Router.prototype, /** @lends R.Router.prototype */ {
    _routes: null,
    registerRoute: function registerRoute(route, fn) {
        regexp = this._routeToRegExp(route);
        this._routes.push({
            regexp: regexp,
            fn: fn,
        });
    },
    route: function route(fragment) {
        var res = null;
        _.each(this._routes, R.scope(function(r) {
            var regexp = r.regexp;
            var fn = r.fn;
            if(res !== null) {
                return;
            }
            if(regexp.match(fragment) !== null) {
                var params = this._extractParameters(regexp, fragment);
                res = fn(params, fragment);
            }
        }, this));
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

module.exports = {
    Router: Router,
};

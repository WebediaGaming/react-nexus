module.exports = function(R) {
    var React = require("react");
    var _ = require("lodash");
    var assert = require("assert");

    var _vanillaCreateClass = React.createClass;
    var toOne = ["render"];
    var toMerge = ["getInitialState", "getDefaultProps", "getChildContext"];
    var toBlacklist = ["setState", "replaceState", "componentDidMount", "componentWillReceiveProps", "shouldComponentUpdate", "componentWillUpdate"];
    var defaults = {
        getInitialState: function getInitialState() {
            return null;
        },
        getDefaultProps: function getDefaultProps() {
            return {};
        },
        componentWillMount: function componentWillMount() {},
        componentWillUnmount: function componentWillUnmount() {},
        render: function render() {
            R.Debug.dev(R.scope(function() {
                throw new Error(this.displayName + ".render(...): not implemented.");
            }, this));
            return null;
        },
    };

    var getFullSpecs = function getFullSpecs(specs) {
        if(!_.has(specs, "mixins")) {
            return _.clone(specs);
        }
        else {
            var specsToMix = [specs];
            _.each(specs.mixins, function(mixin) {
                specsToMix.push(getFullSpecs(mixin));
            });
            var combinedSpecs = {};
            _.each(specsToMix, function(singleSpecs) {
                _.each(_.keys(singleSpecs), function(key) {
                    if(_.has(combinedSpecs, key)) { // This key was already handled
                        return;
                    }
                    combinedSpecs[key] = [];
                    _.each(specsToMix, function(anySpecs) {
                        if(_.has(anySpecs, key)) {
                            combinedSpecs[key].push(anySpecs[key]);
                        }
                    });
                });
            });
            var finalSpecs = _.extend({}, defaults);
            _.each(combinedSpecs, function(combinedSpec, key) {
                if(_.contains(toMerge, key)) {
                    finalSpecs[key] = function() {
                        var r = {};
                        var args = arguments;
                        _.each(combinedSpec, R.scope(function(fn) {
                            _.extend({}, fn.apply(this, args));
                        }, this));
                        return r;
                    };
                }
                else if(_.contains(toOne, key)) {
                    finalSpecs[key] = _.last(combinedSpec);
                }
                else {
                    var lastVal = _.last(combinedSpec);
                    if(_.isFunction(lastVal)) {
                        finalSpecs[key] = function() {
                            var args = arguments;
                            var res;
                            _.each(combinedSpec, R.scope(function(fn) {
                                res = fn.apply(this, args);
                            }, this));
                            return res;
                        };
                    }
                    else {
                        finalSpecs[key] = lastVal;
                    }
                }
            });
            _.each(toBlacklist, function(key) {
                finalSpecs[key] = function() {
                    R.Debug.dev(R.scope(function() {
                        throw new Error(this.displayName  + "." + key + "(...): should not be called on __ReactOnRailsSurrogate instance.");
                    }, this));
                };
            });
            return finalSpecs;
        }
    };

    var noChildren = (function noChildren() {});

    var _patchedCreateClass = function createClass(specs) {
        var fullSpecs = getFullSpecs(specs);
        var __ReactOnRailsSurrogate = function __ReactOnRailsSurrogate(context, props, initialState) {
            this.__ReactOnRailsScopeAll();
            this.__ReactOnRailsSurrogate = __ReactOnRailsSurrogate;
            R.Debug.dev(R.scope(function() {
                assert(_.has(this, "getFlux") && _.isFunction(this.getFlux), this.displayName + ".__ReactOnRailsSurrogate(...): expecting getFlux(): R.Flux.FluxInstance (usually from RootMixin or ComponentMixin).");
            }, this));
            this.context = context;
            this.props = _.extend({}, props, this.getDefaultProps());
            if(_.isUndefined(initialState)) {
                this.state = this.getInitialState();
            }
            else {
                this.state = _.clone(initialState);
            }
        };
        var pseudoPrototype = _.extend(__ReactOnRailsSurrogate.prototype, {
            _isReactOnRailsSurrogate_: true,
            context: null,
            props: null,
            state: null,
            __ReactOnRailsSurrogate: null,
            __ReactOnRailsSurrogateSpecs: fullSpecs,
            __ReactOnRailsScope: function __ReactOnRailsScope(key) {
                this[key] = this[key];
                if(_.isFunction(this[key])) {
                    this[key] = R.scope(this[key], this);
                }
            },
            __ReactOnRailsScopeAll: function __ReactOnRailsScopeAll() {
                _.each(_.keys(fullSpecs), R.scope(this.__ReactOnRailsScope, this));
            },
        }, fullSpecs);

        var createdClass = _vanillaCreateClass.call(React, specs);
        _.extend(createdClass, {
            __ReactOnRailsSurrogate: __ReactOnRailsSurrogate,
        });
        return createdClass;
    };

    var _vanillaChildren = React.Children;
    var _patchedChildren = _.extend({}, React.Children, {
        getChildrenList: function getChildrenList(component) {
            if(null === component || !component.props.children) {
                return [];
            }
            return React.Children.map(component.props.children, _.identity);
        },
        getDescendantsList: function getDescendantsList(component) {
            var childrenList = _patchedChildren.getChildrenList(component);
            var descendantsList = [];
            _.each(childrenList, function(child) {
                descendantsList.push(child);
                var subDescendantsList = _patchedChildren.getDescendantsList(child);
                _.each(subDescendantsList, function(node) {
                    descendantsList.push(node);
                });
            });
            return descendantsList;
        },
        mapDescendants: function mapDescendants(component, fn) {
            return _.map(_patchedChildren.getDescendantsList(component), fn);
        },
    });

    var patchReact = {
        patchCreateClass: function patchCreateClass() {
            React.createClass = _patchedCreateClass;
        },
        restoreVanillaCreateClass: function restoreVanillaCreateClass() {
            React.createClass = _vanillaCreateClass;
        },
        patchChildren: function patchChildren() {
            React.Children = _patchedChildren;
        },
        restoreVanillaChildren: function restoreVanillaChildren() {
            React.Children = _vanillaChildren;
        },
        patchAll: function patchAll() {
            patchReact.patchCreateClass();
            patchReact.patchChildren();
        },
        restoreVanillaAll: function restoreVanillaAll() {
            patchReact.restoreVanillaCreateClass();
            patchReact.restoreVanillaChildren();
        },
    };

    patchReact.patchAll();

    R.patchReact = patchReact;
    return R;
};

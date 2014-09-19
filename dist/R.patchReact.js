module.exports = function(R) {
    var React = R.React;
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

        var createdClass = _vanillaCreateClass.call(React, specs);
        var __ReactOnRailsSurrogate = function __ReactOnRailsSurrogate(context, props, initialState) {
            var descriptor = React.createDescriptor(createdClass, _.omit(props, "children"), props.children);
            var instance;
            React.withContext(context, function() {
                instance = R.instantiateReactComponent(descriptor);
            });
            if(_.isUndefined(initialState)) {
                if(instance.getInitialState && _.isFunction(instance.getInitialState)) {
                    initialState = instance.getInitialState();
                }
                else {
                    initialState = null;
                }
            }
            _.extend(instance, {
                state: initialState,
                _isReactOnRailsSurrogate_: true,
                __ReactOnRailsSurrogate: __ReactOnRailsSurrogate,
            });
            return instance;
        };
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
            R.Debug.dev(function() {
                console.warn("Patching React...");
            });
            React.__ReactOnRailsPatchApplied = true;
            patchReact.patchCreateClass();
            patchReact.patchChildren();
        },
        restoreVanillaAll: function restoreVanillaAll() {
            R.Debug.dev(function() {
                console.warn("Restoring Vanilla React...");
            });
            delete React.__ReactOnRailsPatchApplied;
            patchReact.restoreVanillaCreateClass();
            patchReact.restoreVanillaChildren();
        },
    };

    patchReact.patchAll();

    R.patchReact = patchReact;
    return R;
};

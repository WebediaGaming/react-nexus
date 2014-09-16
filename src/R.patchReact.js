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
        var __ReactOnRailsSurrogate = function __ReactOnRailsSurrogate(context, props) {
            R.scopeAll(this);
            R.Debug.dev(R.scope(function() {
                assert(_.has(this, "getFlux") && _.isFunction(this.getFlux), this.displayName + ".__ReactOnRailsSurrogate(...): expecting getFlux(): R.Flux.FluxInstance (usually from RootMixin or ComponentMixin).");
            }, this));
            this.context = context;
            this.props = _.extend({}, props, this.getDefaultProps());
            this.state = this.getInitialState();
        };
        var pseudoPrototype = _.extend(__ReactOnRailsSurrogate.prototype, {
            _isReactOnRailsSurrogate_: true,
            context: null,
            props: null,
            state: null,
        }, fullSpecs);

        var createdClass = _vanillaCreateClass.call(React, specs);
        _.extend(createdClass, {
            __ReactOnRailsSurrogate: __ReactOnRailsSurrogate,
        });
        return createdClass;
    };

    var patchReact = {
        patchCreateClass: function patchCreateClass() {
            React.createClass = _patchedCreateClass;
        },
        restoreVanillaCreateClass: function restoreVanillaCreateClass() {
            React.createClass = _vanillaCreateClass;
        },
    };

    patchReact.patchCreateClass();

    R.patchReact = patchReact;
    return R;
};

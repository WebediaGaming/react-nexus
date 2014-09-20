module.exports = function(R) {
    var React = R.React;
    var _ = require("lodash");
    var assert = require("assert");

    var _vanillaCreateClass = R.scope(React.createClass, React);

    var noChildren = (function noChildren() {});

    var _patchedCreateClass = function createClass(specs) {
        var createdClass;

        _.defaults(specs, {
            getFluxStoreSubscriptions: _.constant({}),
            statics: {},
        });

        var __ReactOnRailsSurrogate = function __ReactOnRailsSurrogate(context, props, initialState) {
            var instance;
            React.withContext(context, function() {
                var args = [createdClass, _.omit(props, "children")];
                if(props.children) {
                    args.push(props.children);
                }
                var descriptor = React.createElement.apply(React, args);
                instance = R.instantiateReactComponent(descriptor);
                instance.context = context;
                initialState = initialState || {};
                if(instance.getInitialState) {
                    initialState = _.extend(initialState, instance.getInitialState() || {});
                }
                _.extend(instance, {
                    state: initialState,
                    _isReactOnRailsSurrogate_: true,
                    __ReactOnRailsSurrogate: __ReactOnRailsSurrogate,
                });
            });
            return instance;
        };

        _.extend(specs.statics, {
            __ReactOnRailsSurrogate: __ReactOnRailsSurrogate,
        });

        createdClass = _.extend(_vanillaCreateClass(specs), {
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
                console.warn("Patching React.");
            });
            React.__ReactOnRailsPatchApplied = true;
            patchReact.patchCreateClass();
            patchReact.patchChildren();
        },
        restoreVanillaAll: function restoreVanillaAll() {
            R.Debug.dev(function() {
                console.warn("Restoring Vanilla React.");
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

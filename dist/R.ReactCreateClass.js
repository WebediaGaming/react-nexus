module.exports = function(R) {
    var _ = require("lodash");
    var React = R.React;

    var _vanillaCreateClass = R.scope(React.createClass, React);

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

    _patchedCreateClass.restoreVanillaCreateClass = function() {
        React.createClass = _vanillaCreateClass;
    };

    R.Debug.dev(function() {
        console.log("Patching React.createClass.");
    });
    R.ReactCreateClass = React.createClass = _patchedCreateClass;

    return R;
};

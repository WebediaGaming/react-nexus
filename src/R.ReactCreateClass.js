module.exports = function(R) {
    var _ = require("lodash");
    var React = R.React;

    var _vanillaCreateClass = R.scope(React.createClass, React);

    /**
    * <p>Method definition that complements React.createClass. <br />
    * Used to compute an instance of a React component</p>
    * @class R.ReactCreateClass
    */
    var _patchedCreateClass = function createClass(specs) {
        var createdClass;

        _.defaults(specs, {
            getFluxStoreSubscriptions: _.constant({}),
            statics: {},
        });

        /**
        * <p> Returns an instance of a component by React context, the property and a defined state </p>
        * @method __ReactOnRailsSurrogate
        * @param {object} context The context of the future component
        * @param {object} props The props of the future component
        * @param {object} initialState The state of the future component
        * @return {object} instance The created component instance
        */
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

    /**
    * <p> Function to use if you want restore native function of React.createClass </p>
    * @method restoreVanillaCreateClass
    */
    _patchedCreateClass.restoreVanillaCreateClass = function() {
        React.createClass = _vanillaCreateClass;
    };

    React.createClass = _patchedCreateClass;

    return _patchedCreateClass;
};

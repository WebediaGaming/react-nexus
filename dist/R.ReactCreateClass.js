"use strict";

var __NODE__ = !__BROWSER__;var __BROWSER__ = (typeof window === "object");var __PROD__ = !__DEV__;var __DEV__ = (process.env.NODE_ENV !== "production");var Promise = require("lodash-next").Promise;require("6to5/polyfill");module.exports = function (R) {
  var _ = R._;
  var React = R.React;

  var _vanillaCreateClass = React.createClass;

  var _patchedCreateClass = function createClass(specs) {
    _.defaults(specs, {
      getFluxStoreSubscriptions: function () {
        return {};
      },
      statics: {} });

    var createdClass;

    function __ReactNexusSurrogate(_ref) {
      var context = _ref.context;
      var props = _ref.props;
      var state = _ref.state;
      _.dev(function () {
        return context.should.be.an.Object && props.should.be.an.Object && state.should.be.an.Object;
      });
      var instance;
      React.withContext(context, function () {
        state = state || {};
        var element = React.createElement(createdClass, _.omit(props, "children"), props.children);
        instance = R.instantiateReactComponent(element);
        _.extend(instance, { context: context });
        if (instance.getInitialState) {
          state = _.extend({}, state, instance.getInitialState() || {});
        }
        _.extend(instance, { state: state, __ReactNexusSurrogate: __ReactNexusSurrogate });
      });
      return instance;
    }
    _.extend(specs.statics, { __ReactNexusSurrogate: __ReactNexusSurrogate });

    createdClass = _vanillaCreateClass(specs);
    return createdClass;
  };

  _.extend(_patchedCreateClass, {
    patchCreateClass: function () {
      React.createClass = _patchedCreateClass;
      return _patchedCreateClass;
    },

    restoreCreateClass: function () {
      React.createdClass = _vanillaCreateClass;
      return _vanillaCreateClass;
    } });

  return _patchedCreateClass.patchCreateClass();
};
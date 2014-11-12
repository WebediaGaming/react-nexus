module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const React = R.React;

  const _vanillaCreateClass = _.scope(React.createClass, React);

  const _patchedCreateClass = function createClass(specs) {
    _.defaults(specs, {
      getFluxStoreSubscriptions() { return {}; },
      statics: {},
    });

    function __ReactNexusSurrogate({ context, props, state }) {
      let instance;
      React.withContext(context, () => {
        state = state || {};
        let args = [createdClass, _.omit(props, 'children')];
        if(props.children) {
          args.push(props.children);
        }
        let element = React.createElement(args);
        instance = R.instantiateReactComponent(element);
        _.extend(instance, { context });
        if(instance.getInitialState) {
          state = _.extend({}, state, instance.getInitialState() || {});
        }
        _.extend(instance, { state, __ReactNexusSurrogate });
      });
      return instance;
    }

    _.extend(specs.statics, { __ReactNexusSurrogate });
    return _.extend(_vanillaCreateClass(specs), { __ReactNexusSurrogate });
  };

  _.extend(_patchedCreateClass, {
    patchCreateClass() {
      _.extend(React, { createClass: _patchedCreateClass });
      return _patchedCreateClass;
    },

    restoreCreateClass() {
      _.extend(React, { createClass: _vanillaCreateClass });
      return _vanillaCreateClass;
    },
  });

  return _patchedCreateClass.patchCreateClass();
};

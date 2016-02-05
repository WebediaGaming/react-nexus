import Promise from 'bluebird';
import React from 'react';
import _ from 'lodash';
import deepEqual from 'deep-equal';
import should from 'should/as-function';
const __DEV__ = process && process.env && process.NODE_ENV === 'development';

import defaultFluxKey from './defaultFluxKey';
import diff from './util/diff';
import Flux from './Flux';
import preparable from './preparable';

/**
 * Enhance a React Component and make context's {@link Flux}'s {@link Store}'s {@link State}s requested by bindings
 * avaliable as props.
 * @param {Function} getBindingsNotNormalized Function given the component own props, returns Stores bindings.
 * @param {Object} options Options object.
 * @param {String} [options.displayName] The displayName of the wrapper component (useful for debugging).
 * @param {String} [options.fluxKey] Use a specific string as fluxKey rather than the default one.
 * @return {Component} Enhanced component.
 */
function stores(getBindingsNotNormalized, { displayName = void 0, fluxKey = defaultFluxKey } = {}) {
  if(__DEV__) {
    should(getBindingsNotNormalized).be.a.Function();
  }

  /**
   * Returns the normalized bindings.
   * @param {Object} props Props of the component.
   * @param {Object} context Context of the component.
   * @return {Object} Normalized bindings of the component.
   */
  function getBindings(props, context) {
    const flux = context[fluxKey];
    return [flux, _.mapValues(getBindingsNotNormalized(props, flux), (binding) => {
      if(typeof binding === 'string') {
        return [binding, {}];
      }
      if(__DEV__) {
        should(binding).be.an.Array();
        should(binding.length).be.exactly(2);
        should(binding[0]).be.a.String();
        should(binding[1]).be.an.Object();
      }
      return binding;
    })];
  }
  return (Component) => preparable(async function prepare(props, context) {
    const [flux, bindings] = getBindings(props, context);
    const deps = _.map(bindings, (binding) => flux.fetchStore(...binding));
    return await Promise.all(deps);

    /**
     * Represents a Component wrapper used to make binded {@link Store}s {@link State} avaliable as props.
     */
  })(class StoresComponent extends React.Component {
    static displayName = displayName || `@stores(${Component.displayName})`;

    static contextTypes = {
      [fluxKey]: React.PropTypes.instanceOf(Flux),
    };

    /**
     * Constructs a StoresComponent.
     * @constructor
     * @param {Object} props Component's props.
     * @param {Object} context Component's context.
     */
    constructor(props, context) {
      super(props, context);
      const [flux, bindings] = getBindings(props, context);
      this.state = _.mapValues(bindings, (binding) => flux.readStoreFromState(...binding));
      this.observers = new Map();
    }

    /**
     * React lifecycle method called when the component did juste mount.
     * @return {undefined}
     */
    componentDidMount() {
      const { props, context } = this;
      const [flux, bindings] = getBindings(props, context);
      _.each(bindings, (binding, key) =>
        this.observers.set(
          key,
          flux.observeStore(
            ...binding,
            (state) => this.updateStoreState(key, state),
          ),
        )
      );
    }

    /**
     * React lifecycle method called when the component will receive props.
     * @param {Object} nextProps Next props the component will receive.
     * @return {undefined}
     */
    componentWillReceiveProps(nextProps) {
      const { props, context } = this;
      const [, prevBindings] = getBindings(props, context);
      const [flux, nextBindings] = getBindings(nextProps, context);
      const [removed, added] = diff(nextBindings, prevBindings, deepEqual);
      _(removed)
        .keys()
        .each((key) => {
          this.observers.get(key)();
          this.observers.delete(key);
        });
      _(added)
        .each((binding, key) => {
          this.updateStoreState(key, flux.readStoreFromState(...binding));
          this.observers.set(
            key,
            flux.observeStore(
              ...binding,
              (state) => this.updateStoreState(key, state),
            ),
          );
        });
    }

    /**
     * React lifecycle method called when the component will unmount.
     * @return {undefined}
     */
    componentWillUnmount() {
      this.observers.forEach((unobserve) => unobserve());
    }

    /**
     * Set a store component state with a new value.
     * @param {String} key store key.
     * @param {String} state store state.
     * @return {undefined}
     */
    updateStoreState(key, state) {
      this.setState({ [key]: state });
    }

    /**
     * Renders the StoresComponent.
     * @return {ReactElement|false|null} Renderded component.
     */
    render() {
      if(__DEV__) {
        const inter = _.intersection(Object.keys(this.state), Object.keys(this.props));
        if(inter.length > 0) {
          console.warn(
            'Warning: conflicting keys between props and state in StoresComponent',
            this.constructor.displayName,
            inter,
          );
        }
      }
      const childProps = Object.assign({}, this.state, this.props);
      return <Component {...childProps} />;
    }
  });
}

export default stores;

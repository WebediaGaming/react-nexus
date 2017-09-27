import Promise from 'bluebird';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import deepEqual from 'deep-equal';
const __DEV__ = process && process.env && process.NODE_ENV === 'development';

import defaultFluxKey from './defaultFluxKey';
import diff from './util/diff';
import Flux from './Flux';
import preparable from './preparable';
import shouldPureComponentUpdate from './util/shouldPureComponentUpdate';

/**
 * Enhance a React Component and make context's {@link Flux}'s {@link Store}'s {@link State}s requested by bindings
 * avaliable as props.
 * @param {Function} getBindings Function given the component own props, returns Stores bindings.
 * @param {Object} options Options object.
 * @param {String} [options.displayName] The displayName of the wrapper component (useful for debugging).
 * @param {String} [options.fluxKey] Use a specific string as fluxKey rather than the default one.
 * @param {Function} [options.shouldNexusComponentUpdate] Use specific function for shouldComponentUpdate event.
 * @return {Component} Enhanced component.
 */
function stores(
  getBindings, {
    displayName = void 0,
    fluxKey = defaultFluxKey,
    shouldNexusComponentUpdate = shouldPureComponentUpdate,
  } = {}) {
  return (Component) => preparable(async function prepare(props, context) {
    const flux = context[fluxKey];
    const bindings = getBindings(props, flux);
    const deps = _.map(bindings, (binding) => {
      const state = flux.readStoreFromState(binding);
      if(state.isResolved() || (state.isRejected() && !state.meta.uninitialized)) {
        // During prepare, avoid re-fetching a store that's already been fetched.
        return void 0;
      }
      return flux.fetchStore(binding);
    });
    return await Promise.all(deps);

    /**
     * Represents a Component wrapper used to make binded {@link Store}s {@link State} avaliable as props.
     */
  })(class StoresComponent extends React.Component {
    static displayName = displayName || `@stores(${Component.displayName})`;

    static contextTypes = {
      [fluxKey]: PropTypes.instanceOf(Flux),
    };

    /**
     * Constructs a StoresComponent.
     * @constructor
     * @param {Object} props Component's props.
     * @param {Object} context Component's context.
     */
    constructor(props, context) {
      super(props, context);
      const flux = context[fluxKey];
      const bindings = getBindings(props, flux);
      this.state = _.mapValues(bindings, (binding) => flux.readStoreFromState(binding));
      this.observers = new Map();
    }

    /**
     * React lifecycle method called when the component did juste mount.
     * @return {undefined}
     */
    componentDidMount() {
      const { props, context } = this;
      const flux = context[fluxKey];
      const bindings = getBindings(props, flux);
      _.each(bindings, (binding, key) =>
        this.observers.set(
          key,
          flux.observeStore(
            binding,
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
      const flux = context[fluxKey];
      const prevBindings = getBindings(props, flux);
      const nextBindings = getBindings(nextProps, flux);
      const [removed, added] = diff(nextBindings, prevBindings, deepEqual);
      const removedKeys = _.keys(removed);
      _.each(removedKeys, (key) => {
        this.updateStoreState(key, void 0);
        this.observers.get(key)();
        this.observers.delete(key);
      });
      _.each(added, (binding, key) => {
        this.updateStoreState(key, flux.readStoreFromState(binding));
        this.observers.set(
          key,
          flux.observeStore(
            binding,
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
    * React lifecycle method called when the component will receive updated props or state.
    * @param {Object} args Arguments provided when shouldComponentUpdate is triggered: nextProps, nextState.
    * @return {undefined}
     */
    shouldComponentUpdate(...args) {
      return Reflect.apply(shouldNexusComponentUpdate, this, args);
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

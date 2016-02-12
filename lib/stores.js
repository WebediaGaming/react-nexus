import Promise from 'bluebird';
import React from 'react';
import _ from 'lodash';
import deepEqual from 'deep-equal';
const __DEV__ = process && process.env && process.NODE_ENV === 'development';

import defaultFluxKey from './defaultFluxKey';
import diff from './util/diff';
import Flux from './Flux';
import preparable from './preparable';

/**
 * Enhance a React Component and make context's {@link Flux}'s {@link Store}'s {@link State}s requested by bindings
 * avaliable as props.
 * @param {Function} getBindings Function given the component own props, returns Stores bindings.
 * @param {Object} options Options object.
 * @param {String} [options.displayName] The displayName of the wrapper component (useful for debugging).
 * @param {String} [options.fluxKey] Use a specific string as fluxKey rather than the default one.
 * @return {Component} Enhanced component.
 */
function stores(getBindings, { displayName = void 0, fluxKey = defaultFluxKey } = {}) {
  return (Component) => preparable(async function prepare(props, context) {
    const flux = context[fluxKey];
    const bindings = getBindings(props, flux);
    const deps = _.map(bindings, (binding) => flux.fetchStore(binding));
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
      _(removed)
        .keys()
        .each((key) => {
          this.observers.get(key)();
          this.observers.delete(key);
        });
      _(added)
        .each((binding, key) => {
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

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

function stores(getBindingsNotNormalized, { displayName = void 0, fluxKey = defaultFluxKey } = {}) {
  if(__DEV__) {
    should(getBindingsNotNormalized).be.a.Function();
  }
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
  return (Component) => {
    @preparable(async function prepare(props, context) {
      const [flux, bindings] = getBindings(props, context);
      return await Promise.map(bindings, (binding) => flux.fetchStore(...binding));
    })
    class StoresComponent extends React.Component {
      static displayName = displayName || `@stores(${Component.displayName})`;

      static contextTypes = {
        [fluxKey]: React.PropTypes.instanceOf(Flux),
      };

      constructor(props, context) {
        super(props, context);
        const [flux, bindings] = getBindings(props, context);
        this.state = _.mapValues(bindings, (binding) => flux.readStoreFromState(...binding));
        this.observers = new Map();
      }

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

      componentWillReceiveProps(nextProps) {
        const { props, context } = this;
        const [, prevBindings] = getBindings(props, context);
        const [flux, nextBindings] = getBindings(nextProps, context);
        const [removed, added] = diff(nextBindings, (k) => prevBindings[k], deepEqual);
        _(removed)
          .keys()
          .each((key) => {
            this.observers.get(key)();
            this.observers.delete(key);
          })
        .run();
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
          })
        .run();
      }

      componentWillUnmount() {
        this.observers.forEach((unobserve) => unobserve());
      }

      updateStoreState(key, state) {
        this.setState({ [key]: state });
      }

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
    }

    return StoresComponent;
  };
}

export default stores;

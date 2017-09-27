import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
const __DEV__ = process && process.env && process.env.NODE_ENV === 'development';

import Flux from './Flux';
import defaultFluxKey from './defaultFluxKey';
import shouldPureComponentUpdate from './util/shouldPureComponentUpdate';

/**
 * Enhance a React Component and make context's {@link Flux}'s {@link Actions}s requested by bindings avaliable as props.
 * @param {Function} getBindings Function given the component own props, returns Actions bindings.
 * @param {Object} options Options object.
 * @param {String} [options.displayName] The displayName of the wrapper component (useful for debugging).
 * @param {String} [options.fluxKey] Use a specific string as fluxKey rather than the default one.
 * @param {Function} [options.shouldNexusComponentUpdate] Use specific function for shouldComponentUpdate event.
 * @return {Component} Enhanced component.
 */
function actions(getBindings, {
    displayName = void 0,
    fluxKey = defaultFluxKey,
    shouldNexusComponentUpdate = shouldPureComponentUpdate,
  } = {}) {
  return (Component) => {
    /**
     * Represents a Component wrapper used to make binded {@link Actions} avaliable as props.
     */
    class ActionsComponent extends React.Component {
      static displayName = displayName || `@actions(${Component.displayName})`;

      static contextTypes = {
        [fluxKey]: PropTypes.instanceOf(Flux),
      };

      /**
      * React lifecycle method called when the component will receive updated props or state.
      * @param {Object} args Arguments provided when shouldComponentUpdate is triggered: nextProps, nextState.
      * @return {undefined}
       */
      shouldComponentUpdate(...args) {
        return Reflect.apply(shouldNexusComponentUpdate, this, args);
      }

      /**
       * Renders the ActionsComponent.
       * @return {ReactElement|false|null} Renderded component.
       */
      render() {
        const { props, context } = this;
        const flux = context[fluxKey];
        const bindings = getBindings(props, flux);
        const dispatchProps = _.mapValues(bindings, (path) => async function dispatchAction(...params) {
          return await flux.dispatchAction(path, ...params);
        });
        if(__DEV__) {
          const inter = _.intersection(Object.keys(dispatchProps), Object.keys(props));
          if(inter.length > 0) {
            console.warn(
              'Warning: conflicting keys between props and dispatchProps in ActionsComponent',
              this.constructor.displayName,
              inter,
            );
          }
        }
        const childProps = Object.assign({}, dispatchProps, props);
        return <Component {...childProps} />;
      }
    }

    return ActionsComponent;
  };
}

export default actions;

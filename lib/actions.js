import React from 'react';
import _ from 'lodash';
const __DEV__ = process && process.env && process.env.NODE_ENV === 'development';

import Flux from './Flux';
import defaultFluxKey from './defaultFluxKey';

function actions(getBindings, { displayName = void 0, fluxKey = defaultFluxKey } = {}) {
  return (Component) => {
    class ActionsComponent extends React.Component {
      static displayName = displayName || `@actions(${Component.displayName})`;

      static contextTypes = {
        [fluxKey]: React.PropTypes.instanceOf(Flux),
      };

      render() {
        const { props, context } = this;
        const bindings = getBindings(props, context);
        const flux = context[fluxKey];
        const dispatchProps = _.mapValues(bindings, (route) => async function dispatchAction(query, params) {
          return await flux.action(route).dispatch(query, params);
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

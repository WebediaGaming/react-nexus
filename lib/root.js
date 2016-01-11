import React from 'react';
import should from 'should/as-function';
const __DEV__ = process && process.env && process.env.NODE_ENV === 'development';

import Flux from './Flux';
import defaultFluxKey from './defaultFluxKey';

function root(flux, { fluxKey = defaultFluxKey, displayName = void 0 } = {}) {
  if(__DEV__) {
    should(flux).be.an.instanceOf(flux);
  }
  return (Component) => {
    class RootComponent extends React.Component {
      static displayName = displayName || `@root(${Component.displayName})`;

      static childContextTypes = {
        [fluxKey]: React.PropTypes.instanceOf(Flux),
      };

      getChildContext() {
        return {
          [fluxKey]: flux,
        };
      }
    }

    return RootComponent;
  };
}

export default root;

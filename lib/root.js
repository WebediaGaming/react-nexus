import React from 'react';
import should from 'should/as-function';
const __DEV__ = process && process.env && process.env.NODE_ENV === 'development';

import Flux from './Flux';
import defaultFluxKey from './defaultFluxKey';

function root(createFlux, { fluxKey = defaultFluxKey, displayName = void 0 } = {}) {
  if(__DEV__) {
    should(createFlux).be.a.Function();
  }
  return (Component) => {
    class RootComponent extends React.Component {
      static displayName = displayName || `@root(${Component.displayName})`;

      static childContextTypes = {
        [fluxKey]: React.PropTypes.instanceOf(Flux),
      };

      constructor(props, context) {
        super(props, context);
        this.flux = createFlux(props, context);
        if(__DEV__) {
          should(this.flux).be.an.instanceOf(Flux);
        }
      }

      getChildContext() {
        return {
          [fluxKey]: this.flux,
        };
      }

      render() {
        return <Component {...this.props} />;
      }
    }

    return RootComponent;
  };
}

export default root;
